// Generated file. Do not edit directly.
// Edit scripts/adapter-templates/src/i18n/messages.ts and run `npm run sync-adapters`.

import type { Messages } from '@anglefeint/theme-default-i18n';
import { DEFAULT_MESSAGES } from '@anglefeint/theme-default-i18n';
import { deepMerge } from '@anglefeint/astro-theme/utils/merge';
import { getLocaleConfig, getLocaleResolutionChain, type Locale } from './runtime.ts';

const BUILTIN_MESSAGES = DEFAULT_MESSAGES as Record<string, Messages>;

export function getMessages(locale: Locale): Messages {
  const fallbackChain = [...getLocaleResolutionChain(locale)].reverse();
  let resolved = deepMerge(DEFAULT_MESSAGES.en, {});

  for (const code of fallbackChain) {
    const builtinMessages = BUILTIN_MESSAGES[code];
    if (builtinMessages) {
      resolved = deepMerge(resolved, builtinMessages);
    }

    const overrideMessages = getLocaleConfig(code).messages;
    if (overrideMessages) {
      resolved = deepMerge(resolved, overrideMessages);
    }
  }

  return resolved;
}
