import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import {
  fragmentSettings,
  fragmentsForLocale,
  fragmentTerm,
} from '../packages/theme/src/utils/fragments.ts';
import { newFragment } from '../packages/theme/src/scaffold/new-fragment.mjs';
import {
  chooseFragmentId,
  collectFragmentIds,
} from '../packages/theme/src/scaffold/fragment-id.mjs';
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
    data: { id: index === 2 ? 'Other002' : 'Same0001', pubDate: new Date(`2026-11-${10 + index}`) },
  }));
  assert.deepEqual(
    fragmentsForLocale(entries, 'en').map((entry) => entry.data.id),
    ['Other002', 'Same0001']
  );
  assert.equal(
    fragmentTerm(fragmentsForLocale(entries, 'en')[1].data.id),
    fragmentTerm(fragmentsForLocale(entries, 'zh')[0].data.id)
  );
  assert.notEqual(fragmentTerm('Other002'), fragmentTerm('Same0001'));
  assert.throws(() => fragmentsForLocale([...entries, entries[0]], 'en'), /duplicate/);
  for (const id of ['', '../a', 'with space', 'a/b']) assert.throws(() => fragmentTerm(id));
});

test('fragment CLI defaults to all enabled locales with shared identity and preserves user files', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fragments-cli-'));
  const previousLocales = process.env.ANGLEFEINT_LOCALES;
  delete process.env.ANGLEFEINT_LOCALES;
  try {
    await mkdir(path.join(root, 'src'));
    await writeFile(
      path.join(root, 'src/site.config.ts'),
      `export const THEME_CONFIG = {i18n: {defaultLocale: 'zh', locales: {en:{},zh:{},ja:{meta:{enabled:false}}}}};`
    );
    const defaults = await newFragment([], root);
    assert.deepEqual(
      defaults.map((file) => path.basename(path.dirname(file))),
      ['en', 'zh']
    );
    const [first] = defaults;
    const original = await readFile(first, 'utf8');
    assert.equal(await readFile(defaults[1], 'utf8'), original);
    assert.match(original, /pubDate: \d{4}-\d\d-\d\dT/);
    assert.match(original, /^id: '[A-Za-z0-9]{8}'$/m);
    const files = await newFragment(['--locales', 'en,zh'], root);
    assert.equal(files.length, 2);
    assert.equal(await readFile(files[0], 'utf8'), await readFile(files[1], 'utf8'));
    assert.equal(await readFile(first, 'utf8'), original);
    const only = await newFragment(['--locales', 'zh'], root);
    assert.equal(only.length, 1);
    assert.equal(path.basename(path.dirname(only[0])), 'zh');
    assert.notEqual(await readFile(only[0], 'utf8'), original);
    await assert.rejects(newFragment(['--locales', '../zh'], root), /Invalid locale/);
    await assert.rejects(newFragment(['--locales', ', ,'], root), /Locales list is empty/);
    await assert.rejects(newFragment(['--unknown'], root), /Usage/);
  } finally {
    if (previousLocales === undefined) delete process.env.ANGLEFEINT_LOCALES;
    else process.env.ANGLEFEINT_LOCALES = previousLocales;
    await rm(root, { recursive: true, force: true });
  }
});

test('short IDs retry collisions, bound failures and reject long comment IDs', () => {
  const existing = new Set(['existing']);
  const candidates = ['existing', 'NewId123'];
  assert.equal(
    chooseFragmentId(existing, () => candidates.shift()),
    'NewId123'
  );
  let attempts = 0;
  assert.throws(
    () =>
      chooseFragmentId(existing, () => {
        attempts++;
        return 'existing';
      }),
    /unused/
  );
  assert.equal(attempts, 20);
  assert.throws(() => chooseFragmentId(existing, () => '../bad'), /Invalid/);
  const legacy = '550e8400-e29b-41d4-a716-446655440000';
  assert.throws(() => fragmentTerm(legacy), /valid stable/);
});

test('ID lookup reads nested frontmatter across languages without scanning prose as metadata', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fragments-ids-'));
  try {
    assert.deepEqual(await collectFragmentIds(root), new Set());
    const directory = path.join(root, 'src/content/fragments/zh/nested');
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, 'note.md'),
      '\uFEFF---\r\nid: >-\r\n  OldId123\r\n---\r\nid: FakeId12\r\n'
    );
    await writeFile(path.join(directory, 'numeric.md'), '---\nid: "12345678"\n---\n');
    assert.deepEqual(await collectFragmentIds(root), new Set(['OldId123', '12345678']));
    await writeFile(
      path.join(directory, 'long.md'),
      '---\nid: 550e8400-e29b-41d4-a716-446655440000\n---\n'
    );
    await assert.rejects(collectFragmentIds(root), /exactly 8/);
    await rm(path.join(directory, 'long.md'));
    await writeFile(path.join(directory, 'broken.md'), '---\nid: OldId123\n');
    await assert.rejects(collectFragmentIds(root), /Unclosed/);
  } finally {
    assert.equal(path.dirname(root), tmpdir());
    await rm(root, { recursive: true, force: true });
  }
});

test('fragment overrides match new-post precedence, normalize and bypass broken config', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'fragments-overrides-'));
  const previousLocales = process.env.ANGLEFEINT_LOCALES;
  try {
    await mkdir(path.join(root, 'src'));
    await writeFile(path.join(root, 'src/site.config.ts'), 'throw new Error("broken config");');
    process.env.ANGLEFEINT_LOCALES = 'fr';
    const fromEnv = await newFragment([], root);
    assert.deepEqual(
      fromEnv.map((file) => path.basename(path.dirname(file))),
      ['fr']
    );
    const explicit = await newFragment(['--locales', ' ZH , en,zh, '], root);
    assert.deepEqual(
      explicit.map((file) => path.basename(path.dirname(file))),
      ['zh', 'en']
    );
    assert.equal(await readFile(explicit[0], 'utf8'), await readFile(explicit[1], 'utf8'));
    delete process.env.ANGLEFEINT_LOCALES;
    await assert.rejects(newFragment([], root), /Cannot load locales/);
    await assert.rejects(newFragment(['--locales', '../fr'], root), /Invalid locale/);
  } finally {
    if (previousLocales === undefined) delete process.env.ANGLEFEINT_LOCALES;
    else process.env.ANGLEFEINT_LOCALES = previousLocales;
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
