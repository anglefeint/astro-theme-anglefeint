import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  cleanupUnexpectedStarterContent,
  syncStarter,
  validateSyncBranches,
} from '../tools/maintainer/sync-starter.mjs';

test('starter sync rejects source targets and main aliases', () => {
  for (const [source, target] of [
    ['main', 'main'],
    ['origin/main', 'main'],
    ['main', 'refs/heads/main'],
    ['starter', 'starter'],
    ['origin/starter', 'starter'],
  ]) {
    assert.throws(() => validateSyncBranches(source, target), /distribution branch/);
  }
  assert.doesNotThrow(() => validateSyncBranches('main', 'starter'));
});

test('starter cleanup keeps onboarding and removes extra posts on native paths', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-cleanup-test-'));
  try {
    const dir = path.join(root, 'src/content/blog/en');
    await mkdir(dir, { recursive: true });
    for (const file of ['welcome-to-anglefeint.md', 'extra.md', 'asset.txt'])
      await writeFile(path.join(dir, file), file);
    assert.deepEqual(await cleanupUnexpectedStarterContent(root), ['src/content/blog/en/extra.md']);
    assert.equal(
      await readFile(path.join(dir, 'welcome-to-anglefeint.md'), 'utf8'),
      'welcome-to-anglefeint.md'
    );
    assert.equal(await readFile(path.join(dir, 'asset.txt'), 'utf8'), 'asset.txt');
    await assert.rejects(readFile(path.join(dir, 'extra.md')), { code: 'ENOENT' });
    assert.deepEqual(await cleanupUnexpectedStarterContent(root), []);
  } finally {
    assert.equal(path.dirname(root), os.tmpdir());
    await rm(root, { recursive: true, force: true });
  }
});

function fixture({ failPush = false, failAudit = false, committed = false } = {}) {
  const calls = [];
  let branch = 'main';
  return {
    calls,
    operations: {
      run: async (cmd, args) => {
        calls.push([cmd, ...args].join(' '));
        if (cmd === 'git' && args[0] === 'checkout') branch = args[1];
        if (failPush && cmd === 'git' && args[0] === 'push') throw new Error('push failed');
        if (failAudit && cmd === 'npm' && args[0] === 'audit') throw new Error('audit failed');
      },
      currentBranch: async () => branch,
      expectedStarterThemeRange: async () => '^0.2.12',
      cleanupGeneratedArtifacts: async () => [],
      writeManagedFilesFromRef: async () => [],
      cleanupObsoleteStarterFiles: async () => [],
      cleanupUnexpectedStarterContent: async () => [],
      sanitizeStarterPackageJson: async () => false,
      syncStarterThemeDependency: async () => false,
      syncStarterRuntimeDeps: async () => false,
      commitStarterIfNeeded: async () => committed,
    },
  };
}

const options = {
  sourceRef: 'main',
  targetBranch: 'starter',
  originalBranch: 'main',
  allowAnyBranch: false,
  push: true,
};

test('security audit failure prevents starter commit and push', async () => {
  const { calls, operations } = fixture({ failAudit: true });
  let committed = false;
  operations.commitStarterIfNeeded = async () => {
    committed = true;
  };
  await assert.rejects(syncStarter(options, operations), /audit failed/);
  assert.equal(committed, false);
  assert.equal(
    calls.some((call) => call.startsWith('git push')),
    false
  );
});

test('sync pushes an already committed starter and restores main dependencies', async () => {
  const { calls, operations } = fixture();
  await syncStarter(options, operations);
  assert.ok(calls.includes('git push origin starter'));
  assert.deepEqual(calls.slice(-2), ['git checkout main', 'npm install']);
});

test('failed push preserves starter for inspection; retry pushes without a new commit', async () => {
  const first = fixture({ failPush: true, committed: true });
  await assert.rejects(syncStarter(options, first.operations), /push failed/);
  assert.equal(first.calls.includes('git checkout main'), false);
  const retry = fixture();
  await syncStarter(options, retry.operations);
  assert.ok(retry.calls.includes('git push origin starter'));
});

test('invalid sync target has no external effects, and push remains opt-in', async () => {
  const { calls, operations } = fixture();
  await assert.rejects(
    syncStarter({ ...options, targetBranch: 'main' }, operations),
    /distribution branch/
  );
  assert.deepEqual(calls, []);
  await syncStarter({ ...options, push: false }, operations);
  assert.equal(
    calls.some((call) => call.startsWith('git push')),
    false
  );
});
