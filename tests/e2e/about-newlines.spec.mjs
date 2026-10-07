/* global document, getComputedStyle */
import { test, expect } from '@playwright/test';

for (const width of [1440, 390, 320]) {
  test(`About configured line breaks remain visible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en/about/');
    for (const selector of ['.hacker-body > p', '.about-signature']) {
      const element = page.locator(selector).first();
      const geometry = await element.evaluate((node) => {
        node.textContent = 'First\n\nSecond';
        const text = node.firstChild;
        const range = document.createRange();
        range.setStart(text, 0);
        range.setEnd(text, 5);
        const first = range.getBoundingClientRect();
        range.setStart(text, 7);
        range.setEnd(text, 13);
        const second = range.getBoundingClientRect();
        return { gap: second.top - first.top, line: parseFloat(getComputedStyle(node).lineHeight) };
      });
      expect(geometry.gap).toBeCloseTo(geometry.line * 2, 0);
      await element.evaluate((node) => {
        node.textContent = 'A long sentence with normal wrapping. '.repeat(30);
      });
      expect(
        await element.evaluate((node) => node.scrollWidth - node.clientWidth)
      ).toBeLessThanOrEqual(1);
    }
    // The paragraph rule must not change labels or interactive modal text.
    await expect(page.locator('.about-section-title').first()).not.toHaveCSS(
      'white-space',
      'pre-line'
    );
    await expect(page.locator('.hacker-sidebar')).not.toHaveCSS('white-space', 'pre-line');
  });
}
