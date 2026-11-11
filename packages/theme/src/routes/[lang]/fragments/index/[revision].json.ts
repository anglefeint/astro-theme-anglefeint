import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { THEME } from '@anglefeint/site-config/theme';
import { ENABLED_LOCALES } from '@anglefeint/site-i18n/config';
import { buildFragmentIndex } from '../../../../utils/fragment-index';

export const getStaticPaths = (async () => {
  if (!THEME.FRAGMENTS.enabled) return [];
  const entries = await getCollection('fragments');
  return ENABLED_LOCALES.map((lang) => {
    const index = buildFragmentIndex(entries, lang, THEME.FRAGMENTS.pageSize);
    return { params: { lang, revision: index.revision }, props: { body: index.body } };
  });
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(props.body, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
