import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { SUPPORTED_LOCALES } from './i18n/locales.mjs';
import {
	buildNewPostTemplate,
	loadDefaultCovers,
	parseNewPostArgs,
	pickDefaultCoverBySlug,
	resolveLocales,
	usageNewPost,
	validatePostSlug,
} from './scaffold/new-post.mjs';

const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content/blog');
const DEFAULT_COVERS_ROOT = path.resolve(process.cwd(), 'src/assets/blog/default-covers');
const SITE_CONFIG_PATH = path.resolve(process.cwd(), 'src/site.config.ts');

async function exists(filePath) {
	try {
		await access(filePath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

function parseSupportedLocalesFromConfig(configSource) {
	const localeArrayPattern = /supportedLocales\s*:\s*\[([\s\S]*?)\]/g;
	let match = null;
	let picked = '';

	while (true) {
		const next = localeArrayPattern.exec(configSource);
		if (!next) break;
		const body = next[1] ?? '';
		if (body.includes("'") || body.includes('"')) {
			match = next;
			picked = body;
		}
	}

	if (!match || !picked) return [];
	const localeMatches = picked.match(/['"]([a-z]{2,3}(?:-[a-z0-9]+)?)['"]/gi) || [];
	return localeMatches.map((token) => token.slice(1, -1).toLowerCase());
}

async function resolveProjectLocales() {
	try {
		const configSource = await readFile(SITE_CONFIG_PATH, 'utf8');
		const locales = parseSupportedLocalesFromConfig(configSource);
		if (locales.length === 0) return [];
		return Array.from(new Set(locales));
	} catch {
		return [];
	}
}

async function main() {
	const { slug, locales: cliLocales } = parseNewPostArgs(process.argv);
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
	const projectLocales = await resolveProjectLocales();
	const locales = resolveLocales({
		cliLocales,
		envLocales: process.env.ANGLEFEINT_LOCALES ?? '',
		defaultLocales: projectLocales.length > 0 ? projectLocales : SUPPORTED_LOCALES,
	});
	const created = [];
	const skipped = [];

	for (const locale of locales) {
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
