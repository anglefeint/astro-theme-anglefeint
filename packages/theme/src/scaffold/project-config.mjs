import path from 'node:path';
import { createJiti } from 'jiti';

export async function loadProjectModule(file) {
  const jiti = createJiti(import.meta.url, { moduleCache: false, fsCache: false });
  return jiti.import(file);
}

export async function loadProjectLocales(root) {
  const configPath = path.join(root, 'src/site.config.ts');
  try {
    // Transform dependency TS too: native Node stripping rejects TS in node_modules.
    const mod = await loadProjectModule(configPath);
    const config = mod.THEME_CONFIG?.i18n;
    if (!config?.locales) throw new Error('THEME_CONFIG.i18n.locales is missing.');
    const normalized =
      typeof mod.normalizeI18nConfig === 'function' ? mod.normalizeI18nConfig(config) : config;
    const locales = Object.entries(normalized.locales)
      .filter(
        ([code, locale]) => code === normalized.defaultLocale || locale?.meta?.enabled !== false
      )
      .map(([code, locale]) => locale.code ?? code);
    if (!locales.length) throw new Error('No enabled locales found.');
    for (const locale of locales) {
      if (typeof locale !== 'string' || !/^[a-z]{2,3}(?:-[a-z0-9]+)?$/i.test(locale)) {
        throw new Error(`Invalid locale "${locale}".`);
      }
    }
    return [...new Set(locales)];
  } catch (error) {
    throw new Error(
      `Cannot load locales from ${configPath}: ${error.message}\nFix the config or explicitly use --locales en,fr.`,
      { cause: error }
    );
  }
}
