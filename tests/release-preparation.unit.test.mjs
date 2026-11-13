import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { prepareRelease, parseScope } from '../scripts/release-preparation.mjs';
import { parseFlowArgs } from '../scripts/release-flow.mjs';

const exec = promisify(execFile);
const options = {
  version: '1.2.3',
  'message-file': 'acceptance-results/message.txt',
  checks: ['docs-check'],
  testFiles: [],
};
test('scope handles literal names, staged renames and unknown review groups', () => {
  const scope = parseScope(
    'R  docs/new name.md\0docs/old.md\0?? odd\nfile.txt\0 M tests/test.mjs\0'
  );
  assert.equal(scope[0].previousPath, 'docs/old.md');
  assert.equal(scope[1].path, 'odd\nfile.txt');
  assert.equal(scope[1].group, 'review-other');
  assert.equal(scope[2].group, 'tests');
  assert.throws(() => parseScope('R  new\0'), /rename source/);
});

test('prepare writes one ignored review bundle without staging, publishing or changing source', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-prepare-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = async (...args) => (await exec('git', args, { cwd: root })).stdout;
  for (const dir of ['packages/theme', 'docs/releases', 'acceptance-results'])
    await mkdir(path.join(root, dir), { recursive: true });
  await writeFile(path.join(root, '.gitignore'), 'acceptance-results/\n');
  await writeFile(path.join(root, 'packages/theme/package.json'), '{"version":"1.2.3"}');
  await writeFile(
    path.join(root, 'package-lock.json'),
    '{"packages":{"packages/theme":{"version":"1.2.3"}}}'
  );
  await writeFile(path.join(root, 'CHANGELOG.md'), '## [1.2.3]\n');
  await writeFile(path.join(root, 'docs/releases/1.2.3.md'), 'Release scope');
  await writeFile(
    path.join(root, options['message-file']),
    'Release with literal `code` and $()\n'
  );
  await git('init', '-b', 'main');
  await git('config', 'user.name', 'Fixture');
  await git('config', 'user.email', 'fixture@example.invalid');
  await git('add', '.');
  await git('commit', '-m', 'fixture');
  await writeFile(path.join(root, 'new file.txt'), 'untracked');
  const before = await git('status', '--porcelain');
  const result = await prepareRelease(options, {
    root,
    staticCheck: async () => ({ readmes: 9 }),
    suggestDocs: async (files) => 'review: ' + files.join(','),
  });
  assert.equal(await git('status', '--porcelain'), before);
  assert.equal(
    await readFile(path.join(result.directory, 'commit-message.txt'), 'utf8'),
    'Release with literal `code` and $()\n'
  );
  const report = JSON.parse(await readFile(path.join(result.directory, 'scope.json')));
  assert.equal(report.grantsApproval, false);
  assert.equal(report.skipsValidation, false);
  assert.deepEqual(report.reviewOther, ['new file.txt']);
  assert.match(
    await readFile(path.join(result.directory, 'doc-suggestions.txt'), 'utf8'),
    /new file.txt/
  );
  assert.equal(result.sourceArgs[0], 'source');
  await assert.rejects(prepareRelease({ ...options, version: '2.0.0' }, { root }), /version first/);
  await assert.rejects(
    prepareRelease(options, {
      root,
      staticCheck: async () => {
        throw new Error('static failed');
      },
    }),
    /static failed/
  );
});

test('prepare is explicit and cannot use publication execution flags', () => {
  assert.equal(
    parseFlowArgs([
      'prepare',
      '--version',
      '1.2.3',
      '--message-file',
      'msg',
      '--check',
      'docs-check',
    ]).execute,
    false
  );
  assert.throws(
    () =>
      parseFlowArgs([
        'prepare',
        '--version',
        '1.2.3',
        '--message-file',
        'msg',
        '--check',
        'docs-check',
        '--execute',
      ]),
    /never accepts/
  );
});

test('documentation inputs bypass shell length limits and preserve literal names', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-doc-inputs-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const inputFile = path.join(root, 'inputs.json');
  const inputs = [
    ...Array.from({ length: 600 }, (_, i) => `src/content/blog/zh/${i}-${'x'.repeat(80)}.md`),
    'docs/literal space\n中文.md',
  ];
  await writeFile(inputFile, JSON.stringify(inputs));
  const helper = fileURLToPath(new URL('../scripts/suggest-doc-updates.mjs', import.meta.url));
  const run = () =>
    exec(process.execPath, [helper, '--files-from', inputFile, '--json'], {
      cwd: root,
      maxBuffer: 4 * 1024 * 1024,
    });
  const result = JSON.parse((await run()).stdout);
  assert.deepEqual(result.changedFiles, inputs);
  await writeFile(inputFile, '[]');
  assert.deepEqual(
    JSON.parse((await run()).stdout).changedFiles,
    [],
    'explicit empty inputs do not fall back to Git'
  );
  await writeFile(inputFile, '{}');
  await assert.rejects(run(), /JSON string array/);
});
