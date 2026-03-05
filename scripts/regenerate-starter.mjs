import { execFile } from 'node:child_process';
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const MANAGED_FILES = [
  'scripts/adapter-templates/src/config/theme.ts',
  'src/components/pagination/CyberPagination.astro',
  'src/config/theme.ts',
  'src/pages/[lang]/blog/[...page].astro',
  'src/pages/[lang]/index.astro',
  'src/site.config.ts',
  'src/utils/pagination-style.ts',
  'src/utils/pagination.ts',
];

function parseArgs(argv) {
  return {
    check: argv.includes('--check'),
    from: argv.find((arg) => arg.startsWith('--from='))?.slice('--from='.length) || 'main',
  };
}

async function hasRef(ref) {
  try {
    await execFileAsync('git', ['rev-parse', '--verify', '--quiet', ref], {
      maxBuffer: 5 * 1024 * 1024,
    });
    return true;
  } catch {
    return false;
  }
}

async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readFromGit(ref, filePath) {
  const { stdout } = await execFileAsync('git', ['show', `${ref}:${filePath}`], {
    maxBuffer: 20 * 1024 * 1024,
  });
  return stdout;
}

async function resolveSourceRef(requested) {
  const candidates = [requested, `origin/${requested}`];
  for (const candidate of candidates) {
    if (await hasRef(candidate)) return candidate;
  }
  throw new Error(
    `[starter:regen] Cannot resolve source ref "${requested}". Try: npm run starter:regen -- --from=<ref>`
  );
}

async function main() {
  const { check, from } = parseArgs(process.argv.slice(2));
  const sourceRef = await resolveSourceRef(from);
  const cwd = process.cwd();
  const changed = [];

  for (const relPath of MANAGED_FILES) {
    let sourceText = '';
    try {
      sourceText = await readFromGit(sourceRef, relPath);
    } catch (error) {
      console.error(`[starter:regen] missing source file in ref "${sourceRef}": ${relPath}`);
      throw error;
    }

    const targetPath = path.join(cwd, relPath);
    const exists = await fileExists(targetPath);
    const targetText = exists ? await readFile(targetPath, 'utf8') : null;

    if (targetText === sourceText) {
      continue;
    }

    changed.push(relPath);

    if (!check) {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(targetPath, sourceText, 'utf8');
    }
  }

  // Clean up files that became unmanaged in the new pagination architecture.
  const obsoleteFiles = ['src/utils/pagination-style.legacy.ts'];
  for (const relPath of obsoleteFiles) {
    const fullPath = path.join(cwd, relPath);
    if (!(await fileExists(fullPath))) continue;
    changed.push(relPath);
    if (!check) await rm(fullPath, { force: true });
  }

  if (changed.length === 0) {
    console.log(
      check
        ? `Starter files are in sync with ${sourceRef}.`
        : `Starter regenerate: no changes (source: ${sourceRef}).`
    );
    return;
  }

  if (check) {
    console.error(`Starter drift detected against ${sourceRef}:`);
    for (const relPath of changed) console.error(`- ${relPath}`);
    console.error(`\nRun: npm run starter:regen -- --from=${sourceRef}`);
    process.exit(1);
  }

  console.log(`Starter files regenerated from ${sourceRef}:`);
  for (const relPath of changed) console.log(`- ${relPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
