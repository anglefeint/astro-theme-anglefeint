import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false, screenshot: 'off', trace: 'off' });

test('article prose is readable without JavaScript', async ({ page }) => {
  await page.goto('/en/blog/starter-guide-1-configure-your-site/');
  const body = page.locator('.ai-prose-body');
  await expect(body.locator('p').first()).toHaveCSS('opacity', '1');
  await expect(body.locator('h2').first()).toHaveCSS('opacity', '1');
  await expect(body.locator('pre').first()).toHaveCSS('opacity', '1');
  await expect(body.locator('p').first()).toBeVisible();
});

test('Chinese machine indexes are decoded as UTF-8 without a charset response header', async ({
  page,
}) => {
  await page.goto('/zh/llms.txt');
  await expect(page.locator('body')).toContainText('使用指南');
  // Playwright evaluation remains available when website JavaScript is disabled.
  expect(await page.evaluate(() => globalThis.document.characterSet)).toBe('UTF-8');
});
