// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import search from '@anglefeint/astro-theme/search';
import socialImage from '@anglefeint/astro-theme/social-image';
import machineReadable from '@anglefeint/astro-theme/machine-readable';
import markdown from '@anglefeint/astro-theme/markdown';
import { THEME_CONFIG } from './src/site.config';
import { THEME } from './src/config/theme';
import { defineConfig } from 'astro/config';
import { URL, fileURLToPath } from 'node:url';
import { resolveThemeDefaultI18nEntry } from './scripts/resolve-theme-default-i18n-entry.mjs';
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from './src/config/site';
import { resolveSiteUrl } from './scripts/resolve-site-url.mjs';
import { DEFAULT_LOCALE, DEFAULT_LOCALE_PREFIX_MODE } from './src/i18n/config';

const themeDefaultI18nEntry = resolveThemeDefaultI18nEntry(import.meta.url);

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  markdown: { processor: markdown({ enabled: THEME.MATH.ENABLED }) },
  site: resolveSiteUrl(SITE_URL, fileURLToPath(new URL('.', import.meta.url))),
  vite: {
    resolve: {
      alias: {
        '@anglefeint/site-config': fileURLToPath(new URL('./src/config', import.meta.url)),
        '@anglefeint/site-i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)),
        '@anglefeint/theme-default-i18n': fileURLToPath(
          new URL(themeDefaultI18nEntry, import.meta.url)
        ),
      },
    },
  },
  integrations: [
    mdx(),
    socialImage(),
    machineReadable({
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      aiReadableContent: THEME_CONFIG.aiReadableContent,
      locales: THEME_CONFIG.i18n.locales,
    }),
    search({ enabled: THEME.SEARCH.ENABLED }),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        const localizedDefaultHome = `/${DEFAULT_LOCALE}/`;
        const localizedDefaultHomeNoSlash = `/${DEFAULT_LOCALE}`;

        if (DEFAULT_LOCALE_PREFIX_MODE === 'always') {
          return path !== '/';
        }

        return path !== localizedDefaultHome && path !== localizedDefaultHomeNoSlash;
      },
    }),
  ],
});
