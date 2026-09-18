/* global window, document, getComputedStyle */
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

const { defaultLocale } = JSON.parse(
  await readFile(new URL('./.generated-smoke-config.json', import.meta.url), 'utf8')
);

test('About reading status follows the panel gutter and falls back on narrow screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`/${defaultLocale}/about/`);
  const toast = page.locator('.hacker-toast');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(toast).toHaveClass(/visible/);
  await expect(toast).not.toHaveText('');
  for (const width of [1440, 1360, 1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    await expect
      .poll(async () => {
        return toast.evaluate((element) => {
          const panel = document.querySelector('.about-shell > .prose').getBoundingClientRect();
          const rect = element.getBoundingClientRect();
          const gap = parseFloat(getComputedStyle(document.documentElement).fontSize);
          const viewportWidth = document.documentElement.clientWidth;
          return window.innerWidth >= 1360
            ? Math.abs(rect.left - Math.ceil(panel.right) - 12) < 1 && rect.right <= viewportWidth
            : Math.abs(viewportWidth - rect.right - gap) < 2;
        });
      })
      .toBe(true);
    await expect(toast).toHaveCSS('bottom', '16px');
  }
});
