// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from './src/config/site';

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	vite: {
		resolve: {
			alias: {
				'@anglefeint/site-config': fileURLToPath(new URL('./src/config', import.meta.url)),
			},
		},
	},
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => {
				// Exclude /en/ — it redirects to / (root is canonical for English home)
				const path = new URL(page).pathname;
				return path !== '/en/' && path !== '/en';
			},
		}),
	],
});
