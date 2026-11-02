import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, access } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { extractArticle } from '../packages/theme/src/machine/content.mjs';
import { generateMachineReadable } from '../packages/theme/src/machine/generate.mjs';

function page({
  locale = 'en',
  url = `https://example.com/${locale}/blog/nested/hello/`,
  robots = 'index, follow',
  body = '<p>Public content</p>',
  marked = true,
} = {}) {
  return `<!doctype html><html lang="${locale}"><head><title>Post | Site</title><meta name="description" content="A &amp; B"><meta name="author" content="Public alias"><meta name="robots" content="${robots}"><meta property="article:published_time" content="2026-01-02T00:00:00.000Z"><link rel="canonical" href="${url}"></head><body><header>PRIVATE CHROME</header><main><article ${marked ? `data-machine-readable data-machine-locale="${locale}"` : ''}><h1>Post &amp; title</h1><div>OUTPUT latency ~230ms</div><div class="ai-prose-body">${body}<span aria-hidden="true">CURSOR</span></div></article><aside>Related content</aside></main></body></html>`;
}

test('machine content exports only public metadata and article body, independently of search', () => {
  const post = extractArticle(page(), 'https://example.com');
  assert.equal(post.title, 'Post & title');
  assert.equal(post.description, 'A & B');
  assert.match(post.markdown, /author: "Public alias"/);
  assert.match(post.markdown, /published: "2026-01-02/);
  assert.match(post.markdown, /Public content/);
  for (const excluded of ['PRIVATE CHROME', 'latency', 'CURSOR', 'Related content'])
    assert(!post.markdown.includes(excluded));
});

test('machine content excludes noindex, unmarked pages and off-site canonical mirrors', () => {
  for (const robots of ['noindex, follow', 'NONE', 'index, noindex'])
    assert.equal(extractArticle(page({ robots }), 'https://example.com'), null);
  assert.equal(extractArticle(page({ marked: false }), 'https://example.com'), null);
  assert.equal(
    extractArticle(page({ url: 'https://other.example/blog/' }), 'https://example.com'),
    null
  );
});

test('Markdown preserves rendered MDX prose, GFM tables, code, math and independently resolvable links', () => {
  const body = `<aside><strong>Rendered MDX component</strong><p>Helpful note</p></aside>
    <a href="../next/#part">Next</a><img src="/assets/cover.webp" alt="Cover">
    <a href="javascript:alert(1)">unsafe target</a><button>Copy code</button><script>secret()</script>
    <pre data-language="js"><code>const n = 1 &lt; 2;</code></pre>
    <table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>x</td><td>1</td></tr></tbody></table>
    <span class="katex"><span>VISUAL DUPLICATE</span><annotation encoding="application/x-tex">x^2</annotation></span>
    <span class="katex-display"><span class="katex"><annotation encoding="application/x-tex">y=2</annotation></span></span>`;
  const { markdown } = extractArticle(page({ body }), 'https://example.com');
  assert.match(markdown, /\*\*Rendered MDX component\*\*/);
  assert.match(markdown, /https:\/\/example.com\/en\/blog\/nested\/next\/#part/);
  assert.match(markdown, /https:\/\/example.com\/assets\/cover.webp/);
  assert.match(markdown, /```js\nconst n = 1 < 2;/);
  assert.match(markdown, /\| Name \| Value \|/);
  assert.match(markdown, /\$x\^2\$/);
  assert.match(markdown, /\$\$\ny=2\n\$\$/);
  for (const excluded of ['javascript:', 'Copy code', 'secret()', 'VISUAL DUPLICATE'])
    assert(!markdown.includes(excluded));
});

test('build exports nine languages, base paths and nested slugs, with real discovery links', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-machine-'));
  const dir = path.join(root, 'dist');
  const manifestPath = path.join(root, 'cache/manifest.json');
  const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru', 'zh-hant'];
  try {
    for (const locale of locales) {
      const folder = path.join(dir, locale, 'blog/nested/hello');
      await mkdir(folder, { recursive: true });
      await writeFile(
        path.join(folder, 'index.html'),
        page({ locale, url: `https://example.com/project/${locale}/blog/nested/hello/` })
      );
    }
    const options = {
      dir,
      manifestPath,
      site: 'https://example.com',
      base: '/project/',
      title: 'My Site',
      description: 'My description',
    };
    assert.deepEqual(await generateMachineReadable(options), {
      articles: 9,
      locales: 9,
      files: 28,
    });
    const index = await readFile(path.join(dir, 'llms.txt'), 'utf8');
    assert.equal(index.charCodeAt(0), 0xfeff);
    assert.equal(
      (await readFile(path.join(dir, 'zh/blog/nested/hello/index.md'), 'utf8')).charCodeAt(0),
      0xfeff
    );
    assert.equal(
      (await readFile(path.join(dir, 'zh/llms-full.txt'), 'utf8')).charCodeAt(0),
      0xfeff
    );
    assert.match(index, /# My Site/);
    for (const locale of locales) {
      assert(index.includes(`https://example.com/project/${locale}/llms.txt`));
      const languageIndex = await readFile(path.join(dir, locale, 'llms.txt'), 'utf8');
      assert(languageIndex.includes(`/project/${locale}/blog/nested/hello/index.md`));
      const html = await readFile(path.join(dir, locale, 'blog/nested/hello/index.html'), 'utf8');
      assert(html.includes('rel="alternate" type="text/markdown"'));
      assert(
        html.includes(`rel="describedby" href="https://example.com/project/${locale}/llms.txt"`)
      );
    }
    // Rebuilding without cleaning must not duplicate declarations or change stable output.
    await generateMachineReadable(options);
    assert.equal(await readFile(path.join(dir, 'llms.txt'), 'utf8'), index);
    assert.equal(
      (await readFile(path.join(dir, 'en/blog/nested/hello/index.html'), 'utf8')).match(
        /data-anglefeint-machine=/g
      ).length,
      2
    );
    // Disabled/deleted languages and newly noindex articles lose only owned outputs.
    for (const locale of locales.slice(1))
      await rm(path.join(dir, locale, 'blog'), { recursive: true });
    await writeFile(path.join(dir, 'en/blog/nested/hello/index.html'), page({ robots: 'noindex' }));
    assert.deepEqual(await generateMachineReadable(options), { articles: 0, locales: 0, files: 1 });
    for (const locale of locales) {
      await assert.rejects(access(path.join(dir, locale, 'llms.txt')));
      await assert.rejects(access(path.join(dir, locale, 'llms-full.txt')));
    }
    await assert.rejects(access(path.join(dir, 'en/blog/nested/hello/index.md')));
    assert.match(await readFile(path.join(dir, 'llms.txt'), 'utf8'), /No public articles/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('build refuses user-file collisions and unsafe cleanup manifests', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-machine-'));
  const dir = path.join(root, 'dist');
  const manifestPath = path.join(root, 'manifest.json');
  try {
    await mkdir(dir);
    await writeFile(path.join(dir, 'llms.txt'), 'Custom user content');
    const options = { dir, site: 'https://example.com', manifestPath };
    await assert.rejects(generateMachineReadable(options), /conflicts/);
    assert.equal(await readFile(path.join(dir, 'llms.txt'), 'utf8'), 'Custom user content');
    await writeFile(
      manifestPath,
      JSON.stringify({ dir: path.resolve(dir), files: ['../outside.md'] })
    );
    await assert.rejects(generateMachineReadable(options), /Unsafe/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
