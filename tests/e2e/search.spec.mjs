import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`full-text search is lazy, accessible and localized at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const requests = [];
    page.on('request', (request) => {
      if (request.url().includes('/pagefind/')) requests.push(request.url());
    });
    await page.goto('/zh/blog/');
    expect(requests).toHaveLength(0);
    const trigger = page.getByRole('button', { name: '搜索', exact: true });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const input = dialog.getByRole('searchbox');
    await expect(input).toBeFocused();
    await dialog.getByRole('heading', { name: '搜索', exact: true }).click();
    await expect(dialog).toBeVisible();
    const headingBox = await dialog.getByRole('heading').boundingBox();
    await page.mouse.move(headingBox.x + 5, headingBox.y + 5);
    await page.mouse.down();
    await page.mouse.move(2, 2);
    await page.mouse.up();
    await expect(dialog).toBeVisible();
    await page.mouse.click(2, 2);
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(input).toBeFocused();
    await input.fill('mastodon'); // In the starter guide body, absent from its title.
    await expect(dialog.locator('.search-results a').first()).toBeVisible();
    const urls = await dialog
      .locator('.search-results a')
      .evaluateAll((links) => links.map((link) => link.pathname));
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.every((url) => url.startsWith('/zh/blog/'))).toBe(true);
    await expect(dialog.locator('mark').first()).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await input.fill('no-such-article-719286');
    await expect(dialog.getByRole('status')).toHaveText('没有找到匹配的文章。');
    await input.fill('mastodon');
    await expect(dialog.locator('.search-results a').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(dialog.locator('.search-results a').first()).toBeVisible();
    await dialog.locator('.search-results a').first().click();
    await expect(page).toHaveURL(/\/zh\/blog\/[^/]+\//);
  });
}

test('search retries failed resources and does not show stale results', async ({ page }) => {
  await page.goto('/en/blog/');
  await page.route('**/pagefind/anglefeint.json', (route) => route.abort());
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Retry', exact: true })).toBeVisible();
  await dialog.getByRole('searchbox').fill('mastodon');
  await expect(dialog.getByRole('button', { name: 'Retry', exact: true })).toBeVisible();
  await page.unroute('**/pagefind/anglefeint.json');
  await dialog.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(dialog.locator('.search-results a').first()).toBeVisible();
  await dialog.getByRole('searchbox').fill('astro');
  await dialog.getByRole('searchbox').fill('no-such-article-719286');
  await expect(dialog.getByRole('status')).toHaveText('No matching articles.');
  await expect(dialog.locator('.search-results a')).toHaveCount(0);
});

for (const locale of ['en', 'ja', 'ko', 'es']) {
  test(`search stays in the ${locale} index`, async ({ page }) => {
    await page.goto(`/${locale}/blog/`);
    await page.locator('[data-search-open]').click();
    // Every starter locale includes this term in its configuration guide body.
    await page.getByRole('searchbox').fill('Anglefeint');
    await expect(page.locator('.search-results a').first()).toBeVisible();
    const paths = await page
      .locator('.search-results a')
      .evaluateAll((links) => links.map((link) => link.pathname));
    expect(paths.every((url) => url.startsWith(`/${locale}/blog/`))).toBe(true);
  });
}
