// Immutable, binary-safe Git reads. No checkout, global cache or missing/error conflation.
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

export function parseTree(buffer) {
  const files = new Map();
  for (const record of buffer.toString('utf8').split('\0')) {
    if (!record) continue;
    const tab = record.indexOf('\t');
    assert(tab > 0, 'Malformed Git tree record');
    const [mode, type, oid] = record.slice(0, tab).split(' ');
    assert(/^[a-f0-9]{40,64}$/.test(oid), 'Malformed Git object identity');
    files.set(record.slice(tab + 1), { mode, type, oid });
  }
  return files;
}

export function parseBlobs(buffer, ids) {
  const blobs = new Map();
  let offset = 0;
  for (const oid of ids) {
    const newline = buffer.indexOf(10, offset);
    assert(newline >= 0, 'Truncated Git batch header');
    const match = /^([a-f0-9]+) blob (\d+)$/.exec(buffer.toString('ascii', offset, newline));
    assert(match && match[1] === oid, 'Unexpected Git batch object');
    const size = Number(match[2]);
    assert(Number.isSafeInteger(size), 'Invalid Git blob size');
    offset = newline + 1;
    assert(offset + size < buffer.length && buffer[offset + size] === 10, 'Truncated Git blob');
    blobs.set(oid, buffer.subarray(offset, offset + size));
    offset += size + 1;
  }
  assert.equal(offset, buffer.length, 'Unexpected Git batch trailer');
  return blobs;
}

async function batch(root, ids) {
  if (!ids.length) return Buffer.alloc(0);
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['cat-file', '--batch'], { cwd: root, windowsHide: true });
    const chunks = [],
      errors = [];
    let size = 0;
    child.on('error', reject);
    child.stdout.on('data', (chunk) => {
      size += chunk.length;
      if (size > 128 * 1024 * 1024) child.kill();
      else chunks.push(chunk);
    });
    child.stderr.on('data', (chunk) => errors.push(chunk));
    child.stdin.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0 || size > 128 * 1024 * 1024)
        reject(new Error(`Git batch failed: ${Buffer.concat(errors).toString('utf8')}`));
      else resolve(Buffer.concat(chunks));
    });
    child.stdin.end(ids.join('\n') + '\n');
  });
}

export async function readGitSnapshot(root, ref, paths = [], { capture, readBatch = batch } = {}) {
  capture ??= async (args) =>
    (await exec('git', args, { cwd: root, encoding: 'buffer', maxBuffer: 32 * 1024 * 1024 }))
      .stdout;
  const commit = (await capture(['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`]))
    .toString()
    .trim();
  assert(/^[a-f0-9]{40,64}$/.test(commit), 'Invalid source commit');
  const files = parseTree(await capture(['ls-tree', '-r', '-z', commit]));
  const requested = new Set(paths);
  const ids = new Set();
  for (const file of requested) {
    const entry = files.get(file);
    if (!entry) continue;
    assert(
      entry.type === 'blob' && entry.mode !== '120000',
      `Unsupported managed Git file: ${file}`
    );
    ids.add(entry.oid);
  }
  const blobs = parseBlobs(await readBatch(root, [...ids]), [...ids]);
  return {
    commit,
    files,
    read(file) {
      assert(requested.has(file), `Git file was not requested: ${file}`);
      const entry = files.get(file);
      return entry ? blobs.get(entry.oid) : null;
    },
  };
}
