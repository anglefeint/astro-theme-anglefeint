import test from 'node:test';
import process from 'node:process';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { createMaintainerSession } from '../scripts/maintainer-session.mjs';

async function fixture(operation) {
  const root = await mkdtemp(path.join(tmpdir(), 'anglefeint-reporting-'));
  try {
    await operation(root);
  } finally {
    assert.equal(path.dirname(root), tmpdir());
    await rm(root, { recursive: true, force: true });
  }
}

test('maintainer command retains stdout/stderr and blocks after the original exit failure', () =>
  fixture(async (root) => {
    const session = await createMaintainerSession('failure fixture', { root });
    let nextRan = false;
    try {
      await assert.rejects(
        (async () => {
          await session.run(process.execPath, [
            '-e',
            'console.log("stdout marker"); console.error("stderr marker"); process.exit(7)',
          ]);
          nextRan = true;
        })(),
        (error) => error.exitCode === 7
      );
    } finally {
      await session.close();
    }
    assert.equal(nextRan, false);
    const [directory] = await readdir(path.join(root, 'acceptance-results'));
    const summary = JSON.parse(
      await readFile(path.join(root, 'acceptance-results', directory, 'summary.json'))
    );
    assert.equal(summary.stages[0].exitCode, 7);
    assert.equal(summary.stages[0].status, 'failed');
    assert.ok(summary.stages[0].seconds >= 0);
    const log = await readFile(summary.stages[0].log, 'utf8');
    assert.match(log, /stdout marker/);
    assert.match(log, /stderr marker/);
  }));

test('maintainer sessions queue until the preceding session releases the shared lock', () =>
  fixture(async (root) => {
    const first = await createMaintainerSession('first', { root });
    let entered = false;
    const pending = createMaintainerSession('second', { root }).then((session) => {
      entered = true;
      return session;
    });
    await delay(30);
    assert.equal(entered, false);
    await first.close();
    const second = await pending;
    try {
      await second.run(process.execPath, ['-e', 'process.exit(0)']);
    } finally {
      await second.close();
    }
    assert.equal(entered, true);
    await assert.rejects(
      readFile(path.join(root, 'acceptance-results/.maintainer-lock/owner.json')),
      { code: 'ENOENT' }
    );
  }));

test('failed process launch still permits a later maintainer session', () =>
  fixture(async (root) => {
    const session = await createMaintainerSession('missing executable', { root });
    try {
      await assert.rejects(session.run(path.join(root, 'missing-command'), []), { code: 'ENOENT' });
    } finally {
      await session.close();
    }
    const retry = await createMaintainerSession('retry', { root });
    await retry.close();
  }));
