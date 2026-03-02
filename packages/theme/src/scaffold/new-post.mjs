import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { hashString, normalizePathForFrontmatter, toTitleFromSlug, validatePostSlug } from './shared.mjs';

export function usageNewPost() {
	return 'Usage: npm run new-post -- <slug>';
}

export function buildNewPostTemplate(locale, slug, pubDate, heroImage) {
	const titleByLocale = {
		en: toTitleFromSlug(slug),
		ja: '新しい記事タイトル',
		ko: '새 글 제목',
		es: 'Título del nuevo artículo',
		zh: '新文章标题',
	};
	const descriptionByLocale = {
		en: `A short EN post scaffold for "${slug}".`,
		ja: `「${slug}」用の短い日本語記事テンプレートです。`,
		ko: `"${slug}"용 한국어 글 템플릿입니다.`,
		es: `Plantilla breve en español para "${slug}".`,
		zh: `“${slug}”的中文文章模板。`,
	};
	const bodyByLocale = {
		en: `Write your EN content for "${slug}" here.`,
		ja: `ここに「${slug}」の日本語本文を書いてください。`,
		ko: `여기에 "${slug}" 한국어 본문을 작성하세요.`,
		es: `Escribe aquí el contenido en español para "${slug}".`,
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

export async function loadDefaultCovers(defaultCoversRoot) {
	try {
		const entries = await readdir(defaultCoversRoot, { withFileTypes: true });
		return entries
			.filter((entry) => entry.isFile() && /\.(webp|png|jpe?g)$/i.test(entry.name))
			.map((entry) => path.join(defaultCoversRoot, entry.name))
			.sort((a, b) => a.localeCompare(b));
	} catch {
		return [];
	}
}

export function pickDefaultCoverBySlug(slug, localeDir, defaultCovers) {
	if (defaultCovers.length === 0) return '';
	const coverPath = defaultCovers[hashString(slug) % defaultCovers.length];
	return normalizePathForFrontmatter(path.relative(localeDir, coverPath));
}

export { validatePostSlug };
