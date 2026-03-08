// Generated file. Do not edit directly.
// Edit scripts/adapter-templates/src/i18n/posts.ts and run `npm run sync-adapters`.

import type { CollectionEntry } from 'astro:content';
import type { Locale } from './config';
import { THEME } from '../config/theme';

export const BLOG_PAGE_SIZE = THEME.BLOG_PAGE_SIZE;

export function postsForLocale(
  posts: CollectionEntry<'blog'>[],
  locale: Locale
): CollectionEntry<'blog'>[] {
  return posts
    .filter((post) => post.id.startsWith(`${locale}/`))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
