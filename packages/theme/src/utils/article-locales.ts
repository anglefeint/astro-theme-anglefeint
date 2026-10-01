import {
  ENABLED_LOCALES,
  localePath,
  blogIdToSlugAnyLocale,
  type Locale,
} from '@anglefeint/site-i18n/config';

type LocaleHrefs = Partial<Record<Locale, string>>;

export async function resolveArticleLocaleHrefs({
  pathname,
  locale,
  seoLocaleHrefs,
  loadPosts,
}: {
  pathname: string;
  locale: Locale;
  seoLocaleHrefs?: LocaleHrefs;
  loadPosts: () => Promise<{ id: string }[]>;
}): Promise<LocaleHrefs> {
  // Explicit mappings, including an empty map, remain authoritative for custom routes.
  if (seoLocaleHrefs !== undefined) return seoLocaleHrefs;
  if (!ENABLED_LOCALES.includes(locale) || !pathname.startsWith(`/${locale}/blog/`)) return {};
  const normalize = (value: string) =>
    new URL(value, 'https://article.invalid').pathname.replace(/\/$/, '');
  const posts = await loadPosts();
  const current = posts.find(
    (post) =>
      post.id.startsWith(`${locale}/`) &&
      normalize(localePath(locale, `/blog/${blogIdToSlugAnyLocale(post.id)}/`)) ===
        normalize(pathname)
  );
  if (!current) return {};
  const slug = blogIdToSlugAnyLocale(current.id);
  const ids = new Set(posts.map((post) => post.id));
  return Object.fromEntries(
    ENABLED_LOCALES.filter((code) => ids.has(`${code}/${slug}`)).map((code) => [
      code,
      localePath(code, `/blog/${slug}/`),
    ])
  );
}
