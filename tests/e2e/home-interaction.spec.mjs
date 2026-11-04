/* global window, CanvasRenderingContext2D */
import { test, expect } from '@playwright/test';

test.use({ screenshot: 'off', viewport: { width: 1600, height: 900 } });

test('pointer movement wakes rain glyphs inside the existing renderer', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    window.awakenedGlyphs = 0;
    const original = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (...args) {
      if (this.canvas.id === 'matrix-bg') {
        const channels = String(this.fillStyle)
          .match(/[\d.]+/g)
          ?.map(Number);
        if (
          channels &&
          channels[0] > 0 &&
          channels[0] < 200 &&
          channels[1] === 255 &&
          channels[2] > 65
        ) {
          window.awakenedGlyphs++;
        }
      }
      return original.apply(this, args);
    };
  });
  await page.goto('/en/');
  await expect(page.locator('#matrix-bg')).toBeVisible();
  for (const [x, y] of [
    [100, 150],
    [400, 350],
    [900, 550],
    [1400, 700],
  ]) {
    await page.mouse.move(x, y, { steps: 8 });
  }
  await expect.poll(() => page.evaluate(() => window.awakenedGlyphs)).toBeGreaterThan(0);
});

test('door proximity reveals a hint without opening or mounting the passage', async ({ page }) => {
  await page.goto('/en/');
  const panel = page.locator('.home-signal-monitor');
  await expect(panel).toBeVisible();
  const bounds = await panel.boundingBox();
  await page.mouse.move(bounds.x - 60, bounds.y + bounds.height / 2);
  await expect(panel).toHaveAttribute('data-near', '');
  await expect(panel).not.toHaveAttribute('data-expanded');
  await expect(panel).not.toHaveAttribute('data-preview');
  await expect(panel.locator('.home-signal-viewport')).toHaveAttribute('inert', '');
  await page.mouse.move(20, 100);
  await expect(panel).not.toHaveAttribute('data-near');
});
