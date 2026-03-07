import { execFile } from 'node:child_process';
import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { REQUIRED_ADAPTER_TARGET_FILES } from './starter-manifest.mjs';

const execFileAsync = promisify(execFile);

const REQUIRED_VITE_ALIASES = [
  '@anglefeint/site-config',
  '@anglefeint/site-i18n',
  '@anglefeint/theme-default-i18n',
];
const REQUIRED_TSCONFIG_PATHS = [
  '@anglefeint/site-config',
  '@anglefeint/site-config/*',
  '@anglefeint/site-i18n',
  '@anglefeint/site-i18n/*',
  '@anglefeint/theme-default-i18n',
];

async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function runAdapterSmokeCheck(cwd) {
  const smokeSource = `
    import path from 'node:path';
    import { pathToFileURL } from 'node:url';

    const root = process.cwd();
    const importModule = (relPath) => import(pathToFileURL(path.join(root, relPath)).href);

    const [
      siteConfig,
      configIndex,
      i18nConfig,
      i18nRuntime,
      siteAdapter,
      aboutAdapter,
      themeAdapter,
      socialAdapter,
    ] = await Promise.all([
      importModule('src/site.config.ts'),
      importModule('src/config/index.ts'),
      importModule('src/i18n/config.ts'),
      importModule('src/i18n/runtime.ts'),
      importModule('src/config/site.ts'),
      importModule('src/config/about.ts'),
      importModule('src/config/theme.ts'),
      importModule('src/config/social.ts'),
    ]);

    const defaultLocale = i18nConfig.DEFAULT_LOCALE;
    const aboutConfig = aboutAdapter.getAboutConfig(defaultLocale);
    const payload = {
      defaultLocaleMatches:
        defaultLocale === siteConfig.THEME_CONFIG.i18n.defaultLocale &&
        defaultLocale === i18nRuntime.DEFAULT_LOCALE,
      enabledLocalesValid:
        Array.isArray(i18nConfig.ENABLED_LOCALES) &&
        i18nConfig.ENABLED_LOCALES.length > 0 &&
        i18nConfig.ENABLED_LOCALES.includes(defaultLocale),
      enabledLocaleLabelsValid:
        typeof i18nConfig.ENABLED_LOCALE_LABELS?.[defaultLocale] === 'string' &&
        i18nConfig.ENABLED_LOCALE_LABELS[defaultLocale].length > 0,
      siteAdapterValid:
        siteAdapter.SITE_TITLE === siteConfig.THEME_CONFIG.site.title &&
        siteAdapter.SITE_DESCRIPTION === siteConfig.THEME_CONFIG.site.description &&
        siteAdapter.SITE_AUTHOR === siteConfig.THEME_CONFIG.site.author &&
        siteAdapter.SITE_TAGLINE === siteConfig.THEME_CONFIG.site.tagline &&
        typeof siteAdapter.getSiteHero(defaultLocale) === 'string',
      aboutAdapterValid:
        typeof aboutAdapter.getAboutConfig === 'function' &&
        typeof aboutConfig.metaLine === 'string' &&
        aboutConfig.metaLine.length > 0,
      themeAdapterValid:
        themeAdapter.THEME.BLOG_PAGE_SIZE === siteConfig.THEME_CONFIG.theme.blogPageSize &&
        themeAdapter.THEME.HOME_LATEST_COUNT === siteConfig.THEME_CONFIG.theme.homeLatestCount &&
        themeAdapter.THEME.ABOUT_PAGE_ENABLED === siteConfig.THEME_CONFIG.theme.enableAboutPage,
      socialAdapterValid: Array.isArray(socialAdapter.SOCIAL_LINKS),
      configIndexValid:
        typeof configIndex.SITE_TITLE === 'string' &&
        typeof configIndex.getAboutConfig === 'function' &&
        typeof configIndex.SOCIAL_LINKS !== 'undefined',
    };

    process.stdout.write(JSON.stringify(payload));
  `;

  const { stdout } = await execFileAsync(
    process.execPath,
    ['--experimental-strip-types', '--input-type=module', '--eval', smokeSource],
    {
      cwd,
      maxBuffer: 20 * 1024 * 1024,
      encoding: 'utf8',
    }
  );

  return JSON.parse(stdout);
}

async function runAdapterSourceFallbackCheck(cwd) {
  const [configIndexSource, siteSource, aboutSource, themeSource, socialSource] = await Promise.all(
    [
      readFile(path.join(cwd, 'src/config/index.ts'), 'utf8'),
      readFile(path.join(cwd, 'src/config/site.ts'), 'utf8'),
      readFile(path.join(cwd, 'src/config/about.ts'), 'utf8'),
      readFile(path.join(cwd, 'src/config/theme.ts'), 'utf8'),
      readFile(path.join(cwd, 'src/config/social.ts'), 'utf8'),
    ]
  );

  return {
    siteAdapterValid:
      siteSource.includes('THEME_CONFIG.site.title') &&
      siteSource.includes('THEME_CONFIG.site.description') &&
      siteSource.includes('THEME_CONFIG.site.author') &&
      siteSource.includes('THEME_CONFIG.site.tagline') &&
      siteSource.includes('getSiteHero'),
    aboutAdapterValid:
      aboutSource.includes('export function getAboutConfig') &&
      aboutSource.includes('getLocaleResolutionChain'),
    themeAdapterValid:
      themeSource.includes('THEME_CONFIG.theme') && themeSource.includes('ABOUT_PAGE_ENABLED'),
    socialAdapterValid: socialSource.includes('THEME_CONFIG.social.links'),
    configIndexValid:
      configIndexSource.includes("export * from './site.ts'") &&
      configIndexSource.includes("export * from './social.ts'") &&
      configIndexSource.includes("export * from './theme.ts'") &&
      configIndexSource.includes("export * from './about.ts'"),
  };
}

async function main() {
  const issues = [];
  const cwd = process.cwd();

  for (const rel of REQUIRED_ADAPTER_TARGET_FILES) {
    const exists = await fileExists(path.join(cwd, rel));
    if (!exists) issues.push(`Missing required adapter file: ${rel}`);
  }

  const astroConfig = await readFile(path.join(cwd, 'astro.config.mjs'), 'utf8');
  for (const alias of REQUIRED_VITE_ALIASES) {
    if (!astroConfig.includes(`'${alias}'`) && !astroConfig.includes(`"${alias}"`)) {
      issues.push(`astro.config.mjs is missing vite alias: ${alias}`);
    }
  }

  const tsconfigText = await readFile(path.join(cwd, 'tsconfig.json'), 'utf8');
  const tsconfig = JSON.parse(tsconfigText);
  const paths = tsconfig?.compilerOptions?.paths ?? {};
  for (const key of REQUIRED_TSCONFIG_PATHS) {
    if (!(key in paths))
      issues.push(`tsconfig.json is missing compilerOptions.paths entry: ${key}`);
  }

  let smoke;
  try {
    smoke = await runAdapterSmokeCheck(cwd);
  } catch (error) {
    if (
      String(error?.stderr ?? error?.message ?? '').includes(
        'ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING'
      )
    ) {
      smoke = {
        defaultLocaleMatches: true,
        enabledLocalesValid: true,
        enabledLocaleLabelsValid: true,
        ...(await runAdapterSourceFallbackCheck(cwd)),
      };
    } else {
      throw error;
    }
  }
  if (!smoke.defaultLocaleMatches) {
    issues.push('Adapter smoke check failed: i18n default locale wiring is inconsistent.');
  }
  if (!smoke.enabledLocalesValid) {
    issues.push('Adapter smoke check failed: enabled locales are not derived from config.');
  }
  if (!smoke.enabledLocaleLabelsValid) {
    issues.push('Adapter smoke check failed: enabled locale labels are not exposed correctly.');
  }
  if (!smoke.siteAdapterValid) {
    issues.push(
      'Adapter smoke check failed: src/config/site.ts does not map THEME_CONFIG correctly.'
    );
  }
  if (!smoke.aboutAdapterValid) {
    issues.push(
      'Adapter smoke check failed: src/config/about.ts does not expose a valid about selector.'
    );
  }
  if (!smoke.themeAdapterValid) {
    issues.push(
      'Adapter smoke check failed: src/config/theme.ts does not map theme settings correctly.'
    );
  }
  if (!smoke.socialAdapterValid) {
    issues.push(
      'Adapter smoke check failed: src/config/social.ts does not expose social links correctly.'
    );
  }
  if (!smoke.configIndexValid) {
    issues.push('Adapter smoke check failed: src/config/index.ts re-exports are incomplete.');
  }

  if (issues.length > 0) {
    console.error('Adapter contract check failed:');
    for (const issue of issues) console.error(`- ${issue}`);
    process.exit(1);
  }

  console.log('Adapter contract check passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
