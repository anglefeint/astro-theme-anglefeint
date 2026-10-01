import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { articleAlternateFixtures, checkArticleAlternates } from './check-article-alternates.mjs';

const exec = promisify(execFile);
const root = process.cwd();
const npmCli = process.env.npm_execpath;
assert(npmCli, 'Run via npm run check:upgrade');
const parent = await realpath(tmpdir());
const temporary = await mkdtemp(path.join(parent, 'anglefeint-upgrade-'));
const evidence = path.join(root, 'acceptance-results', `upgrade-${Date.now()}`);
await mkdir(evidence, { recursive: true });
const results = [];
const env = { ...process.env, NODE_OPTIONS: '', NODE_PATH: '', ANGLEFEINT_LOCALES: '' };
for (const key of Object.keys(env)) if (key.startsWith('PUBLIC_SITE_')) delete env[key];
async function run(command, args, cwd) {
  const label = `${command === process.execPath ? 'npm' : command} ${args.join(' ')}`;
  try {
    const output = await exec(command, args, {
      cwd,
      env,
      timeout: 600000,
      maxBuffer: 40 * 1024 * 1024,
    });
    await writeFile(path.join(evidence, `${results.length}.log`), output.stdout + output.stderr);
    results.push({ command: label, passed: true });
    return output.stdout;
  } catch (error) {
    await writeFile(
      path.join(evidence, `${results.length}.log`),
      (error.stdout ?? '') + (error.stderr ?? '')
    );
    results.push({ command: label, passed: false });
    throw error;
  }
}
const npm = (args, cwd) => run(process.execPath, [npmCli, ...args], cwd);
async function sourceHashes(project) {
  const files = (await readdir(path.join(project, 'src'), { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
  return Promise.all(
    files.map(async (file) => [
      path.relative(project, file),
      createHash('sha256')
        .update(await readFile(file))
        .digest('hex'),
    ])
  );
}
let passed = false;
try {
  const pack = JSON.parse(
    await npm(
      ['pack', '--workspace', '@anglefeint/astro-theme', '--json', '--pack-destination', temporary],
      root
    )
  );
  const tarball = path.join(temporary, pack[0].filename);
  // Real distribution snapshots, not today's adapters overlaid onto an old route.
  for (const [version, ref] of [
    ['0.8.3', 'ddd297330c0632aa4902f620ac6ce0d2d6f4fc6f'],
    ['0.8.4', '143e8e1553b4c2bf2db3e8b1d72acf267b9a6fff'],
  ]) {
    console.log(`Package-only upgrade from starter ${version} (${ref.slice(0, 7)})`);
    const project = path.join(temporary, version);
    await mkdir(project);
    const archive = path.join(temporary, `${version}.tar`);
    await run('git', ['archive', '--format=tar', `--output=${archive}`, ref], root);
    await run('tar', ['-xf', archive, '-C', project], root);
    const before = await sourceHashes(project);
    await npm(['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], project);
    assert.deepEqual(
      await sourceHashes(project),
      before,
      'npm upgrade must not rewrite source/config/content'
    );
    await npm(['audit', '--audit-level=low', '--prefer-online'], project);
    for (const [slug, locales] of articleAlternateFixtures)
      await npm(['run', 'new-post', '--', slug, '--locales', locales.join(',')], project);
    const fixtures = await sourceHashes(project);
    await npm(['run', 'check'], project);
    await checkArticleAlternates(project, 'en');
    assert.deepEqual(await sourceHashes(project), fixtures, 'build must not rewrite user files');
    results.push({
      baseline: version,
      ref,
      themeVersion: pack[0].version,
      sourcePreserved: true,
      alternatesPassed: true,
    });
    console.log(
      `Starter ${version}: upgrade, audit, check/build and article/menu assertions passed; source unchanged.`
    );
  }
  passed = true;
} finally {
  await writeFile(
    path.join(evidence, 'report.json'),
    JSON.stringify({ passed, results, temporary }, null, 2)
  );
  console.log(`Evidence: ${evidence}`);
  if (passed) {
    assert.equal(path.dirname(temporary), parent);
    assert(path.basename(temporary).startsWith('anglefeint-upgrade-'));
    await rm(temporary, { recursive: true, force: true });
  } else console.log(`Failed upgrade fixtures retained: ${temporary}`);
}
