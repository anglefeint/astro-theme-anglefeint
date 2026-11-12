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

function fixture(opts = {}, registryOverrides = {}) {
  const commands = [],
    captures = [],
    stages = [],
    records = [];
  let audits = 0;
  const pkg = { name: '@anglefeint/astro-theme', version: '0.33.1' };
  const operations = createNpmOperations(opts, {
    pkg,
    npmEnv: {},
    cacheDir: 'unused',
    session: {
      stage: async (label, action) => {
        stages.push(label);
        const record = {};
        records.push(record);
        return action(record);
      },
    },
    run: async (command, args) => commands.push([command, ...args]),
    audit: () => audits++,
    capture: (command, args) => {
      captures.push(args);
      if (command === 'git') return 'a'.repeat(40);
      if (!args.includes('--json')) return '0.33.0';
      const dist = { integrity: 'sha512-test', shasum: 'b'.repeat(40) };
      return JSON.stringify(
        args[0] === 'view'
          ? args[2] === 'version'
            ? pkg.version
            : { ...pkg, gitHead: 'a'.repeat(40), dist, ...registryOverrides }
          : [{ ...pkg, ...dist }]
      );
    },
  });
  return {
    commands,
    captures,
    stages,
    records,
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
  assert(f.captures.some((c) => c[0] === 'rev-parse'));
  assert(!planNpmTools(['npm-delivery']).some((n) => /source|installed|browser/.test(n)));
});

test('normal delivery rejects a registry source mismatch after a single accepted upload', async () => {
  const f = fixture({}, { gitHead: 'c'.repeat(40) });
  await assert.rejects(
    executeNpmToolPlan(['npm-delivery'], (name) => f.operations[name]()),
    (error) => error.code === 'IDENTITY_MISMATCH' && error.attempt === 1
  );
  assert.equal(f.commands.filter((c) => c[1] === 'publish').length, 1);
  assert(!f.captures.some((c) => c[0] === 'pack'));
  assert.equal(f.records.at(-1).verificationFailures[0].code, 'IDENTITY_MISMATCH');
  assert.equal(f.records.at(-1).verificationFailures[0].action, 'stop');
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
  assert.equal(list.standalone['release-closeout'].command, 'npm run release:closeout -- --help');
  assert.throws(() => planNpmTools(['release-closeout']), /Unknown release tool/);
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
  assert.equal(pkg.scripts['release:closeout'], 'node scripts/release-closeout.mjs');
  assert.match(readFileSync('.husky/pre-commit', 'utf8'), /npm exec lint-staged/);
  assert.match(readFileSync('.husky/pre-commit', 'utf8'), /npm run check:docs/);
});
