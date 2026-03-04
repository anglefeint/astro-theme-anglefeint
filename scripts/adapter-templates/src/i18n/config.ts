import { THEME_CONFIG, type LocaleCode } from '../site.config';

export const SUPPORTED_LOCALES = THEME_CONFIG.i18n.supportedLocales as readonly LocaleCode[];
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = THEME_CONFIG.i18n.defaultLocale as Locale;

export const LOCALE_LABELS: Record<Locale, string> = THEME_CONFIG.i18n.localeLabels as Record<Locale, string>;

export function isLocale(value: string): value is Locale {
	return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function withLeadingSlash(path: string): string {
	if (!path) return '/';
	return path.startsWith('/') ? path : `/${path}`;
}

export function localePath(locale: Locale, path = '/'): string {
	const normalized = withLeadingSlash(path);
	if (normalized === '/') return `/${locale}/`;
	return `/${locale}${normalized.endsWith('/') ? normalized : `${normalized}/`}`;
}

export function stripLocaleFromPath(pathname: string, locale: Locale): string {
	const prefix = `/${locale}`;
	if (!pathname.startsWith(prefix)) return pathname;
	const withoutLocale = pathname.slice(prefix.length);
	return withoutLocale || '/';
}

export function blogIdToSlugAnyLocale(id: string): string {
	const parts = id.split('/');
	if (parts.length > 1 && isLocale(parts[0])) return parts.slice(1).join('/');
	return id;
}

/** URL path for a locale's version of a page. For default locale home, returns / instead of /en/. */
export function alternatePathForLocale(locale: Locale, subpath: string): string {
	if (locale === DEFAULT_LOCALE && (subpath === '/' || subpath === '')) return '/';
	return localePath(locale, subpath);
}
