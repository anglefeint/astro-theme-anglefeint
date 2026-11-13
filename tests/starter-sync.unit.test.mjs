import test from 'node:test';
import { Buffer } from 'node:buffer';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  cleanupUnexpectedStarterContent,
  syncStarter,
  validateSyncBranches,
  readFromGitOrNullBuffer,
  parseArgs,
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

function fixture({
  failPush = false,
  failAudit = false,
  failCheck = false,
  committed = false,
} = {}) {
  const calls = [];
  const directory = '/isolated/starter';
  return {
    calls,
    operations: {
      snapshots: async () => ({
        source: { commit: 'a'.repeat(40), read: () => Buffer.from('{"version":"0.2.12"}') },
        destination: { commit: 'b'.repeat(40) },
      }),
      staticCheck: async () => {
        calls.push('static distribution');
      },
      createWorktree: async () => {
        calls.push('create isolated worktree');
        return directory;
      },
      removeWorktree: async () => {
        calls.push('remove isolated worktree');
      },
      verifySource: async () => {},
      auditDependencies: async (cwd) => {
        assert.equal(cwd, directory);
        calls.push('dependency audit');
        if (failAudit) throw new Error('audit failed');
      },
      run: async (cmd, args, { cwd }) => {
        assert.equal(cwd, directory);
        calls.push([cmd, ...args].join(' '));
        if (failPush && cmd === 'git' && args[0] === 'push') throw new Error('push failed');
        if (failCheck && cmd === 'npm' && args.join(' ') === 'run check')
          throw new Error('check failed');
      },
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

test('starter doctor/check failure blocks commit/push and retains its isolated worktree', async () => {
  const { calls, operations } = fixture({ failCheck: true });
  let committed = false;
  operations.commitStarterIfNeeded = async () => {
    committed = true;
  };
  await assert.rejects(syncStarter(options, operations), /check failed/);
  assert.equal(committed, false);
  assert.equal(calls.includes('git push origin starter'), false);
  assert.equal(calls.includes('remove isolated worktree'), false);
});

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

test('sync pushes an already committed starter without switching main or its dependencies', async () => {
  const { calls, operations } = fixture();
  await syncStarter(options, operations);
  assert.deepEqual(calls, [
    'static distribution',
    'create isolated worktree',
    'npm update --prefer-online',
    'dependency audit',
    'npm run check',
    'git push origin starter',
    'remove isolated worktree',
  ]);
  assert.ok(calls.includes('git push origin starter'));
  assert(!calls.some((call) => /checkout|npm install/.test(call)));
  assert.equal(calls.at(-1), 'remove isolated worktree');
});

test('failed push preserves starter for inspection; retry pushes without a new commit', async () => {
  const first = fixture({ failPush: true, committed: true });
  await assert.rejects(syncStarter(options, first.operations), /push failed/);
  assert.equal(first.calls.includes('remove isolated worktree'), false);
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

test('literal Git blob reads distinguish missing dynamic routes from empty content', async () => {
  const existing = await readFromGitOrNullBuffer(
    'HEAD',
    'packages/theme/src/routes/[lang]/about.astro'
  );
  assert(existing?.includes(Buffer.from('AboutWindowControls')));
  assert.equal(
    await readFromGitOrNullBuffer('HEAD', 'src/pages/[lang]/missing-route-do-not-create.astro'),
    null
  );
});

test('starter sync does not reintroduce root runtime dependencies after package sanitization', async () => {
  const { operations } = fixture();
  operations.syncStarterRuntimeDeps = async () => {
    throw new Error('Legacy runtime dependency copying must not run');
  };
  await syncStarter({ ...options, push: false }, operations);
});

test('starter help and invalid arguments cannot silently launch a sync', () => {
  assert.equal(parseArgs(['--from=main', '--help']).help, true);
  assert.throws(() => parseArgs(['--hepl']), /Unknown/);
});

test('Git failures are not treated as missing starter files', async () => {
  await assert.rejects(readFromGitOrNullBuffer('no-such-release-ref-for-test', 'missing.md'));
});

test('static distribution failure happens before worktree creation or npm operations', async () => {
  const f = fixture();
  f.operations.staticCheck = async () => {
    throw new Error('static failed');
  };
  await assert.rejects(syncStarter(options, f.operations), /static failed/);
  assert.deepEqual(f.calls, []);
});

test('source ref drift blocks commit and push without deleting failure evidence', async () => {
  const f = fixture();
  let committed = false;
  f.operations.verifySource = async () => {
    throw new Error('source changed');
  };
  f.operations.commitStarterIfNeeded = async () => {
    committed = true;
  };
  await assert.rejects(syncStarter(options, f.operations), /source changed/);
  assert.equal(committed, false);
  assert(!f.calls.includes('remove isolated worktree'));
  assert(!f.calls.some((call) => call.startsWith('git push')));
});
