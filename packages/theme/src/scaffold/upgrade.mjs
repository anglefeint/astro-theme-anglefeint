import { readFile, writeFile, mkdir, copyFile, access, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import process from 'node:process';
import semver from 'semver';

const exec = promisify(execFile);
export const PROJECT_SCHEMA = 1;
const PACKAGE = '@anglefeint/astro-theme';

export async function npmCommand(args, root) {
  const cli = /(?:^|[\\/])npm-cli\.js$/.test(process.env.npm_execpath ?? '')
    ? process.env.npm_execpath
    : undefined;
  const command = cli ? process.execPath : process.platform === 'win32' ? 'cmd.exe' : 'npm';
  const argv = cli
    ? [cli, ...args]
    : process.platform === 'win32'
      ? ['/d', '/s', '/c', 'npm', ...args]
      : args;
  const result = await exec(command, argv, { cwd: root, maxBuffer: 20 * 1024 * 1024 });
  return result.stdout;
}

export async function inspectIntegrationProject(root) {
  const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  if (pkg.anglefeint?.projectSchema !== PROJECT_SCHEMA) {
    throw new Error(
      'This is not a supported integration starter (projectSchema 1). For pre-0.27 projects, create a fresh starter and migrate site config, articles, music and images. No files were changed.'
    );
  }
  if (!pkg.dependencies?.[PACKAGE]) throw new Error(`Missing dependency ${PACKAGE}.`);
  const config = await readFile(path.join(root, 'astro.config.mjs'), 'utf8');
  if (!config.includes(`${PACKAGE}/integration`))
    throw new Error('The project must use the Anglefeint integration.');
  await access(path.join(root, 'src/site.config.ts'));
  return pkg;
}

async function requireNpmProject(root) {
  for (const file of ['pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb']) {
    try {
      await access(path.join(root, file));
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    throw new Error(
      `Found ${file}. This updater supports npm projects only; preserve your package manager and update dependencies deliberately.`
    );
  }
  try {
    await access(path.join(root, 'package-lock.json'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    throw new Error(
      'A package-lock.json is required for recoverable upgrades. Run npm install first, then retry. No files changed.'
    );
  }
}

/** Update dependencies only. User source/assets/configuration are never rewritten. */
export async function upgradeProject({
  root = process.cwd(),
  target = 'latest',
  check = false,
  run = npmCommand,
  log = console.log,
} = {}) {
  if (!/^(?:\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?|[a-zA-Z][a-zA-Z0-9-]*)$/.test(target)) {
    throw new Error('Target must be an exact version or npm dist-tag.');
  }
  const pkg = await inspectIntegrationProject(root);
  if (pkg.workspaces)
    throw new Error(
      'Run consumer upgrades in a personal-blog project, not the theme maintainer workspace.'
    );
  await requireNpmProject(root);
  const metadata = JSON.parse(await run(['view', `${PACKAGE}@${target}`, '--json'], root));
  if (metadata.name !== PACKAGE || !semver.valid(metadata.version))
    throw new Error('Unexpected npm package metadata.');
  if (metadata.anglefeint?.projectSchema !== PROJECT_SCHEMA)
    throw new Error(
      'Target requires a different starter schema. Read its migration guide before updating; no files changed.'
    );
  if (!semver.satisfies(process.versions.node, metadata.engines?.node ?? '*'))
    throw new Error('Target requires a newer Node.js version; update Node first.');
  const astro = JSON.parse(
    await readFile(path.join(root, 'node_modules/astro/package.json'), 'utf8')
  );
  if (!semver.satisfies(astro.version, metadata.peerDependencies?.astro ?? '*'))
    throw new Error(
      'Target requires an Astro migration. Update Astro deliberately before retrying; no files changed.'
    );
  const current = JSON.parse(
    await readFile(path.join(root, 'node_modules/@anglefeint/astro-theme/package.json'), 'utf8')
  );
  if (semver.gt(current.version, metadata.version))
    throw new Error('Automatic downgrades are not supported.');
  log(
    `Anglefeint ${current.version} -> ${metadata.version}; project schema ${PROJECT_SCHEMA}. User configuration and content are retained.`
  );
  if (check) return { version: metadata.version, changed: false };
  const backup = path.join(root, '.anglefeint', 'backups', `${Date.now()}-${randomUUID()}`);
  await mkdir(backup, { recursive: true });
  const saved = new Map();
  for (const filename of ['package.json', 'package-lock.json']) {
    try {
      saved.set(filename, await readFile(path.join(root, filename)));
      await copyFile(path.join(root, filename), path.join(backup, filename));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  log(`Dependency backup: ${backup}`);
  try {
    // Exact resolution before choosing the future compatible range; never install an unchecked tag.
    await run(
      ['install', `${PACKAGE}@${metadata.version}`, '--save-exact', '--ignore-scripts'],
      root
    );
    const updated = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
    if (updated.anglefeint?.projectSchema !== PROJECT_SCHEMA)
      throw new Error('Project schema changed unexpectedly.');
    await run(['run', 'doctor'], root);
  } catch (error) {
    for (const filename of ['package.json', 'package-lock.json']) {
      if (saved.has(filename)) await writeFile(path.join(root, filename), saved.get(filename));
      else await rm(path.join(root, filename), { force: true });
    }
    try {
      await run(
        saved.has('package-lock.json')
          ? ['ci', '--ignore-scripts']
          : ['install', '--ignore-scripts'],
        root
      );
    } catch (restoreError) {
      throw new Error(
        `Upgrade failed: ${error.message}. Dependency files restored; reinstall failed: ${restoreError.message}. Do not deploy dist/: it may contain an incomplete build. Recover dependencies and rerun npm run doctor. Backup: ${backup}`,
        { cause: error }
      );
    }
    throw new Error(
      `Upgrade failed; previous dependencies restored. ${error.message}. Do not deploy dist/: it may contain an incomplete build. Rerun npm run doctor before deploying. Backup: ${backup}`,
      { cause: error }
    );
  }
  log('Upgrade and doctor completed. Deploy the rebuilt dist/ using your normal hosting workflow.');
  return { version: metadata.version, changed: true, backup };
}
