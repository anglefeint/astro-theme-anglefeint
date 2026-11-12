import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { URL } from 'node:url';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, {
  alias: { '@anglefeint/site-i18n/config': path.resolve('src/i18n/config.ts') },
});
const { buildHeadLocaleState, buildJsonLdSchemas } = await jiti.import(
  '../packages/theme/src/utils/head.ts'
);
const { ENABLED_LOCALES, DEFAULT_LOCALE } = await jiti.import('../src/i18n/config.ts');
const origin = new URL('https://seo.example/');

test('localized site and article JSON-LD preserve language and truthful modification time', () => {
  for (const inLanguage of ['en', 'zh-CN', 'zh-Hant', 'ja', 'ko', 'es', 'pt-BR', 'de', 'ru']) {
    const schemas = buildJsonLdSchemas({
      inLanguage,
      siteTitle: 'Site',
      siteAuthor: 'Author',
      siteURL: origin,
      title: 'Post',
      description: 'Body',
      imageURL: 'https://seo.example/image.jpg',
      canonicalURL: new URL('/post/', origin),
      isArticle: true,
      author: 'Author',
      publishedTime: new Date('2026-01-01'),
    });
    const article = schemas.find((schema) => schema['@type'] === 'BlogPosting');
    assert.equal(article.inLanguage, inLanguage);
    assert.equal(article.dateModified, article.datePublished);
    assert.equal(schemas.find((schema) => schema['@type'] === 'WebSite').inLanguage, inLanguage);
  }
});

test('explicit SEO maps omit missing/disabled translations without menu fallback', () => {
  const state = buildHeadLocaleState(
    '/zh/blog/example/',
    origin,
    { en: '/en/blog/', zh: '/zh/blog/example/' },
    { zh: '/zh/blog/example/', ja: '/ja/blog/example/', disabled: '/disabled/blog/example/' }
  );
  assert.deepEqual(state.alternatePaths.map((item) => item.locale).sort(), ['ja', 'zh']);
  assert.equal(state.xDefaultHref, undefined);
  assert.deepEqual(state.ogLocaleAlternates, ['ja_JP']);
  assert(state.alternatePaths.every((item) => item.href.startsWith(origin.href)));
});

test('empty SEO map emits no alternate metadata', () => {
  const state = buildHeadLocaleState('/en/blog/example/', origin, { en: '/en/blog/' }, {});
  assert.deepEqual(state.alternatePaths, []);
  assert.deepEqual(state.ogLocaleAlternates, []);
  assert.equal(state.xDefaultHref, undefined);
});

test('default translation supplies x-default; omitted SEO map preserves legacy behavior', () => {
  const href = `/${DEFAULT_LOCALE}/blog/example/`;
  const explicit = buildHeadLocaleState(href, origin, undefined, { [DEFAULT_LOCALE]: href });
  assert.equal(explicit.xDefaultHref, new URL(href, origin).href);
  const legacy = buildHeadLocaleState(href, origin, { [DEFAULT_LOCALE]: '/legacy-menu/' });
  assert.equal(legacy.alternatePaths.length, ENABLED_LOCALES.length);
  assert.equal(legacy.xDefaultHref, new URL('/legacy-menu/', origin).href);
});
