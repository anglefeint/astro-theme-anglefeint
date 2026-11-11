// Observational fingerprints only. Nothing reads these to skip validation.
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { lstat, readdir, readFile, readlink } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const digest = (value) => createHash('sha256').update(value).digest('hex');

async function fileHash(filename) {
  try {
    const stat = await lstat(filename);
    if (stat.isSymbolicLink()) return { kind: 'symlink', sha256: digest(await readlink(filename)) };
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(filename)) hash.update(chunk);
    return { kind: 'file', sha256: hash.digest('hex') };
  } catch (error) {
    if (error.code === 'ENOENT') return { kind: 'missing' };
    throw error;
  }
}

async function treeHash(root) {
  const entries = [];
  async function walk(directory, relative = '') {
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    )) {
      const name = path.posix.join(relative, entry.name);
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(filename, name);
      else entries.push([name, filename]);
    }
  }
  const stat = await lstat(root).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
  if (!stat) return { kind: 'missing' };
  if (!stat.isDirectory() || stat.isSymbolicLink()) return fileHash(root);
  await walk(root);
  // Bound concurrent file reads; retain sorted entry order for a deterministic hash.
  for (let offset = 0; offset < entries.length; offset += 8) {
    const batch = entries.slice(offset, offset + 8);
    const hashes = await Promise.all(batch.map(([, filename]) => fileHash(filename)));
    for (let index = 0; index < batch.length; index++) entries[offset + index][1] = hashes[index];
  }
  return { kind: 'tree', entries: entries.length, sha256: digest(JSON.stringify(entries)) };
}

async function gitEvidence(root) {
  const git = async (...args) =>
    (
      await exec('git', ['--no-optional-locks', ...args], {
        cwd: root,
        maxBuffer: 40 * 1024 * 1024,
      })
    ).stdout;
  try {
    const head = (await git('rev-parse', 'HEAD')).trim();
    const tree = (await git('rev-parse', 'HEAD^{tree}')).trim();
    const diff = await git('diff', '--binary', '--no-ext-diff', '--no-textconv', 'HEAD', '--');
    const index = await git('ls-files', '--stage', '-z');
    const untracked = (await git('ls-files', '--others', '--exclude-standard', '-z'))
      .split('\0')
      .filter(Boolean)
      .sort();
    const files = [];
    for (const file of untracked) files.push([file, await fileHash(path.join(root, file))]);
    return {
      available: true,
      head,
      tree,
      workingSha256: digest(JSON.stringify([tree, diff, index, files])),
      untrackedFiles: files.length,
    };
  } catch {
    return { available: false };
  }
}

export async function captureMaintainerEvidence(
  root,
  { env = process.env, artifacts = false } = {}
) {
  try {
    const inputs = {};
    for (const file of [
      'package.json',
      'package-lock.json',
      'pnpm-lock.yaml',
      'yarn.lock',
      'bun.lock',
      'packages/theme/package.json',
      'node_modules/.package-lock.json',
      'node_modules/.pnpm/lock.yaml',
    ])
      inputs[file] = await fileHash(path.join(root, file));
    // Hash dotenv contents without recording values, including ignored root dotenv files.
    for (const file of (await readdir(root))
      .filter((name) => name === '.env' || name.startsWith('.env.'))
      .sort()) {
      if ((await lstat(path.join(root, file))).isFile())
        inputs[file] = await fileHash(path.join(root, file));
    }
    const environment = Object.entries(env)
      .filter(
        ([name]) =>
          /^(PUBLIC_|ANGLEFEINT_|ASTRO_)/.test(name) ||
          [
            'NODE_ENV',
            'NODE_OPTIONS',
            'NODE_PATH',
            'CI',
            'TZ',
            'LANG',
            'npm_config_registry',
            'npm_config_ignore_scripts',
            'npm_config_omit',
            'npm_config_production',
          ].includes(name)
      )
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    const tools = {};
    for (const name of ['astro', 'typescript', '@playwright/test']) {
      const file = path.join(root, 'node_modules', name, 'package.json');
      try {
        tools[name] = JSON.parse(await readFile(file, 'utf8')).version;
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
    const result = {
      schema: 1,
      observationalOnly: true,
      capturedAt: new Date().toISOString(),
      git: await gitEvidence(root),
      inputsSha256: digest(JSON.stringify(inputs)),
      inputs,
      environment: {
        platform: process.platform,
        arch: process.arch,
        node: process.version,
        versions: process.versions,
        tools,
        npmCli: env.npm_execpath ? await fileHash(env.npm_execpath) : { kind: 'unknown' },
        relevantNames: environment.map(([name]) => name),
        valuesSha256: digest(JSON.stringify(environment)),
      },
    };
    if (artifacts) result.artifacts = { dist: await treeHash(path.join(root, 'dist')) };
    return result;
  } catch (error) {
    // Reporting must not replace, skip or change the original command's outcome.
    return {
      schema: 1,
      observationalOnly: true,
      available: false,
      errorCode: error.code ?? 'EVIDENCE_UNAVAILABLE',
    };
  }
}
