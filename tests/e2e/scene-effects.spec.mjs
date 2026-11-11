import { test, expect } from '@playwright/test';

test.use({ screenshot: 'off' });

for (const width of [1280, 390]) {
  test(`homepage rabbit keeps its position, dimensions and trigger behavior (${width})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/en/');
    const row = page.locator('.home-post-record[data-decode]').first();
    const rabbit = row.locator('[data-white-rabbit]');
    await expect(rabbit).toHaveCSS('position', 'absolute');
    await expect(rabbit).toHaveCSS('width', width > 720 ? '22px' : '13px');
    await expect(rabbit).toHaveCSS('height', width > 720 ? '28px' : '19px');
    await row.locator('a').first().focus();
    await expect(rabbit).toHaveAttribute('data-decoding', 'true');
    await expect(row.locator('.home-white-rabbit')).toHaveCSS('opacity', '1');
    await expect(rabbit).not.toHaveAttribute('data-decoding', { timeout: 2000 });
    await expect(rabbit.locator('svg')).toHaveCSS('opacity', '1');
    const archive = page.locator('.home-archive-command');
    await archive.focus();
    await expect(archive.locator('[data-white-rabbit]')).toHaveCSS('left', '0px');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(archive.locator('[data-white-rabbit] canvas')).toBeHidden();
    await expect(archive.locator('[data-white-rabbit] svg')).toHaveCSS('opacity', '1');
  });
}

for (const [route, left, right, opacity] of [
  ['blog', '12s', '24s', '1'],
  ['tags', '18s', '30s', '0.42'],
]) {
  test(`${route} keeps its viewport spotlight and scene timing`, async ({ page }) => {
    await page.goto(`/en/${route}/`);
    const light = page.locator('[data-cyber-spotlight]');
    await expect(light).toHaveCSS('position', 'fixed');
    await expect(light).toHaveCSS('z-index', '5');
    await expect(light).toHaveCSS('opacity', opacity);
    await expect(light.locator('.cyber-spotlight-tl')).toHaveCSS('animation-duration', left);
    await expect(light.locator('.cyber-spotlight-tr')).toHaveCSS('animation-duration', right);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(light.locator('.cyber-spotlight-tl')).toHaveCSS('animation-name', 'none');
    await expect(light.locator('.cyber-spotlight-tr')).toHaveCSS('animation-name', 'none');
  });
}

for (const width of [1280, 390]) {
  for (const route of ['blog', 'tags']) {
    test(`${route} retains viewport rain, dust and mobile thinning (${width})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/en/${route}/`);
      const rain = page.locator('[data-cyber-rain]');
      await expect(rain.locator('.cyber-rain-drop')).toHaveCount(48);
      await expect(page.locator('[data-cyber-dust] .cyber-dust-particle')).toHaveCount(22);
      await expect(rain).toHaveCSS('position', 'fixed');
      await expect(rain).toHaveCSS('z-index', '6');
      await expect(rain).toHaveCSS('opacity', route === 'tags' ? '0.7' : '1');
      await expect(rain.locator('.cyber-rain-drop:visible')).toHaveCount(width <= 720 ? 24 : 48);
      await expect(page.locator('.cyber-dust-particle:visible')).toHaveCount(
        width <= 720 ? 11 : 22
      );
      await expect(rain.locator('.cyber-rain-drop').first()).toHaveCSS(
        'background-image',
        route === 'tags' ? /177, 204, 231/ : /210, 208, 198/
      );
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(rain).toBeHidden();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await expect(rain).toBeVisible();
      await expect(rain.locator('.cyber-rain-drop')).toHaveCount(48);
    });
  }
}
