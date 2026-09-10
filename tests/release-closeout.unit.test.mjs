import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { collectLinks, checkReadmeLinks } from '../scripts/check-readme-links.mjs';
import { verifyPublishedPackage } from '../scripts/verify-published-package.mjs';

test('README parser covers markdown, references and HTML, ignoring code/comments', () => {
  assert.deepEqual(
    collectLinks(
      [
        '[guide](guide.md#title)',
        '![pic](image.png)',
        '[reference][target]',
        '',
        '[target]: reference.md',
        '',
        '<a href="page.html?a=1&amp;b=2">page</a>',
        '<img src=picture.png>',
        '<!-- <a href="ignored.md"> -->',
        '',
        '`[code](ignored.md)`',
        '```html',
        '<a href="ignored.md">',
        '```',
      ].join('\n')
    ),
    ['guide.md#title', 'image.png', 'reference.md', 'page.html?a=1&b=2', 'picture.png']
  );
});

test('README checks resolve relative paths and fail on missing HTML links', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-links-'));
  try {
    await mkdir(path.join(root, 'docs'));
    await writeFile(path.join(root, 'file name.md'), 'ok');
    const readme = path.join(root, 'docs/README.md');
    await writeFile(
      readme,
      '[ok](../file%20name.md#title)\n<a href="/file%20name.md?q=1">ok</a>\n<a href="https://example.com">external</a>\n<img src="//example.com/image.png">\n[anchor](#title)'
    );
    await checkReadmeLinks(root, ['docs/README.md']);
    await writeFile(readme, '<a href="ASTRO_THEME_LISTING.md">listing</a>');
    await assert.rejects(
      checkReadmeLinks(root, ['docs/README.md']),
      /missing local link ASTRO_THEME_LISTING.md/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

const artifact = { name: '@anglefeint/astro-theme', version: '0.2.12', integrity: 'sha512-test' };
const options = { ...artifact, destination: 'unused', log: () => {}, sleep: async () => {} };

test('registry verification retries visibility and download without publishing', async () => {
  const calls = [];
  let packs = 0;
  const result = await verifyPublishedPackage({
    ...options,
    capture: async (args) => {
      calls.push(args);
      if (calls.length === 1) return JSON.stringify('0.2.11');
      if (args[0] === 'view') return JSON.stringify('0.2.12');
      if (++packs === 1) throw new Error('tarball not ready');
      return JSON.stringify([artifact]);
    },
  });
  assert.deepEqual(result, artifact);
  assert.deepEqual(
    calls.map((args) => args[0]),
    ['view', 'view', 'pack', 'view', 'pack']
  );
  assert.ok(calls.every((args) => args.includes('--fetch-timeout=15000')));
});

test('registry exhaustion gives recovery guidance and bounded attempts', async () => {
  let calls = 0;
  let sleeps = 0;
  await assert.rejects(
    verifyPublishedPackage({
      ...options,
      attempts: 3,
      sleep: async () => {
        sleeps += 1;
      },
      capture: async () => {
        calls += 1;
        throw new Error('404');
      },
    }),
    /Do not republish this version or sync starter yet/
  );
  assert.equal(calls, 3);
  assert.equal(sleeps, 2);
});

test('registry custom tags and downloaded identity are checked', async () => {
  const calls = [];
  await assert.rejects(
    verifyPublishedPackage({
      ...options,
      tag: 'alpha',
      attempts: 1,
      capture: async (args) => {
        calls.push(args);
        return JSON.stringify(args[0] === 'view' ? '0.2.12' : [{ ...artifact, version: '0.2.11' }]);
      },
    }),
    /registry verification failed/
  );
  assert.equal(calls[0][1], '@anglefeint/astro-theme@alpha');
  assert.equal(calls[1][1], '@anglefeint/astro-theme@0.2.12');
});
