import { mkdir, writeFile, access, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const SUPPORTED_LOCALES = ['en', 'ja', 'ko', 'es', 'zh'];
const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content/blog');
const DEFAULT_COVERS_ROOT = path.resolve(process.cwd(), 'src/assets/blog/default-covers');

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

function hashString(input) {
	let hash = 5381;
	for (let i = 0; i < input.length; i += 1) {
		hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
	}
	return hash >>> 0;
}

function normalizePathForFrontmatter(filePath) {
	return filePath.split(path.sep).join('/');
}

async function loadDefaultCovers() {
	try {
		const entries = await readdir(DEFAULT_COVERS_ROOT, { withFileTypes: true });
		return entries
			.filter((entry) => entry.isFile() && /\.(webp|png|jpe?g)$/i.test(entry.name))
			.map((entry) => path.join(DEFAULT_COVERS_ROOT, entry.name))
			.sort((a, b) => a.localeCompare(b));
	} catch {
		return [];
	}
}

async function exists(filePath) {
	try {
		await access(filePath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

function templateFor(locale, slug, pubDate, heroImage) {
	const titleByLocale = {
		en: toTitleFromSlug(slug),
		ja: '新しい記事タイトル',
		ko: '새 글 제목',
		es: 'Titulo del nuevo articulo',
		zh: '新文章标题',
	};
	const descriptionByLocale = {
		en: `A short EN post scaffold for "${slug}".`,
		ja: `「${slug}」用の短い日本語記事テンプレートです。`,
		ko: `"${slug}"용 한국어 글 템플릿입니다.`,
		es: `Plantilla breve en espanol para "${slug}".`,
		zh: `“${slug}”的中文文章模板。`,
	};
	const bodyByLocale = {
		en: `Write your EN content for "${slug}" here.`,
		ja: `ここに「${slug}」の日本語本文を書いてください。`,
		ko: `여기에 "${slug}" 한국어 본문을 작성하세요.`,
		es: `Escribe aqui el contenido en espanol para "${slug}".`,
		zh: `请在这里填写“${slug}”的中文正文。`,
	};
	return `---
title: '${titleByLocale[locale]}'
subtitle: ''
description: '${descriptionByLocale[locale]}'
pubDate: '${pubDate}'
${heroImage ? `heroImage: '${heroImage}'` : ''}
---

${bodyByLocale[locale]}
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
	const defaultCovers = await loadDefaultCovers();
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

		let heroImage = '';
		if (defaultCovers.length > 0) {
			const coverPath = defaultCovers[hashString(slug) % defaultCovers.length];
			heroImage = normalizePathForFrontmatter(path.relative(localeDir, coverPath));
		}

		await writeFile(filePath, templateFor(locale, slug, pubDate, heroImage), 'utf8');
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
