import type {
  LocaleCode,
  NormalizedLocaleConfig,
  NormalizedThemeI18nConfig,
  ThemeI18nConfig,
} from './site.config.schema.ts';

function sanitizeFallbackChain(
  locale: LocaleCode,
  fallback: readonly LocaleCode[] | undefined,
  defaultLocale: LocaleCode,
  supportedLocales: ReadonlySet<LocaleCode>
): LocaleCode[] {
  const fallbackCandidates =
    fallback && fallback.length > 0 ? fallback : locale === defaultLocale ? [] : [defaultLocale];
  const seen = new Set<LocaleCode>();
  const resolved: LocaleCode[] = [];

  for (const candidate of fallbackCandidates) {
    if (
      !candidate ||
      candidate === locale ||
      seen.has(candidate) ||
      !supportedLocales.has(candidate)
    ) {
      continue;
    }
    seen.add(candidate);
    resolved.push(candidate);
  }

  if (locale !== defaultLocale && !seen.has(defaultLocale) && supportedLocales.has(defaultLocale)) {
    resolved.push(defaultLocale);
  }

  return resolved;
}

export function normalizeI18nConfig(config: ThemeI18nConfig): NormalizedThemeI18nConfig {
  const localeEntries = { ...config.locales };
  const defaultLocale = config.defaultLocale || 'en';

  if (!localeEntries[defaultLocale]) {
    localeEntries[defaultLocale] = {
      meta: {
        label: defaultLocale,
      },
    };
  }

  const supportedLocales = new Set(Object.keys(localeEntries));
  const normalizedLocales: Record<string, NormalizedLocaleConfig> = {};

  for (const [code, localeConfig] of Object.entries(localeEntries)) {
    const fallback = sanitizeFallbackChain(
      code,
      localeConfig.meta.fallback,
      defaultLocale,
      supportedLocales
    );

    normalizedLocales[code] = {
      code,
      meta: {
        label: localeConfig.meta.label || code,
        hreflang: localeConfig.meta.hreflang || code,
        ogLocale: localeConfig.meta.ogLocale,
        enabled: code === defaultLocale ? true : localeConfig.meta.enabled !== false,
        fallback,
      },
      site: {
        hero: localeConfig.site?.hero,
      },
      about: localeConfig.about,
      messages: localeConfig.messages,
    };
  }

  return {
    defaultLocale,
    locales: normalizedLocales,
    routing: {
      defaultLocalePrefix: config.routing.defaultLocalePrefix || 'always',
    },
  };
}
