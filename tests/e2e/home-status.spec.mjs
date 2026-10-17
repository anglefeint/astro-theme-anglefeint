/* global document */
import { test, expect } from '@playwright/test';

test('homepage signals reveal independently and keep a compact bottom inset', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/');
  const row = page.locator('.home-terminal-status');
  const pirate = page.locator('.home-pirate-signal');
  const trace = page.locator('.home-trace-text');
  const cursor = page.locator('.home-trace-cursor');
  await page.mouse.move(5, 90);
  await expect(pirate).toHaveCSS('opacity', '0');
  await expect(trace).toHaveCSS('opacity', '0');
  await expect(cursor).toHaveCSS('animation-name', 'none');
  const originalBounds = await row.boundingBox();
  const main = await page.locator('main').boundingBox();
  expect(main.y + main.height - originalBounds.y - originalBounds.height).toBeLessThan(16);
  await page.screenshot({ path: testInfo.outputPath('signals-hidden.png') });
  await pirate.hover();
  await expect(pirate).toHaveCSS('opacity', '1');
  await expect(trace).toHaveCSS('opacity', '0');
  await expect(cursor).toHaveCSS('animation-name', 'none');
  await page.screenshot({ path: testInfo.outputPath('pirate-only.png') });
  await trace.hover();
  await expect(pirate).toHaveCSS('opacity', '0');
  await expect(trace).toHaveCSS('opacity', '1');
  await expect(cursor).toHaveCSS('animation-name', 'home-trace-blink');
  await page.screenshot({ path: testInfo.outputPath('trace-only.png') });
  await page.mouse.move(5, 90);
  await expect(trace).toHaveCSS('opacity', '0');
  await page.locator('.home-wordmark').click();
  await page.keyboard.press('ControlOrMeta+A');
  await expect(pirate).toHaveAttribute('data-selected', '');
  await expect(trace).toHaveAttribute('data-selected', '');
  await expect(pirate).toHaveCSS('opacity', '1');
  await expect(trace).toHaveCSS('opacity', '1');
  expect(await row.boundingBox()).toEqual(originalBounds);
  // A selection elsewhere must not reveal either signal.
  await page.evaluate(() => {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.home-wordmark'));
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
  });
  await expect(pirate).toHaveCSS('opacity', '0');
  await expect(trace).toHaveCSS('opacity', '0');
  // Selecting only the trace must not reveal the pirate signal.
  const label = await page.locator('.home-trace-label').boundingBox();
  await page.mouse.move(label.x + 1, label.y + label.height / 2);
  await page.mouse.down();
  await page.mouse.move(label.x + label.width - 1, label.y + label.height / 2, { steps: 8 });
  await page.mouse.up();
  await page.mouse.move(5, 90);
  await expect(trace).toHaveAttribute('data-selected', '');
  await expect(trace).toHaveCSS('opacity', '1');
  await expect(pirate).toHaveCSS('opacity', '0');
  await page.evaluate(() => document.getSelection().removeAllRanges());
  await expect(trace).toHaveCSS('opacity', '0');
  await page.evaluate(() => {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.home-pirate-signal'));
    document.getSelection().addRange(range);
  });
  await expect(pirate).toHaveCSS('opacity', '1');
  await expect(trace).toHaveCSS('opacity', '0');
});

test('touch selection is independent and reduced motion keeps the revealed cursor static', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('/en/');
  const pirate = page.locator('.home-pirate-signal');
  const trace = page.locator('.home-trace-text');
  await expect(pirate).toHaveCSS('opacity', '0');
  await expect(trace).toHaveCSS('opacity', '0');
  const rowBounds = await page.locator('.home-terminal-status').boundingBox();
  const mainBounds = await page.locator('main').boundingBox();
  expect(mainBounds.y + mainBounds.height - rowBounds.y - rowBounds.height).toBeLessThan(16);
  // Native long-press handles are OS-owned; exercise the resulting browser selection.
  await page.evaluate(() => {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.home-trace-text'));
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
  });
  await expect(trace).toHaveCSS('opacity', '1');
  await expect(pirate).toHaveCSS('opacity', '0');
  await expect(page.locator('.home-trace-cursor')).toHaveCSS('animation-name', 'none');
  await page.evaluate(() => document.getSelection().removeAllRanges());
  await expect(trace).toHaveCSS('opacity', '0');
  await context.close();
});
