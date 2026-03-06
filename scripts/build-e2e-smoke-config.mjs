import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

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
  await writeFile(outputPath, `${stdout}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
