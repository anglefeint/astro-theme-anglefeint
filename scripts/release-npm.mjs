#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const repoRoot = process.cwd();
const packageName = '@anglefeint/astro-theme';

function run(cmd, args, options = {}) {
  const [executable, finalArgs] = resolveCommand(cmd, args);
  const result = spawnSync(executable, finalArgs, {
    stdio: 'inherit',
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
  });

  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} failed with status ${result.status ?? 1}.`);
  }
}

function runCapture(cmd, args, options = {}) {
  const [executable, finalArgs] = resolveCommand(cmd, args);
  const result = spawnSync(executable, finalArgs, {
    cwd: options.cwd ?? repoRoot,
    encoding: 'utf8',
    env: options.env ?? process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim();
    throw new Error(`${cmd} ${args.join(' ')} failed${detail ? `:\n${detail}` : ''}`);
  }

  return result.stdout.trim();
}

function resolveCommand(cmd, args) {
  if (process.platform === 'win32' && cmd === 'npm') {
    return ['cmd.exe', ['/d', '/s', '/c', 'npm', ...args]];
  }

  return [cmd, args];
}

function parseArgs(argv) {
  const opts = {
    tag: '',
    dryRun: false,
    skipChecks: false,
    skipPack: false,
    skipRegistryCheck: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      opts.dryRun = true;
      continue;
    }
    if (arg === '--skip-checks') {
      opts.skipChecks = true;
      continue;
    }
    if (arg === '--skip-pack') {
      opts.skipPack = true;
      continue;
    }
    if (arg === '--skip-registry-check') {
      opts.skipRegistryCheck = true;
      continue;
    }
    if (arg === '--tag') {
      opts.tag = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (arg.startsWith('--tag=')) {
      opts.tag = arg.slice('--tag='.length);
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
    console.error(`Unknown argument: ${arg}`);
    printHelp();
    process.exit(1);
  }

  return opts;
}

function printHelp() {
  console.log(`Usage:
  npm run release:npm -- [--tag <tag>] [--dry-run] [--skip-checks] [--skip-pack] [--skip-registry-check]

Examples:
  npm run release:npm
  npm run release:npm -- --tag alpha
  npm run release:npm -- --tag alpha --dry-run
`);
}

async function cleanupTarball(tarballName) {
  if (!tarballName) return;
  const tarballPath = path.join(repoRoot, tarballName);
  if (!existsSync(tarballPath)) return;

  try {
    await rm(tarballPath, { force: true });
    console.log(`\n[release] Cleaned up ${tarballName}.`);
  } catch (error) {
    console.warn(
      `\n[release] Warning: failed to remove ${tarballName}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function readThemePackage() {
  const packageJson = readFileSync(path.join(repoRoot, 'packages/theme/package.json'), 'utf8');
  return JSON.parse(packageJson);
}

function resolveTarballName(pkg) {
  const safeName = String(pkg.name).replace(/^@/, '').replace(/\//g, '-');
  return `${safeName}-${pkg.version}.tgz`;
}

function compareSemver(a, b) {
  const left = parseSemver(a);
  const right = parseSemver(b);

  for (const key of ['major', 'minor', 'patch']) {
    if (left[key] !== right[key]) return left[key] > right[key] ? 1 : -1;
  }

  if (left.prerelease.length === 0 && right.prerelease.length === 0) return 0;
  if (left.prerelease.length === 0) return 1;
  if (right.prerelease.length === 0) return -1;

  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let i = 0; i < length; i += 1) {
    const leftPart = left.prerelease[i];
    const rightPart = right.prerelease[i];
    if (leftPart === undefined) return -1;
    if (rightPart === undefined) return 1;
    if (leftPart === rightPart) continue;

    const leftNumber = /^\d+$/.test(leftPart) ? Number(leftPart) : null;
    const rightNumber = /^\d+$/.test(rightPart) ? Number(rightPart) : null;
    if (leftNumber !== null && rightNumber !== null) {
      return leftNumber > rightNumber ? 1 : -1;
    }
    if (leftNumber !== null) return -1;
    if (rightNumber !== null) return 1;
    return leftPart > rightPart ? 1 : -1;
  }

  return 0;
}

function parseSemver(version) {
  const match = String(version).match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/
  );

  if (!match) {
    throw new Error(`Unsupported semver version: ${version}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ? match[4].split('.') : [],
  };
}

function verifyRegistryVersion(pkg, env) {
  console.log('\n[release] Checking npm registry version...');
  const latestVersion = runCapture('npm', ['view', pkg.name, 'version'], { env });

  if (compareSemver(pkg.version, latestVersion) <= 0) {
    throw new Error(
      `${pkg.name}@${pkg.version} is not newer than npm latest ${latestVersion}. ` +
        'Bump the workspace package version before running release:npm.'
    );
  }

  console.log(`[release] Local version ${pkg.version} is newer than npm latest ${latestVersion}.`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const pkg = readThemePackage();
  const tarballName = resolveTarballName(pkg);
  const cacheDir = mkdtempSync(path.join(tmpdir(), 'npm-cache-anglefeint-'));
  const npmEnv = { ...process.env, npm_config_cache: cacheDir };

  try {
    if (opts.tag && opts.tag.trim().length === 0) {
      throw new Error('--tag requires a non-empty value.');
    }

    if (pkg.name !== packageName) {
      throw new Error(`Expected package ${packageName}, found ${pkg.name}.`);
    }

    if (!opts.skipRegistryCheck) {
      verifyRegistryVersion(pkg, npmEnv);
    }

    if (!opts.skipChecks) {
      console.log('\n[release] Running checks...');
      run('npm', ['run', 'check'], { env: npmEnv });
    }

    if (!opts.skipPack) {
      console.log('\n[release] Packing workspace package...');
      run('npm', ['run', 'theme:pack'], { env: npmEnv });
    }

    if (!opts.dryRun) {
      console.log('\n[release] Verifying npm auth...');
      run('npm', ['whoami'], { env: npmEnv });
    }

    const publishArgs = ['publish', '--access', 'public'];
    if (opts.tag) publishArgs.push('--tag', opts.tag);
    if (opts.dryRun) publishArgs.push('--dry-run');

    console.log(`\n[release] Publishing ${packageName}${opts.tag ? ` (${opts.tag})` : ''}...`);
    run('npm', publishArgs, { cwd: `${repoRoot}/packages/theme`, env: npmEnv });

    console.log('\n[release] Done.');
  } finally {
    await cleanupTarball(tarballName);
    await rm(cacheDir, { force: true, recursive: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
