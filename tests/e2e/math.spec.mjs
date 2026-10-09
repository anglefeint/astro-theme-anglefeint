/* global document, innerWidth */
import { test, expect } from '@playwright/test';

for (const locale of ['en', 'zh', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru', 'zh-hant']) {
  test(`${locale}: math is accessible, styled and scrolls without widening the article`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/${locale}/blog/starter-guide-3-comments-about-and-theme-toggles/`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.anglefeint-math-inline .katex')).toHaveCount(1);
    await expect(page.locator('.anglefeint-math-display math')).toHaveCount(1);
    await expect(page.locator('.anglefeint-math-display mfrac')).toHaveCount(1);
    const stylesheet = page.locator('link[rel="stylesheet"][href*="math."]');
    await expect(stylesheet).toHaveCount(1);
    const css = await (await page.request.get(await stylesheet.getAttribute('href'))).text();
    expect(css).toContain('@font-face');
    expect(css).not.toContain('@import');
    for (const width of [320, 390, 721, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      ).toBeLessThanOrEqual(1);
      const block = page.locator('.anglefeint-math-display');
      await expect(block).toHaveCSS('overflow-x', 'auto');
      if (width === 320) {
        const start = await block.evaluate((e) => {
          e.scrollLeft = 0;
          return {
            left: e.getBoundingClientRect().left,
            formulaLeft: e.querySelector('.katex-html').getBoundingClientRect().left,
          };
        });
        expect(start.formulaLeft).toBeGreaterThanOrEqual(start.left - 1);
        expect(await block.evaluate((e) => e.scrollWidth > e.clientWidth)).toBe(true);
        expect(
          await block.evaluate((e) => {
            e.scrollLeft = 80;
            return e.scrollLeft;
          })
        ).toBeGreaterThan(0);
      }
      if (locale === 'en' && width === 390) {
        await block.evaluate((element) =>
          element.scrollIntoView({ block: 'center', behavior: 'instant' })
        );
        await page.screenshot({
          path: testInfo.outputPath('math-mobile.png'),
          animations: 'disabled',
        });
      }
    }
    await expect(page.locator('.anglefeint-math [data-copy-code]')).toHaveCount(0);
  });
}
