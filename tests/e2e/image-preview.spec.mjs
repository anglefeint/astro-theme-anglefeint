/* global document, window */
import { test, expect } from '@playwright/test';
import { Buffer } from 'node:buffer';

for (const width of [1440, 390]) {
  test(`article images open and dismiss without losing reading position at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Inject images into this browser response only; no public test article or assets.
    await page.route('**/zh/blog/starter-guide-1-configure-your-site/', async (route) => {
      const response = await route.fetch();
      const fixtures = [
        [596, 335],
        [632, 316],
        [1200, 900],
      ]
        .map(([w, h], index) => {
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#123456"/></svg>`;
          const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
          return `<p><img src="${src}" width="${w}" height="${h}" alt="图片预览测试 ${index + 1}"></p>`;
        })
        .join('');
      const html = await response.text();
      const root = /(<div\b[^>]*class="ai-prose-body ai-prose-fade"[^>]*>)/;
      expect(html).toMatch(root);
      await route.fulfill({ response, body: html.replace(root, `$1${fixtures}`) });
    });
    await page.goto('/zh/blog/starter-guide-1-configure-your-site/');
    const source = page.locator('.image-preview-trigger').last();
    await expect(page.locator('.image-preview-trigger')).toHaveCount(3);
    await source.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    const scroll = await page.evaluate(() => window.scrollY);
    await source.press('Enter');
    const dialog = page.getByRole('dialog', { name: '查看大图' });
    await expect(dialog).toBeVisible();
    const image = dialog.locator('img');
    await expect(image).toHaveAttribute('alt', await source.getAttribute('alt'));
    await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
    const box = await image.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(box.y + box.height).toBeLessThanOrEqual(900);
    await image.click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(source).toBeFocused();
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - scroll)).toBeLessThan(3);
    const sourceBox = await source.boundingBox();
    await page.mouse.click(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await expect(dialog).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(dialog).not.toBeVisible();
    await source.press('Space');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: '关闭图片预览' }).click();
    await expect(dialog).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  });
}
