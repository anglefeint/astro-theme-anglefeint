// Package-owned project configuration.

import type { Messages } from '../../i18n/messages';
import { DEFAULT_MESSAGES } from '../../i18n/messages';
import { deepMerge } from '@anglefeint/astro-theme/utils/merge';
import { I18N, getLocaleConfig, getLocaleResolutionChain, type Locale } from './runtime.ts';

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

  // Author text has one shared English default; UI translations keep their normal chain.
  resolved.home.transmission =
    I18N.locales[locale]?.messages?.home?.transmission ??
    I18N.locales.en?.messages?.home?.transmission ??
    DEFAULT_MESSAGES.en.home.transmission;

  return resolved;
}
