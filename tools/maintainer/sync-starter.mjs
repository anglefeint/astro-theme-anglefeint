/* global console, process */
import { execFile } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { constants } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import {
  REQUIRED_STARTER_MANAGED_FILES,
  STARTER_MANAGED_FILES as MANAGED_FILES,
  STARTER_CONTENT_MANAGED_FILES,
  STARTER_CONTENT_ROOT,
  STARTER_OBSOLETE_FILES,
  starterSourcePath,
  STARTER_COVER_ROOT,
  starterCoverFiles,
} from '../../scripts/starter-manifest.mjs';

import { buildStarterPackage, starterPackageDrift } from '../../scripts/starter-package.mjs';
import { readGitSnapshot } from '../../scripts/git-snapshot.mjs';
import { checkStarterStatic } from '../../scripts/starter-static.mjs';
import { auditDependencies } from '../../scripts/audit-dependencies.mjs';
import { createMaintainerSession } from '../../scripts/maintainer-session.mjs';
let session;

const execFileAsync = promisify(execFile);

const STARTER_PACKAGE_JSON = 'package.json';
const STARTER_PACKAGE_LOCK = 'package-lock.json';
const THEME_PACKAGE_JSON = 'packages/theme/package.json';
const STARTER_SYNC_FILES = [STARTER_PACKAGE_JSON, STARTER_PACKAGE_LOCK];
const GENERATED_ARTIFACT_PATTERNS = [/^anglefeint-astro-theme-.*\.tgz$/];
const STARTER_CONTENT_MANAGED_SET = new Set(STARTER_CONTENT_MANAGED_FILES);

export function parseArgs(argv) {
  const result = {
    checkOnly: false,
    push: false,
    allowAnyBranch: false,
    allowDirty: false,
    from: 'main',
    target: 'starter',
    help: false,
  };
  for (const arg of argv) {
    if (['--help', '-h'].includes(arg)) result.help = true;
    else if (arg === '--check') result.checkOnly = true;
    else if (arg === '--push') result.push = true;
    else if (arg === '--allow-any-branch') result.allowAnyBranch = true;
    else if (arg === '--allow-dirty') result.allowDirty = true;
    else if (arg.startsWith('--from=') && arg.length > 7) result.from = arg.slice(7);
    else if (arg.startsWith('--target=') && arg.length > 9) result.target = arg.slice(9);
    else throw new Error('Unknown starter-sync argument: ' + arg);
  }
  return result;
}

export function validateSyncBranches(sourceRef, targetBranch) {
  const normalize = (ref) => ref.replace(/^refs\/(?:heads|remotes)\//, '').replace(/^origin\//, '');
  if (normalize(targetBranch) === 'main' || normalize(sourceRef) === normalize(targetBranch)) {
    throw new Error(
      '[maintainer:sync-starter] target must be a distribution branch distinct from the source, never main.'
    );
  }
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
  if (session) return session.run(command, args, options);
  const { cwd } = options;
  const [executable, finalArgs] = resolveCommand(command, args);
  const { stdout, stderr } = await execFileAsync(executable, finalArgs, {
    cwd,
    maxBuffer: 20 * 1024 * 1024,
  });
  if (stdout.trim()) process.stdout.write(stdout);
  if (stderr.trim()) process.stderr.write(stderr);
}

async function runSilent(command, args, options = {}) {
  const { cwd } = options;
  const [executable, finalArgs] = resolveCommand(command, args);
  return execFileAsync(executable, finalArgs, { cwd, maxBuffer: 20 * 1024 * 1024 });
}

function resolveCommand(command, args) {
  if (process.platform === 'win32' && command === 'npm') {
    return ['cmd.exe', ['/d', '/s', '/c', 'npm', ...args]];
  }

  return [command, args];
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

export async function readFromGitOrNullBuffer(ref, filePath) {
  return (await readGitSnapshot(process.cwd(), ref, [filePath])).read(filePath);
}

export async function loadStarterSnapshots({
  root = process.cwd(),
  from = 'main',
  target = 'starter',
} = {}) {
  const sourcePaths = [
    ...new Set([...MANAGED_FILES.map(starterSourcePath), STARTER_PACKAGE_JSON, THEME_PACKAGE_JSON]),
  ];
  const targetPaths = [...new Set([...MANAGED_FILES, ...STARTER_SYNC_FILES])];
  const source = await readGitSnapshot(root, from, sourcePaths);
  const destination = await readGitSnapshot(root, target, targetPaths);
  return { source, destination };
}

function json(snapshot, file) {
  const bytes = snapshot.read(file);
  if (bytes === null) return null;
  return JSON.parse(bytes.toString('utf8'));
}

function themeRange(snapshot) {
  const pkg = json(snapshot, THEME_PACKAGE_JSON);
  if (!pkg || !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(pkg.version))
    throw new Error('Invalid source theme version.');
  return '^' + pkg.version;
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
    files.push(path.relative(baseRoot, fullPath).split(path.sep).join('/'));
  }

  return files;
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

export function collectDrift(source, destination) {
  const changed = [];
  for (const file of MANAGED_FILES) {
    const a = source.read(starterSourcePath(file)),
      b = destination.read(file);
    if (a === null || b === null || !a.equals(b)) changed.push(file);
  }
  for (const file of STARTER_OBSOLETE_FILES) if (destination.files.has(file)) changed.push(file);
  for (const file of destination.files.keys())
    if (
      file.startsWith(STARTER_CONTENT_ROOT + '/') &&
      file.endsWith('.md') &&
      !STARTER_CONTENT_MANAGED_SET.has(file)
    )
      changed.push(file);
  const range = themeRange(source);
  const pkg = json(destination, STARTER_PACKAGE_JSON);
  if (
    !pkg ||
    starterPackageDrift(json(source, STARTER_PACKAGE_JSON), pkg, range).length ||
    pkg.dependencies?.['@anglefeint/astro-theme'] !== range
  )
    changed.push(STARTER_PACKAGE_JSON);
  const lock = json(destination, STARTER_PACKAGE_LOCK);
  const version =
    lock?.packages?.['node_modules/@anglefeint/astro-theme']?.version ??
    lock?.dependencies?.['@anglefeint/astro-theme']?.version;
  if (version !== range.slice(1)) changed.push(STARTER_PACKAGE_LOCK);
  return [...new Set(changed)];
}

export async function preflightStarter({
  root = process.cwd(),
  from = 'main',
  target = 'starter',
} = {}) {
  validateSyncBranches(from, target);
  validateManagedCoverage();
  const { source, destination } = await loadStarterSnapshots({ root, from, target });
  await checkStarterStatic({ root, snapshot: source, targetSnapshot: destination });
  return {
    sourceRef: source.commit,
    targetRef: destination.commit,
    drift: collectDrift(source, destination),
  };
}

async function writeManagedFilesFromRef(source, repoRoot) {
  const changed = [];
  for (const file of MANAGED_FILES) {
    const bytes = source.read(starterSourcePath(file));
    if (bytes === null) throw new Error('Missing managed source: ' + file);
    const target = path.join(repoRoot, file);
    const existing = (await fileExists(target)) ? await readFile(target) : null;
    if (existing !== null && existing.equals(bytes)) continue;
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
    changed.push(file);
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

export async function cleanupUnexpectedStarterContent(repoRoot) {
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

async function sanitizeStarterPackageJson(repoRoot, sourceRef, expectedRange) {
  const pkgPath = path.join(repoRoot, 'package.json');
  const raw = await readFile(pkgPath, 'utf8');
  const source = json(sourceRef, STARTER_PACKAGE_JSON);
  const pkg = buildStarterPackage(source, JSON.parse(raw), expectedRange);
  const next = `${JSON.stringify(pkg, null, 2)}\n`;
  if (next !== raw) {
    await writeFile(pkgPath, next, 'utf8');
    return true;
  }
  return false;
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

export async function commitStarterIfNeeded(sourceRef, changedFiles, repoRoot) {
  const status = (
    await runSilent('git', ['status', '--porcelain'], { cwd: repoRoot })
  ).stdout.trim();
  if (!status) {
    console.log('[maintainer:sync-starter] starter already up to date.');
    return false;
  }
  let covers = [];
  try {
    covers = starterCoverFiles(
      JSON.parse(await readFile(path.join(repoRoot, STARTER_COVER_ROOT, 'manifest.json'), 'utf8'))
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const staged = [
    ...new Set([...MANAGED_FILES, ...STARTER_SYNC_FILES, ...changedFiles, ...covers]),
  ];
  await run('git', ['add', '--', ...staged], { cwd: repoRoot });
  await runSilent('git', ['rm', '--cached', '--ignore-unmatch', '--', ...STARTER_OBSOLETE_FILES], {
    cwd: repoRoot,
  });
  const permitted = new Set([...staged, ...STARTER_OBSOLETE_FILES]);
  const indexed = (
    await runSilent('git', ['diff', '--cached', '--name-only', '-z'], { cwd: repoRoot })
  ).stdout
    .split('\0')
    .filter(Boolean);
  if (indexed.some((file) => !permitted.has(file)))
    throw new Error('Unmanaged staged content blocks starter commit.');
  const tree = (await runSilent('git', ['write-tree'], { cwd: repoRoot })).stdout.trim();
  await run('git', ['commit', '-m', 'chore(starter): sync managed files from ' + sourceRef], {
    cwd: repoRoot,
  });
  const committed = (
    await runSilent('git', ['rev-parse', 'HEAD^{tree}'], { cwd: repoRoot })
  ).stdout.trim();
  const remaining = (
    await runSilent('git', ['status', '--porcelain'], { cwd: repoRoot })
  ).stdout.trim();
  if (committed !== tree || remaining)
    throw new Error(
      'Starter commit hooks changed tested files or left uncommitted content; inspect the retained worktree before pushing.'
    );
  return true;
}

export async function createStarterWorktree(root, branch, expectedCommit) {
  await runSilent('git', ['check-ref-format', '--branch', branch], { cwd: root });
  const directory = await mkdtemp(
    path.join(await realpath(os.tmpdir()), 'anglefeint-starter-worktree-')
  );
  await run('git', ['worktree', 'add', '--', directory, branch], { cwd: root });
  const actual = (await runSilent('git', ['rev-parse', 'HEAD'], { cwd: directory })).stdout.trim();
  if (actual !== expectedCommit)
    throw new Error('Starter branch changed before worktree creation: ' + directory);
  return directory;
}

export async function removeStarterWorktree(root, directory) {
  const actual = await realpath(directory);
  const temporary = await realpath(os.tmpdir());
  if (
    path.dirname(actual) !== temporary ||
    !path.basename(actual).startsWith('anglefeint-starter-worktree-')
  )
    throw new Error('Unsafe starter worktree cleanup path.');
  const normalize = (p) =>
    process.platform === 'win32' ? path.resolve(p).toLowerCase() : path.resolve(p);
  const registered = (
    await runSilent('git', ['worktree', 'list', '--porcelain', '-z'], { cwd: root })
  ).stdout
    .split('\0')
    .filter((line) => line.startsWith('worktree '))
    .map((line) => normalize(line.slice(9)));
  if (!registered.includes(normalize(actual)))
    throw new Error('Starter worktree is not registered to this repository.');
  // No force: retain unexpected files or a dirty worktree for inspection.
  await run('git', ['worktree', 'remove', '--', actual], { cwd: root });
}

export function starterOperations(root) {
  return {
    snapshots: loadStarterSnapshots,
    staticCheck: checkStarterStatic,
    createWorktree: createStarterWorktree,
    removeWorktree: removeStarterWorktree,
    verifySource: async (ref, commit) => {
      const actual = (
        await runSilent('git', ['rev-parse', '--verify', ref + '^{commit}'], { cwd: root })
      ).stdout.trim();
      if (actual !== commit) throw new Error('Source ref changed during starter delivery.');
    },
    auditDependencies: (cwd) =>
      session
        ? session.stage('Audit starter dependencies', () => auditDependencies(cwd), { cwd })
        : auditDependencies(cwd),
    run,
    cleanupGeneratedArtifacts,
    writeManagedFilesFromRef,
    cleanupObsoleteStarterFiles,
    cleanupUnexpectedStarterContent,
    sanitizeStarterPackageJson,
    syncStarterThemeDependency,
    commitStarterIfNeeded,
  };
}

export async function syncStarter(
  { root = process.cwd(), sourceRef, targetBranch, originalBranch, allowAnyBranch, push },
  operations = starterOperations(root)
) {
  validateSyncBranches(sourceRef, targetBranch);
  if (!allowAnyBranch && originalBranch !== sourceRef.replace(/^origin\//, ''))
    throw new Error('Run starter sync on its source branch.');
  const { source, destination } = await operations.snapshots({
    root,
    from: sourceRef,
    target: targetBranch,
  });
  await operations.staticCheck({ root, snapshot: source, targetSnapshot: destination });
  const range = themeRange(source);
  const directory = await operations.createWorktree(root, targetBranch, destination.commit);
  console.log('[maintainer:sync-starter] isolated directory: ' + directory);
  try {
    await operations.cleanupGeneratedArtifacts(directory);
    const changed = [
      ...(await operations.writeManagedFilesFromRef(source, directory)),
      ...(await operations.cleanupObsoleteStarterFiles(directory)),
      ...(await operations.cleanupUnexpectedStarterContent(directory)),
    ];
    if (await operations.sanitizeStarterPackageJson(directory, source, range))
      changed.push(STARTER_PACKAGE_JSON);
    if (await operations.syncStarterThemeDependency(directory, range))
      changed.push(STARTER_PACKAGE_JSON);
    await operations.run('npm', ['update', '--prefer-online'], { cwd: directory });
    await operations.auditDependencies(directory);
    await operations.run('npm', ['run', 'check'], { cwd: directory });
    changed.push(STARTER_PACKAGE_LOCK);
    await operations.verifySource(sourceRef, source.commit);
    await operations.commitStarterIfNeeded(sourceRef, changed, directory);
    if (push) {
      await operations.verifySource(sourceRef, source.commit);
      await operations.run('git', ['push', 'origin', targetBranch], { cwd: directory });
    }
  } catch (error) {
    console.error('[maintainer:sync-starter] retained failed worktree: ' + directory);
    throw error;
  }
  await operations.removeWorktree(root, directory);
  return { source: source.commit, directory };
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.help) {
    console.log(
      'Usage: npm run release:starter -- [--push] [--check] [--from=main] [--target=starter]\nGenerates and validates starter in an isolated worktree; main dependencies remain untouched.'
    );
    return;
  }
  session = await createMaintainerSession('starter sync');
  try {
    await runMain();
  } finally {
    await session.close();
  }
}

async function runMain() {
  const { checkOnly, push, allowAnyBranch, allowDirty, from, target } = parseArgs(
    process.argv.slice(2)
  );
  validateSyncBranches(from, target);
  validateManagedCoverage();
  const sourceRef = await resolveRefCandidates(from);
  const { localRef: targetLocalRef, compareRef: targetCompareRef } =
    await resolveBranchCandidates(target);
  const originalBranch = await currentBranch();

  if (checkOnly) {
    const { drift } = await preflightStarter({ from: sourceRef, target: targetCompareRef });
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
    // Preserve the failing check result while allowing main's finally to release the lock.
    process.exitCode = 1;
    return;
  }

  if (!targetLocalRef) {
    throw new Error(
      `[maintainer:sync-starter] local branch "${target}" is missing. Create it first (e.g. git branch ${target} origin/${target}).`
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

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  main().catch((error) => {
    console.error(error.message || error);
    console.error(
      '[maintainer:sync-starter] sync failed. Main was not switched; inspect the retained isolated worktree before retrying.'
    );
    process.exit(1);
  });
