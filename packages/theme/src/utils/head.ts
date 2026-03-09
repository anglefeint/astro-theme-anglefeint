import {
  DEFAULT_LOCALE,
  ENABLED_LOCALES,
  alternatePathForLocale,
  getLocaleHreflang,
  getLocaleOgLocale,
  isLocale,
  stripLocaleFromPath,
} from '@anglefeint/site-i18n/config';

export function resolveCurrentLocale(pathname: string): string {
  const pathParts = pathname.split('/').filter(Boolean);
  return pathParts.length > 0 && isLocale(pathParts[0]) ? pathParts[0] : DEFAULT_LOCALE;
}

export function buildHeadLocaleState(pathname: string, siteURL: URL) {
  const currentLocale = resolveCurrentLocale(pathname);
  const localeSubpath = stripLocaleFromPath(pathname, currentLocale);
  const alternatePaths = ENABLED_LOCALES.map((locale) => ({
    locale,
    hreflang: getLocaleHreflang(locale),
    href: new URL(alternatePathForLocale(locale, localeSubpath), siteURL).toString(),
  }));

  return {
    currentLocale,
    alternatePaths,
    xDefaultHref: new URL(alternatePathForLocale(DEFAULT_LOCALE, localeSubpath), siteURL),
    ogLocale: getLocaleOgLocale(currentLocale),
    ogLocaleAlternates: ENABLED_LOCALES.filter((locale) => locale !== currentLocale)
      .map((locale) => getLocaleOgLocale(locale))
      .filter(Boolean),
  };
}

export function buildJsonLdSchemas({
  siteTitle,
  siteAuthor,
  siteURL,
  title,
  description,
  imageURL,
  canonicalURL,
  isArticle,
  author,
  publishedTime,
  modifiedTime,
  tags,
  schema,
}: {
  siteTitle: string;
  siteAuthor: string;
  siteURL: URL;
  title: string;
  description: string;
  imageURL: string;
  canonicalURL: URL;
  isArticle: boolean;
  author: string;
  publishedTime?: Date;
  modifiedTime?: Date;
  tags?: string[];
  schema?: Record<string, unknown> | Record<string, unknown>[];
}) {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: siteURL.toString(),
    description,
    publisher: {
      '@type': 'Person',
      name: siteAuthor,
    },
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteAuthor,
    url: siteURL.toString(),
  };

  const articleSchema = isArticle
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        image: [imageURL],
        author: {
          '@type': 'Person',
          name: author,
        },
        publisher: {
          '@type': 'Person',
          name: siteAuthor,
        },
        mainEntityOfPage: canonicalURL.toString(),
        datePublished: publishedTime?.toISOString(),
        dateModified: (modifiedTime ?? publishedTime)?.toISOString(),
        keywords: tags?.length ? tags.join(', ') : undefined,
      }
    : undefined;

  const extraSchemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];
  return [websiteSchema, personSchema, articleSchema, ...extraSchemas].filter(Boolean);
}
