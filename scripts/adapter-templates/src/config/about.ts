import { DEFAULT_LOCALE, type Locale } from '../i18n/config';
import { THEME_CONFIG, type AboutConfig } from '../site.config';

/**
 * About page content and runtime behavior configuration.
 * Used by src/pages/[lang]/about.astro and @anglefeint/astro-theme/scripts/about-effects.js.
 */
export function getAboutConfig(locale: Locale): AboutConfig {
  return THEME_CONFIG.aboutByLocale[locale] ?? THEME_CONFIG.aboutByLocale[DEFAULT_LOCALE];
}
