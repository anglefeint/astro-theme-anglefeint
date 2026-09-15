import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { THEME } from '@anglefeint/site-config/theme';
import { SITE_AUTHOR, SITE_TITLE } from '@anglefeint/site-config/site';
import { ENABLED_LOCALES } from '@anglefeint/site-i18n/config';
import { imageData, socialKey } from './model.mjs';
import { renderSocialImage } from './render.mjs';

export const prerender = true;
export const getStaticPaths: GetStaticPaths = async () => {
  if (!THEME.SOCIAL_IMAGE.ENABLED) return [];
  const posts = await getCollection('blog');
  const paths = new Map();
  for (const post of posts) {
    const locale = post.id.split('/')[0];
    if (!ENABLED_LOCALES.includes(locale) || post.data.ogImage) continue;
    const data = imageData(post.data.title, post.data.author ?? SITE_AUTHOR, SITE_TITLE, locale);
    const key = socialKey(data);
    paths.set(key, { params: { key }, props: { data } });
  }
  return [...paths.values()];
};

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderSocialImage(props.data)), {
    headers: { 'Content-Type': 'image/png' },
  });
