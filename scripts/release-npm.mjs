#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { rm } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function parseArgs(argv) {
  const opts = {
    tag: '',
    dryRun: false,
    skipChecks: false,
    skipPack: false,
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
  npm run release:npm -- [--tag <tag>] [--dry-run] [--skip-checks] [--skip-pack]

Examples:
  npm run release:npm
  npm run release:npm -- --tag alpha
  npm run release:npm -- --tag alpha --dry-run
`);
}

async function cleanupTarball(tarballName) {
  if (!tarballName) return;
  const tarballPath = path.join(repoRoot, tarballName);
  try {
    await rm(tarballPath, { force: true });
    console.log(`\n[release] Cleaned up ${tarballName}.`);
  } catch (error) {
    console.warn(
      `\n[release] Warning: failed to remove ${tarballName}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function resolveTarballName() {
  const pkg = JSON.parse(
    spawnSync('node', ['-p', "JSON.stringify(require('./packages/theme/package.json'))"], {
      cwd: repoRoot,
      encoding: 'utf8',
    }).stdout
  );
  const safeName = String(pkg.name).replace(/^@/, '').replace(/\//g, '-');
  return `${safeName}-${pkg.version}.tgz`;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const tarballName = resolveTarballName();

  if (opts.tag && opts.tag.trim().length === 0) {
    console.error('--tag requires a non-empty value.');
    process.exit(1);
  }

  if (!opts.skipChecks) {
    console.log('\n[release] Running checks...');
    run('npm', ['run', 'check']);
  }

  if (!opts.skipPack) {
    console.log('\n[release] Packing workspace package...');
    run('npm', ['run', 'theme:pack'], {
      env: { ...process.env, npm_config_cache: '/tmp/npm-cache-anglefeint' },
    });
  }

  if (!opts.dryRun) {
    console.log('\n[release] Verifying npm auth...');
    run('npm', ['whoami']);
  }

  const publishArgs = ['publish', '--access', 'public'];
  if (opts.tag) publishArgs.push('--tag', opts.tag);
  if (opts.dryRun) publishArgs.push('--dry-run');

  console.log(
    `\n[release] Publishing @anglefeint/astro-theme${opts.tag ? ` (${opts.tag})` : ''}...`
  );
  run('npm', publishArgs, { cwd: `${repoRoot}/packages/theme` });
  await cleanupTarball(tarballName);

  console.log('\n[release] Done.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
