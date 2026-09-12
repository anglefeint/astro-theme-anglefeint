/* global document, window */
import { test, expect } from '@playwright/test';
import { URL } from 'node:url';

for (const width of [1440, 1360, 1280, 390]) {
  test(`article contents work with keyboard and valid heading anchors at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/zh/blog/starter-guide-1-configure-your-site/');
    const toc = page.locator('.ai-article-toc');
    await expect(toc).toBeVisible();
    await expect(toc).toHaveAttribute('open', '');
    const panel = page.locator('.ai-article > .prose');
    const panelBox = await panel.boundingBox();
    const tocBox = await toc.boundingBox();
    expect(tocBox.x).toBeGreaterThanOrEqual(0);
    expect(tocBox.x + tocBox.width).toBeLessThanOrEqual(width);
    if (width >= 1360) {
      expect(tocBox.x).toBeGreaterThan(panelBox.x + panelBox.width);
      await page.evaluate(() => window.scrollBy(0, 1400));
      await expect.poll(async () => (await toc.boundingBox()).y).toBeLessThan(112);
      const headerBox = await page.locator('header').boundingBox();
      expect((await toc.boundingBox()).y).toBeGreaterThan(headerBox.y + headerBox.height);
      const buttonBox = await page.locator('.ai-back-to-top').boundingBox();
      const toastBox = await page.locator('.ai-stage-toast').boundingBox();
      const currentPanelBox = await panel.boundingBox();
      expect(toastBox.x).toBeGreaterThan(currentPanelBox.x + currentPanelBox.width);
      expect(toastBox.x - (currentPanelBox.x + currentPanelBox.width)).toBeLessThan(15);
      expect(toastBox.x + toastBox.width).toBeLessThanOrEqual(width);
      expect(buttonBox.y + buttonBox.height).toBeLessThan(toastBox.y);
      const stickyBox = await toc.boundingBox();
      expect(stickyBox.y + stickyBox.height).toBeLessThan(buttonBox.y);
      await panel.locator('.ai-regenerate').evaluate((element) => element.scrollIntoView());
      const endBox = await toc.boundingBox();
      const endPanelBox = await panel.boundingBox();
      expect(endBox.y + endBox.height).toBeLessThanOrEqual(endPanelBox.y + endPanelBox.height + 2);
    } else {
      expect(tocBox.x).toBeGreaterThan(panelBox.x);
      expect(tocBox.x + tocBox.width).toBeLessThan(panelBox.x + panelBox.width);
    }
    const summary = toc.locator('summary');
    await expect(summary).toHaveText('文章目录');
    const links = toc.locator('a');
    expect(await links.count()).toBeGreaterThan(0);
    expect(
      await links.evaluateAll((items) =>
        items.every((link) => {
          const id = decodeURIComponent(link.hash.slice(1));
          const target = document.getElementById(id);
          return target && target.matches('.ai-prose-body h2, .ai-prose-body h3');
        })
      )
    ).toBe(true);
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(toc).not.toHaveAttribute('open', '');
    await expect(links.first()).toBeHidden();
    await page.keyboard.press('Enter');
    await expect(links.first()).toBeVisible();
    const href = await links.first().getAttribute('href');
    // The existing article panel animates continuously; keyboard activation is stable.
    await links.first().press('Enter');
    expect(new URL(page.url()).hash).toBe(href);
    expect(await toc.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.goto('/zh/blog/');
    await expect(page.locator('.ai-article-toc')).toHaveCount(0);
    await page.goto('/zh/about/');
    await expect(page.locator('.ai-article-toc')).toHaveCount(0);
  });
}

test('sidebar remains usable in a short viewport and returns inline after resizing', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 240 });
  await page.goto('/zh/blog/starter-guide-1-configure-your-site/');
  const toc = page.locator('.ai-article-toc');
  await toc.locator('a').last().focus();
  expect(await toc.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  expect(await toc.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  const bounds = await toc.boundingBox();
  expect(bounds.height).toBeLessThan(240);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await toc.evaluate((element) => window.getComputedStyle(element).position)).toBe('static');
  expect(await toc.evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(
    true
  );
});
