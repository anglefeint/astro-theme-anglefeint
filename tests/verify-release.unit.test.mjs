import test from 'node:test';
import assert from 'node:assert/strict';
import { parseVerifyArgs, verifyRelease } from '../scripts/verify-release.mjs';

test('read-only recovery requires an exact version and rejects mutation/duplicate arguments', () => {
  assert.deepEqual(parseVerifyArgs(['--help']), { help: true });
  assert.deepEqual(parseVerifyArgs(['--version', '0.32.0']), { version: '0.32.0', tag: 'latest' });
  for (const args of [
    [],
    ['--version', 'latest'],
    ['--publish'],
    ['--skip-checks'],
    ['--version', '0.32.0', '--tag', 'latest', '--tag', 'beta'],
    ['--version', '0.32.0', '--source', 'a'.repeat(41)],
  ])
    assert.throws(() => parseVerifyArgs(args));
});

const metadata = {
  name: '@anglefeint/astro-theme',
  version: '0.32.0',
  gitHead: 'a'.repeat(40),
  dist: { integrity: 'sha512-YWJj', shasum: 'b'.repeat(40) },
};
function fixture({ visible = metadata.version, pack = {}, meta = {} } = {}) {
  const calls = [];
  return {
    calls,
    capture: async (args) => {
      calls.push(args);
      if (args[0] === 'view' && args[2] === 'version') return JSON.stringify(visible);
      if (args[0] === 'view') return JSON.stringify({ ...metadata, ...meta });
      assert.equal(args[0], 'pack');
      return JSON.stringify([
        { name: metadata.name, version: metadata.version, ...metadata.dist, ...pack },
      ]);
    },
  };
}
const options = {
  version: metadata.version,
  tag: 'latest',
  source: metadata.gitHead,
  integrity: metadata.dist.integrity,
  shasum: metadata.dist.shasum,
};

test('read-only recovery verifies tag, source and exact tarball without installing/publishing', async () => {
  const { calls, capture } = fixture();
  await verifyRelease(options, { capture, destination: 'fixture', attempts: 1, log: () => {} });
  assert.deepEqual(
    calls.map((args) => args[0]),
    ['view', 'view', 'pack']
  );
  assert.ok(calls[2].includes('--ignore-scripts'));
  assert.equal(calls[2][1], `${metadata.name}@${metadata.version}`);
});

test('metadata and downloaded identity mismatches remain blocking', async () => {
  for (const settings of [
    { visible: '0.31.0' },
    { meta: { gitHead: 'c'.repeat(40) } },
    { pack: { integrity: 'sha512-wrong' } },
    { pack: { shasum: 'd'.repeat(40) } },
  ]) {
    const { capture } = fixture(settings);
    await assert.rejects(
      verifyRelease(options, { capture, destination: 'fixture', attempts: 1, log: () => {} }),
      /Do not republish/
    );
  }
});

test('registry delays retry verification only and fail after the bounded attempt count', async () => {
  const { calls, capture } = fixture({ visible: '0.31.0' });
  let sleeps = 0;
  await assert.rejects(
    verifyRelease(options, {
      capture,
      destination: 'fixture',
      attempts: 3,
      sleep: async () => {
        sleeps++;
      },
      log: () => {},
    }),
    /Do not republish/
  );
  assert.equal(calls.length, 3);
  assert.ok(calls.every((args) => args[0] === 'view'));
  assert.equal(sleeps, 2);
});
