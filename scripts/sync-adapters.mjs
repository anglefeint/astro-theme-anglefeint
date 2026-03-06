import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ADAPTER_TEMPLATE_MAP } from './starter-manifest.mjs';

function parseArgs(argv) {
  return {
    check: argv.includes('--check'),
  };
}

async function main() {
  const { check } = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const changed = [];

  for (const [sourceRel, targetRel] of ADAPTER_TEMPLATE_MAP) {
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
