import { test, expect } from '@playwright/test';
import { readdir } from 'node:fs/promises';
import { URL } from 'node:url';
import { parse } from 'node-html-parser';

test('home counters reflect localized posts and the rendered latest records', async ({
  request,
}) => {
  for (const locale of ['en', 'zh', 'zh-hant', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru']) {
    const response = await request.get(`/${locale}/`);
    expect(response.ok()).toBeTruthy();
    const doc = parse(await response.text());
    const sourceFiles = await readdir(
      new URL(`../../src/content/blog/${locale}/`, import.meta.url)
    );
    const total = sourceFiles.filter((name) => /\.mdx?$/.test(name)).length;
    const shown = doc.querySelectorAll('.home-post-record').length;
    expect(doc.querySelector('.home-latest-count').textContent.trim()).toBe(
      `${String(shown).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
    );
  }
});
