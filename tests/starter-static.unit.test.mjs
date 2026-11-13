import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import { STARTER_MANAGED_FILES, starterSourcePath } from '../scripts/starter-manifest.mjs';
import { checkStarterStatic } from '../scripts/starter-static.mjs';

async function fixture() {
  const paths = [
    ...new Set([
      ...STARTER_MANAGED_FILES.map(starterSourcePath),
      'package.json',
      'packages/theme/package.json',
    ]),
  ];
  const files = new Map(await Promise.all(paths.map(async (p) => [p, await readFile(p)])));
  return {
    files,
    snapshot: { read: (p) => files.get(p) ?? null },
    targetSnapshot: { files: new Map([['LICENSE', {}]]) },
  };
}

test('virtual distribution validates nine READMEs and consumer guidance without installing', async () => {
  assert.equal((await checkStarterStatic(await fixture())).readmes, 9);
});

test('a local main file absent from starter fails before installation, including HTML links', async () => {
  for (const link of ['[guide](CONTRIBUTING.md)', '<a href="CONTRIBUTING.md">guide</a>']) {
    const f = await fixture();
    f.files.set('README.md', Buffer.concat([f.files.get('README.md'), Buffer.from('\n' + link)]));
    await assert.rejects(checkStarterStatic(f), /README.md: missing local link CONTRIBUTING.md/);
  }
});

test('missing guidance metadata and escaped local destinations block static preflight', async () => {
  const f = await fixture();
  f.files.set(
    'README.md',
    Buffer.concat([f.files.get('README.md'), Buffer.from('\n[escape](../outside)')])
  );
  await assert.rejects(checkStarterStatic(f), /missing local link/);
  const g = await fixture();
  g.files.delete(starterSourcePath('README.meta.yaml'));
  await assert.rejects(checkStarterStatic(g), /Missing starter source/);
});
