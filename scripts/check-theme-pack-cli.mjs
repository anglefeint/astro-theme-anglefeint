#!/usr/bin/env node

import { existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    encoding: 'utf8',
    stdio: options.stdio ?? 'pipe',
    cwd: options.cwd ?? process.cwd(),
    env: options.env ?? process.env,
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    if (stderr) console.error(stderr);
    if (stdout) console.error(stdout);
    process.exit(result.status ?? 1);
  }

  return result;
}

function main() {
  const pack = run('npm', ['pack', '--workspace', '@anglefeint/astro-theme', '--silent'], {
    env: { ...process.env, npm_config_cache: '/tmp/npm-cache-anglefeint' },
  });
  const tarball = (pack.stdout ?? '')
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1);

  if (!tarball) {
    console.error('Failed to capture npm pack tarball name.');
    process.exit(1);
  }

  if (!existsSync(tarball)) {
    console.error(`Packed tarball not found: ${tarball}`);
    process.exit(1);
  }

  const list = run('tar', ['-tf', tarball]).stdout ?? '';
  const required = [
    'package/src/cli-new-post.mjs',
    'package/src/cli-new-page.mjs',
    'package/src/scaffold/new-post.mjs',
    'package/src/scaffold/new-page.mjs',
    'package/src/scaffold/shared.mjs',
  ];

  const missing = required.filter((entry) => !list.includes(entry));
  rmSync(tarball, { force: true });

  if (missing.length > 0) {
    console.error('Theme tarball CLI check failed. Missing entries:');
    for (const entry of missing) console.error(`- ${entry}`);
    process.exit(1);
  }

  console.log('Theme tarball CLI check passed.');
}

main();
