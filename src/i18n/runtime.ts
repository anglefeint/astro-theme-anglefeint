import { THEME_CONFIG } from '../site.config.ts';
import { normalizeI18nConfig } from '../site.config.runtime.ts';

export const I18N = normalizeI18nConfig(THEME_CONFIG.i18n);
export type Locale = string;

export const DEFAULT_LOCALE: Locale = I18N.defaultLocale;
export const DEFAULT_LOCALE_PREFIX_MODE = I18N.routing.defaultLocalePrefix;
export const SUPPORTED_LOCALES = Object.values(I18N.locales)
  .filter((locale) => locale.meta.enabled)
  .map((locale) => locale.code) as Locale[];

export const LOCALE_LABELS: Record<Locale, string> = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale, I18N.locales[locale]?.meta.label ?? locale])
) as Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return Boolean(I18N.locales[value]?.meta.enabled);
}

export function getLocaleConfig(locale: string) {
  return I18N.locales[locale] ?? I18N.locales[DEFAULT_LOCALE];
}

export function getLocaleMeta(locale: string) {
  return getLocaleConfig(locale).meta;
}

export function getLocaleLabel(locale: string): string {
  return getLocaleMeta(locale).label;
}

export function getLocaleResolutionChain(locale: string): Locale[] {
  const resolved = getLocaleConfig(locale);
  return [resolved.code, ...resolved.meta.fallback] as Locale[];
}

export function getLocaleDirection(locale: string): 'ltr' | 'rtl' {
  return getLocaleMeta(locale).dir;
}

export function getLocaleHreflang(locale: string): string {
  return getLocaleMeta(locale).hreflang;
}

export function getLocaleOgLocale(locale: string): string | undefined {
  return getLocaleMeta(locale).ogLocale;
}

export function getDefaultLocaleHomePath(): string {
  return DEFAULT_LOCALE_PREFIX_MODE === 'always' ? localePath(DEFAULT_LOCALE, '/') : '/';
}

export function shouldRedirectRootToDefaultLocale(): boolean {
  return DEFAULT_LOCALE_PREFIX_MODE === 'always';
}

export function shouldRedirectLocalizedDefaultLocaleHome(locale: string): boolean {
  return locale === DEFAULT_LOCALE && DEFAULT_LOCALE_PREFIX_MODE === 'never';
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

export function alternatePathForLocale(locale: string, subpath: string): string {
  if (
    locale === DEFAULT_LOCALE &&
    (subpath === '/' || subpath === '') &&
    DEFAULT_LOCALE_PREFIX_MODE === 'never'
  ) {
    return '/';
  }
  return localePath(locale, subpath);
}
