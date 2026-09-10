import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import {
  buildStarterPackage,
  starterPackageDrift,
  STARTER_SCRIPTS,
} from '../scripts/starter-package.mjs';
import { STARTER_MANAGED_FILES, STARTER_OBSOLETE_FILES } from '../scripts/starter-manifest.mjs';

const source = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

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
  assert.deepEqual(buildStarterPackage(source, generated, '^0.2.11'), generated);
  assert.deepEqual(starterPackageDrift(source, generated, '^0.2.11'), []);
  for (const field of ['scripts', 'dependencies', 'devDependencies', 'engines']) {
    const broken = JSON.parse(JSON.stringify(generated));
    broken[field].unexpected = 'broken';
    assert.ok(starterPackageDrift(source, broken, '^0.2.11').includes(field));
  }
  assert.equal(old.scripts['new-post'], 'node scripts/new-post.mjs');
});

test('starter owns critical route/config/metrics files and all local command targets', () => {
  for (const file of [
    'astro.config.mjs',
    'src/pages/index.astro',
    'src/pages/robots.txt.ts',
    'src/content.config.ts',
    'src/utils/metrics.ts',
  ]) {
    assert.ok(STARTER_MANAGED_FILES.includes(file), file);
  }
  for (const command of Object.values(STARTER_SCRIPTS)) {
    for (const [, file] of command.matchAll(/node (scripts\/[\w.-]+\.mjs)/g)) {
      assert.ok(STARTER_MANAGED_FILES.includes(file), file);
      assert.ok(!STARTER_OBSOLETE_FILES.includes(file), file);
    }
  }
});
