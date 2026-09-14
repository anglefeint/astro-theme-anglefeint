import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`tag navigation and article links work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/zh/blog/');
    await page.locator('.tag-links a[href$="/tags/"]').click();
    await expect(page.locator('h1')).toHaveText('标签');
    const tag = page.locator('.tag-item').filter({ hasText: 'anglefeint' });
    await expect(tag.locator('.tag-count')).toHaveText('4');
    const box = await tag.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    await tag.click();
    await expect(page).toHaveURL(/\/zh\/tags\/anglefeint\/$/);
    await expect(page.locator('.tag-heading h1')).toContainText('anglefeint');
    await expect(page.locator('link[hreflang]')).toHaveCount(0);
    const cards = page.locator('section ul > li > a');
    await expect(cards).toHaveCount(4);
    for (const href of await cards.evaluateAll((items) =>
      items.map((item) => item.getAttribute('href'))
    ))
      expect(href).toMatch(/^\/zh\/blog\//);
    await cards.first().click();
    await expect(
      page.locator('.article-tags a[rel="tag"]').filter({ hasText: 'anglefeint' })
    ).toHaveAttribute('href', '/zh/tags/anglefeint/');
  });
}

test('tag counts and labels are localized independently', async ({ page }) => {
  for (const [locale, label] of [
    ['en', 'Tags'],
    ['ja', 'タグ'],
    ['ko', '태그'],
    ['es', 'Etiquetas'],
  ]) {
    await page.goto(`/${locale}/tags/`);
    await expect(page.locator('h1')).toHaveText(label);
    await expect(
      page.locator('.tag-item').filter({ hasText: 'anglefeint' }).locator('.tag-count')
    ).toHaveText('4');
  }
});
