#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import { createMaintainerSession } from './maintainer-session.mjs';
import { runNpmTools } from './npm-release-tools.mjs';
import { npmReleaseTools, planNpmTools, validateToolSelection } from './release-tool-plan.mjs';
import { checkPreparedCloseout, verifyCloseout } from './release-closeout.mjs';
import { preflightStarter } from '../tools/maintainer/sync-starter.mjs';

const exec = promisify(execFile);
const usage = `Usage: npm run release:flow -- source --version <version> --message-file <file> --check <tool> [--check <tool> ...] [--test tests/name.test.mjs ...] [--execute]
       npm run release:flow -- announce --receipt <reviewed-receipt.json> [--execute]
Default is plan only. source operates on reviewed, already staged changes.
source runs selected checks and npm prerequisites, normal commit hooks, starter preflight,
main push and one canonical npm upload/download verification under one shared lock.
announce uses reviewed closeout notes, never uploads npm, and never moves an existing tag.
--execute selects mutations; it does not grant user authorization or browser consent.`;

export function parseFlowArgs(args) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) return { help: true };
  const [mode, ...rest] = args;
  if (!['source', 'announce'].includes(mode)) throw new Error(usage);
  const options = { mode, checks: [], testFiles: [], execute: false };
  const seen = new Set();
  const allowed = mode === 'source' ? ['version', 'message-file', 'check', 'test'] : ['receipt'];
  for (let i = 0; i < rest.length; i++) {
    const flag = rest[i];
    if (flag === '--execute' && !seen.has(flag)) {
      options.execute = true;
      seen.add(flag);
      continue;
    }
    const key = flag.slice(2),
      value = rest[++i];
    if (
      !flag.startsWith('--') ||
      !allowed.includes(key) ||
      !value ||
      value.startsWith('--') ||
      (seen.has(flag) && !['check', 'test'].includes(key))
    )
      throw new Error('Unknown, missing or duplicate release-flow argument.');
    seen.add(flag);
    if (key === 'check') options.checks.push(value);
    else if (key === 'test') options.testFiles.push(value);
    else options[key] = value;
  }
  if (mode === 'source') {
    assert.match(options.version ?? '', /^\d+\.\d+\.\d+$/);
    assert.ok(options['message-file'], 'A reviewed commit message file is required.');
    assert.ok(options.checks.length, 'Select necessary technical checks explicitly.');
    for (const name of options.checks) {
      const tool = npmReleaseTools[name];
      assert.ok(
        tool &&
          !tool.requiresUserConfirmation &&
          (tool.script || ['unit-tests', 'installed-check', 'installed-build'].includes(name)),
        'Only independent non-exceptional technical checks belong in --check.'
      );
    }
    validateToolSelection(planNpmTools(options.checks), { testFiles: options.testFiles });
  } else assert.ok(options.receipt, 'A reviewed closeout receipt is required.');
  return options;
}

async function cleanMain(capture, staged = false) {
  assert.equal(
    (await capture('git', ['branch', '--show-current'])).trim(),
    'main',
    'Run release flow on main.'
  );
  const status = (await capture('git', ['status', '--porcelain'])).trimEnd();
  if (staged) {
    assert.ok(
      status &&
        status
          .split(/\r?\n/)
          .every((line) => line[0] !== ' ' && line[0] !== '?' && line[1] === ' '),
      'Stage all reviewed changes first; unstaged/untracked changes block source handoff.'
    );
  } else assert.equal(status, '', 'Source must be clean before pushing/publishing.');
}

async function messageFile(root, name) {
  const base = await realpath(root),
    file = await realpath(path.resolve(base, name));
  const relative = path.relative(base, file);
  assert.ok(
    relative &&
      relative !== '..' &&
      !relative.startsWith('..' + path.sep) &&
      !path.isAbsolute(relative) &&
      !relative.startsWith('.git' + path.sep),
    'Commit message must be a file inside this workspace.'
  );
  const text = await readFile(file, 'utf8');
  assert.ok(text.trim() && !text.includes('\0'), 'Commit message is empty or invalid.');
  return file;
}

export async function runSourceFlow(
  options,
  {
    root = process.cwd(),
    session,
    capture,
    runNpm = runNpmTools,
    preflight = preflightStarter,
    env = process.env,
  } = {}
) {
  assert.notEqual(env.HUSKY, '0', 'Commit hooks must remain enabled.');
  const file = await messageFile(root, options['message-file']);
  const requireVersion = async () => {
    const pkg = JSON.parse(await readFile(path.join(root, 'packages/theme/package.json'), 'utf8'));
    assert.equal(pkg.name, '@anglefeint/astro-theme');
    assert.equal(pkg.version, options.version, 'Prepare version/docs before source handoff.');
  };
  const tree = await session.stage('Validate reviewed staged source', async () => {
    await cleanMain(capture, true);
    await requireVersion();
    return (await capture('git', ['write-tree'])).trim();
  });
  let source;
  await runNpm(
    [...options.checks, 'npm-delivery'],
    { testFiles: options.testFiles },
    {
      session,
      beforeUpload: async () => {
        await session.stage('Check staged source after validation', async () => {
          await cleanMain(capture, true);
          await requireVersion();
          assert.equal(
            (await capture('git', ['write-tree'])).trim(),
            tree,
            'Staged source changed during checks; review and validate again.'
          );
        });
        await session.run('git', ['commit', '--file', file]);
        await session.stage('Check committed source and hooks', async () => {
          await cleanMain(capture);
          assert.equal(
            (await capture('git', ['rev-parse', 'HEAD^{tree}'])).trim(),
            tree,
            'Commit hooks changed source; keep the local commit, review and revalidate before publishing.'
          );
          source = (await capture('git', ['rev-parse', 'HEAD'])).trim();
        });
        await session.stage('Starter managed-file preflight', async (record) => {
          const result = await preflight({ from: 'main', target: 'starter' });
          record.starterDrift = result.drift;
          console.log(
            `[release:flow] ${result.drift.length} managed starter changes to deliver after npm verification.`
          );
        });
        await session.run('git', ['push', 'origin', 'main']);
        await session.stage('Confirm pushed npm source', async () => {
          await cleanMain(capture);
          assert.equal((await capture('git', ['rev-parse', 'HEAD'])).trim(), source);
          const refs = await capture('git', ['ls-remote', 'origin', 'refs/heads/main']);
          assert.equal(
            refs.trim().split(/\s+/)[0],
            source,
            'Remote main does not match the committed source.'
          );
        });
      },
    }
  );
  return { version: options.version, source };
}

export async function runAnnouncementFlow(
  options,
  {
    root = process.cwd(),
    session,
    capture,
    check = checkPreparedCloseout,
    verify = verifyCloseout,
  } = {}
) {
  const prepared = await session.stage('Validate reviewed closeout and current identities', () =>
    check(options, { root, capture })
  );
  const { receipt, identity, notesFile } = prepared;
  const tag = `v${receipt.version}`;
  const local = (await capture('git', ['tag', '--list', tag])).trim();
  if (local)
    assert.equal(
      (await capture('git', ['rev-parse', `${tag}^{}`])).trim(),
      receipt.source,
      'Existing local tag points elsewhere; never move it.'
    );
  let existing = false;
  try {
    await capture('gh', [
      'release',
      'view',
      tag,
      '--repo',
      identity.repository.gh,
      '--json',
      'tagName',
    ]);
    existing = true;
  } catch (error) {
    if (!(error.code === 1 && /^release not found\s*$/i.test(error.stderr?.trim() ?? '')))
      throw error;
  }
  if (!existing) {
    if (!identity.tagSource) {
      if (!local) await session.run('git', ['tag', tag, receipt.source]);
      await session.run('git', ['push', 'origin', `refs/tags/${tag}`]);
    }
    await session.run('gh', [
      'release',
      'create',
      tag,
      '--repo',
      identity.repository.gh,
      '--verify-tag',
      '--title',
      tag,
      '--notes-file',
      notesFile,
    ]);
  }
  return session.stage('Read back final source/tag/starter/npm/Release identities', () =>
    verify(options, { root, capture })
  );
}

async function main(args) {
  const options = parseFlowArgs(args);
  if (options.help) return console.log(usage);
  const plan =
    options.mode === 'source'
      ? [
          ...planNpmTools([...options.checks, 'npm-delivery']).flatMap((name) =>
            name === 'npm-upload'
              ? ['normal commit hooks', 'structured starter preflight', 'push/confirm main', name]
              : [name]
          ),
        ]
      : [
          'validate reviewed receipt/notes/current identities',
          'check existing tags/Release',
          'create/push exact tag if missing',
          'create Release if missing',
          'verify exact published body/identities',
        ];
  console.log(
    JSON.stringify(
      {
        mode: options.mode,
        executes: options.execute,
        publishesNpm: options.mode === 'source' && options.execute,
        plan,
      },
      null,
      2
    )
  );
  if (!options.execute) return;
  const session = await createMaintainerSession('release flow: ' + options.mode);
  const capture = async (command, argv) => {
    if (command === 'npm' && !process.env.npm_execpath)
      throw new Error('Run through npm run release:flow.');
    return (
      await exec(
        command === 'npm' ? process.execPath : command,
        command === 'npm' ? [process.env.npm_execpath, ...argv] : argv,
        { cwd: process.cwd(), maxBuffer: 8 * 1024 * 1024 }
      )
    ).stdout;
  };
  try {
    const result = await (options.mode === 'source' ? runSourceFlow : runAnnouncementFlow)(
      options,
      { session, capture }
    );
    console.log(
      `[release:flow] ${options.mode} complete; ${options.mode === 'source' ? 'deliver starter only after this npm verification succeeds.' : result.receipt.status}`
    );
  } finally {
    await session.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
