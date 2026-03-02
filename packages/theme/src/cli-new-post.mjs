import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { SUPPORTED_LOCALES } from './i18n/locales.mjs';
import {
	buildNewPostTemplate,
	loadDefaultCovers,
	pickDefaultCoverBySlug,
	usageNewPost,
	validatePostSlug,
} from './scaffold/new-post.mjs';

const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content/blog');
const DEFAULT_COVERS_ROOT = path.resolve(process.cwd(), 'src/assets/blog/default-covers');

async function exists(filePath) {
	try {
		await access(filePath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

async function main() {
	const slug = process.argv[2];
	if (!slug) {
		console.error(usageNewPost());
		process.exit(1);
	}

	if (!validatePostSlug(slug)) {
		console.error('Invalid slug. Use lowercase letters, numbers, and hyphens only.');
		process.exit(1);
	}

	const pubDate = new Date().toISOString().slice(0, 10);
	const defaultCovers = await loadDefaultCovers(DEFAULT_COVERS_ROOT);
	const created = [];
	const skipped = [];

	for (const locale of SUPPORTED_LOCALES) {
		const localeDir = path.join(CONTENT_ROOT, locale);
		const filePath = path.join(localeDir, `${slug}.md`);
		await mkdir(localeDir, { recursive: true });

		if (await exists(filePath)) {
			skipped.push(filePath);
			continue;
		}

		const heroImage = pickDefaultCoverBySlug(slug, localeDir, defaultCovers);

		await writeFile(filePath, buildNewPostTemplate(locale, slug, pubDate, heroImage), 'utf8');
		created.push(filePath);
	}

	if (created.length > 0) {
		console.log('Created files:');
		for (const filePath of created) console.log(`- ${filePath}`);
	}

	if (skipped.length > 0) {
		console.log('Skipped existing files:');
		for (const filePath of skipped) console.log(`- ${filePath}`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
