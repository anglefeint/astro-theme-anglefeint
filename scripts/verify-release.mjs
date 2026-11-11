#!/usr/bin/env node
// A read-only recovery entry. It cannot publish, install, switch branches or sync starter.
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { createMaintainerSession } from './maintainer-session.mjs';
import { verifyPublishedPackage } from './verify-published-package.mjs';

const exec = promisify(execFile);
const usage = `Usage: npm run release:verify -- --version <exact-version> [--tag latest] [--source <git-sha>] [--integrity <sri>] [--shasum <sha1>]
Only verifies registry visibility and downloads the exact package; never republishes it.`;

async function cleanupDownload(root, download) {
  if (!download) return;
  if (
    path.dirname(download) !== path.join(root, 'acceptance-results') ||
    !path.basename(download).startsWith('registry-verify-')
  )
    throw new Error('Unexpected verification download directory');
  await rm(download, { recursive: true, force: true });
}

export function parseVerifyArgs(argv) {
  if (argv.length === 1 && ['--help', '-h'].includes(argv[0])) return { help: true };
  const result = { tag: 'latest' };
  const names = new Set(['version', 'tag', 'source', 'integrity', 'shasum']);
  const seen = new Set();
  for (let index = 0; index < argv.length; index++) {
    const name = argv[index].replace(/^--/, '');
    if (!argv[index].startsWith('--') || !names.has(name) || seen.has(name))
      throw new Error(`Unknown or duplicate option: ${argv[index]}`);
    seen.add(name);
    const value = argv[++index];
    if (!value || value.startsWith('--')) throw new Error(`Missing --${name} value`);
    result[name] = value;
  }
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(result.version ?? ''))
    throw new Error('--version must be an explicit exact version');
  if (!/^[a-zA-Z][0-9A-Za-z._-]*$/.test(result.tag)) throw new Error('Invalid --tag');
  if (result.source && !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i.test(result.source))
    throw new Error('Invalid --source');
  if (result.shasum && !/^[0-9a-f]{40}$/i.test(result.shasum)) throw new Error('Invalid --shasum');
  if (result.integrity && !/^sha(?:256|384|512)-[A-Za-z0-9+/]+={0,2}$/.test(result.integrity))
    throw new Error('Invalid --integrity');
  return result;
}

export function verifyRelease(
  options,
  { capture, destination, log, attempts, delayMs, sleep } = {}
) {
  return verifyPublishedPackage({
    name: '@anglefeint/astro-theme',
    version: options.version,
    tag: options.tag,
    expected: { source: options.source, integrity: options.integrity, shasum: options.shasum },
    capture: async (args) => {
      if (!['view', 'pack'].includes(args[0]))
        throw new Error('Read-only verifier rejected a mutation');
      return capture(args);
    },
    destination,
    log,
    attempts,
    delayMs,
    sleep,
  });
}

async function main(argv) {
  const options = parseVerifyArgs(argv);
  if (options.help) {
    console.log(usage);
    return;
  }
  const root = process.cwd();
  const session = await createMaintainerSession('read-only registry verification');
  let download;
  try {
    const parent = path.join(root, 'acceptance-results');
    await mkdir(parent, { recursive: true });
    download = await mkdtemp(path.join(parent, 'registry-verify-'));
    const npmCli = process.env.npm_execpath;
    if (!npmCli) throw new Error('Run through npm run release:verify');
    await session.stage('Verify published tag, metadata and downloaded package (read-only)', () =>
      verifyRelease(options, {
        destination: download,
        capture: async (args) =>
          (
            await exec(process.execPath, [npmCli, ...args], {
              cwd: root,
              maxBuffer: 8 * 1024 * 1024,
            })
          ).stdout,
      })
    );
    console.log(
      `Verified @anglefeint/astro-theme@${options.version}; no package was published. Follow the remaining starter/remote/tag/announcement gates.`
    );
  } finally {
    try {
      await cleanupDownload(root, download);
    } finally {
      await session.close();
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
