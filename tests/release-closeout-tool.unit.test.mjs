import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  announcementBody,
  parseCloseoutArgs,
  prepareCloseout,
  repositoryFromOrigin,
  verifyCloseout,
} from '../scripts/release-closeout.mjs';

const version = '0.36.0';
const source = 'a'.repeat(40),
  starter = 'b'.repeat(40),
  main = 'c'.repeat(40);
const name = '@anglefeint/astro-theme';
const dist = { integrity: 'sha512-YWJj', shasum: 'd'.repeat(40) };
const options = { version, source, starter, sessions: [] };

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-closeout-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'docs/releases'), { recursive: true });
  await mkdir(path.join(root, 'acceptance-results/session'), { recursive: true });
  await writeFile(
    path.join(root, `docs/releases/${version}.md`),
    '---\ndoc_id: release\n---\n# Release\n\n[Upgrade](../../UPGRADING.md#next)\n'
  );
  await writeFile(
    path.join(root, 'acceptance-results/session/summary.json'),
    JSON.stringify({
      seconds: 15,
      stages: [
        { status: 'failed', seconds: 10 },
        { status: 'passed', seconds: 5 },
      ],
    })
  );
  const state = {
    tag: false,
    main,
    starter,
    branch: 'main',
    dirty: '',
    ancestor: true,
    integrity: dist.integrity,
    lockVersion: version,
    lockRange: `^${version}`,
    registrySource: source,
    latest: version,
    releaseBody: '',
    draft: false,
    prerelease: false,
    tagSource: source,
    repo: 'git@github.com:anglefeint/astro-theme-anglefeint.git',
  };
  const calls = [];
  const capture = async (command, args) => {
    calls.push([command, ...args]);
    if (command === 'npm') {
      assert.equal(args[0], 'view');
      assert.ok(args.includes('--prefer-online'));
      return JSON.stringify({
        name,
        version,
        gitHead: state.registrySource,
        'dist-tags': { latest: state.latest },
        dist,
      });
    }
    if (command === 'gh') {
      assert.deepEqual(args.slice(0, 3), ['release', 'view', `v${version}`]);
      return JSON.stringify({
        tagName: `v${version}`,
        isDraft: state.draft,
        isPrerelease: state.prerelease,
        url: `https://github.com/anglefeint/astro-theme-anglefeint/releases/tag/v${version}`,
        body: state.releaseBody,
        publishedAt: '2026-11-13T00:00:00Z',
      });
    }
    assert.equal(command, 'git');
    switch (args[0]) {
      case 'branch':
        return state.branch;
      case 'status':
        return state.dirty;
      case 'rev-parse':
        return state.main;
      case 'remote':
        return state.repo;
      case 'merge-base':
        if (!state.ancestor) throw new Error('Source is not an ancestor');
        return '';
      case 'ls-remote':
        return (
          `${state.remoteMain ?? state.main}\trefs/heads/main\n${state.starter}\trefs/heads/starter\n` +
          (state.tag
            ? `${'e'.repeat(40)}\trefs/tags/v${version}\n${state.tagSource}\trefs/tags/v${version}^{}\n`
            : '')
        );
      case 'show': {
        if (args[1] === `${source}:packages/theme/package.json`)
          return JSON.stringify({ name, version });
        if (args[1] === `${starter}:package.json`)
          return JSON.stringify({ dependencies: { [name]: `^${version}` } });
        if (args[1] === `${starter}:package-lock.json`)
          return JSON.stringify({
            packages: {
              '': { dependencies: { [name]: state.lockRange } },
              [`node_modules/${name}`]: { version: state.lockVersion, integrity: state.integrity },
            },
          });
        throw new Error('Unexpected source read');
      }
      default:
        throw new Error('Mutation or unexpected command: ' + args.join(' '));
    }
  };
  return { root, state, calls, capture, now: () => '2026-11-13T00:00:00Z' };
}

test('closeout arguments are explicit, stable-only and cannot select mutation commands', () => {
  assert.deepEqual(parseCloseoutArgs(['--help']), { help: true });
  assert.deepEqual(
    parseCloseoutArgs(['prepare', '--version', version, '--source', source, '--starter', starter]),
    { mode: 'prepare', ...options }
  );
  assert.equal(
    parseCloseoutArgs(['verify', '--receipt', 'acceptance-results/example/receipt.json']).mode,
    'verify'
  );
  for (const args of [
    [],
    ['publish'],
    ['prepare', '--version', version],
    ['verify'],
    ['verify', '--receipt', 'a', '--receipt', 'b'],
    ['verify', '--publish'],
    ['prepare', '--version', '0.36.0-beta.1', '--source', source, '--starter', starter],
    ['prepare', '--version', '../x', '--source', source, '--starter', starter],
  ])
    assert.throws(() => parseCloseoutArgs(args));
});

test('origin and Markdown links resolve within the actual GitHub repository, leaving code intact', () => {
  const repo = repositoryFromOrigin('git@github.example.com:team/theme.git');
  assert.deepEqual(repo, {
    url: 'https://github.example.com/team/theme',
    gh: 'github.example.com/team/theme',
  });
  assert.equal(
    repositoryFromOrigin('ssh://git@github.com/team/theme.git').gh,
    'github.com/team/theme'
  );
  assert.throws(() => repositoryFromOrigin('https://token:secret@github.com/team/theme.git'));
  assert.throws(() => repositoryFromOrigin('https://github.com/team/theme/extra'));
  const markdown =
    '---\nsecret: metadata\n---\n# Notes\n\n[Upgrade](../../UPGRADING.md#next)\n\n[Audit][audit]\n\n[audit]: ../CODE_DOC_AUDIT.md\n\n```md\n[Example](../leave.md)\n```\n';
  const result = announcementBody(markdown, repo, version);
  assert.ok(!result.includes('secret: metadata'));
  assert.match(result, /https:\/\/github.example.com\/team\/theme\/blob\/main\/UPGRADING.md#next/);
  assert.ok(
    result.includes(
      '[audit]: https://github.example.com/team/theme/blob/main/docs/CODE_DOC_AUDIT.md'
    )
  );
  assert.ok(result.includes('[Example](../leave.md)'));
  assert.throws(
    () => announcementBody('<a href="../relative.html">HTML</a>', repo, version),
    /absolute URLs/
  );
});

test('prepare aggregates fresh identities and explicit observational sessions; verify reads back exact announcement', async (t) => {
  const f = await fixture(t);
  const prepared = await prepareCloseout(
    { ...options, sessions: ['acceptance-results/session/summary.json'] },
    f
  );
  const notes = await readFile(path.join(prepared.output, 'notes.md'), 'utf8');
  assert.equal(prepared.receipt.status, 'prepared');
  assert.equal(prepared.receipt.observationalOnly, true);
  assert.equal(prepared.receipt.sessions[0].stages[0].status, 'failed');
  assert.ok(notes.includes('| 1 | 15 | 1 | 1 |'));
  assert.ok(notes.includes(`--template anglefeint/astro-theme-anglefeint#starter`));
  assert.ok(!notes.includes('session/summary.json'));
  assert.ok(
    !f.calls.some((call) =>
      ['publish', 'pack', 'install', 'push', 'tag', 'commit', 'checkout', 'run'].includes(call[1])
    )
  );
  f.state.tag = true;
  f.state.releaseBody = notes;
  const before = f.calls.length;
  const verified = await verifyCloseout({ receipt: path.join(prepared.output, 'receipt.json') }, f);
  assert.equal(verified.receipt.status, 'identity-verified');
  assert.ok(
    f.calls.slice(before).some((call) => call[0] === 'npm'),
    'Verification must refetch metadata, never trust the old receipt'
  );
  assert.equal(
    JSON.parse(await readFile(path.join(prepared.output, 'receipt.json'), 'utf8')).status,
    'prepared'
  );
});

test('prepare blocks dirty/unpushed source, mismatched starter/registry/tag identities and writes no partial output', async (t) => {
  for (const change of [
    { branch: 'starter' },
    { dirty: ' M file' },
    { remoteMain: 'f'.repeat(40) },
    { starter: 'f'.repeat(40) },
    { ancestor: false },
    { registrySource: 'f'.repeat(40) },
    { latest: '0.35.0' },
    { lockVersion: '0.35.0' },
    { lockRange: '^0.35.0' },
    { integrity: 'sha512-wrong' },
    { tag: true, tagSource: 'f'.repeat(40) },
  ]) {
    const f = await fixture(t);
    Object.assign(f.state, change);
    await assert.rejects(prepareCloseout(options, f));
    assert.ok(
      !(await readdir(path.join(f.root, 'acceptance-results'))).some((name) =>
        name.startsWith('release-closeout-')
      )
    );
  }
});

test('verify rejects missing/moved tags, changed checkout/origin, drafts, prerelease and altered announcement', async (t) => {
  for (const change of [
    { tag: false },
    { tagSource: 'f'.repeat(40) },
    { main: 'f'.repeat(40) },
    { repo: 'git@github.com:other/theme.git' },
    { dirty: '?? file' },
    { draft: true },
    { prerelease: true },
    { releaseBody: 'wrong notes' },
  ]) {
    const f = await fixture(t);
    const prepared = await prepareCloseout(options, f);
    Object.assign(
      f.state,
      { tag: true, releaseBody: await readFile(path.join(prepared.output, 'notes.md'), 'utf8') },
      change
    );
    await assert.rejects(
      verifyCloseout({ receipt: path.join(prepared.output, 'receipt.json') }, f)
    );
  }
});

test('evidence outside acceptance-results and modified prepared notes cannot become a verified receipt', async (t) => {
  const f = await fixture(t);
  await writeFile(path.join(f.root, 'outside.json'), JSON.stringify({ seconds: 1, stages: [] }));
  await assert.rejects(
    prepareCloseout({ ...options, sessions: ['outside.json'] }, f),
    /inside acceptance-results/
  );
  await assert.rejects(verifyCloseout({ receipt: 'outside.json' }, f), /inside acceptance-results/);
  const prepared = await prepareCloseout(options, f);
  f.state.tag = true;
  await writeFile(path.join(prepared.output, 'notes.md'), 'changed');
  await assert.rejects(
    verifyCloseout({ receipt: path.join(prepared.output, 'receipt.json') }, f),
    /notes changed/
  );
});

test('junctions cannot redirect evidence reads or generated closeout files outside the workspace', async (t) => {
  const f = await fixture(t);
  const external = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-closeout-external-'));
  t.after(() => rm(external, { recursive: true, force: true }));
  const link = path.join(f.root, 'acceptance-results/linked');
  await writeFile(path.join(external, 'summary.json'), JSON.stringify({ seconds: 0, stages: [] }));
  await symlink(external, link, 'junction');
  await assert.rejects(
    prepareCloseout({ ...options, sessions: ['acceptance-results/linked/summary.json'] }, f),
    /inside acceptance-results/
  );
  await rm(link);
  const redirectedRoot = path.join(f.root, 'redirected');
  await mkdir(redirectedRoot);
  await symlink(external, path.join(redirectedRoot, 'acceptance-results'), 'junction');
  await assert.rejects(
    verifyCloseout(
      { receipt: path.join(external, 'summary.json') },
      { ...f, root: redirectedRoot }
    ),
    /inside the workspace/
  );
  assert.deepEqual(await readdir(external), ['summary.json']);
});
