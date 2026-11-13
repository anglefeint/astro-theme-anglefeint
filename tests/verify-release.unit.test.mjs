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
  const measured = [];
  await assert.rejects(
    verifyRelease(options, {
      capture,
      destination: 'fixture',
      attempts: 3,
      onWait: (ms) => measured.push(ms),
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
  assert.equal(measured.length, 2);
  assert.ok(measured.every((ms) => Number.isFinite(ms) && ms >= 0));
  assert.ok(
    measured.every((ms) => ms < 10000),
    'measure actual sleep rather than the configured delay'
  );
});

test('transient failures identify stage/code, wait 10 seconds by default and recover read-only', async () => {
  for (const code of ['E404', 'ETIMEDOUT', 'ECONNRESET', 'EAI_AGAIN', 'E429', 'E503']) {
    const f = fixture();
    const logs = [],
      delays = [];
    let first = true;
    await verifyRelease(options, {
      capture: async (args) => {
        if (first) {
          first = false;
          throw Object.assign(new Error('npm request failed'), {
            stdout: JSON.stringify({ error: { code, summary: 'request temporarily unavailable' } }),
          });
        }
        return f.capture(args);
      },
      destination: 'fixture',
      sleep: async (ms) => delays.push(ms),
      log: (line) => logs.push(line),
    });
    assert.deepEqual(delays, [10000]);
    assert(logs[0].includes(`stage=tag code=${code} action=retry`));
    assert(logs.at(-1).includes('verified'));
    assert.deepEqual(
      f.calls.map((args) => args[0]),
      ['view', 'view', 'pack']
    );
  }
});

test('auth, integrity, malformed output and unknown failures stop immediately at their stage', async () => {
  for (const stage of ['tag', 'metadata', 'download']) {
    for (const code of ['E401', 'E403', 'EINTEGRITY', 'EPERM', 'UNKNOWN_ERROR', 'INVALID_JSON']) {
      const f = fixture();
      let sleeps = 0;
      const logs = [];
      await assert.rejects(
        verifyRelease(options, {
          capture: async (args) => {
            const current =
              args[0] === 'pack' ? 'download' : args[2] === 'version' ? 'tag' : 'metadata';
            if (current === stage) {
              if (code === 'INVALID_JSON') return '{broken';
              if (code === 'UNKNOWN_ERROR') throw new Error('unexpected failure');
              // Match npm CLI stderr, including execFile's numeric exit code.
              throw Object.assign(new Error('npm failed'), {
                code: 1,
                stderr: `npm error code ${code}\n`,
              });
            }
            return f.capture(args);
          },
          destination: 'fixture',
          sleep: async () => sleeps++,
          log: (line) => logs.push(line),
        }),
        (error) =>
          error.code === code && error.stage === stage && error.attempt === 1 && !error.retryable
      );
      assert.equal(sleeps, 0);
      assert.equal(logs.length, 1);
      assert(logs[0].includes('action=stop'));
    }
  }
});

test('identity mismatches never retry or download mismatched metadata', async () => {
  for (const settings of [
    { meta: { name: 'wrong' } },
    { meta: { version: '0.0.0' } },
    { meta: { gitHead: 'c'.repeat(40) } },
    { meta: { dist: {} } },
    { meta: { dist: { integrity: 7, shasum: 'b'.repeat(40) } } },
    { meta: { dist: { integrity: 'sha512-YWJj', shasum: 'bad' } } },
    { pack: { name: 'wrong' } },
    { pack: { version: '0.0.0' } },
    { pack: { integrity: 'sha512-wrong' } },
    { pack: { shasum: 'c'.repeat(40) } },
  ]) {
    const f = fixture(settings);
    let sleeps = 0;
    await assert.rejects(
      verifyRelease(options, {
        capture: f.capture,
        destination: 'fixture',
        sleep: async () => sleeps++,
        log: () => {},
      }),
      (error) => error.code === 'IDENTITY_MISMATCH' && error.attempt === 1
    );
    assert.equal(sleeps, 0);
    assert.equal(f.calls.length, settings.meta ? 2 : 3);
  }
});

test('default retry count stays twelve and final diagnostics preserve the actual cause', async () => {
  let calls = 0,
    sleeps = 0;
  const logs = [];
  const failures = [];
  await assert.rejects(
    verifyRelease(options, {
      capture: async () => {
        calls++;
        throw Object.assign(new Error('socket reset'), { code: 'ECONNRESET' });
      },
      destination: 'fixture',
      sleep: async (ms) => {
        assert.equal(ms, 10000);
        sleeps++;
      },
      log: (line) => logs.push(line),
      onFailure: (failure) => failures.push(failure),
    }),
    (error) =>
      error.attempt === 12 && error.code === 'ECONNRESET' && error.cause.message === 'socket reset'
  );
  assert.equal(calls, 12);
  assert.equal(sleeps, 11);
  assert.equal(failures.length, 12);
  assert.deepEqual(failures.at(-1), {
    attempt: 12,
    attempts: 12,
    stage: 'tag',
    code: 'ECONNRESET',
    action: 'exhausted',
    reason: 'socket reset',
  });
  assert(logs.at(-1).includes('12/12 stage=tag code=ECONNRESET action=exhausted'));
});

test('diagnostics redact credentials and are bounded without hiding code/stage', async () => {
  const logs = [];
  await assert.rejects(
    verifyRelease(options, {
      capture: async () => {
        throw new Error(
          'https://user:secret@example.com token=private npm_secrettoken Bearer privatevalue\n' +
            'x'.repeat(1000)
        );
      },
      destination: 'fixture',
      log: (line) => logs.push(line),
    }),
    (error) => !/secret|private/.test(error.message)
  );
  assert.equal(logs.length, 1);
  assert(!/secret|private|\n/.test(logs[0]));
  assert(logs[0].length < 520);
});
