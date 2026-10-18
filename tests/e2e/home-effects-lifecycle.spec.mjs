/* global window, document, Event, PageTransitionEvent, CanvasRenderingContext2D, WebGLRenderingContext */
import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
const { defaultLocale } = JSON.parse(
  await readFile(new URL('./.generated-smoke-config.json', import.meta.url), 'utf8')
);

test('terminal retains one paused preview, reuses it and releases idle GPU resources', async ({
  page,
}) => {
  // This scenario includes the intentional 15-second idle GPU release delay.
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1764, height: 1000 });
  await page.addInitScript(() => {
    window.signalStats = { draws: 0, textures: 0 };
    for (const [name, counter] of [
      ['drawArrays', 'draws'],
      ['createTexture', 'textures'],
    ]) {
      const original = WebGLRenderingContext.prototype[name];
      WebGLRenderingContext.prototype[name] = function (...args) {
        if (this.canvas.closest('.home-signal-monitor')) window.signalStats[counter]++;
        return original.apply(this, args);
      };
    }
  });
  await page.goto(`/${defaultLocale}/`);
  const panel = page.locator('.home-signal-monitor');
  await panel.hover();
  await page.waitForTimeout(1000);
  await expect(panel.locator('canvas')).toHaveCount(0);
  const text = panel.locator('.home-signal-scroll');
  await text.focus();
  await expect(panel).not.toHaveAttribute('data-expanded', '');
  await panel.locator('.home-signal-message').evaluate((element) => {
    element.textContent = 'A quiet signal travels through the city. '.repeat(20);
  });
  await text.hover();
  await page.mouse.wheel(0, 180);
  await expect.poll(() => text.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(panel.locator('canvas')).toHaveCount(0);
  await text.evaluate((element) => {
    element.scrollTop = 0;
  });
  await panel.locator('.home-signal-message').click({ position: { x: 10, y: 10 } });
  await expect(panel).not.toHaveAttribute('data-expanded', '');
  await panel.locator('.home-signal-message').evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  });
  expect(await page.evaluate(() => window.getSelection().toString())).toContain('quiet signal');
  await panel.locator('.home-signal-enter').click();
  await expect(panel).toHaveAttribute('data-unlocking', '');
  await expect(panel).not.toHaveAttribute('data-expanded', '');
  await page.mouse.move(800, 100);
  await page.waitForTimeout(500);
  await expect(panel).not.toHaveAttribute('data-unlocking', '');
  await expect(panel.locator('canvas')).toHaveCount(0);
  await panel.locator('.home-signal-enter').click();
  await expect(panel).toHaveAttribute('data-unlocked', '');
  await expect(panel).toHaveAttribute('data-expanded', '');
  await expect(panel.locator('.home-signal-insert-key')).toHaveCSS('opacity', '0');
  await expect(panel).toHaveAttribute('data-preview', '');
  const textures = await page.evaluate(() => window.signalStats.textures);
  expect(textures).toBeGreaterThan(0);
  await page.mouse.move(800, 100);
  await expect(panel).not.toHaveAttribute('data-preview', '');
  const draws = await page.evaluate(() => window.signalStats.draws);
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => window.signalStats.draws)).toBe(draws);
  await expect(panel.locator('canvas')).toHaveCount(1);
  await panel.locator('.home-signal-enter').click();
  await expect(panel).toHaveAttribute('data-preview', '');
  expect(await page.evaluate(() => window.signalStats.textures)).toBe(textures);
  await page.mouse.move(800, 100);
  await expect(panel.locator('canvas')).toHaveCount(0, { timeout: 17000 });
  await panel.locator('.home-signal-enter').click();
  await expect(panel).toHaveAttribute('data-preview', '');
  expect(await page.evaluate(() => window.signalStats.textures)).toBeGreaterThan(textures);
  await page.evaluate(() =>
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }))
  );
  await expect(panel.locator('canvas')).toHaveCount(0);
});

test('terminal door hit area continues the shared passage without restarting WebGL', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1764, height: 1000 });
  await page.addInitScript(() => {
    window.doorPrograms = 0;
    const create = WebGLRenderingContext.prototype.createProgram;
    WebGLRenderingContext.prototype.createProgram = function (...args) {
      if (this.canvas.closest('.home-signal-monitor')) window.doorPrograms++;
      return create.apply(this, args);
    };
  });
  await page.goto(`/${defaultLocale}/`);
  const panel = page.locator('.home-signal-monitor');
  await panel.locator('.home-signal-enter').click();
  await expect(panel).toHaveAttribute('data-preview', '');
  const door = panel.locator('.passage-door-hit');
  const programs = await page.evaluate(() => window.doorPrograms);
  const bounds = await panel.boundingBox();
  await page.mouse.click(bounds.x + 8, bounds.y + 80);
  await expect(door).toBeEnabled();
  await expect(door).toHaveCSS('cursor', 'pointer');
  await door.focus();
  await door.press('Enter');
  await expect(door).toBeDisabled();
  await expect(panel.locator('.home-signal-scroll')).toBeFocused();
  expect(await page.evaluate(() => window.doorPrograms)).toBe(programs);
  const passage = panel.locator('.passage-inline');
  await expect(passage).toHaveAttribute('data-view', 'oracle', { timeout: 7000 });
  for (let i = 0; i < 12; i++) await page.keyboard.press('ArrowRight');
  await expect.poll(() => page.evaluate(() => window.passageView?.[0])).toBeLessThan(-0.99);
  await page.keyboard.press('Home');
  await expect.poll(() => page.evaluate(() => window.passageView?.[0])).toBeGreaterThan(0.99);
  await panel.click({ button: 'right', position: { x: 90, y: 80 } });
  await expect(passage).toHaveAttribute('data-playback', 'reverse');
  await expect(door).toBeEnabled({ timeout: 7000 });
  await expect(passage).toHaveAttribute('data-view', 'corridor');
  expect(await page.evaluate(() => window.doorPrograms)).toBe(programs);
  await page.mouse.move(800, 100);
  await page.locator('.home-wordmark').click();
  await expect(panel).not.toHaveAttribute('data-preview', '');
});

test('About Oracle walks back on right-click and keeps Escape exit', async ({ page }) => {
  await page.goto(`/${defaultLocale}/about/`);
  await page.locator('[data-oracle]').click();
  const passage = page.locator('.oracle-passage');
  await expect(passage).toHaveAttribute('data-view', 'oracle', { timeout: 12000 });
  await page.mouse.move(1270, 360);
  await page.mouse.down();
  await page.mouse.move(630, 360, { steps: 12 });
  await page.mouse.up();
  await expect(passage).toHaveAttribute('data-playback', 'idle');
  await expect.poll(() => page.evaluate(() => window.passageView?.[0])).toBeLessThan(-0.99);
  await page.keyboard.press('Home');
  await expect.poll(() => page.evaluate(() => window.passageView?.[0])).toBeGreaterThan(0.99);
  await passage.click({ button: 'right', position: { x: 640, y: 360 } });
  await expect(passage).toHaveAttribute('data-playback', 'reverse');
  await expect(passage).toHaveAttribute('data-view', 'corridor', { timeout: 7000 });
  await expect(passage).toHaveAttribute('data-playback', 'idle');
  await page.keyboard.press('Escape');
  await expect(passage).toHaveCount(0);
  await expect(page.locator('[data-oracle]')).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('[data-oracle]').click();
  await page.keyboard.press('Tab');
  await expect(page.locator('.passage-exit')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(passage).toHaveCount(0);
});

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const locations = new WeakMap();
    const uniformLocation = WebGLRenderingContext.prototype.getUniformLocation;
    const uniformMatrix = WebGLRenderingContext.prototype.uniformMatrix4fv;
    WebGLRenderingContext.prototype.getUniformLocation = function (...args) {
      const location = uniformLocation.apply(this, args);
      if (location) locations.set(location, args[1]);
      return location;
    };
    WebGLRenderingContext.prototype.uniformMatrix4fv = function (...args) {
      if (
        locations.get(args[0]) === 'view' &&
        this.canvas.closest('.passage-inline, .oracle-passage')
      ) {
        window.passageView = Array.from(args[2]);
      }
      return uniformMatrix.apply(this, args);
    };
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
