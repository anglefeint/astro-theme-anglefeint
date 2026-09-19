/* global document, window */
import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`demo footer credits and translated content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const locale of ['en', 'zh', 'ja', 'ko', 'es']) {
      await page.goto(`/${locale}/about/`);
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toContainText('Anglefeint');
      await expect(footer.getByRole('link', { name: 'Anglefeint', exact: true })).toHaveAttribute(
        'href',
        'https://github.com/anglefeint/astro-theme-anglefeint'
      );
      await expect(footer.getByRole('link', { name: 'Astro', exact: true })).toHaveAttribute(
        'href',
        'https://astro.build/'
      );
      await expect(footer).not.toContainText('All rights reserved');
      await expect(page.locator('main')).not.toContainText('Write a short introduction');
      await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
      ).toBe(true);
    }
  });
}
