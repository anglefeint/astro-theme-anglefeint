/**
 * Single user-facing config entry for Anglefeint.
 * Edit this file only. Other files under src/config/* and src/i18n/* are adapters.
 */
import { defineThemeConfig } from './site.config.defaults.ts';

export type {
  AboutConfig,
  LocaleCode,
  LocaleConfig,
  LocaleMetaConfig,
  LocaleSiteConfig,
  NormalizedLocaleConfig,
  NormalizedThemeI18nConfig,
  SocialLink,
  ThemeConfig,
  ThemeI18nConfig,
} from './site.config.schema.ts';
export { DEFAULT_ABOUT_CONFIG, defineThemeConfig } from './site.config.defaults.ts';
export { normalizeI18nConfig } from './site.config.runtime.ts';

/**
 * Edit this object only.
 * Omitted fields safely fall back to theme defaults.
 */
export const THEME_CONFIG = defineThemeConfig({
  // Hide theme and Astro credits; copyright and custom site.tagline remain.
  // theme: { footer: { showCredits: false } },
  // Optional music: put your audio in public/music/, then enable a playlist.
  // theme: { music: { enabled: true, tracks: [{ title: 'My Song', src: '/music/my-song.mp3' }] } },
  // Article contents are enabled by default. Per-post `toc: true/false` overrides this.
  // theme: { toc: { enabled: false } },
  // Tag browsing: theme: { tags: { enabled: false } }
  // Automatic article share images: theme: { socialImage: { enabled: false } }
  // Per-post `ogImage` always takes priority and does not change the hero image.
  // Search is enabled by default; builds generate its index automatically.
  // To disable: theme: { search: { enabled: false } }
  // Example:
  // Language menu names use i18n.locales.<code>.meta.label.
  // Chinese defaults to 简体中文. To customize only its display name:
  // i18n: { locales: { zh: { meta: { label: '中文' } } } },
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: {
  //     en: {
  //       meta: { label: 'English', hreflang: 'en', ogLocale: 'en_US' },
  //       site: { hero: 'Your localized hero copy.' },
  //       about: { metaLine: '$ profile booted | mode: builder' },
  //       messages: { nav: { home: 'Home' } },
  //     },
  //   },
  // },
});
