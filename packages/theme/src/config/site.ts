import type { Locale } from '../i18n/config';

/**
 * Site identity config. Override via environment variables:
 *   PUBLIC_SITE_URL, PUBLIC_SITE_TITLE, PUBLIC_SITE_AUTHOR, PUBLIC_SITE_DESCRIPTION, PUBLIC_SITE_TAGLINE
 */
const env = import.meta.env;

export const SITE_TITLE = (env.PUBLIC_SITE_TITLE as string | undefined) ?? 'My Blog';
export const SITE_DESCRIPTION =
	(env.PUBLIC_SITE_DESCRIPTION as string | undefined) ??
	'Cinematic web interfaces, AI-era engineering notes, and system architecture essays.';
export const SITE_URL = (env.PUBLIC_SITE_URL as string | undefined) ?? (env.SITE as string | undefined) ?? 'https://anglefeint.com';
export const SITE_AUTHOR = (env.PUBLIC_SITE_AUTHOR as string | undefined) ?? 'Your Name';
export const SITE_TAGLINE = (env.PUBLIC_SITE_TAGLINE as string | undefined) ?? 'Built with Astro.';

export const SITE_HERO_BY_LOCALE: Record<Locale, string> = {
	en: 'Write a short introduction for your site and what readers can expect from your posts.',
	ja: 'このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。',
	ko: '사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.',
	es: 'Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores.',
	zh: '在这里写一段站点简介，并告诉读者你将发布什么类型的内容。',
};
