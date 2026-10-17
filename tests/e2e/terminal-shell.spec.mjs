import { test, expect } from '@playwright/test';

async function openTerminal(page, locale = 'en') {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.addInitScript(() => {
    const clear = globalThis.CanvasRenderingContext2D.prototype.clearRect;
    const text = globalThis.CanvasRenderingContext2D.prototype.fillText;
    globalThis.CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.classList.contains('hacker-bg-canvas')) globalThis.terminalRows = [];
      return clear.apply(this, args);
    };
    globalThis.CanvasRenderingContext2D.prototype.fillText = function (...args) {
      if (this.canvas.classList.contains('hacker-bg-canvas'))
        (globalThis.terminalRows ||= []).push(args[0]);
      return text.apply(this, args);
    };
  });
  await page.goto(`/${locale}/about/`);
  await page.mouse.click(100, 350);
}
async function command(page, value) {
  await page.keyboard.type(value);
  await page.keyboard.press('Enter');
}
const rows = (page) => page.evaluate(() => (globalThis.terminalRows || []).join('\n'));

test('JSON terminal lists, navigates, reads and clears with command history and path completion', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openTerminal(page);
  await expect.poll(() => rows(page)).toContain('/root/bash/scripts $ ');
  expect(await rows(page)).not.toContain('about.md');
  expect(await rows(page)).not.toContain('total 42');
  expect(await rows(page)).not.toContain('.env.gpg');
  await expect(page.locator('.terminal-backdrop__input')).toBeFocused();
  await page.locator('.terminal-backdrop__input').fill('pwd');
  await page.keyboard.press('Enter');
  await expect.poll(() => rows(page)).toContain('/root/bash/scripts');
  await command(page, 'ls');
  await expect.poll(() => rows(page)).toContain('about.md');
  await command(page, 'cd ..');
  await expect.poll(() => rows(page)).toContain('/root/bash $ ');
  await command(page, 'cd scripts');
  await command(page, 'cat about.md');
  await expect.poll(() => rows(page)).toContain('Anglefeint');
  await command(page, 'cp about.md copy.md');
  await expect.poll(() => rows(page)).toContain('Command not supported: cp');
  await command(page, 'clear');
  await expect.poll(() => rows(page)).toBe('/root/bash/scripts $ ');
  await page.keyboard.type('vi about.m');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const reader = page.locator('.terminal-backdrop');
  await expect(reader).toHaveClass(/terminal-backdrop--reading/);
  await expect.poll(() => rows(page)).toContain('Anglefeint');
  await expect(page.locator('#terminal-reader, .terminal-reader-window')).toHaveCount(0);
  await page.screenshot({ path: 'acceptance-results/terminal-reader-desktop.png' });
  await page.locator('.terminal-backdrop__input').fill(':q');
  await page.keyboard.press('Enter');
  await expect(reader).not.toHaveClass(/terminal-backdrop--reading/);
  await expect.poll(() => rows(page)).toContain('/root/bash/scripts $ ');
  expect(errors).toEqual([]);
});

test('article content is lazy, local, cached and read in the original Canvas', async ({ page }) => {
  const documents = [];
  page.on('request', (request) => {
    if (request.url().includes('/terminal/')) documents.push(request.url());
  });
  await openTerminal(page, 'zh');
  expect(documents).toHaveLength(0);
  const file = await page
    .locator('#hacker-runtime-config')
    .evaluate((node) => JSON.parse(node.textContent).terminal.entries.find((entry) => entry.url));
  const originalCanvas = await page.locator('.hacker-bg-canvas').elementHandle();
  await command(page, `vi "${file.path}"`);
  const reader = page.locator('.terminal-backdrop');
  await expect(reader).toHaveClass(/terminal-backdrop--reading/);
  await expect.poll(() => rows(page)).toContain('只读');
  expect(
    await page.evaluate(
      (node) => node === globalThis.document.querySelector('.hacker-bg-canvas'),
      originalCanvas
    )
  ).toBe(true);
  await expect(page.locator('#terminal-reader, .terminal-reader-text')).toHaveCount(0);
  expect(documents).toHaveLength(1);
  await page.keyboard.press('Escape');
  await expect(reader).not.toHaveClass(/terminal-backdrop--reading/);
  await command(page, `vi "${file.path}"`);
  await expect(reader).toHaveClass(/terminal-backdrop--reading/);
  expect(documents).toHaveLength(1);
  await page.evaluate(() =>
    globalThis.dispatchEvent(new globalThis.PageTransitionEvent('pagehide', { persisted: true }))
  );
  await expect(reader).not.toHaveClass(/terminal-backdrop--reading/);
});

test('terminal reader stays usable on narrow screens and late reads are cancelled on disposal', async ({
  page,
}) => {
  await openTerminal(page, 'zh');
  await page.setViewportSize({ width: 390, height: 420 });
  await page.locator('.terminal-backdrop__input').focus();
  await command(page, 'vi about.md');
  const reader = page.locator('.terminal-backdrop');
  await expect(reader).toHaveClass(/terminal-backdrop--reading/);
  expect(await reader.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  await expect(page.locator('#terminal-reader')).toHaveCount(0);
  const before = await rows(page);
  await page.keyboard.press('PageDown');
  await expect.poll(() => rows(page)).not.toBe(before);
  await page.screenshot({ path: 'acceptance-results/terminal-reader-mobile.png' });
  await page.locator('.terminal-backdrop__input').fill(':q');
  await page.keyboard.press('Enter');
  await expect(reader).not.toHaveClass(/terminal-backdrop--reading/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const file = await page
    .locator('#hacker-runtime-config')
    .evaluate((node) => JSON.parse(node.textContent).terminal.entries.find((entry) => entry.url));
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route('**/terminal/*.json', async (route) => {
    await gate;
    await route
      .fulfill({ contentType: 'application/json', body: JSON.stringify({ content: 'late text' }) })
      .catch(() => {});
  });
  await page.mouse.click(100, 350);
  await command(page, `vi "${file.path}"`);
  await page.evaluate(() =>
    globalThis.dispatchEvent(new globalThis.PageTransitionEvent('pagehide', { persisted: true }))
  );
  release();
  await page.waitForTimeout(100);
  await expect(reader).not.toHaveClass(/terminal-backdrop--reading/);
  expect(await page.locator('.hacker-bg-canvas').evaluate((node) => node.width)).toBe(0);
});
