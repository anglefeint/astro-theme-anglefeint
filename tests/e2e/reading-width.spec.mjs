/* global document, innerWidth, getComputedStyle */
import { test, expect } from '@playwright/test';

for (const locale of ['en', 'zh', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru', 'zh-hant']) {
  test(`${locale}: reading panels fit around the desktop breakpoint and keep wide-screen width`, async ({
    page,
  }) => {
    // This measures our reading panels, not the remote comment provider. Each
    // viewport navigates again; live widgets otherwise add network waits to all
    // ten article loads. Provider behavior is covered by the comment tests.
    await page.route('https://giscus.app/**', (route) =>
      route.fulfill({ contentType: 'application/javascript', body: '' })
    );
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
        if (width === 1440) expect(geometry.contentWidth).toBe(selector === 'main' ? 720 : 780);
      }
    }
  });
}
