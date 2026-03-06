import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const MAP = [
  ['scripts/adapter-templates/src/config/site.ts', 'src/config/site.ts'],
  ['scripts/adapter-templates/src/config/theme.ts', 'src/config/theme.ts'],
  ['scripts/adapter-templates/src/config/social.ts', 'src/config/social.ts'],
  ['scripts/adapter-templates/src/config/about.ts', 'src/config/about.ts'],
  ['scripts/adapter-templates/src/config/index.ts', 'src/config/index.ts'],
  ['scripts/adapter-templates/src/i18n/config.ts', 'src/i18n/config.ts'],
  ['scripts/adapter-templates/src/i18n/runtime.ts', 'src/i18n/runtime.ts'],
  ['scripts/adapter-templates/src/i18n/messages.ts', 'src/i18n/messages.ts'],
  ['scripts/adapter-templates/src/i18n/posts.ts', 'src/i18n/posts.ts'],
  ['scripts/adapter-templates/src/types/theme-scripts.d.ts', 'src/types/theme-scripts.d.ts'],
];

function parseArgs(argv) {
  return {
    check: argv.includes('--check'),
  };
}

async function main() {
  const { check } = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const changed = [];

  for (const [sourceRel, targetRel] of MAP) {
    const sourcePath = path.join(cwd, sourceRel);
    const targetPath = path.join(cwd, targetRel);
    const sourceText = await readFile(sourcePath, 'utf8');
    let targetText = '';
    try {
      targetText = await readFile(targetPath, 'utf8');
    } catch {
      targetText = '';
    }

    if (sourceText === targetText) continue;
    changed.push(targetRel);
    if (!check) {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(targetPath, sourceText, 'utf8');
    }
  }

  if (changed.length === 0) {
    console.log(check ? 'Adapter files already in sync.' : 'No adapter updates needed.');
    return;
  }

  if (check) {
    console.error('Adapter files are out of sync:');
    for (const file of changed) console.error(`- ${file}`);
    console.error('\nRun: npm run sync-adapters');
    process.exit(1);
  }

  console.log('Updated adapter files:');
  for (const file of changed) console.log(`- ${file}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
