import type { Messages } from '@anglefeint/theme-default-i18n';
import { DEFAULT_MESSAGES } from '@anglefeint/theme-default-i18n';
import { deepMerge, type DeepPartial } from '@anglefeint/astro-theme/utils/merge';
import type { Locale } from './config';

/**
 * Override only the fields you want to customize per locale.
 * Unspecified keys fall back to package defaults.
 */
const MESSAGE_OVERRIDES: Partial<Record<Locale, DeepPartial<Messages>>> = {};

export function getMessages(locale: Locale): Messages {
	const base = DEFAULT_MESSAGES[locale] ?? DEFAULT_MESSAGES.en;
	return deepMerge(base, MESSAGE_OVERRIDES[locale] ?? {});
}
