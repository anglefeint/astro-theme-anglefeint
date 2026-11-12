// Agents select validation explicitly. Only publication mechanics are implicit.
export const npmReleaseTools = {
  'registry-check': {
    needs: [],
    purpose: 'Reject a version already released or older than latest',
  },
  'audit-main': { needs: [], purpose: 'Blocking audit of main dependencies' },
  'docs-check': { needs: [], purpose: 'Document metadata', script: 'check:docs' },
  lint: { needs: [], purpose: 'JavaScript lint', script: 'lint' },
  'format-check': {
    needs: [],
    purpose: 'Formatting after fixtures finish',
    script: 'format:check',
  },
  'types-check': { needs: [], purpose: 'Astro diagnostics without build', script: 'check:types' },
  'workspace-check': { needs: [], purpose: 'Workspace link', script: 'check:workspace-link' },
  'fonts-check': { needs: [], purpose: 'Bundled fonts', script: 'check:fonts' },
  'integration-check': { needs: [], purpose: 'Integration wiring', script: 'check:integration' },
  'pack-cli-check': { needs: [], purpose: 'Packed CLI', script: 'check:pack-cli' },
  'scaffold-check': { needs: [], purpose: 'Starter structure', script: 'check:scaffold' },
  'unit-tests': { needs: [], purpose: 'Only explicit --test tests/<name>.test.mjs files' },
  build: { needs: [], purpose: 'Build once', script: 'build' },
  'about-output-check': {
    needs: [],
    purpose: 'Assert existing dist; no rebuild',
    script: 'check:about-output',
  },
  'source-check': {
    needs: [],
    purpose: 'Legacy full source aggregate; exceptional opt-in',
    requiresUserConfirmation: true,
  },
  'installed-check': {
    needs: [],
    purpose: 'Independent installation, audit and CLI; no build',
    exclusiveGroup: 'installed-validation',
  },
  'installed-build': {
    needs: [],
    purpose: 'Independent install/audit/CLI and one default build',
    exclusiveGroup: 'installed-validation',
  },
  'installed-matrix': {
    needs: [],
    purpose: 'Fourteen-case installed matrix',
    exclusiveGroup: 'installed-validation',
    requiresUserConfirmation: true,
  },
  pack: {
    needs: [],
    purpose: 'Check package creation and clean the preparation tarball afterward',
  },
  'npm-auth': { needs: [], purpose: 'Check npm publishing identity' },
  'npm-upload': {
    needs: ['registry-check', 'audit-main', 'pack', 'npm-auth'],
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
    requiresUserConfirmation: true,
    command: 'npm run check:template',
    purpose: 'Fresh public npm template acceptance',
  },
  'consumer-pnpm': {
    requiresUserConfirmation: true,
    command: 'npm run check:template -- --pnpm',
    purpose: 'Fresh public pnpm template acceptance',
  },
  'consumer-upgrade': {
    requiresUserConfirmation: true,
    command: 'npm run check:template -- --upgrade-from=<baseline>',
    purpose: 'Real published npm upgrade and personal-file preservation',
  },
  'local-upgrade': {
    requiresUserConfirmation: true,
    command: 'npm run check:upgrade',
    purpose: 'Local package real-upgrade acceptance before publication',
  },
  browsers: {
    command: 'npm run e2e',
    purpose: 'Browser acceptance; confirmation required',
    requiresUserConfirmation: true,
  },
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
    if (!Object.hasOwn(tools, name)) throw new Error(`Unknown release tool: ${name}`);
    if (visiting.has(name)) throw new Error(`Cyclic tool dependency: ${name}`);
    if (complete.has(name)) return;
    visiting.add(name);
    for (const dependency of tools[name].needs) visit(dependency);
    visiting.delete(name);
    complete.add(name);
    ordered.push(name);
  }
  for (const target of targets) visit(target);
  const groups = new Set();
  for (const name of ordered) {
    const group = tools[name].exclusiveGroup;
    if (group && groups.has(group))
      throw new Error('Choose one installed validation level, not multiple installations.');
    if (group) groups.add(group);
  }
  // All explicitly selected validation must finish before an upload, even when
  // npm-delivery was listed first. Preserve order within each group.
  return [
    ...ordered.filter((name) => tools[name].effect !== 'publish'),
    ...ordered.filter((name) => tools[name].effect === 'publish'),
  ];
}

export function validateToolSelection(plan, options = {}) {
  const optional = plan.filter((name) => npmReleaseTools[name].requiresUserConfirmation);
  if (optional.length && !options.confirmed)
    throw new Error(
      'User confirmation required before running: ' +
        optional.join(', ') +
        '. Explain why, scope and expected cost; --confirmed only records approval already received.'
    );
  const files = options.testFiles ?? [];
  if (plan.includes('unit-tests') && !files.length)
    throw new Error(
      'unit-tests requires explicit --test tests/<name>.test.mjs; no implicit full suite.'
    );
  if (!plan.includes('unit-tests') && files.length) throw new Error('--test requires unit-tests.');
  for (const file of files)
    if (
      !file.startsWith('tests/') ||
      !file.endsWith('.test.mjs') ||
      file.includes('\\') ||
      file.split('/').includes('..')
    )
      throw new Error('Use a literal repository test path: ' + file);
}

export async function executeNpmToolPlan(targets, execute) {
  // Resolve the entire plan before any side effect, including unknown-name failures.
  const plan = planNpmTools(targets);
  for (const name of plan) await execute(name);
  return plan;
}
