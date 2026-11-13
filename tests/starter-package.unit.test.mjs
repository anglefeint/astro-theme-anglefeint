import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import {
  buildStarterPackage,
  starterPackageDrift,
  STARTER_SCRIPTS,
} from '../scripts/starter-package.mjs';
import {
  STARTER_MANAGED_FILES,
  STARTER_OBSOLETE_FILES,
  STARTER_CONTENT_MANAGED_FILES,
  starterSourcePath,
} from '../scripts/starter-manifest.mjs';

const source = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('distributed tutorial overrides use the current integration guidance', async () => {
  let tutorials = 0;
  for (const destination of STARTER_CONTENT_MANAGED_FILES) {
    const source = starterSourcePath(destination);
    if (destination.endsWith('/welcome-to-anglefeint.md')) {
      assert.equal(source, destination);
      continue;
    }
    assert.match(source, /^scripts\/starter-templates\/content\//);
    const body = await readFile(new URL('../' + source, import.meta.url), 'utf8');
    assert.match(body, /^---\r?\n/, destination);
    assert.doesNotMatch(body, /export const STARTER_SOURCE_OVERRIDES/);
    // Each tutorial either explains upgrading or links to the self-contained
    // installation guide; unrelated tutorials need not repeat upgrade commands.
    const locale = destination.split('/').at(-2);
    assert.ok(
      body.includes('npx @anglefeint/astro-theme@latest upgrade') ||
        body.includes(`/${locale}/blog/starter-guide-1-configure-your-site/`),
      destination
    );
    assert.equal(
      body,
      await readFile(new URL('../' + destination, import.meta.url), 'utf8'),
      `${destination} must match its starter template`
    );
    // The integration's upgrade introduction is already published. Later
    // sections may accurately distinguish a new CLI change awaiting release.
    const upgradeIntroduction = body.split('```')[0];
    assert.doesNotMatch(upgradeIntroduction, /not published yet|尚未发布|未公開です/);
    assert.doesNotMatch(body, /UPGRADING\.md#unreleased-/);
    tutorials++;
  }
  assert.equal(tutorials, 198);
});

test('starter generation fixes legacy commands, is idempotent and excludes maintainer dependencies', () => {
  const old = {
    name: 'starter',
    scripts: { 'new-post': 'node scripts/new-post.mjs' },
    workspaces: ['packages/*'],
  };
  const generated = buildStarterPackage(source, old, '^0.2.11');
  assert.deepEqual(generated.scripts, STARTER_SCRIPTS);
  assert.equal(generated.workspaces, undefined);
  assert.equal(generated.devDependencies.husky, undefined);
  assert.equal(generated.devDependencies.satori, undefined);
  assert.deepEqual(generated.overrides, { fflate: '0.7.5' });
  assert.deepEqual(buildStarterPackage(source, generated, '^0.2.11'), generated);
  assert.deepEqual(starterPackageDrift(source, generated, '^0.2.11'), []);
  for (const field of ['scripts', 'dependencies', 'devDependencies', 'engines', 'overrides']) {
    const broken = JSON.parse(JSON.stringify(generated));
    broken[field].unexpected = 'broken';
    assert.ok(starterPackageDrift(source, broken, '^0.2.11').includes(field));
  }
  assert.equal(old.scripts['new-post'], 'node scripts/new-post.mjs');
});

test('thin starter owns user entrypoints and delegates standard routes/runtime to the package', () => {
  for (const file of [
    'astro.config.mjs',
    'src/content.config.ts',
    'src/site.config.ts',
    'tsconfig.json',
  ]) {
    assert.ok(STARTER_MANAGED_FILES.includes(file), file);
  }
  for (const file of [
    'src/pages/index.astro',
    'src/utils/metrics.ts',
    'src/site.config.defaults.ts',
    'src/pages/[lang]/about.astro',
  ]) {
    assert.ok(!STARTER_MANAGED_FILES.includes(file), file);
    assert.ok(STARTER_OBSOLETE_FILES.includes(file), file);
  }
  for (const command of Object.values(STARTER_SCRIPTS)) {
    for (const [, file] of command.matchAll(/node (scripts\/[\w.-]+\.mjs)/g)) {
      assert.ok(STARTER_MANAGED_FILES.includes(file), file);
      assert.ok(!STARTER_OBSOLETE_FILES.includes(file), file);
    }
  }
});
