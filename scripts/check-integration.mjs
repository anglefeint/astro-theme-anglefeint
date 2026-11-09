import assert from 'node:assert/strict';
import path from 'node:path';
import { createJiti } from 'jiti';
const load = createJiti(import.meta.url, {
  moduleCache: false,
  fsCache: false,
  alias: { '@anglefeint/user-config': path.resolve('src/site.config.ts') },
});
const { THEME_CONFIG } = await load.import(path.resolve('src/site.config.ts'));
const { THEME } = await load.import(path.resolve('packages/theme/src/project/config/theme.ts'));
const { ENABLED_LOCALES, DEFAULT_LOCALE } = await load.import(
  path.resolve('packages/theme/src/project/i18n/runtime.ts')
);
const { getMessages } = await load.import(
  path.resolve('packages/theme/src/project/i18n/messages.ts')
);
assert.equal(DEFAULT_LOCALE, THEME_CONFIG.i18n.defaultLocale);
assert(ENABLED_LOCALES.includes(DEFAULT_LOCALE));
assert.equal(THEME.BLOG_PAGE_SIZE, THEME_CONFIG.theme.blogPageSize);
assert.equal(THEME.ABOUT_PAGE_ENABLED, THEME_CONFIG.theme.enableAboutPage);
assert(getMessages(DEFAULT_LOCALE).decoderPage.fullTool);
console.log('Package-owned configuration, i18n and feature wiring passed.');
