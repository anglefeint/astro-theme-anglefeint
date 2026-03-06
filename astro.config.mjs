// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';
import { URL, fileURLToPath } from 'node:url';
import { SITE_URL } from './src/config/site';
import { DEFAULT_LOCALE, DEFAULT_LOCALE_PREFIX_MODE } from './src/i18n/config';

const THEME_DEFAULT_I18N_LOCAL = './packages/theme/src/i18n/messages.ts';
const THEME_DEFAULT_I18N_NODE_MODULES =
  './node_modules/@anglefeint/astro-theme/src/i18n/messages.ts';
const themeDefaultI18nEntry = existsSync(
  fileURLToPath(new URL(THEME_DEFAULT_I18N_LOCAL, import.meta.url))
)
  ? THEME_DEFAULT_I18N_LOCAL
  : THEME_DEFAULT_I18N_NODE_MODULES;

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
