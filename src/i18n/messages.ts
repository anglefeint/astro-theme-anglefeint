import type { Messages } from '@anglefeint/theme-default-i18n';
import { DEFAULT_MESSAGES } from '@anglefeint/theme-default-i18n';
import type { Locale } from './config';

type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};

/**
 * Override only the fields you want to customize per locale.
 * Unspecified keys fall back to package defaults.
 */
const MESSAGE_OVERRIDES: Partial<Record<Locale, DeepPartial<Messages>>> = {};

function mergeMessages(base: Messages, override?: DeepPartial<Messages>): Messages {
	if (!override) return base;
	return {
		...base,
		...override,
		nav: { ...base.nav, ...override.nav },
		home: { ...base.home, ...override.home },
		about: { ...base.about, ...override.about },
		blog: { ...base.blog, ...override.blog },
	};
}

export function getMessages(locale: Locale): Messages {
	const base = DEFAULT_MESSAGES[locale] ?? DEFAULT_MESSAGES.en;
	return mergeMessages(base, MESSAGE_OVERRIDES[locale]);
}
