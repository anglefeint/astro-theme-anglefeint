#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import { fromMarkdown } from 'mdast-util-from-markdown';
import matter from './parse-frontmatter.mjs';
import { collectLinks } from './check-readme-links.mjs';
import { createMaintainerSession } from './maintainer-session.mjs';

const exec = promisify(execFile);
const packageName = '@anglefeint/astro-theme';
const sha = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i;
const versionPattern = /^\d+\.\d+\.\d+$/;
const usage = `Usage: npm run release:closeout -- prepare --version <version> --source <sha> --starter <sha> [--session acceptance-results/<session>/summary.json ...]
       npm run release:closeout -- verify --receipt acceptance-results/<closeout>/receipt.json
Prepare collects fresh identities and writes announcement notes plus an observational receipt.
Verify reads back the source tag, remote branches and GitHub Release body.
Stable releases only. Neither mode publishes, commits, pushes, installs, downloads npm tarballs or runs validation suites.
Run the selected technical checks and canonical npm download verifier first; receipts never skip gates.`;

export function parseCloseoutArgs(argv) {
  if (argv.length === 1 && ['--help', '-h'].includes(argv[0])) return { help: true };
  const [mode, ...args] = argv;
  if (!['prepare', 'verify'].includes(mode)) throw new Error('Choose prepare or verify.');
  const result = { mode, sessions: [] };
  const allowed = new Set(
    mode === 'prepare' ? ['version', 'source', 'starter', 'session'] : ['receipt']
  );
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].slice(2);
    if (!args[i].startsWith('--') || !allowed.has(key) || (key !== 'session' && key in result))
      throw new Error('Unknown or duplicate closeout argument.');
    const value = args[i + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing --${key} value.`);
    if (key === 'session') result.sessions.push(value);
    else result[key] = value;
  }
  if (mode === 'prepare') validateIdentity(result);
  else if (!result.receipt) throw new Error('verify requires --receipt.');
  return result;
}

function validateIdentity({ version, source, starter }) {
  if (!versionPattern.test(version ?? '') || !sha.test(source ?? '') || !sha.test(starter ?? ''))
    throw new Error('An exact version, npm source SHA and delivered starter SHA are required.');
}

export function repositoryFromOrigin(origin) {
  const normalized = origin.startsWith('git@')
    ? origin.replace(/^git@([^:]+):/, 'https://$1/')
    : origin;
  const url = new URL(normalized);
  if (
    !['https:', 'ssh:'].includes(url.protocol) ||
    url.password ||
    (url.username && url.username !== 'git')
  )
    throw new Error('Use a credential-free GitHub origin URL.');
  const parts = url.pathname
    .replace(/\.git\/?$/, '')
    .split('/')
    .filter(Boolean);
  if (parts.length !== 2 || parts.some((part) => !/^[\w.-]+$/.test(part)) || url.search || url.hash)
    throw new Error('Cannot resolve GitHub repository from origin.');
  return { url: `https://${url.host}/${parts.join('/')}`, gh: `${url.host}/${parts.join('/')}` };
}

function isInside(parent, target) {
  const rel = path.relative(parent, target);
  return Boolean(rel) && rel !== '..' && !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel);
}

async function evidenceParent(root) {
  await mkdir(path.join(root, 'acceptance-results'), { recursive: true });
  const parent = await realpath(path.join(root, 'acceptance-results'));
  if (!isInside(await realpath(root), parent))
    throw new Error('acceptance-results must resolve inside the workspace.');
  return parent;
}

async function evidenceFile(root, file) {
  const parent = await evidenceParent(root);
  const target = await realpath(path.resolve(root, file));
  if (!isInside(parent, target))
    throw new Error('Evidence files must stay inside acceptance-results.');
  return target;
}

function digest(text) {
  return createHash('sha256').update(text).digest('hex');
}

// Resolve only actual Markdown destinations; code fences containing link examples stay intact.
export function announcementBody(markdown, repository, version) {
  const body = matter(markdown).content.trim();
  const edits = [];
  function visit(node) {
    if (
      ['link', 'image', 'definition'].includes(node.type) &&
      !/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(node.url)
    ) {
      const raw = body.slice(node.position.start.offset, node.position.end.offset);
      const from = node.type === 'definition' ? raw.indexOf(':') + 1 : raw.lastIndexOf('](') + 2;
      const offset = raw.indexOf(node.url, from);
      if (offset < from)
        throw new Error('Normalize relative Markdown link syntax before closeout.');
      const url = new URL(node.url, `https://relative.invalid/docs/releases/${version}.md`);
      edits.push({
        start: node.position.start.offset + offset,
        length: node.url.length,
        text: `${repository.url}/blob/main${url.pathname}${url.search}${url.hash}`,
      });
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(fromMarkdown(body));
  let result = body;
  for (const edit of edits.sort((a, b) => b.start - a.start))
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.start + edit.length);
  if (collectLinks(result).some((url) => !/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(url)))
    throw new Error('Use absolute URLs for HTML links in release notes.');
  return result;
}

async function settledReads(reads) {
  const results = await Promise.allSettled(reads);
  const failed = results.find((result) => result.status === 'rejected');
  if (failed) throw failed.reason;
  return results.map((result) => result.value);
}

async function readIdentities(options, capture) {
  validateIdentity(options);
  const { version, source, starter } = options;
  const [branch, dirty, main, origin, refsText, sourceText, starterText, lockText, registryText] =
    await settledReads([
      capture('git', ['branch', '--show-current']),
      capture('git', ['status', '--porcelain']),
      capture('git', ['rev-parse', 'HEAD']),
      capture('git', ['remote', 'get-url', 'origin']),
      capture('git', [
        'ls-remote',
        'origin',
        'refs/heads/main',
        'refs/heads/starter',
        `refs/tags/v${version}`,
        `refs/tags/v${version}^{}`,
      ]),
      capture('git', ['show', `${source}:packages/theme/package.json`]),
      capture('git', ['show', `${starter}:package.json`]),
      capture('git', ['show', `${starter}:package-lock.json`]),
      capture('npm', [
        'view',
        `${packageName}@${version}`,
        '--json',
        '--prefer-online',
        '--fetch-retries=0',
        '--fetch-timeout=15000',
      ]),
      capture('git', ['merge-base', '--is-ancestor', source, 'HEAD']),
    ]);
  assert.equal(branch.trim(), 'main', 'Closeout must run on main.');
  assert.equal(
    dirty.trim(),
    '',
    'Commit/push source and any meaningful document corrections before closeout.'
  );
  const refs = Object.fromEntries(
    refsText
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [commit, ref] = line.split(/\s+/);
        assert.ok(sha.test(commit) && ref, 'Invalid remote ref response.');
        return [ref, commit];
      })
  );
  assert.equal(refs['refs/heads/main'], main.trim(), 'Remote main does not match local HEAD.');
  assert.equal(refs['refs/heads/starter'], starter, 'Remote starter does not match delivered SHA.');
  const tagSource = refs[`refs/tags/v${version}^{}`] ?? refs[`refs/tags/v${version}`];
  if (tagSource)
    assert.equal(tagSource, source, 'An existing source tag points elsewhere; never move it.');
  const sourcePackage = JSON.parse(sourceText);
  assert.equal(sourcePackage.name, packageName);
  assert.equal(sourcePackage.version, version, 'Source package version mismatch.');
  const starterPackage = JSON.parse(starterText);
  const lock = JSON.parse(lockText);
  assert.equal(
    starterPackage.dependencies?.[packageName],
    `^${version}`,
    'Starter dependency range mismatch.'
  );
  assert.equal(
    lock.packages?.['']?.dependencies?.[packageName],
    `^${version}`,
    'Starter lock range mismatch.'
  );
  const installed = lock.packages?.[`node_modules/${packageName}`];
  assert.equal(installed?.version, version, 'Starter resolved package version mismatch.');
  const registry = JSON.parse(registryText);
  assert.equal(registry.name, packageName);
  assert.equal(registry.version, version);
  assert.equal(registry.gitHead, source, 'Registry source mismatch.');
  assert.equal(registry['dist-tags']?.latest, version, 'Stable latest tag does not match release.');
  assert.match(registry.dist?.shasum ?? '', /^[a-f0-9]{40}$/i);
  assert.match(registry.dist?.integrity ?? '', /^sha(?:256|384|512)-[A-Za-z0-9+/]+={0,2}$/);
  assert.equal(installed?.integrity, registry.dist.integrity, 'Starter lock integrity mismatch.');
  return {
    main: main.trim(),
    repository: repositoryFromOrigin(origin.trim()),
    refs,
    tagSource,
    registry: {
      name: registry.name,
      version,
      gitHead: registry.gitHead,
      dist: { shasum: registry.dist.shasum, integrity: registry.dist.integrity },
    },
  };
}

export async function prepareCloseout(
  options,
  { root = process.cwd(), capture, now = () => new Date().toISOString() } = {}
) {
  const identity = await readIdentities(options, capture);
  const markdown = await readFile(
    path.join(root, 'docs/releases', `${options.version}.md`),
    'utf8'
  );
  const sessions = [];
  for (const file of [...new Set(options.sessions ?? [])]) {
    const location = await evidenceFile(root, file);
    const summary = JSON.parse(await readFile(location, 'utf8'));
    assert.ok(
      Array.isArray(summary.stages) && Number.isFinite(summary.seconds) && summary.seconds >= 0,
      'Invalid session summary.'
    );
    sessions.push({
      file: path.relative(root, location).replaceAll('\\', '/'),
      seconds: summary.seconds,
      stages: summary.stages.map(({ status, seconds }) => ({ status, seconds })),
    });
  }
  const { version, source, starter } = options;
  const observedAt = now();
  let notes = announcementBody(markdown, identity.repository, version);
  notes += `\n\n## Observed delivery identities\n\n- npm: ${packageName}@${version}\n- Exact npm source / v${version} tag target: ${source}\n- Main: ${identity.main}\n- Delivered starter: ${starter} (range ^${version}, lock ${version})\n- SHA1: ${identity.registry.dist.shasum}\n- Integrity: ${identity.registry.dist.integrity}\n- Observed at: ${observedAt}\n`;
  const starterTemplate = `${new URL(identity.repository.url).pathname.slice(1)}#starter`;
  if (!notes.includes(`--template ${starterTemplate}`))
    notes += `\nCreate a consumer from the generated starter, not the GitHub source archive:\n\n\x60\x60\x60bash\nnpm create astro@latest -- --template ${starterTemplate}\n\x60\x60\x60\n`;
  if (sessions.length) {
    notes +=
      '\nSession timings supplied by the operator (observational; failures remain recorded):\n\n| Evidence | Seconds | Passed stages | Failed stages |\n| --- | ---: | ---: | ---: |\n';
    sessions.forEach((summary, i) => {
      notes += `| ${i + 1} | ${summary.seconds} | ${summary.stages.filter((s) => s.status === 'passed').length} | ${summary.stages.filter((s) => s.status === 'failed').length} |\n`;
    });
  }
  notes +=
    '\nThis identity collection does not rerun or replace technical checks, audits or the canonical npm download verifier. Historical summaries do not authorize skipping checks. Demo/browser acceptance remains user-owned.\n';
  const parent = await evidenceParent(root);
  const output = await mkdtemp(path.join(parent, `release-closeout-${version}-`));
  const receipt = {
    schema: 1,
    observationalOnly: true,
    kind: 'release-closeout',
    status: 'prepared',
    observedAt,
    version,
    source,
    starter,
    ...identity,
    sessions,
    notesSha256: digest(notes),
  };
  await writeFile(path.join(output, 'notes.md'), notes, { flag: 'wx' });
  await writeFile(path.join(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', {
    flag: 'wx',
  });
  return { output, receipt };
}

export async function verifyCloseout(
  options,
  { root = process.cwd(), capture, now = () => new Date().toISOString() } = {}
) {
  const receiptFile = await evidenceFile(root, options.receipt);
  const receipt = JSON.parse(await readFile(receiptFile, 'utf8'));
  assert.ok(
    receipt.schema === 1 &&
      receipt.kind === 'release-closeout' &&
      receipt.observationalOnly === true,
    'Invalid closeout receipt.'
  );
  const identity = await readIdentities(receipt, capture);
  assert.equal(
    identity.main,
    receipt.main,
    'Main changed since preparation; prepare a fresh announcement.'
  );
  assert.deepEqual(identity.repository, receipt.repository, 'Origin changed since preparation.');
  assert.deepEqual(
    identity.registry,
    receipt.registry,
    'Registry identity changed since preparation.'
  );
  assert.equal(
    identity.tagSource,
    receipt.source,
    'Remote release tag is missing or points elsewhere.'
  );
  const notesFile = await evidenceFile(root, path.join(path.dirname(receiptFile), 'notes.md'));
  const notes = await readFile(notesFile, 'utf8');
  assert.equal(
    digest(notes),
    receipt.notesSha256,
    'Prepared notes changed; prepare a fresh announcement.'
  );
  const release = JSON.parse(
    await capture('gh', [
      'release',
      'view',
      `v${receipt.version}`,
      '--repo',
      identity.repository.gh,
      '--json',
      'url,tagName,isDraft,isPrerelease,body,publishedAt',
    ])
  );
  assert.equal(release.tagName, `v${receipt.version}`);
  assert.equal(release.isDraft, false, 'Release is still a draft.');
  assert.ok(Number.isFinite(Date.parse(release.publishedAt)), 'Release is not published.');
  assert.equal(release.isPrerelease, false, 'Stable release is marked prerelease.');
  assert.equal(release.url, `${identity.repository.url}/releases/tag/v${receipt.version}`);
  assert.equal(
    release.body.trim(),
    notes.trim(),
    'Published announcement differs from prepared notes.'
  );
  const verified = {
    ...receipt,
    status: 'identity-verified',
    verifiedAt: now(),
    refs: identity.refs,
    release: { url: release.url, publishedAt: release.publishedAt },
  };
  const output = await mkdtemp(path.join(path.dirname(receiptFile), 'verification-'));
  await writeFile(path.join(output, 'receipt.json'), JSON.stringify(verified, null, 2) + '\n', {
    flag: 'wx',
  });
  return { output, receipt: verified };
}

async function main(argv) {
  const options = parseCloseoutArgs(argv);
  if (options.help) return console.log(usage);
  const root = process.cwd();
  const session = await createMaintainerSession('release closeout: ' + options.mode);
  try {
    const capture = async (command, args) => {
      const npm = command === 'npm';
      if (npm && !process.env.npm_execpath)
        throw new Error('Run through npm run release:closeout.');
      return (
        await exec(
          npm ? process.execPath : command,
          npm ? [process.env.npm_execpath, ...args] : args,
          { cwd: root, maxBuffer: 8 * 1024 * 1024 }
        )
      ).stdout;
    };
    const result = await session.stage('Collect fresh closeout identities: ' + options.mode, () =>
      (options.mode === 'prepare' ? prepareCloseout : verifyCloseout)(options, { root, capture })
    );
    console.log(`[release:closeout] ${result.receipt.status}; files: ${result.output}`);
    if (options.mode === 'prepare')
      console.log(
        'Review notes.md, then create/push the exact source tag and GitHub Release serially; finish with verify --receipt <receipt.json>.'
      );
  } finally {
    await session.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
