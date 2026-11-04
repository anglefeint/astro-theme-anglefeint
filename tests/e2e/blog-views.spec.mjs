/* global window, getComputedStyle */
import { test, expect } from '@playwright/test';
import { URL } from 'node:url';

test.use({ screenshot: 'off' });

test('keyboard article focus enhances cover reflection without pointer hover', async ({ page }) => {
  await page.goto('/en/blog/');
  await page.mouse.move(0, 0);
  const link = page.locator('.archive-post-link').first();
  const cover = page.locator('.blog-entry .img-wrapper').first();
  await page.locator('[data-blog-view="cards"]').focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  await expect
    .poll(() => cover.evaluate((element) => getComputedStyle(element, '::after').opacity))
    .toBe('1');
  await page.locator('[data-blog-view="cards"]').focus();
  await expect
    .poll(() => cover.evaluate((element) => getComputedStyle(element, '::after').opacity))
    .toBe('0.65');
});

test('list tags navigate to their archive independently of the article', async ({ page }) => {
  await page.goto('/en/blog/');
  await page.locator('[data-blog-view="list"]').click();
  const tag = page.locator('.archive-tags a').first();
  const href = await tag.getAttribute('href');
  await tag.click();
  await expect(page).toHaveURL(new URL(href, page.url()).href);
  await expect(page.locator('[data-blog-browser]')).toHaveAttribute('data-view', 'list');
  await page.locator('.archive-post-link').first().click();
  await expect(page).toHaveURL(/\/en\/blog\/[^/]+\/?$/);
});

test('archive view persists across reloads, locales and tag archives', async ({ page }) => {
  await page.goto('/en/blog/');
  const browser = page.locator('[data-blog-browser]');
  await expect(page.locator('.blog-view-toolbar')).toHaveClass(/\bneon-v[1-9]\b/);
  await expect(browser).toHaveAttribute('data-view', 'cards');
  const hrefs = await browser
    .locator('li .archive-post-link')
    .evaluateAll((links) => links.map((a) => a.href));
  await page.locator('[data-blog-view="list"]').click();
  await expect(browser).toHaveAttribute('data-view', 'list');
  await expect(browser.locator('.img-wrapper').first()).toBeHidden();
  await expect(browser.locator('.archive-index').first()).toBeVisible();
  await expect(browser.locator('.archive-arrow').first()).toBeVisible();
  await expect(browser.locator('.archive-numeric-date').first()).toHaveText(
    /^\s*\d{4}\.\d{2}\.\d{2}\s*$/
  );
  await expect(page.locator('[data-blog-view="list"]')).toHaveAttribute('aria-pressed', 'true');
  expect(
    await browser.locator('li .archive-post-link').evaluateAll((links) => links.map((a) => a.href))
  ).toEqual(hrefs);
  await page.reload();
  await expect(browser).toHaveAttribute('data-view', 'list');
  await page.goto('/zh/blog/');
  await expect(browser).toHaveAttribute('data-view', 'list');
  await page.goto('/en/tags/');
  await page.locator('main a[href*="/tags/"]').first().click();
  await expect(browser).toHaveAttribute('data-view', 'list');
  await page.locator('[data-blog-view="cards"]').click();
  await page.goto('/en/blog/');
  await expect(browser).toHaveAttribute('data-view', 'cards');
  await expect(browser.locator('.archive-index').first()).toBeHidden();
  await expect(browser.locator('.img-wrapper').first()).toBeVisible();
});

test('list ranges and row numbers continue on the next static page', async ({ page }) => {
  await page.goto('/en/blog/');
  await page.locator('[data-blog-view="list"]').click();
  const firstCount = await page.locator('.blog-cards > li').count();
  const total = (await page.locator('.archive-count').innerText()).split('/').at(-1).trim();
  if (Number(total) <= firstCount) return;
  await page.goto('/en/blog/2/');
  await expect(page.locator('.archive-index').first()).toHaveText(
    String(firstCount + 1).padStart(2, '0')
  );
  const secondCount = await page.locator('.blog-cards > li').count();
  await expect(page.locator('.archive-count')).toHaveText(
    `${String(firstCount + 1).padStart(2, '0')}–${String(firstCount + secondCount).padStart(2, '0')} / ${total}`
  );
});

test('switching works when local storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage blocked');
      },
    });
  });
  await page.goto('/en/blog/');
  await page.locator('[data-blog-view="list"]').click();
  await expect(page.locator('[data-blog-browser]')).toHaveAttribute('data-view', 'list');
  await page.reload();
  await expect(page.locator('[data-blog-browser]')).toHaveAttribute('data-view', 'cards');
});

test('without JavaScript article links remain usable and controls stay hidden', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/en/blog/`);
  await expect(page.locator('.blog-view-toolbar')).toBeHidden();
  expect(await page.locator('.blog-cards li .archive-post-link').count()).toBeGreaterThan(0);
  await context.close();
});
