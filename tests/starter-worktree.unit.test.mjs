import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {
  createStarterWorktree,
  removeStarterWorktree,
  commitStarterIfNeeded,
} from '../tools/maintainer/sync-starter.mjs';
import { STARTER_MANAGED_FILES } from '../scripts/starter-manifest.mjs';

const exec = promisify(execFile);

async function commitFixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-starter-commit-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = async (...args) => (await exec('git', args, { cwd: root })).stdout;
  await git('init', '-b', 'starter');
  await git('config', 'core.autocrlf', 'false');
  await git('config', 'user.name', 'Fixture');
  await git('config', 'user.email', 'fixture@example.invalid');
  for (const file of [
    ...STARTER_MANAGED_FILES,
    'package.json',
    'package-lock.json',
    'unmanaged.txt',
  ]) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), file === '.gitignore' ? 'node_modules/\n' : 'fixture\n');
  }
  await git('add', '.');
  await git('commit', '-m', 'initial');
  await writeFile(path.join(root, 'README.md'), 'generated\n');
  return { root, git };
}

test('starter hook changes are detected before the caller can push', async (t) => {
  const { root, git } = await commitFixture(t);
  await writeFile(
    path.join(root, '.git/hooks/pre-commit'),
    '#!/bin/sh\nprintf changed >> README.md\ngit add README.md\n',
    { mode: 0o755 }
  );
  await assert.rejects(
    commitStarterIfNeeded('main', ['README.md'], root),
    /hooks changed tested files/
  );
  assert.match(await readFile(path.join(root, 'README.md'), 'utf8'), /changed/);
  assert.equal(
    (await git('log', '-1', '--format=%s')).trim(),
    'chore(starter): sync managed files from main'
  );
});

test('unmanaged staged changes block starter commit', async (t) => {
  const { root, git } = await commitFixture(t);
  const before = (await git('rev-parse', 'HEAD')).trim();
  await writeFile(path.join(root, 'unmanaged.txt'), 'do not publish');
  await git('add', 'unmanaged.txt');
  await assert.rejects(commitStarterIfNeeded('main', ['README.md'], root), /Unmanaged staged/);
  assert.equal((await git('rev-parse', 'HEAD')).trim(), before);
});

test('real isolated worktree preserves main branch, dependencies and hook behavior', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-worktree-'));
  const git = async (cwd, ...args) => (await exec('git', args, { cwd })).stdout;
  let directory;
  t.after(async () => {
    if (directory) {
      assert(path.basename(directory).startsWith('anglefeint-starter-worktree-'));
      try {
        await git(root, 'worktree', 'remove', '--force', '--', directory);
      } catch {
        /* already removed */
      }
    }
    await rm(root, { recursive: true, force: true });
  });
  await git(root, 'init', '-b', 'main');
  await git(root, 'config', 'user.name', 'Fixture');
  await git(root, 'config', 'user.email', 'fixture@example.invalid');
  await writeFile(path.join(root, '.gitignore'), 'node_modules/\nacceptance-results/\n');
  await writeFile(path.join(root, 'file.txt'), 'initial');
  await git(root, 'add', '.');
  await git(root, 'commit', '-m', 'initial');
  await git(root, 'branch', 'starter');
  await mkdir(path.join(root, 'node_modules'));
  await writeFile(path.join(root, 'node_modules/sentinel'), 'main dependencies');
  await writeFile(path.join(root, '.git/hooks/pre-commit'), '#!/bin/sh\nprintf hook > hook-ran\n', {
    mode: 0o755,
  });
  const source = (await git(root, 'rev-parse', 'HEAD')).trim();
  directory = await createStarterWorktree(root, 'starter', source);
  assert(
    !directory.startsWith(root + path.sep),
    'generated projects stay outside main file discovery'
  );
  await mkdir(path.join(directory, 'node_modules'));
  await writeFile(path.join(directory, 'node_modules/sentinel'), 'isolated dependencies');
  await writeFile(path.join(directory, 'file.txt'), 'starter change');
  await git(directory, 'add', 'file.txt');
  await git(directory, 'commit', '-m', 'generated');
  assert.equal(await readFile(path.join(directory, 'hook-ran'), 'utf8'), 'hook');
  assert.equal((await git(root, 'branch', '--show-current')).trim(), 'main');
  assert.equal(
    await readFile(path.join(root, 'node_modules/sentinel'), 'utf8'),
    'main dependencies'
  );
  assert.equal((await git(root, 'rev-parse', 'HEAD')).trim(), source);
  assert.notEqual((await git(root, 'rev-parse', 'starter')).trim(), source);
  await assert.rejects(removeStarterWorktree(root, directory), /git worktree remove/);
  await rm(path.join(directory, 'hook-ran'));
  await removeStarterWorktree(root, directory);
  await assert.rejects(removeStarterWorktree(root, root), /Unsafe/);
});
