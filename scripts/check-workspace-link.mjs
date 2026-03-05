import { lstat, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

const cwd = process.cwd();
const pkgPath = path.join(cwd, 'package.json');

function fail(message) {
  console.error(`[check:workspace-link] ${message}`);
  process.exit(1);
}

async function main() {
  const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
  const isWorkspaceRepo =
    Array.isArray(pkg.workspaces) &&
    pkg.workspaces.some((item) => typeof item === 'string' && item.includes('packages'));
  const themeDep = pkg?.dependencies?.['@anglefeint/astro-theme'];

  // Starter branch / non-workspace projects should skip this guard.
  if (!isWorkspaceRepo || themeDep !== 'workspace:*') {
    console.log('[check:workspace-link] skipped (non-workspace package consumer mode).');
    return;
  }

  const linkPath = path.join(cwd, 'node_modules', '@anglefeint', 'astro-theme');
  const expected = path.join(cwd, 'packages', 'theme');

  let stat;
  try {
    stat = await lstat(linkPath);
  } catch {
    fail('missing node_modules/@anglefeint/astro-theme. Run: npm install');
  }

  if (!stat.isSymbolicLink()) {
    fail('node_modules/@anglefeint/astro-theme is not a symlink. Run: npm install');
  }

  const [resolvedLink, resolvedExpected] = await Promise.all([
    realpath(linkPath),
    realpath(expected),
  ]);
  if (resolvedLink !== resolvedExpected) {
    fail(
      `node_modules/@anglefeint/astro-theme points to ${resolvedLink}, expected ${resolvedExpected}. Run: npm install`
    );
  }

  console.log('[check:workspace-link] workspace link is valid.');
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});
