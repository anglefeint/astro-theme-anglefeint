// One reviewed preparation bundle. Observational only: never stages or grants approval.
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { checkStarterStatic } from './starter-static.mjs';
import { planNpmTools } from './release-tool-plan.mjs';

const exec = promisify(execFile);

export function parseScope(status) {
  const records = status.split('\0');
  const files = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record) continue;
    assert(record.length > 3 && record[2] === ' ', 'Malformed Git status');
    const item = { status: record.slice(0, 2), path: record.slice(3) };
    if (/[RC]/.test(item.status)) {
      assert(records[i + 1], 'Missing rename source');
      item.previousPath = records[++i];
    }
    item.group = /^packages\/theme\/src\//.test(item.path)
      ? 'package-runtime'
      : /^tests\//.test(item.path)
        ? 'tests'
        : /^src\/content\//.test(item.path)
          ? 'demo-content'
          : /^scripts\/starter-templates\//.test(item.path)
            ? 'starter-templates'
            : /^(?:scripts|tools)\//.test(item.path)
              ? 'maintainer-tools'
              : /^(?:docs\/|README|CHANGELOG|UPGRADING|AGENTS|CLAUDE)/.test(item.path)
                ? 'documentation'
                : /^(?:package(?:-lock)?\.json|packages\/theme\/package\.json)$/.test(item.path)
                  ? 'package-metadata'
                  : 'review-other';
    files.push(item);
  }
  return files;
}

export async function prepareRelease(
  options,
  { root = process.cwd(), capture, staticCheck = checkStarterStatic, suggestDocs } = {}
) {
  root = await realpath(root);
  capture ??= async (args) =>
    (await exec('git', args, { cwd: root, maxBuffer: 8 * 1024 * 1024 })).stdout;
  const [branch, head, status] = await Promise.all([
    capture(['branch', '--show-current']),
    capture(['rev-parse', 'HEAD']),
    capture(['status', '--porcelain=v1', '-z', '--untracked-files=all']),
  ]);
  assert.equal(branch.trim(), 'main', 'Prepare the release on main.');
  const pkg = JSON.parse(await readFile(path.join(root, 'packages/theme/package.json'), 'utf8'));
  assert.equal(pkg.version, options.version, 'Prepare the intended package version first.');
  const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'));
  assert.equal(
    lock.packages?.['packages/theme']?.version,
    options.version,
    'Package lock version mismatch.'
  );
  const changelog = await readFile(path.join(root, 'CHANGELOG.md'), 'utf8');
  assert(changelog.includes(`## [${options.version}]`), 'Prepare the versioned changelog first.');
  const ledger = `docs/releases/${options.version}.md`;
  await readFile(path.join(root, ledger));
  const message = await realpath(path.resolve(root, options['message-file']));
  const relative = path.relative(root, message);
  assert(
    relative &&
      !relative.startsWith('..') &&
      !path.isAbsolute(relative) &&
      !relative.startsWith('.git' + path.sep),
    'Message file must be inside the workspace.'
  );
  const text = await readFile(message, 'utf8');
  assert(text.trim() && !text.includes('\0'), 'Invalid commit message.');
  const staticResult = await staticCheck({ root });
  const files = parseScope(status);
  const counts = {};
  for (const file of files) counts[file.group] = (counts[file.group] ?? 0) + 1;
  const evidence = path.join(root, 'acceptance-results');
  await capture(['check-ignore', '--no-index', path.join(evidence, 'release-prepare-probe')]);
  await mkdir(evidence, { recursive: true });
  const directory = await mkdtemp(path.join(evidence, 'release-prepare-'));
  const docInputs = files.flatMap((file) => [
    file.path,
    ...(file.previousPath ? [file.previousPath] : []),
  ]);
  const inputFile = path.join(directory, 'doc-inputs.json');
  await writeFile(inputFile, JSON.stringify(docInputs, null, 2) + '\n');
  suggestDocs ??= async () =>
    (
      await exec(
        process.execPath,
        [path.join(root, 'scripts/suggest-doc-updates.mjs'), '--files-from', inputFile],
        { cwd: root, maxBuffer: 8 * 1024 * 1024 }
      )
    ).stdout;
  const suggestions = await suggestDocs(docInputs);
  const plan = [
    'starter static distribution before expensive checks',
    ...planNpmTools([
      ...options.checks.filter((name) => name !== 'starter-static-check'),
      'npm-delivery',
    ]),
  ];
  const commandArgs = [
    'source',
    '--version',
    options.version,
    '--message-file',
    path.relative(root, path.join(directory, 'commit-message.txt')).split(path.sep).join('/'),
    ...options.checks.flatMap((x) => ['--check', x]),
    ...options.testFiles.flatMap((x) => ['--test', x]),
  ];
  const report = {
    schema: 1,
    observationalOnly: true,
    grantsApproval: false,
    skipsValidation: false,
    version: options.version,
    head: head.trim(),
    createdAt: new Date().toISOString(),
    counts,
    files,
    staticResult,
    documents: ['CHANGELOG.md', ledger],
    plan,
    sourceArgs: commandArgs,
    reviewOther: files.filter((x) => x.group === 'review-other').map((x) => x.path),
  };
  await Promise.all([
    writeFile(path.join(directory, 'scope.json'), JSON.stringify(report, null, 2) + '\n'),
    writeFile(path.join(directory, 'commit-message.txt'), text),
    writeFile(path.join(directory, 'plan.json'), JSON.stringify(commandArgs, null, 2) + '\n'),
    writeFile(path.join(directory, 'doc-suggestions.txt'), suggestions),
  ]);
  return { directory, counts, reviewOther: report.reviewOther, sourceArgs: commandArgs };
}
