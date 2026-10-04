// Maintainer-only release gate: every reported vulnerability blocks delivery.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function inspectAudit(report) {
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
  assert.equal(Object.keys(findings).length, 0, 'Dependency vulnerabilities block release');
  return false;
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
  inspectAudit(report);
  assert.equal(result.status, 0, 'npm audit failed without findings');
  console.log('[audit] 0 known vulnerabilities.');
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  auditDependencies(path.resolve(process.argv[2] || '.'));
}
