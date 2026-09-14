/* global navigator */
import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`copy preserves exact code and stays fixed during horizontal scrolling at ${width}px`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/zh/blog/starter-guide-1-configure-your-site/');
    const block = page.locator('.code-block').first();
    const code = block.locator('code');
    const expected = '  中文配置\n\n\t' + 'long line '.repeat(100) + '\n';
    await code.evaluate((element, value) => {
      element.textContent = value;
    }, expected);
    const button = block.getByRole('button', { name: '复制代码' });
    await button.press('Enter');
    await expect(block.getByRole('status')).toHaveText('已复制');
    expect(
      (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')
    ).toBe(expected);
    const before = await button.boundingBox();
    await block.locator('pre').evaluate((element) => {
      element.scrollLeft = 400;
    });
    const after = await button.boundingBox();
    expect(Math.abs(before.x - after.x)).toBeLessThan(2);
    await expect(block.locator('.code-copy-status')).toBeEmpty();
    const second = page.locator('.code-block').nth(1);
    const secondText = await second.locator('code').textContent();
    await second.getByRole('button').press('Enter');
    await expect(second.getByRole('status')).toHaveText('已复制');
    expect(
      (await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')
    ).toBe(secondText);
  });
}

test('clipboard rejection shows localized failure and permits retry', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {
          throw new Error('denied');
        },
      },
      configurable: true,
    })
  );
  await page.goto('/en/blog/starter-guide-1-configure-your-site/');
  const block = page.locator('.code-block').first();
  await block.getByRole('button', { name: 'Copy code' }).press('Enter');
  await expect(block.getByRole('status')).toContainText('Copy failed');
  await expect(block.getByRole('button')).toBeEnabled();
  await expect(block.getByRole('button')).not.toHaveClass(/is-copied/);
});
