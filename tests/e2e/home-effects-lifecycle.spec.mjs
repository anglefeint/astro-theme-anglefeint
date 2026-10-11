/* global window, document, Event, PageTransitionEvent, CanvasRenderingContext2D, WebGLRenderingContext */
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
const { defaultLocale } = JSON.parse(
  await readFile(new URL('./.generated-smoke-config.json', import.meta.url), 'utf8')
);

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame;
    const cancel = window.cancelAnimationFrame;
    const fill = CanvasRenderingContext2D.prototype.fillRect;
    const pending = new Map();
    let current, rain;
    window.requestAnimationFrame = (callback) => {
      const id = request((time) => {
        pending.delete(id);
        current = callback;
        try {
          callback(time);
        } finally {
          current = undefined;
        }
      });
      pending.set(id, callback);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      pending.delete(id);
      cancel(id);
    };
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      if (this.canvas.id === 'matrix-bg' && current) rain = current;
      return fill.apply(this, args);
    };
    window.homeRainPending = () =>
      [...pending.values()].filter((callback) => callback === rain).length;
  });
});

test('homepage keeps one rain loop and pauses for page lifecycle events', async ({ page }) => {
  await page.goto(`/${defaultLocale}/`);
  const pending = () => page.evaluate(() => window.homeRainPending());
  await expect.poll(pending).toBe(1);
  const modes = await page
    .locator('[data-decode]')
    .evaluateAll((rows) => rows.map((row) => row.dataset.decode));
  await page.evaluate(() => {
    for (let i = 0; i < 10; i++) document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(pending).toBe(1);
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }))
  );
  await expect.poll(pending).toBe(0);
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  await expect.poll(pending).toBe(0);
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }))
  );
  await expect.poll(pending).toBe(1);
  expect(
    await page.locator('[data-decode]').evaluateAll((rows) => rows.map((row) => row.dataset.decode))
  ).toEqual(modes);
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }))
  );
  await expect.poll(pending).toBe(0);
  await expect.poll(() => page.locator('#matrix-bg').evaluate((canvas) => canvas.width)).toBe(0);
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }))
  );
  await expect.poll(pending).toBe(0);
});

test('live reduced-motion changes pause and restart rain without duplicating loops', async ({
  page,
}) => {
  await page.goto(`/${defaultLocale}/`);
  const pending = () => page.evaluate(() => window.homeRainPending());
  await expect.poll(pending).toBe(1);
  for (let i = 0; i < 3; i++) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('#matrix-bg')).toBeHidden();
    await expect.poll(pending).toBe(0);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(page.locator('#matrix-bg')).toBeVisible();
    await expect.poll(pending).toBe(1);
  }
});

test('repair frees mirror textures and keeps the repaired state on a cached return', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.mirrorResources = { created: 0, deleted: 0, allocated: 0, updated: 0 };
    for (const [method, counter] of [
      ['createTexture', 'created'],
      ['deleteTexture', 'deleted'],
      ['texImage2D', 'allocated'],
      ['texSubImage2D', 'updated'],
    ]) {
      const original = WebGLRenderingContext.prototype[method];
      WebGLRenderingContext.prototype[method] = function (...args) {
        if (this.canvas.classList.contains('home-mirror')) window.mirrorResources[counter]++;
        return original.apply(this, args);
      };
    }
  });
  await page.goto(`/${defaultLocale}/`);
  const mirror = page.locator('.home-mirror');
  await expect.poll(() => page.evaluate(() => window.mirrorResources.updated)).toBeGreaterThan(1);
  expect(await page.evaluate(() => window.mirrorResources.allocated)).toBe(1);
  const rect = await mirror.boundingBox();
  await page.mouse.click(rect.x + rect.width * 0.7, rect.y + rect.height * 0.25);
  await expect(mirror).toHaveAttribute('data-state', 'repaired');
  await expect(mirror).toBeHidden();
  const resources = await page.evaluate(() => window.mirrorResources);
  expect(resources.created).toBe(resources.deleted);
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await expect(mirror).toHaveAttribute('data-state', 'repaired');
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.mirrorResources)).toEqual(resources);
  await page.reload();
  await expect(mirror).toHaveAttribute('data-state', 'cracked');
});
