import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import search from '../packages/theme/src/search.mjs';

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
