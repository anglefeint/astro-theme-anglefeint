import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

const { defaultLocale } = JSON.parse(
  await readFile(new URL('./.generated-smoke-config.json', import.meta.url), 'utf8')
);

test('tool title decoding survives rapid close/reopen and keeps its accessible name', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`/${defaultLocale}/about/`);
  const clockStart = new Date('2026-01-01T00:00:00Z');
  await page.clock.install({ time: clockStart });
  await page.clock.pauseAt(new Date(clockStart.getTime() + 1000));
  const ai = page.locator('[data-modal="ai"]');
  const help = page.locator('[data-modal="help"]');
  const title = page.locator('#hacker-modal-title');
  const dialog = page.getByRole('dialog');
  await ai.click();
  const firstTitle = await title.locator('.hacker-title-source').textContent();
  await expect(dialog).toHaveAccessibleName(firstTitle);
  await expect(title.locator('.hacker-title-decode')).toHaveAttribute('aria-hidden', 'true');
  await page.keyboard.press('Escape');
  await expect(page.locator('#hacker-modal')).toHaveAttribute('aria-hidden', 'true');
  await expect(ai).toBeFocused();
  await expect(title.locator('.hacker-title-decode')).toHaveCount(0);
  await help.click();
  const secondTitle = await title.locator('.hacker-title-source').textContent();
  await expect(dialog).toHaveAccessibleName(secondTitle);
  await page.clock.runFor(500);
  await expect(title).toHaveText(secondTitle);
  await expect(title.locator('.hacker-title-decode')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(help).toBeFocused();
  await page.clock.runFor(1000);
  await expect(title).toHaveText(secondTitle);
});

for (const reducedMotion of ['no-preference', 'reduce']) {
  test(`canvas effects and tool titles respect ${reducedMotion}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion });
    await page.goto('/');
    const matrix = page.locator('#matrix-bg');
    if (reducedMotion === 'reduce') {
      await expect(matrix).toBeHidden();
    } else {
      await expect(matrix).toBeVisible();
      const initial = await matrix.evaluate((canvas) => canvas.toDataURL());
      await expect.poll(() => matrix.evaluate((canvas) => canvas.toDataURL())).not.toBe(initial);
    }
    await page.locator('.home-post-title').first().click();
    const network = page.locator('.ai-network-canvas');
    await expect.poll(() => network.evaluate((canvas) => canvas.width)).toBeGreaterThan(300);
    const initial = await network.evaluate((canvas) => canvas.toDataURL());
    if (reducedMotion === 'reduce') {
      // Advance the actual page timers to ensure this is a static render, not a lucky frame.
      await page.clock.install();
      await page.clock.runFor(1000);
      expect(await network.evaluate((canvas) => canvas.toDataURL())).toBe(initial);
    } else {
      await expect.poll(() => network.evaluate((canvas) => canvas.toDataURL())).not.toBe(initial);
    }
    await page.goto(`/${defaultLocale}/about/`);
    await page.locator('[data-modal="ai"]').click();
    if (reducedMotion === 'reduce') {
      await expect(page.locator('.hacker-title-decode')).toHaveCount(0);
      await expect(page.locator('.hacker-modal')).toHaveCSS('animation-name', 'none');
    }
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });
}
