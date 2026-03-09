/* global console, process */
import { execFile } from 'node:child_process';
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import {
  REQUIRED_STARTER_MANAGED_FILES,
  STARTER_MANAGED_FILES as MANAGED_FILES,
  STARTER_CONTENT_MANAGED_FILES,
  STARTER_CONTENT_ROOT,
  STARTER_OBSOLETE_FILES,
} from '../../scripts/starter-manifest.mjs';

const execFileAsync = promisify(execFile);

const STARTER_PACKAGE_JSON = 'package.json';
const STARTER_PACKAGE_LOCK = 'package-lock.json';
const THEME_PACKAGE_JSON = 'packages/theme/package.json';
const STARTER_SYNC_FILES = [STARTER_PACKAGE_JSON, STARTER_PACKAGE_LOCK];
const GENERATED_ARTIFACT_PATTERNS = [/^anglefeint-astro-theme-.*\.tgz$/];
const STARTER_CONTENT_MANAGED_SET = new Set(STARTER_CONTENT_MANAGED_FILES);

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

function validateManagedCoverage() {
  const managed = new Set(MANAGED_FILES);
  const missing = REQUIRED_STARTER_MANAGED_FILES.filter((relPath) => !managed.has(relPath));
  if (missing.length === 0) return;

  throw new Error(
    `[maintainer:sync-starter] MANAGED_FILES is missing starter-required file(s):\n- ${missing.join('\n- ')}`
  );
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

async function listRepoRootEntries(repoRoot) {
  try {
    const { readdir } = await import('node:fs/promises');
    return await readdir(repoRoot);
  } catch {
    return [];
  }
}

async function listGitTreeFiles(ref, treeRoot) {
  try {
    const { stdout } = await runSilent('git', [
      'ls-tree',
      '-r',
      '--name-only',
      ref,
      '--',
      treeRoot,
    ]);
    return stdout
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function listLocalFiles(rootPath, baseRoot = rootPath) {
  const { readdir } = await import('node:fs/promises');
  if (!(await fileExists(rootPath))) return [];

  const entries = await readdir(rootPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listLocalFiles(fullPath, baseRoot)));
      continue;
    }
    files.push(path.relative(baseRoot, fullPath));
  }

  return files;
}

async function collectUnexpectedStarterContentFiles(ref) {
  const contentFiles = await listGitTreeFiles(ref, STARTER_CONTENT_ROOT);
  return contentFiles.filter(
    (relPath) => relPath.endsWith('.md') && !STARTER_CONTENT_MANAGED_SET.has(relPath)
  );
}

async function cleanupGeneratedArtifacts(repoRoot) {
  const removed = [];
  for (const entry of await listRepoRootEntries(repoRoot)) {
    if (!GENERATED_ARTIFACT_PATTERNS.some((pattern) => pattern.test(entry))) continue;
    await rm(path.join(repoRoot, entry), { force: true, recursive: true });
    removed.push(entry);
  }
  return removed;
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
  for (const relPath of await collectUnexpectedStarterContentFiles(targetRef)) {
    changed.push(relPath);
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

async function cleanupUnexpectedStarterContent(repoRoot) {
  const contentRoot = path.join(repoRoot, STARTER_CONTENT_ROOT);
  const files = await listLocalFiles(contentRoot, repoRoot);
  const removed = [];

  for (const relPath of files) {
    if (!relPath.startsWith(`${STARTER_CONTENT_ROOT}/`) || !relPath.endsWith('.md')) continue;
    if (STARTER_CONTENT_MANAGED_SET.has(relPath)) continue;
    await rm(path.join(repoRoot, relPath), { force: true });
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
  const staged = [...new Set([...MANAGED_FILES, ...STARTER_SYNC_FILES, ...changedFiles])];
  if (staged.length > 0) {
    await run('git', ['add', '--', ...staged]);
  }
  for (const relPath of STARTER_OBSOLETE_FILES) {
    await runSilent('git', ['rm', '--cached', '--ignore-unmatch', '--', relPath]);
  }
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
  let syncSucceeded = false;
  try {
    await run('git', ['checkout', targetBranch]);
    switched = true;

    await cleanupGeneratedArtifacts(repoRoot);
    const changedManaged = await writeManagedFilesFromRef(sourceRef, repoRoot);
    const removedObsolete = await cleanupObsoleteStarterFiles(repoRoot);
    const removedUnexpectedContent = await cleanupUnexpectedStarterContent(repoRoot);
    const sanitized = await sanitizeStarterPackageJson(repoRoot);
    const dependencyUpdated = await syncStarterThemeDependency(repoRoot, expectedRange);

    await run('npm', ['install']);
    await run('npm', ['run', 'check']);
    await run('npm', ['run', 'build']);

    const changed = [...changedManaged, ...removedObsolete, ...removedUnexpectedContent];
    if (sanitized) changed.push('package.json');
    if (dependencyUpdated && !changed.includes('package.json')) changed.push('package.json');
    changed.push(STARTER_PACKAGE_LOCK);
    const committed = await commitStarterIfNeeded(sourceRef, changed);
    console.log(
      `[maintainer:sync-starter] starter theme dependency target: ${expectedRange} (lockfile resolved via npm install).`
    );
    if (committed && push) await run('git', ['push', 'origin', targetBranch]);
    syncSucceeded = true;
  } finally {
    if (syncSucceeded && switched && (await currentBranch()) !== originalBranch) {
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
  validateManagedCoverage();
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
  console.error(
    '[maintainer:sync-starter] sync failed. If you are left on "starter", inspect the working tree there, then return to "main" to fix the issue before retrying.'
  );
  process.exit(1);
});
