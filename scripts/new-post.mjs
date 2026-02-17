import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const SUPPORTED_LOCALES = ['en', 'ja', 'ko', 'es', 'zh'];
const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content/blog');

function toTitleFromSlug(slug) {
	return slug
		.split('-')
		.filter(Boolean)
		.map((segment) => segment[0].toUpperCase() + segment.slice(1))
		.join(' ');
}

function validateSlug(slug) {
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

async function exists(filePath) {
	try {
		await access(filePath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

function templateFor(locale, slug, pubDate) {
	const title = toTitleFromSlug(slug);
	return `---
title: '${title}'
description: 'A short ${locale.toUpperCase()} post scaffold for this slug.'
pubDate: '${pubDate}'
---

Write your ${locale.toUpperCase()} content for "${slug}" here.
`;
}

async function main() {
	const slug = process.argv[2];
	if (!slug) {
		console.error('Usage: npm run new-post -- <slug>');
		process.exit(1);
	}

	if (!validateSlug(slug)) {
		console.error('Invalid slug. Use lowercase letters, numbers, and hyphens only.');
		process.exit(1);
	}

	const pubDate = new Date().toISOString().slice(0, 10);
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

		await writeFile(filePath, templateFor(locale, slug, pubDate), 'utf8');
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

