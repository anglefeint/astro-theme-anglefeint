// Only used to generate upstream starter output, never to rewrite a user's project.
export const STARTER_SCRIPTS = {
  dev: 'astro dev',
  build: 'astro build',
  preview: 'astro preview',
  'check:workspace-link': 'node scripts/check-workspace-link.mjs',
  'check:adapters':
    'node scripts/check-adapter-contract.mjs && node scripts/sync-adapters.mjs --check',
  'check:scaffold': 'node scripts/check-scaffold.mjs',
  'check:about-runtime': 'npm run build && node scripts/check-about-runtime-config.mjs',
  'check:no-build': 'npm run check:adapters && npm run check:scaffold && astro check',
  'sync-adapters': 'node scripts/sync-adapters.mjs',
  doctor: 'node scripts/doctor.mjs && npm run check:adapters && npm run check',
  check: 'npm run check:no-build && npm run check:about-runtime',
  'new-post': 'anglefeint-new-post',
  'new-page': 'anglefeint-new-page',
  astro: 'astro',
};

export function buildStarterPackage(source, previous, themeRange) {
  const result = { ...previous };
  delete result.workspaces;
  delete result['lint-staged'];
  result.engines = source.engines;
  result.scripts = { ...STARTER_SCRIPTS };
  result.dependencies = { ...source.dependencies, '@anglefeint/astro-theme': themeRange };
  result.devDependencies = Object.fromEntries(
    ['@astrojs/check', 'typescript'].map((name) => [name, source.devDependencies[name]])
  );
  return result;
}

export function starterPackageDrift(source, actual, themeRange) {
  const expected = buildStarterPackage(source, actual, themeRange);
  return [
    'scripts',
    'dependencies',
    'devDependencies',
    'engines',
    'workspaces',
    'lint-staged',
  ].filter((key) => {
    const sorted = (value) =>
      value && Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
    return JSON.stringify(sorted(expected[key])) !== JSON.stringify(sorted(actual[key]));
  });
}
