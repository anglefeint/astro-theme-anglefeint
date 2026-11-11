import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  fragmentSettings,
  fragmentsForLocale,
  fragmentTerm,
} from '../packages/theme/src/utils/fragments.ts';
import { newFragment } from '../packages/theme/src/scaffold/new-fragment.mjs';
import { loadProjectModule } from '../packages/theme/src/scaffold/project-config.mjs';
import anglefeint from '../packages/theme/src/integration.mjs';

const { defineThemeConfig } = await loadProjectModule(
  path.resolve('packages/theme/src/project/defaults.ts')
);

test('fragments defaults preserve old projects; bounds and stable discussion IDs are explicit', () => {
  assert.deepEqual(fragmentSettings(), {
    enabled: false,
    pageSize: 20,
    comments: { enabled: false },
  });
  assert.equal(defineThemeConfig({}).theme.fragments.enabled, false);
  for (const pageSize of [0, -1, 101, 1.5, NaN])
    assert.throws(() => fragmentSettings({ pageSize }));
  const entries = ['en/a', 'zh/a', 'en/nested/b'].map((id, index) => ({
    id,
    data: { id: index === 2 ? 'other' : 'same', pubDate: new Date(`2026-11-${10 + index}`) },
  }));
  assert.deepEqual(
    fragmentsForLocale(entries, 'en').map((entry) => entry.data.id),
    ['other', 'same']
  );
  assert.equal(
    fragmentTerm(fragmentsForLocale(entries, 'en')[1].data.id),
    fragmentTerm(fragmentsForLocale(entries, 'zh')[0].data.id)
  );
  assert.notEqual(fragmentTerm('other'), fragmentTerm('same'));
  assert.throws(() => fragmentsForLocale([...entries, entries[0]], 'en'), /duplicate/);
  for (const id of ['', '../a', 'with space', 'a/b']) assert.throws(() => fragmentTerm(id));
});

test('fragment CLI defaults to one locale, shares IDs only on request and preserves user files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fragments-cli-'));
  try {
    await mkdir(path.join(root, 'src'));
    await writeFile(
      path.join(root, 'src/site.config.ts'),
      `export const THEME_CONFIG = {i18n: {defaultLocale: 'zh', locales: {en:{},zh:{},ja:{meta:{enabled:false}}}}};`
    );
    const [first] = await newFragment([], root);
    assert.ok(first.includes(path.join('fragments', 'zh')));
    const original = await readFile(first, 'utf8');
    assert.match(original, /pubDate: \d{4}-\d\d-\d\dT/);
    const files = await newFragment(['--locales', 'en,zh'], root);
    assert.equal(files.length, 2);
    assert.equal(await readFile(files[0], 'utf8'), await readFile(files[1], 'utf8'));
    assert.equal(await readFile(first, 'utf8'), original);
    await assert.rejects(newFragment(['--locales', '../zh'], root), /enabled locale/);
    await assert.rejects(newFragment(['--locales', 'ja'], root), /enabled locale/);
    await assert.rejects(newFragment(['--unknown'], root), /Usage/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('fragments routes reserve custom paths only when enabled', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fragments-routes-'));
  try {
    const pages = path.join(root, 'src/pages/en/fragments');
    await mkdir(pages, { recursive: true });
    const custom = path.join(pages, 'index.md');
    await writeFile(custom, 'My custom page');
    const config = {
      root: pathToFileURL(root + path.sep),
      srcDir: pathToFileURL(path.join(root, 'src') + path.sep),
    };
    const injected = [];
    await anglefeint(defineThemeConfig({}))[0].hooks['astro:config:setup']({
      config,
      injectRoute: (value) => injected.push(value),
      updateConfig() {},
    });
    assert.equal(
      injected.some((route) => route.pattern.includes('fragments')),
      false
    );
    await assert.rejects(
      anglefeint(defineThemeConfig({ theme: { fragments: { enabled: true } } }))[0].hooks[
        'astro:config:setup'
      ]({ config, injectRoute() {}, updateConfig() {} }),
      /Reserved standard route/
    );
    assert.equal(await readFile(custom, 'utf8'), 'My custom page');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
