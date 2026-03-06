import { THEME_CONFIG } from '../site.config';
import {
  getLocaleConfig,
  getLocaleFallbackChain,
  SUPPORTED_LOCALES,
  type Locale,
} from '../i18n/config';

/**
 * Site identity config. Override via environment variables:
 *   PUBLIC_SITE_URL, PUBLIC_SITE_TITLE, PUBLIC_SITE_AUTHOR, PUBLIC_SITE_DESCRIPTION, PUBLIC_SITE_TAGLINE
 */
const env = import.meta.env;

export const SITE_TITLE = (env.PUBLIC_SITE_TITLE as string | undefined) ?? THEME_CONFIG.site.title;
export const SITE_DESCRIPTION =
  (env.PUBLIC_SITE_DESCRIPTION as string | undefined) ?? THEME_CONFIG.site.description;
export const SITE_URL =
  (env.PUBLIC_SITE_URL as string | undefined) ??
  (env.SITE as string | undefined) ??
  THEME_CONFIG.site.url;
export const SITE_AUTHOR =
  (env.PUBLIC_SITE_AUTHOR as string | undefined) ?? THEME_CONFIG.site.author;
export const SITE_TAGLINE =
  (env.PUBLIC_SITE_TAGLINE as string | undefined) ?? THEME_CONFIG.site.tagline;

export function getSiteHero(locale: Locale): string | undefined {
  for (const code of getLocaleFallbackChain(locale)) {
    const hero = getLocaleConfig(code).site.hero;
    if (hero) return hero;
  }
  return undefined;
}

export const SITE_HERO_BY_LOCALE: Record<Locale, string> = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale, getSiteHero(locale) ?? ''])
) as Record<Locale, string>;
