// Maintainer-only release gate. The scoped exception is documented in docs/PACKAGE_RELEASE.md.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const REVIEWED_ADVISORY = 'https://github.com/advisories/GHSA-ch52-4w7c-c8xp';
const reviewedPackages = new Set([
  'http-cache-semantics',
  'astro',
  '@astrojs/mdx',
  '@anglefeint/astro-theme',
]);

export function inspectAudit(report, now = new Date()) {
  assert.ok(
    report && !report.error && report.auditReportVersion === 2,
    'Invalid npm audit response'
  );
  const findings = report.vulnerabilities;
  assert.ok(findings && typeof findings === 'object', 'Missing audit findings');
  assert.equal(
    Object.keys(findings).length,
    report.metadata?.vulnerabilities?.total,
    'Incomplete audit report'
  );
  if (!Object.keys(findings).length) return false;
  assert.ok(
    now < new Date('2026-11-03T00:00:00Z'),
    'Advisory review expired; reassess before release'
  );
  const visit = (name, seen = new Set()) => {
    assert.ok(
      reviewedPackages.has(name) && !seen.has(name),
      `Unreviewed audit dependency: ${name}`
    );
    const finding = findings[name];
    assert.ok(finding?.via?.length && finding.nodes?.length, `Incomplete finding: ${name}`);
    for (const via of finding.via) {
      if (typeof via === 'string') visit(via, new Set([...seen, name]));
      else {
        assert.equal(name, 'http-cache-semantics', 'Unexpected advisory owner');
        assert.equal(via.url, REVIEWED_ADVISORY, 'Unreviewed security advisory');
        assert.equal(via.name, 'http-cache-semantics');
      }
    }
  };
  Object.keys(findings).forEach((name) => visit(name));
  return true;
}

export function verifyReviewedUsage(root, report) {
  const read = (file) => readFileSync(path.join(root, file), 'utf8');
  const hash = (file) =>
    createHash('sha256').update(read(file).replaceAll('\r\n', '\n')).digest('hex');
  // Pin the reviewed static config and Astro image-cache caller, not merely the advisory ID.
  assert.equal(
    hash('astro.config.mjs'),
    '103810625fdf43fddb9b30fca1b7578cc35d96bef28164c5d9e3c7badb0a2616',
    'Astro configuration changed; reassess advisory'
  );
  assert.equal(
    hash('node_modules/astro/dist/assets/build/remote.js'),
    'f373fa76e3112446db327c79b34e2bbb1ef1dcad41affb60788adf30edc9588e',
    'Astro cache caller changed; reassess advisory'
  );
  assert.equal(
    JSON.parse(read('node_modules/astro/package.json')).version,
    '7.3.5',
    'Unreviewed Astro version'
  );
  const nodes = report.vulnerabilities['http-cache-semantics'].nodes;
  assert.deepEqual(
    nodes,
    ['node_modules/http-cache-semantics'],
    'Unexpected cache-library installation'
  );
  assert.equal(JSON.parse(read(`${nodes[0]}/package.json`)).version, '4.2.0');
}

export function auditDependencies(root = process.cwd(), env = process.env) {
  const args = ['audit', '--json', '--prefer-online'];
  const command = env.npm_execpath
    ? [process.execPath, [env.npm_execpath, ...args]]
    : process.platform === 'win32'
      ? ['cmd.exe', ['/d', '/s', '/c', 'npm', ...args]]
      : ['npm', args];
  const result = spawnSync(command[0], command[1], {
    cwd: root,
    env,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  assert.ok(
    !result.error && [0, 1].includes(result.status),
    `npm audit failed: ${result.error || result.stderr}`
  );
  const report = JSON.parse(result.stdout);
  const reviewed = inspectAudit(report);
  if (reviewed) {
    verifyReviewedUsage(root, report);
    console.log(
      `[audit] ${report.metadata.vulnerabilities.total} reported dependency entries; only ${REVIEWED_ADVISORY} is present. Reviewed static Astro 7.3.5 usage accepted until 2026-11-03; upstream vulnerability remains unfixed.`
    );
  } else {
    assert.equal(result.status, 0, 'npm audit failed without findings');
    console.log('[audit] 0 known vulnerabilities.');
  }
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  auditDependencies(path.resolve(process.argv[2] || '.'));
}
