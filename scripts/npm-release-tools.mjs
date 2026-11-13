#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { verifyPublishedPackage } from './verify-published-package.mjs';
import { auditDependencies } from './audit-dependencies.mjs';
import { createMaintainerSession } from './maintainer-session.mjs';
import {
  npmReleaseTools,
  planNpmTools,
  executeNpmToolPlan,
  validateToolSelection,
} from './release-tool-plan.mjs';

const repoRoot = process.cwd();
const packageName = '@anglefeint/astro-theme';

function runCapture(cmd, args, options = {}) {
  const [executable, finalArgs] = resolveCommand(cmd, args);
  const result = spawnSync(executable, finalArgs, {
    cwd: options.cwd ?? repoRoot,
    encoding: 'utf8',
    env: options.env ?? process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim();
    throw Object.assign(
      new Error(`${cmd} ${args.join(' ')} failed${detail ? `:\n${detail}` : ''}`),
      {
        code: result.error?.code,
        stdout: result.stdout,
        stderr: result.stderr,
        status: result.status,
      }
    );
  }

  return result.stdout.trim();
}

function resolveCommand(cmd, args) {
  if (process.platform === 'win32' && cmd === 'npm') {
    return ['cmd.exe', ['/d', '/s', '/c', 'npm', ...args]];
  }

  return [cmd, args];
}

async function cleanupTarball(tarballName) {
  if (!tarballName) return;
  const tarballPath = path.join(repoRoot, tarballName);
  if (!existsSync(tarballPath)) return;

  try {
    await rm(tarballPath, { force: true });
    console.log(`\n[release] Cleaned up ${tarballName}.`);
  } catch (error) {
    console.warn(
      `\n[release] Warning: failed to remove ${tarballName}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function readThemePackage() {
  const packageJson = readFileSync(path.join(repoRoot, 'packages/theme/package.json'), 'utf8');
  return JSON.parse(packageJson);
}

function resolveTarballName(pkg) {
  const safeName = String(pkg.name).replace(/^@/, '').replace(/\//g, '-');
  return `${safeName}-${pkg.version}.tgz`;
}

function compareSemver(a, b) {
  const left = parseSemver(a);
  const right = parseSemver(b);

  for (const key of ['major', 'minor', 'patch']) {
    if (left[key] !== right[key]) return left[key] > right[key] ? 1 : -1;
  }

  if (left.prerelease.length === 0 && right.prerelease.length === 0) return 0;
  if (left.prerelease.length === 0) return 1;
  if (right.prerelease.length === 0) return -1;

  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let i = 0; i < length; i += 1) {
    const leftPart = left.prerelease[i];
    const rightPart = right.prerelease[i];
    if (leftPart === undefined) return -1;
    if (rightPart === undefined) return 1;
    if (leftPart === rightPart) continue;

    const leftNumber = /^\d+$/.test(leftPart) ? Number(leftPart) : null;
    const rightNumber = /^\d+$/.test(rightPart) ? Number(rightPart) : null;
    if (leftNumber !== null && rightNumber !== null) {
      return leftNumber > rightNumber ? 1 : -1;
    }
    if (leftNumber !== null) return -1;
    if (rightNumber !== null) return 1;
    return leftPart > rightPart ? 1 : -1;
  }

  return 0;
}

function parseSemver(version) {
  const match = String(version).match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/
  );

  if (!match) {
    throw new Error(`Unsupported semver version: ${version}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ? match[4].split('.') : [],
  };
}

function verifyRegistryVersion(pkg, env, capture = runCapture) {
  console.log('\n[release] Checking npm registry version...');
  const latestVersion = capture('npm', ['view', pkg.name, 'version'], { env });

  if (compareSemver(pkg.version, latestVersion) <= 0) {
    throw new Error(
      `${pkg.name}@${pkg.version} is not newer than npm latest ${latestVersion}. ` +
        'Bump the workspace package version before running release:npm.'
    );
  }

  console.log(`[release] Local version ${pkg.version} is newer than npm latest ${latestVersion}.`);
}

export function createNpmOperations(
  opts,
  { pkg, npmEnv, cacheDir, session, run, capture = runCapture, audit = auditDependencies }
) {
  let publishedSource;
  return {
    ...Object.fromEntries(
      Object.entries(npmReleaseTools)
        .filter(([, tool]) => tool.script)
        .map(([name, tool]) => [name, () => run('npm', ['run', tool.script], { env: npmEnv })])
    ),
    'unit-tests': () =>
      run(process.execPath, ['--experimental-strip-types', '--test', ...opts.testFiles], {
        env: npmEnv,
      }),
    'registry-check': () =>
      opts.skipRegistryCheck
        ? undefined
        : session.stage('Verify registry version', () =>
            verifyRegistryVersion(pkg, npmEnv, capture)
          ),
    'audit-main': () => session.stage('Audit main dependencies', () => audit(repoRoot, npmEnv)),
    'source-check': () => run('npm', ['run', 'check'], { env: npmEnv }),
    'installed-check': () =>
      run('npm', ['run', 'check:installed', '--', '--audit'], { env: npmEnv }),
    'installed-build': () =>
      run('npm', ['run', 'check:installed', '--', '--audit', '--smoke-build'], { env: npmEnv }),
    'installed-matrix': () =>
      run('npm', ['run', 'check:installed', '--', '--audit', '--build'], { env: npmEnv }),
    pack: () => (opts.skipPack ? undefined : run('npm', ['run', 'theme:pack'], { env: npmEnv })),
    'npm-auth': () => (opts.dryRun ? undefined : run('npm', ['whoami'], { env: npmEnv })),
    'npm-upload': () => {
      if (!opts.dryRun) {
        publishedSource = capture('git', ['rev-parse', 'HEAD']);
        if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i.test(publishedSource))
          throw new Error('Cannot establish npm publication source');
      }
      return run(
        'npm',
        [
          'publish',
          '--access',
          'public',
          ...(opts.tag ? ['--tag', opts.tag] : []),
          ...(opts.dryRun ? ['--dry-run'] : []),
        ],
        { cwd: path.join(repoRoot, 'packages/theme'), env: npmEnv, interactive: true }
      );
    },
    'npm-delivery': () =>
      opts.dryRun
        ? undefined
        : session.stage('Verify published tag and downloaded package', (record) =>
            verifyPublishedPackage({
              name: pkg.name,
              version: pkg.version,
              tag: opts.tag || 'latest',
              capture: (args) => capture('npm', args, { env: npmEnv }),
              destination: cacheDir,
              expected: { source: publishedSource },
              onFailure: (failure) => (record.verificationFailures ??= []).push(failure),
              onWait: (ms) => {
                record.explicitWaitSeconds = (record.explicitWaitSeconds ?? 0) + ms / 1000;
              },
            })
          ),
  };
}

export async function runNpmTools(
  targets,
  opts = {},
  { session: suppliedSession, beforeUpload } = {}
) {
  const plan = planNpmTools(targets);
  validateToolSelection(plan, opts);
  for (const file of opts.testFiles ?? [])
    if (!existsSync(path.join(repoRoot, file))) throw new Error('Test file not found: ' + file);
  const session =
    suppliedSession ?? (await createMaintainerSession('maintainer tools: ' + targets.join(', ')));
  try {
    return await release(opts, plan, session, beforeUpload);
  } finally {
    if (!suppliedSession) await session.close();
  }
}

export async function executeNpmOperations(plan, operations, beforeUpload) {
  await executeNpmToolPlan(plan, async (name) => {
    console.log('[tool] ' + name);
    if (name === 'npm-upload') await beforeUpload?.();
    await operations[name]();
  });
}

async function release(opts, plan, session, beforeUpload) {
  const run = (cmd, args, options) => session.run(cmd, args, options);
  const pkg = readThemePackage();
  const tarballName = resolveTarballName(pkg);
  const cacheDir = mkdtempSync(path.join(tmpdir(), 'npm-cache-anglefeint-'));
  const npmEnv = { ...process.env, npm_config_cache: cacheDir };
  try {
    if (opts.tag && opts.tag.trim().length === 0)
      throw new Error('--tag requires a non-empty value.');
    if (pkg.name !== packageName) throw new Error('Unexpected theme package name.');
    const operations = createNpmOperations(opts, { pkg, npmEnv, cacheDir, session, run });
    await executeNpmOperations(plan, operations, beforeUpload);
    if (plan.includes('npm-delivery') && !opts.dryRun)
      console.log(
        '[release] npm verified. Record selected technical checks and source/starter/tag/announcement identities. Demo acceptance belongs to the user; do not launch browser or hosting checks.'
      );
    return plan;
  } finally {
    if (plan.includes('pack') && !opts.skipPack) await cleanupTarball(tarballName);
    await rm(cacheDir, { force: true, recursive: true });
  }
}
