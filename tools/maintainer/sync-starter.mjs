/* global console, process */
import { execFile } from 'node:child_process';
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const MANAGED_FILES = [
  'README.md',
  'README.zh-CN.md',
  'README.ja.md',
  'README.es.md',
  'README.ko.md',
  'scripts/adapter-templates/src/config/about.ts',
  'scripts/adapter-templates/src/config/index.ts',
  'scripts/adapter-templates/src/config/site.ts',
  'scripts/adapter-templates/src/config/social.ts',
  'scripts/check-about-runtime-config.mjs',
  'scripts/check-adapter-contract.mjs',
  'scripts/new-page.mjs',
  'scripts/new-post.mjs',
  'scripts/sync-adapters.mjs',
  'scripts/adapter-templates/src/config/theme.ts',
  'scripts/adapter-templates/src/i18n/config.ts',
  'scripts/adapter-templates/src/i18n/messages.ts',
  'scripts/adapter-templates/src/i18n/posts.ts',
  'scripts/adapter-templates/src/i18n/runtime.ts',
  'scripts/adapter-templates/src/types/theme-scripts.d.ts',
  'src/components/pagination/CyberPagination.astro',
  'src/config/about.ts',
  'src/config/site.ts',
  'src/config/theme.ts',
  'src/i18n/config.ts',
  'src/i18n/messages.ts',
  'src/i18n/runtime.ts',
  'src/pages/[lang]/about.astro',
  'src/pages/[lang]/blog/[...page].astro',
  'src/pages/[lang]/index.astro',
  'src/pages/[lang]/rss.xml.ts',
  'src/scripts/cyber-rain-dust.js',
  'src/site.config.ts',
  'src/utils/pagination-style.ts',
  'src/utils/pagination.ts',
];

const STARTER_OBSOLETE_FILES = [
  'scripts/regenerate-starter.mjs',
  'tools/maintainer/sync-starter.mjs',
  'docs/MAINTAINER_WORKFLOW.md',
];

const STARTER_PACKAGE_JSON = 'package.json';
const STARTER_PACKAGE_LOCK = 'package-lock.json';
const THEME_PACKAGE_JSON = 'packages/theme/package.json';

function parseArgs(argv) {
  return {
    checkOnly: argv.includes('--check'),
    push: argv.includes('--push'),
    allowAnyBranch: argv.includes('--allow-any-branch'),
    allowDirty: argv.includes('--allow-dirty'),
    from: argv.find((arg) => arg.startsWith('--from='))?.slice('--from='.length) || 'main',
    target: argv.find((arg) => arg.startsWith('--target='))?.slice('--target='.length) || 'starter',
  };
}

async function run(command, args, options = {}) {
  const { cwd } = options;
  const { stdout, stderr } = await execFileAsync(command, args, {
    cwd,
    maxBuffer: 20 * 1024 * 1024,
  });
  if (stdout.trim()) process.stdout.write(stdout);
  if (stderr.trim()) process.stderr.write(stderr);
}

async function runSilent(command, args, options = {}) {
  const { cwd } = options;
  return execFileAsync(command, args, { cwd, maxBuffer: 20 * 1024 * 1024 });
}

async function currentBranch() {
  const { stdout } = await runSilent('git', ['branch', '--show-current']);
  return stdout.trim();
}

async function hasRef(ref) {
  try {
    await runSilent('git', ['rev-parse', '--verify', '--quiet', ref]);
    return true;
  } catch {
    return false;
  }
}

async function resolveRefCandidates(name) {
  const candidates = [name, `origin/${name}`];
  for (const candidate of candidates) {
    if (await hasRef(candidate)) return candidate;
  }
  throw new Error(`[maintainer:sync-starter] cannot resolve ref "${name}".`);
}

async function resolveBranchCandidates(name) {
  const local = await hasRef(name);
  const remote = await hasRef(`origin/${name}`);
  if (!local && !remote) {
    throw new Error(`[maintainer:sync-starter] target branch "${name}" not found.`);
  }
  return { localRef: local ? name : null, compareRef: local ? name : `origin/${name}` };
}

async function gitStatusPorcelain() {
  const { stdout } = await runSilent('git', ['status', '--porcelain']);
  return stdout.trim();
}

async function ensureCleanWorktree(allowDirty) {
  if (allowDirty) return;
  const dirty = await gitStatusPorcelain();
  if (dirty) {
    throw new Error(
      '[maintainer:sync-starter] working tree is dirty. Commit/stash first, or pass --allow-dirty.'
    );
  }
}

async function readFromGit(ref, filePath) {
  const { stdout } = await runSilent('git', ['show', `${ref}:${filePath}`]);
  return stdout;
}

async function readFromGitOrNull(ref, filePath) {
  try {
    return await readFromGit(ref, filePath);
  } catch {
    return null;
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

async function collectDrift(sourceRef, targetRef) {
  const changed = [];
  for (const relPath of MANAGED_FILES) {
    const sourceText = await readFromGitOrNull(sourceRef, relPath);
    if (sourceText === null) {
      changed.push(relPath);
      continue;
    }
    const targetText = await readFromGitOrNull(targetRef, relPath);
    if (targetText !== sourceText) changed.push(relPath);
  }
  for (const relPath of STARTER_OBSOLETE_FILES) {
    const targetText = await readFromGitOrNull(targetRef, relPath);
    if (targetText !== null) changed.push(relPath);
  }
  const expectedRange = await expectedStarterThemeRange(sourceRef);
  const starterPkg = await readStarterThemeDependency(targetRef);
  if (starterPkg !== expectedRange) changed.push(STARTER_PACKAGE_JSON);
  const starterLockVersion = await readStarterThemeLockVersion(targetRef);
  if (starterLockVersion !== expectedRange.slice(1)) changed.push(STARTER_PACKAGE_LOCK);
  return changed;
}

async function writeManagedFilesFromRef(sourceRef, repoRoot) {
  const changed = [];
  for (const relPath of MANAGED_FILES) {
    const sourceText = await readFromGit(sourceRef, relPath);
    const fullPath = path.join(repoRoot, relPath);
    const existing = (await fileExists(fullPath)) ? await readFile(fullPath, 'utf8') : null;
    if (existing === sourceText) continue;
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, sourceText, 'utf8');
    changed.push(relPath);
  }
  return changed;
}

async function cleanupObsoleteStarterFiles(repoRoot) {
  const removed = [];
  for (const relPath of STARTER_OBSOLETE_FILES) {
    const fullPath = path.join(repoRoot, relPath);
    if (!(await fileExists(fullPath))) continue;
    await rm(fullPath, { force: true });
    removed.push(relPath);
  }
  return removed;
}

async function sanitizeStarterPackageJson(repoRoot) {
  const pkgPath = path.join(repoRoot, 'package.json');
  const raw = await readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(raw);
  pkg.scripts = pkg.scripts || {};
  delete pkg.scripts['maintainer:sync-starter'];
  delete pkg.scripts['maintainer:sync-starter:check'];
  delete pkg.scripts['release:starter'];
  delete pkg.scripts['release:starter:push'];
  const next = `${JSON.stringify(pkg, null, 2)}\n`;
  if (next !== raw) {
    await writeFile(pkgPath, next, 'utf8');
    return true;
  }
  return false;
}

async function expectedStarterThemeRange(sourceRef) {
  const pkgRaw = await readFromGit(sourceRef, THEME_PACKAGE_JSON);
  const pkg = JSON.parse(pkgRaw);
  if (typeof pkg.version !== 'string' || !pkg.version.trim()) {
    throw new Error('[maintainer:sync-starter] packages/theme/package.json missing valid version.');
  }
  return `^${pkg.version}`;
}

async function readStarterThemeDependency(ref) {
  const raw = await readFromGitOrNull(ref, STARTER_PACKAGE_JSON);
  if (!raw) return null;
  const pkg = JSON.parse(raw);
  return pkg?.dependencies?.['@anglefeint/astro-theme'] ?? null;
}

async function readStarterThemeLockVersion(ref) {
  const raw = await readFromGitOrNull(ref, STARTER_PACKAGE_LOCK);
  if (!raw) return null;
  const lock = JSON.parse(raw);
  return (
    lock?.packages?.['node_modules/@anglefeint/astro-theme']?.version ??
    lock?.dependencies?.['@anglefeint/astro-theme']?.version ??
    null
  );
}

async function syncStarterThemeDependency(repoRoot, expectedRange) {
  const pkgPath = path.join(repoRoot, STARTER_PACKAGE_JSON);
  const raw = await readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(raw);
  pkg.dependencies = pkg.dependencies || {};
  const prev = pkg.dependencies['@anglefeint/astro-theme'];
  pkg.dependencies['@anglefeint/astro-theme'] = expectedRange;
  const next = `${JSON.stringify(pkg, null, 2)}\n`;
  if (next !== raw) {
    await writeFile(pkgPath, next, 'utf8');
    return prev !== expectedRange;
  }
  return false;
}

async function commitStarterIfNeeded(sourceRef, changedFiles) {
  const status = await gitStatusPorcelain();
  if (!status) {
    console.log('[maintainer:sync-starter] starter already up to date.');
    return false;
  }
  await run('git', ['add', '-A']);
  await run('git', [
    'commit',
    '-m',
    `chore(starter): sync managed files from ${sourceRef.replace(/^origin\//, '')}`,
  ]);
  if (changedFiles.length > 0) {
    console.log('[maintainer:sync-starter] changed files:');
    for (const relPath of changedFiles) console.log(`- ${relPath}`);
  }
  return true;
}

async function syncStarter({ sourceRef, targetBranch, originalBranch, allowAnyBranch, push }) {
  if (!allowAnyBranch && originalBranch !== sourceRef.replace(/^origin\//, '')) {
    throw new Error(
      `[maintainer:sync-starter] current branch is "${originalBranch}". Run on "${sourceRef.replace(/^origin\//, '')}" or pass --allow-any-branch.`
    );
  }

  const repoRoot = process.cwd();
  const expectedRange = await expectedStarterThemeRange(sourceRef);
  let switched = false;
  try {
    await run('git', ['checkout', targetBranch]);
    switched = true;

    const changedManaged = await writeManagedFilesFromRef(sourceRef, repoRoot);
    const removedObsolete = await cleanupObsoleteStarterFiles(repoRoot);
    const sanitized = await sanitizeStarterPackageJson(repoRoot);
    const dependencyUpdated = await syncStarterThemeDependency(repoRoot, expectedRange);

    await run('npm', ['install']);
    await run('npm', ['run', 'check']);
    await run('npm', ['run', 'build']);

    const changed = [...changedManaged, ...removedObsolete];
    if (sanitized) changed.push('package.json');
    if (dependencyUpdated && !changed.includes('package.json')) changed.push('package.json');
    changed.push(STARTER_PACKAGE_LOCK);
    const committed = await commitStarterIfNeeded(sourceRef, changed);
    console.log(
      `[maintainer:sync-starter] starter theme dependency target: ${expectedRange} (lockfile resolved via npm install).`
    );
    if (committed && push) await run('git', ['push', 'origin', targetBranch]);
  } finally {
    if (switched && (await currentBranch()) !== originalBranch) {
      await run('git', ['checkout', originalBranch]);
      await run('npm', ['install']);
      console.log(`[maintainer:sync-starter] restored dependencies for "${originalBranch}".`);
    }
  }
}

async function main() {
  const { checkOnly, push, allowAnyBranch, allowDirty, from, target } = parseArgs(
    process.argv.slice(2)
  );
  const sourceRef = await resolveRefCandidates(from);
  const { localRef: targetLocalRef, compareRef: targetCompareRef } =
    await resolveBranchCandidates(target);
  const originalBranch = await currentBranch();

  if (checkOnly) {
    const drift = await collectDrift(sourceRef, targetCompareRef);
    if (drift.length === 0) {
      console.log(
        `[maintainer:sync-starter] starter is in sync with ${sourceRef} (compared against ${targetCompareRef}).`
      );
      return;
    }
    console.error(
      `[maintainer:sync-starter] starter drift detected (${drift.length} file(s)) against ${sourceRef}:`
    );
    for (const relPath of drift) console.error(`- ${relPath}`);
    process.exit(1);
  }

  if (!targetLocalRef) {
    throw new Error(
      `[maintainer:sync-starter] local branch "${target}" is missing. Create it first (e.g. git checkout -b ${target} origin/${target}).`
    );
  }
  await ensureCleanWorktree(allowDirty);
  await syncStarter({
    sourceRef,
    targetBranch: target,
    originalBranch,
    allowAnyBranch,
    push,
  });
  console.log('[maintainer:sync-starter] sync + validation complete.');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
