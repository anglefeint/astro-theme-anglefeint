import { execFile as execFileCallback } from 'node:child_process';
import { cp, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { resolveSiteUrl } from './resolve-site-url.mjs';
import { fragmentFixture } from '../tests/fragments-fixture.mjs';

const execFile = promisify(execFileCallback);
const repoRoot = process.cwd();
const siteConfigPath = path.join(repoRoot, 'src/site.config.ts');
const outputPath = path.join(repoRoot, 'tests/e2e/.generated-smoke-config.json');

async function main() {
  const loaderSource = `
    import { pathToFileURL } from 'node:url';

    const mod = await import(pathToFileURL(process.argv[1]).href);
    const normalized = mod.normalizeI18nConfig(mod.THEME_CONFIG.i18n);
    const enabledLocales = Object.values(normalized.locales)
      .filter((locale) => locale.meta.enabled)
      .map((locale) => ({
        code: locale.code,
        hreflang: locale.meta.hreflang,
      }));
    const defaultHomePath =
      normalized.routing.defaultLocalePrefix === 'always'
        ? '/' + normalized.defaultLocale + '/'
        : '/';
    const payload = {
      siteUrl: mod.THEME_CONFIG.site.url,
      defaultLocale: normalized.defaultLocale,
      defaultLocalePrefixMode: normalized.routing.defaultLocalePrefix,
      defaultLocaleOgLocale: normalized.locales[normalized.defaultLocale]?.meta.ogLocale ?? null,
      defaultHomePath,
      enabledLocales,
    };

    process.stdout.write(JSON.stringify(payload));
  `;

  const { stdout } = await execFile(
    process.execPath,
    ['--experimental-strip-types', '--input-type=module', '--eval', loaderSource, siteConfigPath],
    {
      cwd: repoRoot,
      encoding: 'utf8',
    }
  );

  await mkdir(path.dirname(outputPath), { recursive: true });
  const payload = JSON.parse(stdout);
  payload.siteUrl = resolveSiteUrl(payload.siteUrl, repoRoot, ['build']);
  await writeFile(outputPath, `${JSON.stringify(payload)}\n`, 'utf8');
  // Build fixtures before launching parallel browsers, not beside WebGL/animation tests.
  const fixture = await fragmentFixture();
  try {
    await cp(
      'tests/fixtures/reusable-effects.astro',
      path.join(fixture.root, 'src/pages/effects-test.astro')
    );
    // Exercise the shared jump control with the small two-page fixture.
    await fixture.build({ extra: { pagination: { showJumpThreshold: 1 } } });
    await mkdir(path.join(repoRoot, 'acceptance-results'), { recursive: true });
    const directory = await mkdtemp(path.join(repoRoot, 'acceptance-results/fragments-browser-'));
    await cp(path.join(fixture.root, 'dist'), directory, { recursive: true });
    await writeFile(
      path.join(repoRoot, 'tests/e2e/.generated-fragments-config.json'),
      JSON.stringify({ directory })
    );
  } finally {
    await fixture.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
