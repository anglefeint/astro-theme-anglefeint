import { deepMerge } from '@anglefeint/astro-theme/utils/merge';
import { DEFAULT_ABOUT_CONFIG } from '../site.config.defaults.ts';
import type { AboutConfig } from '../site.config.schema.ts';
import { getLocaleConfig, getLocaleResolutionChain, type Locale } from '../i18n/config.ts';

/**
 * About page content and runtime behavior configuration.
 * Used by src/pages/[lang]/about.astro and @anglefeint/astro-theme/scripts/about-effects.js.
 */
export function getAboutConfig(locale: Locale): AboutConfig {
  let resolved = deepMerge(DEFAULT_ABOUT_CONFIG, {});

  for (const code of [...getLocaleResolutionChain(locale)].reverse()) {
    const config = getLocaleConfig(code).about;
    if (config) {
      resolved = deepMerge(resolved, config);
    }
  }

  return resolved;
}
