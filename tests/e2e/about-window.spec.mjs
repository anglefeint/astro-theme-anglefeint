import { test, expect } from '@playwright/test';

test.use({
  screenshot: 'off',
  trace: 'off',
  reducedMotion: 'reduce',
  viewport: { width: 1440, height: 720 },
});
const panel = (page) => page.locator('#about-reading-window');
const button = (page, action) => page.locator(`[data-about-action="${action}"]`);
const dock = (page) => page.locator('[data-about-restore]');
const opener = (page) => page.locator('[data-about-open]');
async function command(page, value) {
  await page.mouse.click(80, 280);
  const input = page.locator('.terminal-backdrop__input');
  await expect(input).toBeFocused();
  await input.fill(value);
  await input.press('Enter');
}

test('outer controls minimize with reading position, survive reload, and close with a reset', async ({
  page,
}) => {
  await page.goto('/en/about/');
  await expect(button(page, 'close')).toBeVisible();
  await expect(page.locator('.hacker-response-header button')).toHaveCount(0);
  await page.evaluate(() => globalThis.scrollTo(0, 350));
  await expect.poll(() => page.evaluate(() => globalThis.scrollY)).toBe(350);
  const pageHeight = await page.evaluate(() => globalThis.document.documentElement.scrollHeight);
  await command(page, 'minimize');
  await expect(panel(page)).toBeHidden();
  await expect(panel(page)).toHaveAttribute('inert', '');
  await expect
    .poll(() => page.evaluate(() => globalThis.document.documentElement.scrollHeight))
    .toBe(pageHeight);
  await expect.poll(() => page.evaluate(() => globalThis.scrollY)).toBe(350);
  await expect(dock(page)).toBeVisible();
  await expect(opener(page)).toBeHidden();
  await page.reload();
  await expect(panel(page)).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => globalThis.document.documentElement.scrollHeight))
    .toBe(pageHeight);
  await expect.poll(() => page.evaluate(() => globalThis.scrollY)).toBe(350);
  await dock(page).click();
  await expect(panel(page)).toBeVisible();
  await expect.poll(() => page.evaluate(() => globalThis.scrollY)).toBe(350);
  await button(page, 'close').click();
  await expect(panel(page)).toBeHidden();
  await expect(dock(page)).toBeHidden();
  await expect(opener(page)).toBeVisible();
  await expect(opener(page)).toBeFocused();
  expect(await page.evaluate(() => globalThis.document.documentElement.scrollHeight)).toBeLessThan(
    pageHeight
  );
  await page.reload();
  await expect(panel(page)).toBeHidden();
  await opener(page).press('Enter');
  await expect(panel(page)).toBeVisible();
  await expect(opener(page)).toBeHidden();
  await expect.poll(() => page.evaluate(() => globalThis.scrollY)).toBe(0);
});

test('closed window reopens from top About navigation and the compact toolbar entry', async ({
  page,
}) => {
  await page.goto('/en/about/');
  await button(page, 'close').click();
  await page.locator('header a[href="/en/about/"]').click();
  await expect(panel(page)).toBeVisible();
  await expect(opener(page)).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/zh/about/');
  await button(page, 'close').click();
  await expect(opener(page)).toBeVisible();
  await expect(dock(page)).toBeHidden();
  await opener(page).click();
  await expect(panel(page)).toBeVisible();
});

test('green control enters real fullscreen, native exit restores layout, and reload never reenters', async ({
  page,
}) => {
  await page.goto('/en/about/');
  await button(page, 'maximize').click();
  await expect
    .poll(() => page.evaluate(() => !!globalThis.document.fullscreenElement))
    .toBeTruthy();
  await expect(button(page, 'maximize')).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(() => page.evaluate(() => globalThis.document.fullscreenElement?.id))
    .toBe('about-reading-window');
  await expect(page.locator('.about-navigation')).toBeHidden();
  await expect(page.locator('.hacker-sidebar')).toBeHidden();
  expect(await panel(page).evaluate((el) => el.getBoundingClientRect().width)).toBeGreaterThan(900);
  const dimensions = await panel(page).evaluate((el) => ({
    width: el.clientWidth,
    height: el.clientHeight,
    viewportWidth: globalThis.innerWidth,
    viewportHeight: globalThis.innerHeight,
  }));
  expect(Math.abs(dimensions.width - dimensions.viewportWidth)).toBeLessThanOrEqual(1);
  expect(Math.abs(dimensions.height - dimensions.viewportHeight)).toBeLessThanOrEqual(1);
  await panel(page).evaluate((el) => el.scrollTo(0, 100));
  await expect.poll(() => panel(page).evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect.poll(() => page.evaluate(() => !!globalThis.document.fullscreenElement)).toBeFalsy();
  await expect(button(page, 'maximize')).toHaveAttribute('aria-pressed', 'false');
  await button(page, 'maximize').click();
  await expect
    .poll(() => page.evaluate(() => !!globalThis.document.fullscreenElement))
    .toBeTruthy();
  await button(page, 'maximize').click();
  await expect.poll(() => page.evaluate(() => !!globalThis.document.fullscreenElement)).toBeFalsy();
  await button(page, 'maximize').click();
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!globalThis.document.fullscreenElement)).toBeFalsy();
  await expect(button(page, 'maximize')).toHaveAttribute('aria-pressed', 'false');
  await button(page, 'maximize').click();
  await button(page, 'minimize').click();
  await expect.poll(() => page.evaluate(() => !!globalThis.document.fullscreenElement)).toBeFalsy();
  await page.locator('.frontier-dropdown summary').click();
  await page.locator('.frontier-contact').click();
  await expect(panel(page)).toBeVisible();
  await expect(page.locator('#contact')).toBeInViewport();
  await button(page, 'close').click();
  await page.goto('/en/about/#contact');
  await page.reload();
  await expect(panel(page)).toBeVisible();
  await expect(page.locator('#contact')).toBeInViewport();
});

test('terminal commands share window state and retain filesystem commands and completion', async ({
  page,
}) => {
  await page.goto('/en/about/');
  await command(page, 'close');
  await expect(panel(page)).toBeHidden();
  await command(page, 'open');
  await expect(panel(page)).toBeVisible();
  await command(page, 'minimize');
  await expect(panel(page)).toBeHidden();
  await command(page, 'restore');
  await expect(panel(page)).toBeVisible();
  await command(page, 'maximize');
  await expect
    .poll(() => page.evaluate(() => !!globalThis.document.fullscreenElement))
    .toBeTruthy();
  await expect(button(page, 'maximize')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect.poll(() => page.evaluate(() => !!globalThis.document.fullscreenElement)).toBeFalsy();
  await command(page, 'restore');
  await expect(button(page, 'maximize')).toHaveAttribute('aria-pressed', 'false');
  await command(page, 'help');
  await expect(page.locator('.terminal-backdrop__log')).toContainText('minimize');
  await command(page, 'ls');
  await expect(page.locator('.terminal-backdrop__log')).toContainText('about.md');
  const input = page.locator('.terminal-backdrop__input');
  await input.fill('vi about.m');
  await input.press('Tab');
  await expect(input).toHaveValue('vi about.md');
});

test('panel fullscreen scrolls independently and exit restores the original page position', async ({
  page,
}) => {
  await page.goto('/en/about/');
  await page.evaluate(() => globalThis.scrollTo(0, 350));
  await expect.poll(() => page.evaluate(() => globalThis.scrollY)).toBe(350);
  await command(page, 'maximize');
  await expect
    .poll(() => page.evaluate(() => globalThis.document.fullscreenElement?.id))
    .toBe('about-reading-window');
  await panel(page).evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await expect.poll(() => panel(page).evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await page.evaluate(() => globalThis.document.exitFullscreen());
  await expect.poll(() => page.evaluate(() => !!globalThis.document.fullscreenElement)).toBeFalsy();
  await expect.poll(() => page.evaluate(() => globalThis.scrollY)).toBe(350);
});

test('denied fullscreen leaves a usable normal window with no false pressed state', async ({
  page,
}) => {
  await page.addInitScript(() => {
    globalThis.Element.prototype.requestFullscreen = () => Promise.reject(new Error('Denied'));
  });
  await page.goto('/en/about/');
  await button(page, 'maximize').click();
  await expect(button(page, 'maximize')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.hacker-sidebar')).toBeVisible();
  await expect(panel(page)).toBeVisible();
  await expect(button(page, 'maximize')).toHaveAttribute('title', /F11/);
});

test('storage failures do not break controls and no-JavaScript content stays readable', async ({
  page,
  browser,
}) => {
  await page.addInitScript(() => {
    globalThis.Storage.prototype.getItem = () => {
      throw new Error('Storage denied');
    };
    globalThis.Storage.prototype.setItem = () => {
      throw new Error('Storage denied');
    };
  });
  await page.goto('/zh/about/');
  await button(page, 'minimize').click();
  await expect(panel(page)).toBeHidden();
  await expect(dock(page)).toBeFocused();
  await dock(page).click();
  await expect(panel(page)).toBeVisible();
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const fallback = await context.newPage();
    await fallback.goto(`${test.info().project.use.baseURL}/zh/about/`);
    await expect(panel(fallback)).toBeVisible();
    await expect(fallback.locator('.about-window-bar')).toBeHidden();
    await expect(fallback.locator('#contact')).toBeVisible();
  } finally {
    await context.close();
  }
});
