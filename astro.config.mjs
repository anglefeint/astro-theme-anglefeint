// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { URL, fileURLToPath } from 'node:url';
import { resolveThemeDefaultI18nEntry } from './scripts/resolve-theme-default-i18n-entry.mjs';
import { SITE_URL } from './src/config/site';
import { DEFAULT_LOCALE, DEFAULT_LOCALE_PREFIX_MODE } from './src/i18n/config';

const themeDefaultI18nEntry = resolveThemeDefaultI18nEntry(import.meta.url);

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
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
