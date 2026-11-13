type Article = { id: string; data: { pubDate: Date } };
type Links = Record<string, string>;

/** Build-scoped data: no module cache that could outlive a content/config edit. */
export function buildArticlePaths<Post extends Article>(
  posts: Iterable<Post>,
  {
    locales,
    slugOf,
    menuPath,
    seoPath,
  }: {
    locales: readonly string[];
    slugOf: (id: string) => string;
    menuPath: (locale: string, path: string) => string;
    seoPath: (locale: string, path: string) => string;
  }
) {
  const groups = new Map(locales.map((locale) => [locale, [] as Post[]]));
  const ids = new Set<string>();
  const slugs = new Map<string, string>();
  for (const post of posts) {
    ids.add(post.id);
    const group = groups.get(post.id.split('/')[0]);
    if (!group) continue;
    group.push(post);
    slugs.set(post.id, slugOf(post.id));
  }
  const translations = new Map<string, { localeHrefs: Links; seoLocaleHrefs: Links }>();
  for (const slug of new Set(slugs.values())) {
    const menuEntries: [string, string][] = [],
      seoEntries: [string, string][] = [];
    for (const locale of locales) {
      const exists = ids.has(`${locale}/${slug}`);
      const path = `/blog/${slug}/`;
      menuEntries.push([locale, menuPath(locale, exists ? path : '/blog/')]);
      if (exists) seoEntries.push([locale, seoPath(locale, path)]);
    }
    translations.set(slug, {
      localeHrefs: Object.fromEntries(menuEntries),
      seoLocaleHrefs: Object.fromEntries(seoEntries),
    });
  }
  return locales.flatMap((locale) => {
    const localized = groups.get(locale)!;
    localized.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
    // At most four candidates are needed to select three while excluding self.
    const latest = localized.slice(0, 4);
    return localized.map((post) => {
      const articleSlug = slugs.get(post.id)!;
      return {
        params: { lang: locale, slug: articleSlug },
        props: {
          post,
          locale,
          articleSlug,
          related: latest.filter((candidate) => candidate.id !== post.id).slice(0, 3),
          ...translations.get(articleSlug)!,
        },
      };
    });
  });
}
