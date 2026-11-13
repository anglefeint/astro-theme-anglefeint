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
      'package/tsconfig.json',
      'package/src/integration.mjs',
      'package/src/covers/prepare.mjs',
      'package/src/covers/project.mjs',
      'package/src/utils/article-author.ts',
      'package/src/utils/article-paths.ts',
      'package/src/scripts/blogpost/motion.js',
      'package/src/utils/blog-pagination.ts',
      'package/src/effects/red-queen/decoder-pool.js',
      'package/src/covers/fragment-sources.mjs',
      'package/src/covers/fragment-markdown.mjs',
      'package/src/covers/fragment-render.mjs',
      'package/src/covers/responsive.mjs',
      'package/src/covers/types.d.ts',
      'package/src/utils/fragment-html.ts',
      'package/src/covers/integration.mjs',
      'package/src/covers/virtual.d.ts',
      'package/src/utils/blog-cover.ts',
      'package/src/integration.d.mts',
      'package/src/cli.mjs',
      'package/src/project/defaults.ts',
      'package/src/project/schema.ts',
      'package/src/project/config/theme.ts',
      'package/src/routes/[lang]/about.astro',
      'package/src/routes/[lang]/decoder.astro',
      'package/src/routes/[lang]/terminal/[id].json.ts',
      'package/src/routes/[lang]/fragments/index/[revision].json.ts',
      'package/src/utils/fragment-index.ts',
      'package/src/scripts/fragment-links.js',
      'package/src/sitemap.mjs',
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
      'package/src/effects/matrix-rain/matrix-rain.js',
      'package/src/effects/matrix-rain/matrix-rain.d.ts',
      'package/src/effects/matrix-rain/glyphs.js',
      'package/src/effects/signal-loading/SignalLoading.astro',
      'package/src/effects/cyber-spotlight/CyberSpotlight.astro',
      'package/src/effects/cyber-rain/CyberRain.astro',
      'package/src/effects/cyber-rain/cyber-rain.js',
      'package/src/effects/cyber-rain/cyber-rain.d.ts',
      'package/src/effects/cyber-dust/CyberDust.astro',
      'package/src/effects/cyber-dust/cyber-dust.js',
      'package/src/effects/cyber-dust/cyber-dust.d.ts',
      'package/src/effects/ai-background/AiBackground.astro',
      'package/src/effects/ai-background/ai-background.css',
      'package/src/effects/ai-background/ai-network.js',
      'package/src/effects/ai-background/ai-network.d.ts',
      'package/src/effects/network-backdrop/NetworkBackdrop.astro',
      'package/src/effects/network-backdrop/network-backdrop.css',
      'package/src/effects/network-backdrop/network-background.js',
      'package/src/effects/network-backdrop/network-background.d.ts',
      'package/src/effects/network-backdrop/entry.js',
      'package/src/effects/network-backdrop/entry.d.ts',
      'package/src/effects/red-queen/RedQueen.astro',
      'package/src/effects/red-queen/red-queen.js',
      'package/src/effects/red-queen/red-queen.css',
      'package/src/effects/red-queen/red-queen.d.ts',
      ...[
        'key-button/KeyButton.astro',
        'key-button/key-button.js',
        'key-button/key-button.css',
        'key-button/key-button.d.ts',
        'blink-cursor/BlinkCursor.astro',
        'blink-cursor/cursor.js',
        'blink-cursor/cursor.css',
        'blink-cursor/cursor.d.ts',
        'startup-text/StartupText.astro',
        'startup-text/startup-text.js',
        'startup-text/startup-text.css',
        'startup-text/startup-text.d.ts',
        'startup-text/model.js',
        'startup-text/model.d.ts',
        'hidden-signal/HiddenSignal.astro',
        'hidden-signal/hidden-signal.js',
        'hidden-signal/hidden-signal.css',
        'hidden-signal/hidden-signal.d.ts',
        'cyber-environment/CyberEnvironment.astro',
        'cyber-environment/environment.js',
        'cyber-environment/environment.css',
        'cyber-environment/environment.d.ts',
        'cyber-environment/layers.js',
        'cyber-environment/layers.d.ts',
      ].map((file) => `package/src/effects/${file}`),
      'package/src/effects/white-rabbit/WhiteRabbit.astro',
      'package/src/effects/white-rabbit/white-rabbit.js',
      'package/src/effects/white-rabbit/white-rabbit.d.ts',
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
