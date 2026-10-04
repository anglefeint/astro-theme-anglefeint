import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectAudit } from '../scripts/audit-dependencies.mjs';
function report(vulnerabilities = {}) {
  return {
    auditReportVersion: 2,
    metadata: { vulnerabilities: { total: Object.keys(vulnerabilities).length } },
    vulnerabilities,
  };
}
test('audit accepts a complete clean report', () => {
  assert.equal(inspectAudit(report()), false);
});
test('audit blocks the formerly exempt advisory and its dependency chain', () => {
  assert.throws(
    () =>
      inspectAudit(
        report({
          astro: { via: ['http-cache-semantics'], nodes: ['node_modules/astro'] },
          'http-cache-semantics': {
            via: [
              {
                name: 'http-cache-semantics',
                url: 'https://github.com/advisories/GHSA-ch52-4w7c-c8xp',
              },
            ],
            nodes: ['node_modules/http-cache-semantics'],
          },
        })
      ),
    /vulnerabilities block release/
  );
});
test('audit blocks other findings regardless of severity', () => {
  assert.throws(
    () => inspectAudit(report({ example: { severity: 'low' } })),
    /vulnerabilities block release/
  );
});
test('audit rejects registry errors and incomplete reports', () => {
  assert.throws(() => inspectAudit({ error: 'registry unavailable' }), /Invalid/);
  assert.throws(() => inspectAudit({ ...report(), vulnerabilities: undefined }), /Missing/);
  assert.throws(() => inspectAudit({ ...report(), metadata: {} }), /Incomplete/);
  assert.throws(
    () => inspectAudit({ ...report(), metadata: { vulnerabilities: { total: 1 } } }),
    /Incomplete/
  );
});
