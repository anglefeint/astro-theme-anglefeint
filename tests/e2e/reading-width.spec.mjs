/* global document, innerWidth, getComputedStyle */
import { test, expect } from '@playwright/test';

for (const locale of ['en', 'zh', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru', 'zh-hant']) {
  test(`${locale}: reading panels fit around the desktop breakpoint and keep wide-screen width`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [320, 390, 720, 721, 740, 768, 800, 820, 900, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [route, selector] of [
        [`/${locale}/`, 'main'],
        [`/${locale}/blog/welcome-to-anglefeint/`, 'main .prose'],
      ]) {
        await page.goto(route);
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth), {
            message: `${route} at ${width}px must not overflow`,
          })
          .toBeLessThanOrEqual(1);
        const panel = page.locator(selector).first();
        const geometry = await panel.evaluate((e) => {
          const r = e.getBoundingClientRect(),
            s = getComputedStyle(e);
          return { left: r.left, right: r.right, contentWidth: parseFloat(s.width) };
        });
        expect(geometry.left).toBeGreaterThanOrEqual(-1);
        expect(geometry.right).toBeLessThanOrEqual(width + 1);
        if (width === 1440) expect(geometry.contentWidth).toBe(720);
      }
    }
  });
}
