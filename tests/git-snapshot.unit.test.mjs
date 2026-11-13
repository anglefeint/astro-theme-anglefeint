import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { readGitSnapshot, parseBlobs } from '../scripts/git-snapshot.mjs';

const exec = promisify(execFile);
test('batch snapshot preserves binary, empty, Unicode, bracket and newline names with a fixed process count', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-git-batch-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = async (...args) => (await exec('git', args, { cwd: root })).stdout;
  await git('init', '-b', 'main');
  await git('config', 'user.name', 'Fixture');
  await git('config', 'user.email', 'fixture@example.invalid');
  const binary = Buffer.from([0, 10, 255, 128, 10, 0]);
  const name = process.platform === 'win32' ? '中文 [slug] space.bin' : '中文 [slug]\nspace.bin';
  await writeFile(path.join(root, name), binary);
  await writeFile(path.join(root, 'empty.txt'), '');
  await git('add', '.');
  await git('commit', '-m', 'fixture');
  const calls = [];
  const snapshot = await readGitSnapshot(root, 'HEAD', [name, 'empty.txt', 'missing'], {
    capture: async (args) => {
      calls.push(args);
      return (await exec('git', args, { cwd: root, encoding: 'buffer' })).stdout;
    },
  });
  assert.equal(calls.length, 2, 'metadata reads do not scale with file count');
  assert.equal(calls[1].at(-1), snapshot.commit, 'tree reads use the resolved immutable commit');
  assert.deepEqual(snapshot.read(name), binary);
  assert.equal(snapshot.read('empty.txt').length, 0);
  assert.equal(snapshot.read('missing'), null);
  assert.throws(() => snapshot.read('not-requested'), /not requested/);
  await writeFile(path.join(root, 'empty.txt'), 'changed');
  assert.equal(snapshot.read('empty.txt').length, 0, 'snapshot is not affected by working changes');
  await assert.rejects(readGitSnapshot(root, 'absent-ref', ['empty.txt']));
});

test('batch errors and truncated payloads fail closed', async () => {
  const id = 'a'.repeat(40);
  for (const output of [`${id} blob 3\nab`, `${id} missing\n`, `${id} blob 0\n\nextra`])
    assert.throws(() => parseBlobs(Buffer.from(output), [id]));
  const capture = async (args) =>
    Buffer.from(args[0] === 'rev-parse' ? id : `100644 blob ${id}\tfile\0`);
  await assert.rejects(
    readGitSnapshot('.', 'HEAD', ['file'], {
      capture,
      readBatch: async () => {
        throw new Error('batch failed');
      },
    }),
    /batch failed/
  );
});

test('managed symlinks are rejected before batch reading', async () => {
  const id = 'a'.repeat(40);
  await assert.rejects(
    readGitSnapshot('.', 'HEAD', ['file'], {
      capture: async (args) =>
        Buffer.from(args[0] === 'rev-parse' ? id : `120000 blob ${id}\tfile\0`),
    }),
    /Unsupported managed/
  );
});
