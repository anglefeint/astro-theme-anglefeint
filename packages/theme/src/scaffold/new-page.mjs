import { toTitleFromSlug, validatePageSlug } from './shared.mjs';

export const THEMES = ['base', 'cyber', 'ai', 'hacker', 'matrix'];

export const LAYOUT_BY_THEME = {
	base: 'BasePageLayout',
	ai: 'AiPageLayout',
	cyber: 'CyberPageLayout',
	hacker: 'HackerPageLayout',
	matrix: 'MatrixPageLayout',
};

export function parseNewPageArgs(argv) {
	const args = argv.slice(2);
	const positional = [];
	let theme = 'base';

	for (let i = 0; i < args.length; i += 1) {
		const token = args[i];
		if (token === '--theme') {
			theme = args[i + 1] ?? '';
			i += 1;
			continue;
		}
		positional.push(token);
	}

	return { slug: positional[0], theme };
}

export function isValidNewPageTheme(theme) {
	return THEMES.includes(theme);
}

export function usageNewPage() {
	return 'Usage: npm run new-page -- <slug> [--theme <base|cyber|ai|hacker|matrix>]';
}

export function buildNewPageTemplate({ slug, theme }) {
	const title = toTitleFromSlug(slug) || 'New Page';
	const layoutName = LAYOUT_BY_THEME[theme];

	return `---
import type { GetStaticPaths } from 'astro';
import ${layoutName} from '@anglefeint/astro-theme/layouts/${layoutName}.astro';
import { SUPPORTED_LOCALES, type Locale } from '@anglefeint/site-i18n/config';

export const getStaticPaths = (() => SUPPORTED_LOCALES.map((lang: Locale) => ({ params: { lang } }))) satisfies GetStaticPaths;

const locale = Astro.params.lang as Locale;
const pageTitle = '${title}';
const pageDescription = 'A custom page built from the ${theme} theme shell.';
---

<${layoutName} locale={locale} title={pageTitle} description={pageDescription}>
\t<h1>${title}</h1>
\t<p>Replace this content with your own page content.</p>
</${layoutName}>
`;
}

export { validatePageSlug };
