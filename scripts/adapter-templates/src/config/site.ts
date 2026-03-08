// Generated file. Do not edit directly.
// Edit scripts/adapter-templates/src/config/site.ts and run `npm run sync-adapters`.

import { THEME_CONFIG } from '../site.config.ts';
import { getLocaleConfig, getLocaleResolutionChain, type Locale } from '../i18n/config.ts';

/**
 * Site identity config. Override via environment variables:
 *   PUBLIC_SITE_URL, PUBLIC_SITE_TITLE, PUBLIC_SITE_AUTHOR, PUBLIC_SITE_DESCRIPTION, PUBLIC_SITE_TAGLINE
 */
const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

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
  for (const code of getLocaleResolutionChain(locale)) {
    const hero = getLocaleConfig(code).site.hero;
    if (hero !== undefined) return hero;
  }
  return undefined;
}
