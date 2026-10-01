import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'parse5';

const languageTags = { en: 'en', zh: 'zh-CN', ja: 'ja', ko: 'ko', es: 'es' };
const ogTags = { en: 'en_US', zh: 'zh_CN', ja: 'ja_JP', ko: 'ko_KR', es: 'es_ES' };
const walk = (node) => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attrs = (node) =>
  Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));

export const articleAlternateFixtures = [
  ['seo-zh-only', ['zh']],
  ['seo-zh-ja', ['zh', 'ja']],
  ['seo-en-zh', ['en', 'zh']],
  ['seo-all', ['en', 'zh', 'ja', 'ko', 'es']],
];

export async function checkArticleAlternates(project, defaultLocale) {
  for (const [slug, locales] of articleAlternateFixtures) {
    let expectedLinks;
    for (const locale of locales) {
      const html = await readFile(
        path.join(project, `dist/${locale}/blog/${slug}/index.html`),
        'utf8'
      );
      const nodes = walk(parse(html));
      const links = nodes.filter((node) => node.tagName === 'link').map(attrs);
      const canonical = links.find((link) => link.rel === 'canonical')?.href;
      assert(canonical, `${slug}: canonical exists`);
      const origin = new URL(canonical).origin;
      assert.equal(new URL(canonical).pathname, `/${locale}/blog/${slug}/`);
      const alternates = links.filter((link) => link.hreflang);
      const expected = locales.map((code) => [
        languageTags[code],
        `${origin}/${code}/blog/${slug}/`,
      ]);
      if (locales.includes(defaultLocale))
        expected.push(['x-default', `${origin}/${defaultLocale}/blog/${slug}/`]);
      const actual = alternates.map((link) => [link.hreflang, link.href]).sort();
      assert.deepEqual(actual, expected.sort(), `${locale}/${slug}: only real translations`);
      if (expectedLinks) assert.deepEqual(actual, expectedLinks, `${slug}: reciprocal links`);
      expectedLinks = actual;
      const og = nodes
        .filter((node) => node.tagName === 'meta')
        .map(attrs)
        .filter((meta) => meta.property === 'og:locale:alternate')
        .map((meta) => meta.content)
        .sort();
      assert.deepEqual(
        og,
        locales
          .filter((code) => code !== locale)
          .map((code) => ogTags[code])
          .sort()
      );
      const options = nodes.filter((node) => node.tagName === 'option').map(attrs);
      for (const code of Object.keys(languageTags)) {
        const href = locales.includes(code) ? `/${code}/blog/${slug}/` : `/${code}/blog/`;
        assert(
          options.some((option) => option.value === href),
          `${locale}/${slug}: menu ${code}`
        );
      }
    }
  }
}
