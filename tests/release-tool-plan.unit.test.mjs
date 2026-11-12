import assert from 'node:assert/strict';
import process from 'node:process';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import test from 'node:test';
import {
  deliveryTools,
  executeNpmToolPlan,
  planNpmTools,
  validateToolSelection,
} from '../scripts/release-tool-plan.mjs';
import { createNpmOperations } from '../scripts/npm-release-tools.mjs';

function fixture(opts = {}) {
  const commands = [],
    captures = [],
    stages = [];
  let audits = 0;
  const pkg = { name: '@anglefeint/astro-theme', version: '0.33.1' };
  const operations = createNpmOperations(opts, {
    pkg,
    npmEnv: {},
    cacheDir: 'unused',
    session: {
      stage: async (label, action) => {
        stages.push(label);
        return action();
      },
    },
    run: async (command, args) => commands.push([command, ...args]),
    audit: () => audits++,
    capture: (_command, args) => {
      captures.push(args);
      if (!args.includes('--json')) return '0.33.0';
      return JSON.stringify(
        args[0] === 'view' ? pkg.version : [{ ...pkg, integrity: 'sha512-test' }]
      );
    },
  });
  return {
    commands,
    captures,
    stages,
    operations,
    get audits() {
      return audits;
    },
  };
}

test('publication mechanics audit and upload once, without hidden source/install/browser checks', async () => {
  const f = fixture();
  await executeNpmToolPlan(['npm-delivery', 'npm-delivery'], (name) => f.operations[name]());
  assert.equal(f.audits, 1);
  assert.deepEqual(
    f.commands.map((c) => c[1]),
    ['run', 'whoami', 'publish']
  );
  assert.equal(f.commands[0][2], 'theme:pack');
  assert(f.captures.some((c) => c[0] === 'pack'));
  assert(!planNpmTools(['npm-delivery']).some((n) => /source|installed|browser/.test(n)));
});

test('selected checks run once before upload regardless of target order; failure blocks upload', async () => {
  const calls = [];
  await assert.rejects(
    executeNpmToolPlan(['npm-delivery', 'types-check', 'types-check'], async (name) => {
      calls.push(name);
      if (name === 'types-check') throw Error('types failed');
    }),
    /types failed/
  );
  assert.equal(calls.filter((n) => n === 'types-check').length, 1);
  assert(!calls.includes('npm-upload'));
  const plan = planNpmTools(['npm-delivery', 'build']);
  assert(plan.indexOf('build') < plan.indexOf('npm-upload'));
  assert(plan.indexOf('npm-upload') < plan.indexOf('npm-delivery'));
});

test('independent adapters do not invoke check/doctor or rebuild About output', async () => {
  const files = ['tests/release-tool-plan.unit.test.mjs'];
  const f = fixture({ testFiles: files });
  for (const n of ['docs-check', 'types-check', 'unit-tests', 'build', 'about-output-check'])
    await f.operations[n]();
  assert.deepEqual(f.commands[0], ['npm', 'run', 'check:docs']);
  assert.deepEqual(f.commands[1], ['npm', 'run', 'check:types']);
  assert.deepEqual(f.commands[2], [
    process.execPath,
    '--experimental-strip-types',
    '--test',
    ...files,
  ]);
  assert.deepEqual(f.commands[3], ['npm', 'run', 'build']);
  assert.deepEqual(f.commands[4], ['npm', 'run', 'check:about-output']);
});

test('installation levels stay explicit, audited and mutually exclusive', async () => {
  const f = fixture();
  for (const n of ['installed-check', 'installed-build', 'installed-matrix'])
    await f.operations[n]();
  assert.deepEqual(
    f.commands.map((c) => c.slice(3)),
    [
      ['--', '--audit'],
      ['--', '--audit', '--smoke-build'],
      ['--', '--audit', '--build'],
    ]
  );
  assert.throws(() => planNpmTools(['installed-build', 'installed-matrix']), /Choose one/);
});

test('full checks require real prior consent and focused tests require safe explicit paths', () => {
  assert.throws(
    () => validateToolSelection(planNpmTools(['source-check'])),
    /confirmation required/
  );
  assert.throws(
    () => validateToolSelection(planNpmTools(['installed-matrix'])),
    /confirmation required/
  );
  validateToolSelection(planNpmTools(['installed-matrix']), { confirmed: true });
  assert.throws(() => validateToolSelection(['unit-tests']), /explicit/);
  assert.throws(
    () => validateToolSelection(['unit-tests'], { testFiles: ['tests/../bad.test.mjs'] }),
    /literal/
  );
  validateToolSelection(['unit-tests'], { testFiles: ['tests/release-tool-plan.unit.test.mjs'] });
  for (const n of [
    'browsers',
    'consumer-npm',
    'consumer-pnpm',
    'consumer-upgrade',
    'local-upgrade',
  ])
    assert.equal(deliveryTools[n].requiresUserConfirmation, true, n);
});

test('CLI rejects unconfirmed aggregate before session, network or publication effects', () => {
  const r = spawnSync(
    process.execPath,
    ['scripts/release-tools.mjs', 'run', 'npm-delivery', 'source-check'],
    { encoding: 'utf8' }
  );
  assert.equal(r.status, 1);
  assert.match(r.stderr, /confirmation required/);
  assert(!r.stdout.includes('[maintainer]'));
});

test('unknown tools/cycles fail before effects, and source validation does not publish', async () => {
  let calls = 0;
  await assert.rejects(
    executeNpmToolPlan(['docs-check', 'typo'], async () => calls++),
    /Unknown/
  );
  assert.equal(calls, 0);
  assert.throws(() => planNpmTools([]), /Select/);
  assert.throws(() => planNpmTools(['a'], { a: { needs: ['b'] }, b: { needs: ['a'] } }), /Cyclic/);
  const done = [];
  for (let i = 0; i < 2; i++) await executeNpmToolPlan(['docs-check'], async (n) => done.push(n));
  assert.deepEqual(done, ['docs-check', 'docs-check']);
});

test('dry-run mechanics retain audits but skip authentication and download verification', async () => {
  const f = fixture({ dryRun: true, skipChecks: true, skipPack: true, skipRegistryCheck: true });
  await executeNpmToolPlan(['npm-delivery'], (n) => f.operations[n]());
  assert.equal(f.audits, 1);
  assert.deepEqual(f.commands, [['npm', 'publish', '--access', 'public', '--dry-run']]);
  assert.equal(f.captures.length, 0);
});

test('list/plan are read-only and show consent, while pre-push full trigger is absent', () => {
  const list = JSON.parse(
    execFileSync(process.execPath, ['scripts/release-tools.mjs', 'list'], { encoding: 'utf8' })
  );
  assert(list.tools['unit-tests']);
  const p = JSON.parse(
    execFileSync(process.execPath, ['scripts/release-tools.mjs', 'plan', 'source-check'], {
      encoding: 'utf8',
    })
  );
  assert.deepEqual(p.confirmationRequired, ['source-check']);
  assert.equal(p.publishes, false);
  assert.equal(existsSync('.husky/pre-push'), false);
  assert.equal(existsSync('scripts/pre-push-check.mjs'), false);
  const pkg = JSON.parse(readFileSync('package.json'));
  assert.equal(pkg.scripts['check:types'], 'astro check');
  assert.equal(pkg.scripts['check:about-output'], 'node scripts/check-about-runtime-config.mjs');
});
