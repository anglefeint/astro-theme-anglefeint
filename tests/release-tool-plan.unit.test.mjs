import assert from 'node:assert/strict';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { executeNpmToolPlan, planNpmTools } from '../scripts/release-tool-plan.mjs';
import { createNpmOperations } from '../scripts/npm-release-tools.mjs';

test('real operation adapters retain audits, installed build flags, upload and download verification', async () => {
  for (const opts of [
    {},
    { skipChecks: true, skipPack: true, skipRegistryCheck: true, dryRun: true },
  ]) {
    const commands = [],
      stages = [],
      captures = [];
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
    await executeNpmToolPlan(['npm-delivery'], (name) => operations[name]());
    assert.equal(audits, 1);
    const installed = commands.find((command) => command.includes('check:installed'));
    assert(installed.includes('--audit'));
    assert.equal(installed.includes('--build'), !opts.skipChecks);
    assert.equal(
      commands.some((command) => command[2] === 'check'),
      !opts.skipChecks
    );
    assert.equal(commands.filter((command) => command[1] === 'publish').length, 1);
    assert.equal(
      commands.find((command) => command[1] === 'publish').includes('--dry-run'),
      !!opts.dryRun
    );
    assert.equal(stages.includes('Verify published tag and downloaded package'), !opts.dryRun);
    assert.equal(
      captures.some((args) => args[0] === 'pack'),
      !opts.dryRun
    );
  }
});

test('composed release tools run each required gate exactly once before upload and verification', async () => {
  const executed = [];
  await executeNpmToolPlan(
    ['source-check', 'installed-check', 'npm-delivery', 'source-check'],
    async (name) => executed.push(name)
  );
  assert.equal(new Set(executed).size, executed.length);
  for (const gate of [
    'registry-check',
    'audit-main',
    'source-check',
    'installed-check',
    'pack',
    'npm-auth',
  ])
    assert(executed.indexOf(gate) < executed.indexOf('npm-upload'));
  assert(executed.indexOf('npm-upload') < executed.indexOf('npm-delivery'));
});

test('any failed prerequisite blocks publication; accepted upload verification is never retried as upload', async () => {
  for (const failure of ['audit-main', 'source-check', 'installed-check', 'npm-delivery']) {
    const calls = [];
    await assert.rejects(
      executeNpmToolPlan(['npm-delivery'], async (name) => {
        calls.push(name);
        if (name === failure) throw new Error(failure);
      }),
      new RegExp(failure)
    );
    assert.equal(
      calls.filter((name) => name === 'npm-upload').length,
      failure === 'npm-delivery' ? 1 : 0
    );
  }
});

test('unknown tools, missing targets and cycles fail before executing any tool', async () => {
  let calls = 0;
  await assert.rejects(
    executeNpmToolPlan(['source-check', 'typo'], async () => calls++),
    /Unknown/
  );
  assert.equal(calls, 0);
  assert.throws(() => planNpmTools([]), /Select/);
  assert.throws(() => planNpmTools(['a'], { a: { needs: ['b'] }, b: { needs: ['a'] } }), /Cyclic/);
});

test('source-only selection cannot publish; separate invocations do not reuse a previous result', async () => {
  const calls = [];
  for (let i = 0; i < 2; i++)
    await executeNpmToolPlan(['source-check'], async (name) => calls.push(name));
  assert.deepEqual(calls, ['source-check', 'source-check']);
});

test('listing and planning tools have no publishing or session side effects', () => {
  const list = JSON.parse(
    execFileSync(process.execPath, ['scripts/release-tools.mjs', 'list'], { encoding: 'utf8' })
  );
  assert(list.standalone['registry-recovery']);
  const plan = JSON.parse(
    execFileSync(process.execPath, ['scripts/release-tools.mjs', 'plan', 'npm-delivery'], {
      encoding: 'utf8',
    })
  );
  assert.equal(plan.publishes, true);
  assert.equal(plan.plan.at(-1), 'npm-delivery');
});
