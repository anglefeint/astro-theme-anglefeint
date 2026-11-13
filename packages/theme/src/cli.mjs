#!/usr/bin/env node
import process from 'node:process';
import { upgradeProject, inspectIntegrationProject } from './scaffold/upgrade.mjs';
import { npmCommand } from './scaffold/upgrade.mjs';

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'prepare-covers') {
    if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
      console.log('Usage: astro-theme prepare-covers [--check]');
      return;
    }
    if (args.some((arg) => arg !== '--check') || new Set(args).size !== args.length)
      throw new Error('Usage: astro-theme prepare-covers [--check]');
    const { prepareProjectCovers } = await import('./covers/project.mjs');
    const result = await prepareProjectCovers({ check: args.includes('--check') });
    console.log(
      `[covers] ${result.encoded} generated, ${result.reused} reused. Commit src/assets/blog/covers/ with your originals.`
    );
    return;
  }
  if (command === 'new-fragment') {
    const { newFragment } = await import('./scaffold/new-fragment.mjs');
    await newFragment(args);
    return;
  }
  if (!command || command === '--help' || command === 'help') {
    console.log(
      'Usage: astro-theme upgrade [--to <version|tag>] [--check]\n       astro-theme doctor\n       astro-theme prepare-covers [--check]\n       astro-theme new-fragment [--locales en,zh]\nUpgrade entry: npx @anglefeint/astro-theme@latest upgrade'
    );
    return;
  }
  if (command === 'doctor') {
    if (args.length) throw new Error('doctor takes no arguments.');
    await inspectIntegrationProject(process.cwd());
    const { prepareProjectCovers } = await import('./covers/project.mjs');
    // Local and CI doctor use the same preparation policy as normal builds.
    // Explicit prepare-covers --check remains the read-only validation entry.
    await prepareProjectCovers();
    process.stdout.write(await npmCommand(['exec', '--', 'astro', 'check'], process.cwd()));
    process.stdout.write(await npmCommand(['run', 'build'], process.cwd()));
    // Source validation is shipped with the package, not copied into the starter.
    const { loadProjectModule } = await import('./scaffold/project-config.mjs');
    const { resolve } = await import('node:path');
    const config = await loadProjectModule(resolve('src/site.config.ts'));
    if (config.THEME_CONFIG.theme.enableAboutPage)
      await import('./scaffold/check-about-runtime.mjs');
    return;
  }
  if (command !== 'upgrade') throw new Error(`Unknown command: ${command}`);
  let target = 'latest';
  let check = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--check') check = true;
    else if (args[i] === '--to' && args[i + 1]) target = args[++i];
    else throw new Error(`Unknown or incomplete option: ${args[i]}`);
  }
  await upgradeProject({ target, check });
}
main().catch((error) => {
  console.error(`[anglefeint] ${error.message}`);
  process.exitCode = 1;
});
