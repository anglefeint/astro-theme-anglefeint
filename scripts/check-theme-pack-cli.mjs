#!/usr/bin/env node

import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

function run(cmd, args, options = {}) {
  const winCommand =
    process.platform === 'win32' && cmd === 'npm'
      ? ['cmd.exe', ['/d', '/s', '/c', 'npm', ...args]]
      : [cmd, args];
  const [executable, finalArgs] = winCommand;
  const result = spawnSync(executable, finalArgs, {
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
  const cacheDir = mkdtempSync(join(tmpdir(), 'npm-cache-anglefeint-'));
  try {
    const pack = run('npm', ['pack', '--workspace', '@anglefeint/astro-theme', '--silent'], {
      env: { ...process.env, npm_config_cache: cacheDir },
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
      'package/src/scaffold/project-config.mjs',
      'package/src/machine-readable.mjs',
      'package/src/machine-readable.d.mts',
      'package/src/machine/content.mjs',
      'package/src/machine/generate.mjs',
      'package/src/components/about/AboutContents.astro',
      'package/src/components/about/AboutWindowControls.astro',
      'package/src/scripts/about/window.js',
      'package/src/styles/about/window.css',
      'package/src/scripts/blogpost/section-links.js',
      'package/src/components/shared/FrontierMenu.astro',
      'package/src/utils/about-sections.ts',
    ];

    const entries = new Set(list.split(/\r?\n/));
    const packedManifest = JSON.parse(run('tar', ['-xOf', tarball, 'package/package.json']).stdout);
    const aboutExport = packedManifest.exports?.['./utils/about-sections'];
    const missing = required.filter((entry) => !entries.has(entry));
    if (typeof aboutExport !== 'string' || !entries.has(`package/${aboutExport.slice(2)}`))
      missing.push('resolvable ./utils/about-sections export');
    const missingShebang = ['package/src/cli-new-post.mjs', 'package/src/cli-new-page.mjs'].filter(
      (entry) => {
        const packedFile = run('tar', ['-xOf', tarball, entry]).stdout ?? '';
        return !packedFile.startsWith('#!/usr/bin/env node');
      }
    );
    rmSync(tarball, { force: true });

    if (missing.length > 0) {
      console.error('Theme tarball CLI check failed. Missing entries:');
      for (const entry of missing) console.error(`- ${entry}`);
      process.exit(1);
    }

    if (missingShebang.length > 0) {
      console.error('Theme tarball CLI check failed. Missing node shebang:');
      for (const entry of missingShebang) console.error(`- ${entry}`);
      process.exit(1);
    }

    console.log('Theme tarball CLI check passed.');
  } finally {
    rmSync(cacheDir, { force: true, recursive: true });
  }
}

main();
