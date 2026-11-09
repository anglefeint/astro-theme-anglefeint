import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import articleSitemap, { articleLastmod } from '../scripts/article-sitemap.mjs';

const article = (updated = '') => `<meta property="og:type" content="article">
<meta property="article:published_time" content="2026-01-02T00:00:00Z">
${updated ? `<meta content="${updated}" property="article:modified_time">` : ''}`;

test('article sitemap uses updated date, then publication date; other pages get no date', () => {
  assert.equal(articleLastmod(article('2026-03-04T12:00:00Z')), '2026-03-04T12:00:00.000Z');
  assert.equal(articleLastmod(article()), '2026-01-02T00:00:00.000Z');
  assert.equal(articleLastmod('<meta property="og:type" content="website">'), undefined);
  assert.equal(articleLastmod(article('invalid')), undefined);
});

test('real sitemap preserves filtering and URLs while adding per-article dates in both formats', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'anglefeint-sitemap-'));
  try {
    for (const format of ['directory', 'file']) {
      const dir = path.join(root, format);
      await mkdir(path.join(dir, 'en/blog/post'), { recursive: true });
      await writeFile(
        path.join(dir, format === 'file' ? 'en/blog/post.html' : 'en/blog/post/index.html'),
        article()
      );
      await writeFile(path.join(dir, 'index.html'), '<meta property="og:type" content="website">');
      const integration = articleSitemap({ filter: (url) => !url.includes('/excluded') });
      await integration.hooks['astro:config:done']({
        config: {
          site: 'https://example.com',
          base: '/notes/',
          build: { format },
          trailingSlash: 'ignore',
        },
      });
      integration.hooks['astro:routes:resolved']({ routes: [] });
      await integration.hooks['astro:build:done']({
        dir: pathToFileURL(dir + path.sep),
        pages: [{ pathname: '' }, { pathname: 'en/blog/post/' }, { pathname: 'excluded/' }],
        logger: {
          info() {},
          warn(message) {
            throw new Error(message);
          },
          error(message) {
            throw new Error(message);
          },
        },
      });
      const xml = await readFile(path.join(dir, 'sitemap-0.xml'), 'utf8');
      assert.match(xml, /https:\/\/example.com\/notes\/en\/blog\/post\//);
      assert.match(xml, /<lastmod>2026-01-02T00:00:00.000Z<\/lastmod>/);
      assert.equal((xml.match(/<lastmod>/g) ?? []).length, 1);
      assert(!xml.includes('excluded'));
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
