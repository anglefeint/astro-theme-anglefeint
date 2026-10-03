import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadProjectModule } from '../packages/theme/src/scaffold/project-config.mjs';
import { buildNewPostTemplate, resolveLocales } from '../packages/theme/src/scaffold/new-post.mjs';
import matter from 'gray-matter';
import path from 'node:path';

const additions = ['pt-br', 'de', 'ru', 'zh-hant'];
function leaves(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' ? leaves(child, `${prefix}${key}.`) : [[prefix + key, child]]
  );
}

test('all nine built-in translations contain the full message schema and placeholders', async () => {
  const { DEFAULT_MESSAGES } = await loadProjectModule(
    path.resolve('packages/theme/src/i18n/messages.ts')
  );
  const source = leaves(DEFAULT_MESSAGES.en);
  assert.equal(Object.keys(DEFAULT_MESSAGES).length, 9);
  for (const [locale, messages] of Object.entries(DEFAULT_MESSAGES)) {
    const translated = leaves(messages);
    assert.deepEqual(
      translated.map(([key]) => key).sort(),
      source.map(([key]) => key).sort(),
      locale
    );
    const map = new Map(translated);
    for (const [key, original] of source) {
      assert.ok(map.get(key)?.trim(), `${locale}.${key}`);
      assert.deepEqual(
        map.get(key).match(/\{\w+\}/g),
        original.match(/\{\w+\}/g),
        `${locale}.${key}`
      );
    }
  }
});

test('new locale defaults, language metadata and disabled states remain consistent', async () => {
  const { defineThemeConfig } = await loadProjectModule(
    path.resolve('src/site.config.defaults.ts')
  );
  const { normalizeI18nConfig } = await loadProjectModule(
    path.resolve('src/site.config.runtime.ts')
  );
  const config = defineThemeConfig({});
  assert.equal(Object.keys(config.i18n.locales).length, 9);
  assert.equal(config.i18n.defaultLocale, 'en');
  assert.equal(config.i18n.locales['pt-br'].meta.hreflang, 'pt-BR');
  assert.equal(config.i18n.locales['zh-hant'].meta.hreflang, 'zh-Hant');
  for (const locale of additions) {
    const normalized = normalizeI18nConfig(
      defineThemeConfig({
        i18n: {
          defaultLocale: locale,
          locales: Object.fromEntries(
            Object.keys(config.i18n.locales).map((code) => [code, { meta: { enabled: false } }])
          ),
        },
      }).i18n
    );
    assert.deepEqual(
      Object.values(normalized.locales)
        .filter((v) => v.meta.enabled)
        .map((v) => v.code),
      [locale]
    );
    assert.notEqual(
      config.i18n.locales[locale].about.sections.who,
      config.i18n.locales.en.about.sections.who
    );
    const template = buildNewPostTemplate(locale, 'test-post', '2026-10-03', '');
    const parsed = matter(template);
    assert.ok(parsed.data.title && parsed.data.description && parsed.content.trim());
    assert.doesNotMatch(template, /Localized post scaffold|Write your .* content/);
  }
  assert.deepEqual(
    resolveLocales({ cliLocales: 'pt-BR,zh-Hant,PT-br', envLocales: '', defaultLocales: [] }),
    ['pt-br', 'zh-hant']
  );
});

test('new translations preserve article inventory and localized guide links', async () => {
  const { readdir } = await import('node:fs/promises');
  const english = (await readdir('src/content/blog/en')).sort();
  for (const locale of additions) {
    assert.deepEqual((await readdir(`src/content/blog/${locale}`)).sort(), english);
    for (const file of english) {
      const { data, content } = matter(
        await readFile(`src/content/blog/${locale}/${file}`, 'utf8')
      );
      assert.ok(data.title && data.description && content.trim());
      assert.doesNotMatch(content, /\]\(\/en\/blog\//);
    }
  }
});
