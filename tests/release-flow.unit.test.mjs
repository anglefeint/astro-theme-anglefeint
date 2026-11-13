import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, rm, realpath } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parseFlowArgs, runSourceFlow, runAnnouncementFlow } from '../scripts/release-flow.mjs';
import { executeNpmOperations, runNpmTools } from '../scripts/npm-release-tools.mjs';
import { planNpmTools } from '../scripts/release-tool-plan.mjs';
import { createMaintainerSession } from '../scripts/maintainer-session.mjs';

const exec = promisify(execFile),
  source = 'a'.repeat(40),
  tree = 'b'.repeat(40);
async function directory(t) {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'anglefeint-release-flow-')));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'packages/theme'), { recursive: true });
  await mkdir(path.join(root, 'acceptance-results'), { recursive: true });
  await writeFile(
    path.join(root, 'packages/theme/package.json'),
    JSON.stringify({ name: '@anglefeint/astro-theme', version: '1.0.0' })
  );
  await writeFile(
    path.join(root, 'acceptance-results/message.txt'),
    'Release subject\n\nLiteral `code` and $() stay in the file.\n'
  );
  return root;
}
const options = () =>
  parseFlowArgs([
    'source',
    '--version',
    '1.0.0',
    '--message-file',
    'acceptance-results/message.txt',
    '--check',
    'docs-check',
    '--execute',
  ]);

async function sourceFixture(t, fail) {
  const root = await directory(t),
    calls = [];
  const state = { committed: false, tree, dirty: 'M  source\n' };
  const session = {
    stage: async (label, action) => {
      calls.push(label);
      return action({});
    },
    run: async (command, args) => {
      calls.push(args[0]);
      if (fail === args[0]) throw new Error(fail);
      if (args[0] === 'commit') {
        state.committed = true;
        state.dirty = '';
        if (fail === 'hook-change') state.tree = 'c'.repeat(40);
      }
    },
  };
  const capture = async (_command, args) => {
    if (args[0] === 'branch') return 'main\n';
    if (args[0] === 'status') return state.dirty;
    if (args[0] === 'write-tree' || args[1] === 'HEAD^{tree}') return state.tree;
    if (args[0] === 'rev-parse') return source;
    if (args[0] === 'ls-remote')
      return `${fail === 'remote-drift' ? tree : source}\trefs/heads/main\n`;
    throw new Error('Unexpected capture: ' + args);
  };
  const runNpm = async (targets, _opts, context) => {
    assert.equal(context.session, session, 'reuse the owning lock/session');
    const plan = planNpmTools(targets);
    const operations = Object.fromEntries(
      plan.map((name) => [
        name,
        async () => {
          calls.push(name);
          if (fail === name) throw new Error(name);
          if (name === 'npm-auth' && fail === 'staged-change') state.tree = 'c'.repeat(40);
          if (name === 'npm-upload') assert.equal(state.committed, true);
        },
      ])
    );
    await executeNpmOperations(plan, operations, context.beforeUpload);
  };
  const preflight = async () => {
    calls.push('preflight');
    if (fail === 'preflight') throw new Error('preflight failed');
    return { drift: ['package.json'] };
  };
  const staticCheck = async () => {
    calls.push('starter-static');
    if (fail === 'starter-static') throw new Error('static distribution failed');
  };
  return { root, session, capture, runNpm, preflight, staticCheck, calls, state, env: {} };
}

test('plan defaults are non-mutating and checks/messages remain explicit', () => {
  assert.equal(parseFlowArgs(['announce', '--receipt', 'reviewed.json']).execute, false);
  assert.throws(
    () => parseFlowArgs(['source', '--version', '1.0.0', '--message-file', 'message.txt']),
    /Select necessary/
  );
  for (const check of ['npm-delivery', 'source-check', 'installed-matrix'])
    assert.throws(
      () =>
        parseFlowArgs([
          'source',
          '--version',
          '1.0.0',
          '--message-file',
          'message.txt',
          '--check',
          check,
        ]),
      /Only independent/
    );
  assert.throws(() => parseFlowArgs(['announce', '--receipt', 'r', '--skip-checks']), /argument/);
});
test('source checks and npm prerequisites precede commit/hooks/preflight/push and one upload', async (t) => {
  const f = await sourceFixture(t);
  assert.equal((await runSourceFlow(options(), f)).source, source);
  for (const [a, b] of [
    ['starter-static', 'docs-check'],
    ['docs-check', 'commit'],
    ['npm-auth', 'commit'],
    ['commit', 'preflight'],
    ['preflight', 'push'],
    ['push', 'npm-upload'],
    ['npm-upload', 'npm-delivery'],
  ])
    assert(f.calls.indexOf(a) < f.calls.indexOf(b), `${a} before ${b}`);
  assert.equal(f.calls.filter((call) => call === 'npm-upload').length, 1);
});
for (const failure of [
  'starter-static',
  'docs-check',
  'audit-main',
  'npm-auth',
  'commit',
  'preflight',
  'push',
  'hook-change',
  'remote-drift',
  'staged-change',
]) {
  test(`source stops before upload on ${failure}`, async (t) => {
    const f = await sourceFixture(t, failure);
    await assert.rejects(runSourceFlow(options(), f));
    assert(!f.calls.includes('npm-upload'));
    if (['docs-check', 'audit-main', 'npm-auth', 'staged-change'].includes(failure))
      assert(!f.calls.includes('commit'));
  });
}
test('an accepted upload with failed verification is not uploaded twice', async (t) => {
  const f = await sourceFixture(t, 'npm-delivery');
  await assert.rejects(runSourceFlow(options(), f));
  assert.equal(f.calls.filter((call) => call === 'npm-upload').length, 1);
});

test('an explicitly selected static tool is not rerun after the intrinsic early check', async (t) => {
  const f = await sourceFixture(t);
  const opts = options();
  opts.checks.push('starter-static-check');
  await runSourceFlow(opts, f);
  assert.equal(f.calls.filter((call) => call === 'starter-static').length, 1);
  assert(!f.calls.includes('starter-static-check'));
});
test('unstaged source and disabled hooks block handoff', async (t) => {
  const f = await sourceFixture(t);
  f.state.dirty = ' M source\n';
  await assert.rejects(runSourceFlow(options(), f), /Stage all reviewed/);
  await assert.rejects(runSourceFlow(options(), { ...f, env: { HUSKY: '0' } }), /hooks/);
});

test('real local commit executes its hook without nested locks; npm and push are mocked', async (t) => {
  const root = await directory(t);
  const git = async (...args) => (await exec('git', args, { cwd: root })).stdout;
  await git('init', '-b', 'main');
  await git('config', 'user.name', 'Fixture');
  await git('config', 'user.email', 'fixture@example.invalid');
  await writeFile(path.join(root, '.gitignore'), 'acceptance-results/\n');
  await git('add', '.');
  await git('commit', '-m', 'initial');
  await writeFile(
    path.join(root, '.git/hooks/pre-commit'),
    '#!/bin/sh\nprintf hook > .git/hook-ran\n',
    { mode: 0o755 }
  );
  await writeFile(path.join(root, 'source.txt'), 'candidate\n');
  await git('add', 'source.txt');
  const session = await createMaintainerSession('source hook fixture', { root });
  const run = session.run;
  session.run = async (cmd, args) =>
    args[0] === 'push' ? undefined : run(cmd, args, { cwd: root });
  let uploads = 0;
  try {
    await runSourceFlow(options(), {
      root,
      session,
      env: {},
      capture: async (_cmd, args) =>
        args[0] === 'ls-remote'
          ? `${(await git('rev-parse', 'HEAD')).trim()}\trefs/heads/main`
          : git(...args),
      preflight: async () => ({ drift: [] }),
      staticCheck: async () => {},
      runNpm: async (_targets, _opts, { beforeUpload, session: owner }) => {
        assert.equal(owner, session);
        await beforeUpload();
        uploads++;
      },
    });
  } finally {
    await session.close();
  }
  assert.equal(await readFile(path.join(root, '.git/hook-ran'), 'utf8'), 'hook');
  assert.equal(uploads, 1);
});

function announcementFixture({
  tag = false,
  local = false,
  localWrong = false,
  existing = false,
  lookupError,
  verifyError,
} = {}) {
  const calls = [];
  return {
    calls,
    session: {
      stage: async (_label, action) => action({}),
      run: async (cmd, args) => calls.push([cmd, ...args]),
    },
    check: async () => ({
      receipt: { version: '1.0.0', source },
      identity: {
        tagSource: tag ? source : undefined,
        repository: { gh: 'github.com/owner/repo' },
      },
      notesFile: 'reviewed.md',
    }),
    capture: async (cmd, args) => {
      if (cmd === 'git')
        return args[0] === 'tag' ? (local ? 'v1.0.0' : '') : localWrong ? tree : source;
      if (lookupError) throw lookupError;
      if (existing) return '{}';
      throw Object.assign(new Error('missing'), { code: 1, stderr: 'release not found\n' });
    },
    verify: async () => {
      calls.push(['verify']);
      if (verifyError) throw verifyError;
      return { receipt: { status: 'identity-verified' } };
    },
  };
}
test('announcement composes tag, push, reviewed file publication and exact readback', async () => {
  const f = announcementFixture();
  await runAnnouncementFlow({ receipt: 'r' }, f);
  assert.deepEqual(
    f.calls.map((c) => c.slice(0, 2)),
    [['git', 'tag'], ['git', 'push'], ['gh', 'release'], ['verify']]
  );
  assert(f.calls[2].includes('--verify-tag'));
  assert(f.calls[2].includes('--notes-file'));
});
test('partial announcement resumes without forcing tags or editing an existing Release', async () => {
  const f = announcementFixture({ tag: true, existing: true });
  await runAnnouncementFlow({ receipt: 'r' }, f);
  assert.deepEqual(f.calls, [['verify']]);
  const partial = announcementFixture({ tag: true });
  await runAnnouncementFlow({ receipt: 'r' }, partial);
  assert(!partial.calls.some((c) => c[0] === 'git'));
});
test('failed tag push stops Release creation and final readback', async () => {
  const f = announcementFixture();
  const run = f.session.run;
  f.session.run = async (command, args) => {
    if (command === 'git' && args[0] === 'push') throw new Error('push failed');
    return run(command, args);
  };
  await assert.rejects(runAnnouncementFlow({}, f), /push failed/);
  assert.deepEqual(
    f.calls.map((call) => call.slice(0, 2)),
    [['git', 'tag']]
  );
});

test('announcement blocks changed notes, conflicting tags, lookup errors and failed readback', async () => {
  const changed = announcementFixture();
  changed.check = async () => {
    throw new Error('notes changed');
  };
  await assert.rejects(runAnnouncementFlow({}, changed));
  assert.equal(changed.calls.length, 0);
  for (const props of [
    { local: true, localWrong: true },
    { lookupError: Object.assign(new Error('auth'), { code: 1, stderr: 'authentication failed' }) },
  ]) {
    const f = announcementFixture(props);
    await assert.rejects(runAnnouncementFlow({}, f));
    assert.equal(f.calls.length, 0);
  }
  const existing = announcementFixture({
    tag: true,
    existing: true,
    verifyError: new Error('wrong body'),
  });
  await assert.rejects(runAnnouncementFlow({}, existing));
  assert.deepEqual(existing.calls, [['verify']]);
});
test('shared-session npm tools do not acquire or close another lock', async () => {
  let ran = 0;
  await runNpmTools(
    ['docs-check'],
    {},
    {
      session: {
        run: async () => {
          ran++;
        },
        close() {
          throw new Error('must not close supplied owner');
        },
      },
    }
  );
  assert.equal(ran, 1);
});
test('CLI plan creates no session and performs no effects', async () => {
  const result = await exec(process.execPath, [
    'scripts/release-flow.mjs',
    'source',
    '--version',
    '1.0.0',
    '--message-file',
    'not-present',
    '--check',
    'docs-check',
  ]);
  const value = JSON.parse(result.stdout);
  assert.equal(value.executes, false);
  assert.equal(value.publishesNpm, false);
});
