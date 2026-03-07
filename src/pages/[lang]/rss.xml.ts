import type { APIContext } from 'astro';
import { trailingSlash as astroTrailingSlash } from 'astro:config/server';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_URL } from '../../config/site';
import {
  DEFAULT_LOCALE,
  ENABLED_LOCALES,
  blogIdToSlugAnyLocale,
  isLocale,
  localePath,
} from '../../i18n/config';
import { getMessages } from '../../i18n/messages';
import { postsForLocale } from '../../i18n/posts';

export function getStaticPaths() {
  return ENABLED_LOCALES.map((lang) => ({ params: { lang } }));
}

export async function GET(context: APIContext) {
  const langParam = context.params.lang ?? DEFAULT_LOCALE;
  const locale = isLocale(langParam) ? langParam : DEFAULT_LOCALE;
  const messages = getMessages(locale);
  const posts = await getCollection('blog');
  const sourcePosts = postsForLocale(posts, locale);
  const rssTrailingSlash = astroTrailingSlash === 'never' ? false : undefined;
  return rss({
    title: SITE_TITLE,
    description: messages.blog.archiveDescription,
    site: context.site ?? SITE_URL,
    trailingSlash: rssTrailingSlash,
    items: sourcePosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: localePath(locale, `/blog/${blogIdToSlugAnyLocale(post.id)}`),
    })),
  });
}
