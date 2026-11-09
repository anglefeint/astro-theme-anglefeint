import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import search, { writeSearchIndex } from '../packages/theme/src/search.mjs';

test('search publishes complete Pagefind bytes before returning, without native disk writes', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-search-'));
  assert.equal(path.dirname(root), os.tmpdir());
  assert.ok(path.basename(root).startsWith('anglefeint-search-'));
  const files = [
    {
      path: 'pagefind-entry.json',
      content: Buffer.from(
        JSON.stringify({ languages: { en: { page_count: 2 }, zh: { page_count: 1 } } })
      ),
    },
    { path: 'index/example.pf_index', content: new Uint8Array(2 * 1024 * 1024).fill(213) },
    { path: 'pagefind.js', content: Buffer.from('export const marker = "unchanged";') },
  ];
  try {
    const count = await writeSearchIndex(
      {
        getFiles: async () => ({ errors: [], files }),
        writeFiles: () => assert.fail('must not use the early-returning native disk API'),
      },
      root
    );
    assert.equal(count, 3);
    for (const file of files) {
      assert.deepEqual(await readFile(path.join(root, file.path)), Buffer.from(file.content));
    }
    assert.deepEqual(JSON.parse(await readFile(path.join(root, 'anglefeint.json'), 'utf8')), {
      languages: ['en', 'zh'],
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('search rejects native errors and incomplete metadata rather than publishing an empty fallback', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-search-'));
  assert.equal(path.dirname(root), os.tmpdir());
  assert.ok(path.basename(root).startsWith('anglefeint-search-'));
  try {
    for (const [result, error] of [
      [{ errors: ['native indexing failed'], files: [] }, /native indexing failed/],
      [{ errors: [], files: [] }, /did not return pagefind-entry.json/],
      [
        { errors: [], files: [{ path: 'pagefind-entry.json', content: Buffer.alloc(0) }] },
        SyntaxError,
      ],
    ]) {
      await assert.rejects(writeSearchIndex({ getFiles: async () => result }, root), error);
      await assert.rejects(readFile(path.join(root, 'anglefeint.json')), { code: 'ENOENT' });
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('search indexes only opted-in articles, supports empty and disabled sites', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-search-'));
  assert.equal(path.dirname(root), os.tmpdir());
  assert.ok(path.basename(root).startsWith('anglefeint-search-'));
  const build = (folder, enabled = true) =>
    search({ enabled }).hooks['astro:build:done']({
      dir: pathToFileURL(`${folder}${path.sep}`),
      logger: { info() {} },
    });
  try {
    for (const [name, html] of Object.entries({
      'article.html':
        '<html lang="zh"><div data-anglefeint-search><h1 data-pagefind-body>中文标题</h1><p data-pagefind-body>正文关键词</p><aside>decoration</aside></div></html>',
      'hidden.html': '<html lang="en"><h1 data-pagefind-body>Excluded article</h1></html>',
      'index.html': '<html lang="en"><h1>Home page</h1></html>',
    }))
      await writeFile(path.join(root, name), html);
    await build(root);
    const manifest = JSON.parse(
      await readFile(path.join(root, 'pagefind/anglefeint.json'), 'utf8')
    );
    assert.deepEqual(manifest.languages, ['zh']);
    const entry = JSON.parse(
      await readFile(path.join(root, 'pagefind/pagefind-entry.json'), 'utf8')
    );
    assert.equal(entry.languages.zh.page_count, 1);
    const empty = path.join(root, 'empty');
    await mkdir(empty);
    await writeFile(
      path.join(empty, 'index.html'),
      '<html lang="en"><h1>Do not index home</h1></html>'
    );
    await build(empty);
    assert.deepEqual(
      JSON.parse(await readFile(path.join(empty, 'pagefind/anglefeint.json'), 'utf8')).languages,
      []
    );
    const disabled = path.join(root, 'disabled');
    await mkdir(disabled);
    await build(disabled, false);
    await assert.rejects(readFile(path.join(disabled, 'pagefind/anglefeint.json')), {
      code: 'ENOENT',
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
