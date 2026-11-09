// Only used to generate upstream starter output, never to rewrite a user's project.
export const STARTER_SCRIPTS = {
  dev: 'astro dev',
  build: 'astro build',
  preview: 'astro preview',
  'check:no-build': 'astro check',
  check: 'astro-theme doctor',
  doctor: 'astro-theme doctor',
  upgrade: 'npx @anglefeint/astro-theme@latest upgrade',
  'new-post': 'anglefeint-new-post',
  'new-page': 'anglefeint-new-page',
  astro: 'astro',
};

export function buildStarterPackage(source, previous, themeRange) {
  const result = { ...previous };
  delete result.workspaces;
  delete result['lint-staged'];
  result.engines = source.engines;
  result.anglefeint = { projectSchema: 1 };
  result.scripts = { ...STARTER_SCRIPTS };
  result.dependencies = { astro: source.dependencies.astro, '@anglefeint/astro-theme': themeRange };
  // Distribute the rendering dependency patch, not maintainer-only ESLint overrides.
  const renderingOverride = source.overrides?.fflate;
  if (renderingOverride) result.overrides = { fflate: renderingOverride };
  else delete result.overrides;
  result.devDependencies = Object.fromEntries(
    ['@astrojs/check', 'typescript'].map((name) => [name, source.devDependencies[name]])
  );
  return result;
}

export function starterPackageDrift(source, actual, themeRange) {
  const expected = buildStarterPackage(source, actual, themeRange);
  return [
    'anglefeint',
    'scripts',
    'dependencies',
    'devDependencies',
    'engines',
    'overrides',
    'workspaces',
    'lint-staged',
  ].filter((key) => {
    const sorted = (value) =>
      value && Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
    return JSON.stringify(sorted(expected[key])) !== JSON.stringify(sorted(actual[key]));
  });
}
