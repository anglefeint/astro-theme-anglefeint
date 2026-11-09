// @ts-check
import { defineConfig } from 'astro/config';
import anglefeint from '@anglefeint/astro-theme/integration';
import { THEME_CONFIG } from './src/site.config';

export default defineConfig({ integrations: [anglefeint(THEME_CONFIG)] });
