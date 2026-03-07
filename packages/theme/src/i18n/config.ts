import {
  ENABLED_LOCALES as ENABLED_LOCALES_RUNTIME,
  DEFAULT_LOCALE as DEFAULT_LOCALE_RUNTIME,
} from './locales.mjs';

export type Locale = string;
export const ENABLED_LOCALES = ENABLED_LOCALES_RUNTIME as readonly string[];
export const DEFAULT_LOCALE: Locale = DEFAULT_LOCALE_RUNTIME;

export const ENABLED_LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  zh: '中文',
};

export function isLocale(value: string): value is Locale {
  return (ENABLED_LOCALES as readonly string[]).includes(value);
}

export function withLeadingSlash(path: string): string {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

export function localePath(locale: string, path = '/'): string {
  const normalized = withLeadingSlash(path);
  if (normalized === '/') return `/${locale}/`;
  return `/${locale}${normalized.endsWith('/') ? normalized : `${normalized}/`}`;
}

export function stripLocaleFromPath(pathname: string, locale: string): string {
  const prefix = `/${locale}`;
  if (pathname === prefix) return '/';
  if (!pathname.startsWith(`${prefix}/`)) return pathname;
  const withoutLocale = pathname.slice(prefix.length);
  return withoutLocale || '/';
}

export function blogIdToSlugAnyLocale(id: string): string {
  const parts = id.split('/');
  if (parts.length > 1 && isLocale(parts[0])) return parts.slice(1).join('/');
  return id;
}

/** URL path for a locale's version of a page. For default locale home, returns / instead of /en/. */
export function alternatePathForLocale(locale: string, subpath: string): string {
  if (locale === DEFAULT_LOCALE && (subpath === '/' || subpath === '')) return '/';
  return localePath(locale, subpath);
}
