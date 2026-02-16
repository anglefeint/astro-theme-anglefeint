import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_TITLE } from '../../consts';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale } from '../../i18n/config';
import { getMessages } from '../../i18n/messages';
import { postsForLocale } from '../../i18n/posts';

export function getStaticPaths() {
	return SUPPORTED_LOCALES.map((lang) => ({ params: { lang } }));
}

export async function GET(context) {
	const langParam = context.params.lang ?? DEFAULT_LOCALE;
	const locale = isLocale(langParam) ? langParam : DEFAULT_LOCALE;
	const messages = getMessages(locale);
	const posts = await getCollection('blog');
	const sourcePosts = postsForLocale(posts, locale);
	return rss({
		title: SITE_TITLE,
		description: messages.blog.archiveDescription,
		site: context.site,
		items: sourcePosts.map((post) => ({
			...post.data,
			link: `/${locale}/blog/${post.id.split('/').slice(1).join('/')}/`,
		})),
	});
}
