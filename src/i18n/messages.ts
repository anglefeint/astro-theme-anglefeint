import type { Messages } from '@anglefeint/theme-default-i18n';
import { DEFAULT_MESSAGES } from '@anglefeint/theme-default-i18n';
import { deepMerge } from '@anglefeint/astro-theme/utils/merge';
import { getLocaleConfig, getLocaleFallbackChain, type Locale } from './runtime';

const BUILTIN_MESSAGES = DEFAULT_MESSAGES as Record<string, Messages>;

export function getMessages(locale: Locale): Messages {
  const fallbackChain = [...getLocaleFallbackChain(locale)].reverse();
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
