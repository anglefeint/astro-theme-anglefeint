import { access, mkdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const THEMES = ['base', 'cyber', 'ai', 'hacker', 'matrix'];
const PAGES_ROOT = path.resolve(process.cwd(), 'src/pages/[lang]');
const LAYOUT_BY_THEME = {
	base: 'BasePageLayout',
	ai: 'AiPageLayout',
	cyber: 'CyberPageLayout',
	hacker: 'HackerPageLayout',
	matrix: 'MatrixPageLayout',
};

function usage() {
	console.error('Usage: npm run new-page -- <slug> [--theme <base|cyber|ai|hacker|matrix>]');
}

function parseArgs(argv) {
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

function validateSlug(slug) {
	if (!slug) return false;
	if (slug.startsWith('/') || slug.endsWith('/')) return false;
	const parts = slug.split('/');
	return parts.every((part) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part));
}

function toTitleFromSlug(slug) {
	const leaf = slug.split('/').pop() ?? slug;
	return leaf
		.split('-')
		.filter(Boolean)
		.map((segment) => segment[0].toUpperCase() + segment.slice(1))
		.join(' ');
}

async function exists(filePath) {
	try {
		await access(filePath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

function templateFor({ slug, theme }) {
	const title = toTitleFromSlug(slug) || 'New Page';
	const layoutName = LAYOUT_BY_THEME[theme];
	return `---
import type { GetStaticPaths } from 'astro';
import ${layoutName} from '@anglefeint/astro-theme/layouts/${layoutName}.astro';
import { SUPPORTED_LOCALES } from '@anglefeint/astro-theme/i18n/config';

export const getStaticPaths = (() => SUPPORTED_LOCALES.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

const locale = Astro.params.lang;
const pageTitle = '${title}';
const pageDescription = 'A custom page built from the ${theme} theme shell.';
---

<${layoutName} locale={locale} title={pageTitle} description={pageDescription}>
\t<h1>${title}</h1>
\t<p>Replace this content with your own page content.</p>
</${layoutName}>
`;
}

async function main() {
	const { slug, theme: rawTheme } = parseArgs(process.argv);
	const theme = String(rawTheme || '').toLowerCase();

	if (!slug) {
		usage();
		process.exit(1);
	}
	if (!validateSlug(slug)) {
		console.error('Invalid page slug. Use lowercase letters, numbers, hyphens, and optional nested paths.');
		process.exit(1);
	}
	if (!THEMES.includes(theme)) {
		console.error(`Invalid theme "${rawTheme}". Use one of: ${THEMES.join(', ')}.`);
		process.exit(1);
	}

	const targetPath = path.join(PAGES_ROOT, `${slug}.astro`);

	if (await exists(targetPath)) {
		console.error(`File already exists: ${targetPath}`);
		process.exit(1);
	}

	const targetDir = path.dirname(targetPath);
	await mkdir(targetDir, { recursive: true });
	await writeFile(
		targetPath,
		templateFor({ slug, theme }),
		'utf8',
	);

	console.log(`Created page: ${targetPath}`);
	console.log(`Theme: ${theme}`);
	console.log('This route is generated for all locales via getStaticPaths().');
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
