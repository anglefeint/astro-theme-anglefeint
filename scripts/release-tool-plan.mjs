// Maintainer-only capabilities. Dependencies are safety requirements, not a prose runbook.
export const npmReleaseTools = {
  'registry-check': {
    needs: [],
    purpose: 'Reject a version already released or older than latest',
  },
  'audit-main': { needs: [], purpose: 'Blocking audit of main dependencies' },
  'source-check': { needs: [], purpose: 'Complete main checks, build and About assertions' },
  'installed-check': {
    needs: [],
    purpose: 'Independent packed installation, audit, CLI and build matrix',
  },
  pack: {
    needs: [],
    purpose: 'Check package creation and clean the preparation tarball afterward',
  },
  'npm-auth': { needs: [], purpose: 'Check npm publishing identity' },
  'npm-upload': {
    needs: ['registry-check', 'audit-main', 'source-check', 'installed-check', 'pack', 'npm-auth'],
    purpose: 'Upload once; never retry publication automatically',
    effect: 'publish',
  },
  'npm-delivery': {
    needs: ['npm-upload'],
    purpose: 'Verify the uploaded version/tag and downloaded package; verification retries only',
    effect: 'publish',
  },
};

// Existing standalone capabilities stay separate: asking for recovery or starter sync must
// never pull npm publication into a dependency graph.
export const deliveryTools = {
  'starter-preflight': {
    command: 'npm run maintainer:sync-starter:check',
    purpose: 'Read-only managed-file drift check; expected drift exits 1',
  },
  'starter-delivery': {
    command: 'npm run release:starter',
    purpose: 'Generate/install/audit/check/commit starter and restore main; does not push',
  },
  'consumer-npm': {
    command: 'npm run check:template',
    purpose: 'Fresh public npm template acceptance',
  },
  'consumer-pnpm': {
    command: 'npm run check:template -- --pnpm',
    purpose: 'Fresh public pnpm template acceptance',
  },
  'consumer-upgrade': {
    command: 'npm run check:template -- --upgrade-from=<baseline>',
    purpose: 'Real published npm upgrade and personal-file preservation',
  },
  'local-upgrade': {
    command: 'npm run check:upgrade',
    purpose: 'Local package real-upgrade acceptance before publication',
  },
  browsers: { command: 'npm run e2e', purpose: 'Full local functional browser acceptance' },
  'registry-recovery': {
    command: 'npm run release:verify -- --version <exact-version> [identity options]',
    purpose: 'Read-only recovery; never publishes or installs',
  },
};

export function planNpmTools(targets, tools = npmReleaseTools) {
  if (!targets.length) throw new Error('Select at least one tool; no default publishing action.');
  const visiting = new Set();
  const complete = new Set();
  const ordered = [];
  function visit(name) {
    if (!Object.hasOwn(tools, name)) throw new Error(`Unknown npm tool: ${name}`);
    if (visiting.has(name)) throw new Error(`Cyclic tool dependency: ${name}`);
    if (complete.has(name)) return;
    visiting.add(name);
    for (const dependency of tools[name].needs) visit(dependency);
    visiting.delete(name);
    complete.add(name);
    ordered.push(name);
  }
  for (const target of targets) visit(target);
  return ordered;
}

export async function executeNpmToolPlan(targets, execute) {
  // Resolve the entire plan before any side effect, including unknown-name failures.
  const plan = planNpmTools(targets);
  for (const name of plan) await execute(name);
  return plan;
}
