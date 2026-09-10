#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  buildNewPostTemplate,
  loadDefaultCovers,
  parseNewPostArgs,
  pickDefaultCoverBySlug,
  resolveLocales,
  usageNewPost,
  validatePostSlug,
} from './scaffold/new-post.mjs';
import { loadProjectLocales } from './scaffold/project-config.mjs';

async function main() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs.includes('--help') || rawArgs.includes('-h') || rawArgs[0] === 'help') {
    console.log(usageNewPost());
    return;
  }
  const { slug, locales: cliLocales } = parseNewPostArgs(process.argv);
  if (!slug) throw new Error(usageNewPost());
  if (!validatePostSlug(slug)) {
    throw new Error('Invalid slug. Use lowercase letters, numbers, and hyphens only.');
  }

  const envLocales = process.env.ANGLEFEINT_LOCALES ?? '';
  const locales = resolveLocales({
    cliLocales,
    envLocales,
    defaultLocales: cliLocales || envLocales ? [] : await loadProjectLocales(process.cwd()),
  });
  const contentRoot = path.resolve('src/content/blog');
  const defaultCovers = await loadDefaultCovers(path.resolve('src/assets/blog/default-covers'));
  const pubDate = new Date().toISOString().slice(0, 10);
  const created = [];
  const skipped = [];

  for (const locale of locales) {
    const localeDir = path.join(contentRoot, locale);
    const filePath = path.join(localeDir, `${slug}.md`);
    await mkdir(localeDir, { recursive: true });
    const heroImage = pickDefaultCoverBySlug(slug, localeDir, defaultCovers);
    try {
      await writeFile(filePath, buildNewPostTemplate(locale, slug, pubDate, heroImage), {
        encoding: 'utf8',
        flag: 'wx',
      });
      created.push(filePath);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      skipped.push(filePath);
    }
  }
  if (created.length)
    console.log(`Created files:\n${created.map((file) => `- ${file}`).join('\n')}`);
  if (skipped.length)
    console.log(`Skipped existing files:\n${skipped.map((file) => `- ${file}`).join('\n')}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
