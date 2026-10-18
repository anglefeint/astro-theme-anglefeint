import { test, expect } from '@playwright/test';

test('decoder reveal works independently when terminal Canvas initialization throws', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = globalThis.HTMLCanvasElement.prototype.getContext;
    globalThis.HTMLCanvasElement.prototype.getContext = function (...args) {
      if (this.classList.contains('hacker-bg-canvas'))
        throw new Error('injected background failure');
      return original.apply(this, args);
    };
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/en/about/');
  await page.locator('[data-modal="decryptor"]').click();
  await page.locator('[name="decoder-format"]').selectOption('base64');
  await page.locator('[data-decoder-example]').click();
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator('.hacker-decoder-output')).toHaveAttribute(
    'data-decoder-state',
    'running'
  );
  await expect(page.locator('.hacker-decoder-output')).toHaveAttribute(
    'data-decoder-state',
    'done'
  );
  await expect(page.locator('.hacker-decoder-output')).toContainText('Follow the white rabbit.');
  expect(errors).toEqual([]);
});

test('About disposes on pagehide and restores its independent modules on bfcache pageshow', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/en/about/');
  const canvas = page.locator('.hacker-bg-canvas');
  await expect.poll(() => canvas.evaluate((node) => node.width)).toBeGreaterThan(0);
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() =>
      globalThis.dispatchEvent(new globalThis.PageTransitionEvent('pagehide', { persisted: true }))
    );
    await expect.poll(() => canvas.evaluate((node) => node.width)).toBe(0);
    await page.evaluate(() =>
      globalThis.dispatchEvent(new globalThis.PageTransitionEvent('pageshow', { persisted: true }))
    );
    await expect.poll(() => canvas.evaluate((node) => node.width)).toBeGreaterThan(0);
  }
  await page.locator('[data-modal="dl-data"]').click();
  await page.keyboard.press('Escape');
  const progress = await page.locator('#dl-progress .filled').count();
  await page.waitForTimeout(250);
  expect(await page.locator('#dl-progress .filled').count()).toBe(progress);
  await page.locator('[data-modal="decryptor"]').click();
  await expect(page.locator('.hacker-decoder-form')).toBeVisible();
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});

test('Oracle releases the passage and restores page interaction when About is disposed', async ({
  page,
}) => {
  await page.goto('/en/about/');
  const originalOverflow = await page.evaluate(() => globalThis.document.body.style.overflow);
  await page.locator('[data-oracle]').click();
  await expect(page.locator('.oracle-passage')).toBeVisible();
  await page.evaluate(() =>
    globalThis.dispatchEvent(new globalThis.PageTransitionEvent('pagehide', { persisted: true }))
  );
  await expect(page.locator('.oracle-passage')).toHaveCount(0);
  expect(await page.evaluate(() => globalThis.document.body.style.overflow)).toBe(originalOverflow);
  expect(
    await page.locator('.about-shell').evaluate((node) => node.closest('[inert]') !== null)
  ).toBe(false);
  await page.evaluate(() =>
    globalThis.dispatchEvent(new globalThis.PageTransitionEvent('pageshow', { persisted: true }))
  );
  await page.locator('[data-modal="decryptor"]').click();
  await expect(page.locator('.hacker-decoder-form')).toBeVisible();
});
