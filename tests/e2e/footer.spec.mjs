/* global document, window */
import { test, expect } from '@playwright/test';

const footerLabels = {
  en: ['Theme by', 'Built with'],
  zh: ['主题：', '构建工具：'],
  ja: ['テーマ：', '構築：'],
  ko: ['테마:', '제작 도구:'],
  es: ['Tema de', 'Creado con'],
  'pt-br': ['Tema por', 'Feito com'],
  de: ['Theme von', 'Erstellt mit'],
  ru: ['Тема от', 'Создано на'],
  'zh-hant': ['佈景主題：', '建置工具：'],
};

for (const [locale, labels] of Object.entries(footerLabels)) {
  test(`${locale}: footer groups fit all four scenes`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [1440, 721, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const suffix of ['', 'blog/', 'about/', 'blog/welcome-to-anglefeint/']) {
        await page.goto(`/${locale}/${suffix}`);
        const footer = page.locator('footer');
        for (const label of labels)
          await expect(footer.locator('.footer-credits')).toContainText(label);
        await expect(footer.locator('.footer-tagline')).toHaveCount(0);
        const copyright = await footer.locator('.footer-copyright').boundingBox();
        const credits = await footer.locator('.footer-credits').boundingBox();
        expect(credits.y).toBeGreaterThanOrEqual(copyright.y + copyright.height);
        for (const element of await footer
          .locator('.footer-content, .footer-credits > span, .social-links')
          .all()) {
          const bounds = await element.boundingBox();
          expect(bounds.x).toBeGreaterThanOrEqual(-1);
          expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
        }
      }
    }
  });
}

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
