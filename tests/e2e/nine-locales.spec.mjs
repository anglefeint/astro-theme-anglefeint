/* global document, innerWidth, URL */
import { test, expect } from '@playwright/test';

const cases = [
  ['pt-br', 'pt-BR', 'Buscar', 'publicação'],
  ['de', 'de', 'Suche', 'Veröffentlichung'],
  ['ru', 'ru', 'Поиск', 'публикации'],
  ['zh-hant', 'zh-Hant', '搜尋', '發布'],
];

for (const [locale, language, searchLabel, term] of cases) {
  test(`${locale}: navigation, metadata, mobile layout and actual localized search`, async ({
    page,
  }) => {
    for (const width of [1280, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['', 'blog/', 'about/', 'blog/starter-guide-2-languages-and-routing/']) {
        await page.goto(`/${locale}/${route}`);
        await expect(page.locator('html')).toHaveAttribute('lang', language);
        await expect(page.locator('#lang-select option')).toHaveCount(9);
        // Entrance transforms can temporarily extend outside the viewport.
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), {
            message: `${locale}/${route} at ${width}px must not overflow`,
          })
          .toBe(true);
        const menu = await page.locator('#lang-select').boundingBox();
        expect(menu.x).toBeGreaterThanOrEqual(0);
        expect(menu.x + menu.width).toBeLessThanOrEqual(width);
      }
    }
    await page.goto(`/${locale}/blog/`);
    await page.getByRole('button', { name: searchLabel, exact: true }).click();
    await page.getByRole('searchbox').fill(term);
    const links = page.locator('.search-results a');
    await expect(links.first()).toBeVisible();
    expect(
      await links.evaluateAll(
        (items, locale) =>
          items.every((a) => new URL(a.href).pathname.startsWith(`/${locale}/blog/`)),
        locale
      )
    ).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await page.goto(`/${locale}/blog/welcome-to-anglefeint/`);
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute(
      'href',
      /\/pt-br\/blog\/welcome-to-anglefeint\/$/
    );
    await expect(page.locator('link[rel="alternate"][hreflang="zh-Hant"]')).toHaveAttribute(
      'href',
      /\/zh-hant\/blog\/welcome-to-anglefeint\/$/
    );
    const image = await page.locator('meta[property="og:image"]').getAttribute('content');
    const response = await page.request.get(new URL(image).pathname);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/png');
  });
}
