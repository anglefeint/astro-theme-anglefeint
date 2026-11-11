import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { captureMaintainerEvidence } from '../scripts/maintainer-evidence.mjs';

test('Git evidence distinguishes tracked edits, staged changes and untracked contents', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'anglefeint-evidence-git-'));
  const exec = promisify(execFile);
  const git = (...args) => exec('git', args, { cwd: root });
  try {
    await git('init', '--quiet');
    await writeFile(path.join(root, 'source.js'), 'first');
    await git('add', 'source.js');
    // Only the disposable test repository receives this fixture commit.
    await git(
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.test',
      '-c',
      'commit.gpgsign=false',
      'commit',
      '--quiet',
      '-m',
      'fixture'
    );
    const capture = () => captureMaintainerEvidence(root, { env: {} });
    const clean = await capture();
    assert.equal(clean.git.available, true);
    await writeFile(path.join(root, 'source.js'), 'second');
    const edited = await capture();
    assert.notEqual(clean.git.workingSha256, edited.git.workingSha256);
    await git('add', 'source.js');
    const staged = await capture();
    assert.notEqual(edited.git.workingSha256, staged.git.workingSha256);
    await writeFile(path.join(root, 'new.js'), 'new');
    const untracked = await capture();
    await writeFile(path.join(root, 'new.js'), 'changed');
    const changed = await capture();
    assert.notEqual(untracked.git.workingSha256, changed.git.workingSha256);
    assert.equal(clean.git.head, changed.git.head);
  } finally {
    assert.equal(path.dirname(root), tmpdir());
    await rm(root, { recursive: true, force: true });
  }
});

test('observational evidence detects input, environment and artifact changes without exposing values', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'anglefeint-evidence-'));
  try {
    await writeFile(path.join(root, 'package-lock.json'), 'first');
    await writeFile(path.join(root, '.env.local'), 'PRIVATE=dotenv-secret');
    await mkdir(path.join(root, 'dist'));
    await writeFile(path.join(root, 'dist/index.html'), 'first');
    await Promise.all(
      Array.from({ length: 17 }, (_, index) =>
        writeFile(path.join(root, `dist/${index}.txt`), String(index))
      )
    );
    const env = { PUBLIC_SITE: 'private-site-value', NPM_TOKEN: 'auth-secret' };
    const first = await captureMaintainerEvidence(root, { env, artifacts: true });
    const same = await captureMaintainerEvidence(root, { env, artifacts: true });
    assert.equal(first.observationalOnly, true);
    assert.equal(first.git.available, false);
    assert.equal(first.inputsSha256, same.inputsSha256);
    assert.equal(first.artifacts.dist.sha256, same.artifacts.dist.sha256);
    assert.equal(first.artifacts.dist.entries, 18);
    const serialized = JSON.stringify(first);
    for (const secret of ['dotenv-secret', 'private-site-value', 'auth-secret', 'NPM_TOKEN'])
      assert.equal(serialized.includes(secret), false);
    await writeFile(path.join(root, 'package-lock.json'), 'second');
    const lock = await captureMaintainerEvidence(root, { env });
    assert.notEqual(first.inputsSha256, lock.inputsSha256);
    await writeFile(path.join(root, '.env.local'), 'PRIVATE=changed');
    const dotenv = await captureMaintainerEvidence(root, { env });
    assert.notEqual(lock.inputsSha256, dotenv.inputsSha256);
    await writeFile(path.join(root, 'dist/index.html'), 'second');
    const after = await captureMaintainerEvidence(root, {
      env: { ...env, PUBLIC_SITE: 'changed' },
      artifacts: true,
    });
    assert.notEqual(first.environment.valuesSha256, after.environment.valuesSha256);
    assert.notEqual(first.artifacts.dist.sha256, after.artifacts.dist.sha256);
  } finally {
    assert.equal(path.dirname(root), tmpdir());
    await rm(root, { recursive: true, force: true });
  }
});

test('unavailable reporting inputs produce an explicit observational failure marker', async () => {
  const result = await captureMaintainerEvidence(
    path.join(tmpdir(), 'anglefeint-does-not-exist-evidence')
  );
  assert.equal(result.observationalOnly, true);
  assert.equal(result.available, false);
  assert.equal(result.errorCode, 'ENOENT');
});
