import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { terminalDocumentId } from '@anglefeint/astro-theme/utils/terminal-document';
import { ENABLED_LOCALES } from '../../../i18n/config';
import { postsForLocale } from '../../../i18n/posts';
import { THEME } from '../../../config/theme';

export const getStaticPaths = (async () => {
  if (!THEME.ABOUT_PAGE_ENABLED) return [];
  const posts = await getCollection('blog');
  return ENABLED_LOCALES.flatMap((lang) =>
    postsForLocale(posts, lang).map((post) => ({
      params: { lang, id: terminalDocumentId(post.id) },
      props: { content: post.body ?? '' },
    }))
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(JSON.stringify({ content: props.content }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
