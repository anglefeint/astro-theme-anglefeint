import { access, mkdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import {
	buildNewPageTemplate,
	isValidNewPageTheme,
	parseNewPageArgs,
	usageNewPage,
	validatePageSlug,
} from './scaffold/new-page.mjs';

const PAGES_ROOT = path.resolve(process.cwd(), 'src/pages/[lang]');

async function exists(filePath) {
	try {
		await access(filePath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

async function main() {
	const { slug, theme: rawTheme } = parseNewPageArgs(process.argv);
	const theme = String(rawTheme || '').toLowerCase();

	if (!slug) {
		console.error(usageNewPage());
		process.exit(1);
	}
	if (!validatePageSlug(slug)) {
		console.error('Invalid page slug. Use lowercase letters, numbers, hyphens, and optional nested paths.');
		process.exit(1);
	}
	if (!isValidNewPageTheme(theme)) {
		console.error('Invalid theme. Use one of: base, cyber, ai, hacker, matrix.');
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
		buildNewPageTemplate({ slug, theme }),
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
