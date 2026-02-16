import type { APIRoute } from 'astro';
import { SITE_URL } from '../consts';

/**
 * Dynamically generate robots.txt with correct sitemap reference.
 * RSS feeds are discoverable via <link rel="alternate" type="application/rss+xml"> in page HTML.
 */
export const GET: APIRoute = ({ site }) => {
	const base = site ?? SITE_URL;
	const sitemapURL = new URL('/sitemap-index.xml', base).toString();

	const body = `User-agent: *
Allow: /

Sitemap: ${sitemapURL}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
