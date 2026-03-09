import { existsSync } from 'node:fs';
import { URL, fileURLToPath } from 'node:url';

const THEME_DEFAULT_I18N_LOCAL = './packages/theme/src/i18n/messages.ts';
const THEME_DEFAULT_I18N_NODE_MODULES =
  './node_modules/@anglefeint/astro-theme/src/i18n/messages.ts';

export function resolveThemeDefaultI18nEntry(importMetaUrl) {
  const localPath = fileURLToPath(new URL(THEME_DEFAULT_I18N_LOCAL, importMetaUrl));

  if (existsSync(localPath)) {
    return THEME_DEFAULT_I18N_LOCAL;
  }

  return THEME_DEFAULT_I18N_NODE_MODULES;
}
