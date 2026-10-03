import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  inspectAudit,
  verifyReviewedUsage,
  REVIEWED_ADVISORY,
} from '../scripts/audit-dependencies.mjs';

const now = new Date('2026-10-03T00:00:00Z');
function report(extra = []) {
  return {
    auditReportVersion: 2,
    metadata: { vulnerabilities: { total: 2 } },
    vulnerabilities: {
      astro: { via: ['http-cache-semantics'], nodes: ['node_modules/astro'] },
      'http-cache-semantics': {
        via: [{ name: 'http-cache-semantics', url: REVIEWED_ADVISORY }, ...extra],
        nodes: ['node_modules/http-cache-semantics'],
      },
    },
  };
}

test('audit accepts a clean report or the reviewed advisory chain, without hiding findings', () => {
  assert.equal(inspectAudit(report(), now), true);
  assert.equal(
    inspectAudit(
      { auditReportVersion: 2, vulnerabilities: {}, metadata: { vulnerabilities: { total: 0 } } },
      now
    ),
    false
  );
});

test('audit blocks new advisories even when they affect an already reviewed package', () => {
  assert.throws(
    () =>
      inspectAudit(
        report([{ name: 'http-cache-semantics', url: 'https://github.com/advisories/NEW' }]),
        now
      ),
    /Unreviewed security advisory/
  );
  const other = report();
  other.vulnerabilities.braces = { via: ['http-cache-semantics'], nodes: ['node_modules/braces'] };
  other.metadata.vulnerabilities.total++;
  assert.throws(() => inspectAudit(other, now), /Unreviewed audit dependency/);
});

test('audit rejects errors, incomplete reports, cycles and expired review', () => {
  assert.throws(() => inspectAudit({ error: 'registry unavailable' }, now), /Invalid/);
  assert.throws(() => inspectAudit({ ...report(), vulnerabilities: {} }, now), /Incomplete/);
  const cycle = report();
  cycle.vulnerabilities['http-cache-semantics'].via = ['astro'];
  assert.throws(() => inspectAudit(cycle, now), /Unreviewed audit dependency/);
  assert.throws(() => inspectAudit(report(), new Date('2026-11-03T00:00:00Z')), /expired/);
});

test('review acceptance is invalidated by config, caller or installed-version changes', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-audit-test-'));
  try {
    const files = [
      'astro.config.mjs',
      'node_modules/astro/dist/assets/build/remote.js',
      'node_modules/astro/package.json',
      'node_modules/http-cache-semantics/package.json',
    ];
    for (const file of files) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), await readFile(file));
    }
    verifyReviewedUsage(root, report());
    for (const [index, replacement] of [
      [0, '// changed config'],
      [1, '// changed caller'],
      [2, '{"version":"7.3.6"}'],
      [3, '{"version":"4.2.1"}'],
    ]) {
      const file = path.join(root, files[index]);
      const original = await readFile(file);
      await writeFile(file, replacement);
      assert.throws(() => verifyReviewedUsage(root, report()));
      await writeFile(file, original);
    }
  } finally {
    assert.equal(path.dirname(root), os.tmpdir());
    await rm(root, { recursive: true, force: true });
  }
});
