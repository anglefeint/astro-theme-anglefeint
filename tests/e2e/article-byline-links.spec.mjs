/* global navigator */
import { test, expect } from '@playwright/test';
import { URL } from 'node:url';

test.use({ screenshot: 'off', trace: 'off' });

test('localized bylines match structured author URLs', async ({ page }) => {
  for (const locale of ['en', 'zh', 'zh-hant', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru']) {
    await page.goto(`/${locale}/blog/starter-guide-1-configure-your-site/`);
    const author = page.locator('.ai-article-author a');
    await expect(author).toHaveAttribute('href', `/${locale}/about/`);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const article = schemas
      .flatMap((text) => JSON.parse(text))
      .find((item) => item['@type'] === 'BlogPosting');
    await expect(author).toHaveText(article.author.name);
    expect(new URL(article.author.url).pathname).toBe(`/${locale}/about/`);
  }
});

for (const width of [1440, 390]) {
  test(`heading links copy canonical section URLs at ${width}px`, async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/zh/blog/starter-guide-1-configure-your-site/?from=copy-test');
    const heading = page.locator('.ai-prose-body h2[id]').first();
    const id = await heading.getAttribute('id');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    const expected = new URL(canonical);
    expected.hash = id;
    const link = heading.locator('[data-section-link]');
    await expect(link).toHaveAttribute('href', expected.href);
    await expect(link).not.toHaveClass(/ai-link-preview/);
    await expect(link).not.toHaveAttribute('data-preview');
    await expect(link).toHaveAttribute('title', '复制本节链接');
    await link.press('Enter');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected.href);
    await expect(heading.getByRole('status')).toHaveText('已复制');
    await expect(heading).toHaveAttribute('id', id);
  });
}

test('clipboard rejection exposes the exact URL for manual copying', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('denied');
        },
      },
    })
  );
  await page.goto('/en/blog/starter-guide-1-configure-your-site/');
  const link = page.locator('[data-section-link]').first();
  const expected = await link.getAttribute('href');
  await link.press('Enter');
  const input = page.locator('.ai-section-feedback input');
  await expect(input).toHaveValue(expected);
  await expect(input).toBeFocused();
});
