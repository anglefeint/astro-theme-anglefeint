/* global window, document, Event, navigator */
import { test, expect } from '@playwright/test';
import { Buffer } from 'node:buffer';
import { URL } from 'node:url';

const output = '.hacker-decoder-output';
async function openDecoder(page, locale = 'en') {
  await page.goto(`/${locale}/about/`);
  await expect(page.locator('.about-title h1 > *')).toHaveCount(0);
  await page.locator('[data-modal="decryptor"]').click();
  await expect(page.locator('.hacker-modal-title')).toHaveText('Hacker Decryptor');
  await expect(page.locator('.hacker-decoder-form')).toBeVisible();
}

test('real Unicode result uses the relocated animation, keeps input safe, and copies exactly', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openDecoder(page);
  expect((await page.locator('.hacker-modal').boundingBox()).width).toBeGreaterThan(700);
  const text = '你好、世界 👩🏽‍💻\n<img src=x onerror="window.decoderInjected=1">';
  await page.locator('[name="decoder-input"]').fill(Buffer.from(text).toString('base64'));
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'running');
  await expect(page.locator(`${output} canvas`)).toHaveCount(1);
  await expect(page.locator('.hacker-decoder-original')).toHaveCSS('opacity', '0');
  await expect(page.locator('[data-decoder-copy]')).toBeDisabled();
  await expect(page.locator('[data-decoder-reuse]')).toBeDisabled();
  await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'done', {
    timeout: 10000,
  });
  await expect(page.locator(output)).toHaveText(text);
  await expect(page.locator(`${output} canvas`)).toHaveCount(0);
  expect(await page.evaluate(() => window.decoderInjected)).toBeUndefined();
  await expect(page.locator(`${output} img`)).toHaveCount(0);
  await page.locator('[data-decoder-copy]').click();
  // The Windows clipboard normalizes LF to CRLF.
  expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')).toBe(
    text
  );
});

test('result can become input for an explicit second decoding step', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openDecoder(page);
  const input = page.locator('[name="decoder-input"]');
  const format = page.locator('[name="decoder-format"]');
  const reuse = page.locator('[data-decoder-reuse]');
  await expect(reuse).toBeDisabled();
  await input.fill('SGVsbG8%3D');
  await format.selectOption('url');
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(output)).toHaveText('SGVsbG8=');
  await reuse.click();
  await expect(input).toHaveValue('SGVsbG8=');
  await expect(input).toBeFocused();
  await expect(format).toHaveValue('auto');
  await expect(page.locator(output)).toBeEmpty();
  await expect(reuse).toBeDisabled();
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(output)).toHaveText('Hello');
  await expect(reuse).toBeEnabled();
  await input.fill('changed');
  await expect(reuse).toBeDisabled();
});

test('URL, Hex, errors, ambiguity and samples work with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openDecoder(page);
  const input = page.locator('[name="decoder-input"]');
  const format = page.locator('[name="decoder-format"]');
  await format.selectOption('url');
  await input.fill('%E4%BD%A0%E5%A5%BD%20%F0%9F%90%87');
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(output)).toHaveText('你好 🐇');
  await expect(page.locator(`${output} canvas`)).toHaveCount(0);
  await format.selectOption('hex');
  await input.fill('48 65 6c 6c 6f');
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(output)).toHaveText('Hello');
  await format.selectOption('auto');
  await input.fill('64646464');
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator('.hacker-decoder-status')).toContainText('More than one');
  await expect(page.locator(output)).toBeEmpty();
  await input.fill('not encoded!');
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator('.hacker-decoder-status')).toContainText('Could not identify');
  await page.locator('[data-decoder-example]').click();
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(output)).toHaveText('Follow the white rabbit.');
  await page.locator('[data-decoder-clear]').click();
  await expect(input).toBeEmpty();
  await expect(page.locator(output)).toBeEmpty();
});

test('HTML entities, Unicode escapes and JWT share the existing animation and safe output', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openDecoder(page);
  const input = page.locator('[name="decoder-input"]');
  const format = page.locator('[name="decoder-format"]');
  const submit = page.locator('.hacker-decoder-submit');
  for (const [kind, encoded, decoded] of [
    [
      'html',
      '&lt;img src=x onerror=alert(1)&gt; &amp; &copy; &#x1F407; &NotEqualTilde;',
      '<img src=x onerror=alert(1)> & © 🐇 ≂̸',
    ],
    ['unicode', '\\u4F60\\u597D \\uD83D\\uDC07', '你好 🐇'],
  ]) {
    await format.selectOption(kind);
    await input.fill(encoded);
    await submit.click();
    await expect(page.locator(`${output} canvas`)).toHaveCount(1);
    await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'done');
    await expect(page.locator(output)).toHaveText(decoded);
    await expect(page.locator(`${output} img`)).toHaveCount(0);
  }
  await format.selectOption('auto');
  await input.fill('&amp;lt;script&amp;gt;');
  await submit.click();
  await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'done');
  await expect(page.locator(output)).toHaveText('&lt;script&gt;');
  await format.selectOption('jwt');
  await page.locator('[data-decoder-example]').click();
  await submit.click();
  await expect(page.locator(`${output} canvas`)).toHaveCount(1);
  await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'done');
  const result = JSON.parse(await page.locator(output).textContent());
  expect(result.payload.name).toBe('Neo');
  await expect(page.locator('.hacker-decoder-status')).toContainText('Signature not verified');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await format.selectOption('html');
  await input.fill('&amp;'.repeat(3000));
  await submit.click();
  await expect(page.locator(output)).toHaveText('&'.repeat(3000));
});

test('closing and resubmitting cancel old animation; missing Web Crypto still works', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() =>
    Object.defineProperty(window.crypto, 'getRandomValues', { value: undefined })
  );
  await openDecoder(page);
  await page.locator('[name="decoder-input"]').fill('SGVsbG8=');
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(`${output} canvas`)).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator(`${output} canvas`)).toHaveCount(0);
  await page.locator('[data-modal="decryptor"]').click();
  await expect(page.locator('[name="decoder-input"]')).toBeEmpty();
  await page.locator('[name="decoder-input"]').fill('SGVsbG8=');
  await page.locator('.hacker-decoder-submit').click();
  await page.locator('[name="decoder-input"]').fill('QQ==');
  await expect(page.locator(`${output} canvas`)).toHaveCount(0);
  await page.locator('.hacker-decoder-submit').click();
  await page.waitForTimeout(500);
  expect(
    await page.locator(`${output} canvas`).evaluate((canvas) => {
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      return pixels.some((value, index) => index % 4 === 3 && value > 0);
    })
  ).toBe(true);
  await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'done', {
    timeout: 10000,
  });
  await expect(page.locator(output)).toHaveText('A');
});

test('long output remains complete and scrolling finishes the decorative reveal', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openDecoder(page);
  const text = 'Follow the white rabbit. 你好。\n'.repeat(100);
  await page.locator('[name="decoder-input"]').fill(Buffer.from(text).toString('base64'));
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(`${output} canvas`)).toHaveCount(1);
  await page.locator(output).evaluate((element) => {
    element.scrollTop = 100;
    element.dispatchEvent(new Event('scroll'));
  });
  await expect(page.locator(`${output} canvas`)).toHaveCount(0);
  expect(await page.locator(output).textContent()).toBe(text);
});

test('near-limit input shows the complete result within the bounded animation time', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openDecoder(page);
  const text = 'a'.repeat(12000);
  await page.locator('[name="decoder-input"]').fill(Buffer.from(text).toString('base64'));
  const started = Date.now();
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'running');
  await expect(page.locator('.hacker-decoder-original')).toHaveCSS('opacity', '0');
  await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'done', {
    timeout: 5000,
  });
  expect(Date.now() - started).toBeLessThan(3500);
  expect(await page.locator(output).textContent()).toBe(text);
  await expect(page.locator(`${output} canvas`)).toHaveCount(0);
});

test('all built-in locales have translated decoder controls and fit narrow screens', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [index, locale] of [
    'en',
    'zh',
    'zh-hant',
    'ja',
    'ko',
    'es',
    'pt-br',
    'de',
    'ru',
  ].entries()) {
    await page.setViewportSize({ width: index % 2 ? 320 : 390, height: 844 });
    await openDecoder(page, locale);
    await expect(page.locator('.hacker-modal-header .decoder-full-link')).toHaveAttribute(
      'href',
      `/${locale}/decoder/`
    );
    await expect(page.locator('.hacker-modal-body .decoder-full-link')).toHaveCount(0);
    if (locale === 'en')
      await expect(page.locator('.decoder-full-link')).toContainText('DECODER LAB');
    else await expect(page.locator('.decoder-full-link')).not.toContainText('DECODER LAB');
    await page.locator('[name="decoder-format"]').selectOption('url');
    await page.locator('[data-decoder-example]').click();
    await page.locator('.hacker-decoder-submit').click();
    await expect(page.locator(output)).toHaveText('Follow the white rabbit.');
    for (const kind of ['html', 'unicode', 'jwt']) {
      await page.locator('[name="decoder-format"]').selectOption(kind);
      await page.locator('[data-decoder-example]').click();
      await page.locator('.hacker-decoder-submit').click();
      await expect(page.locator(output)).not.toBeEmpty();
      if (kind === 'jwt') {
        await expect(page.locator('.hacker-decoder-status')).not.toHaveText(/undefined/);
        if (locale !== 'en')
          await expect(page.locator('.hacker-decoder-status')).not.toContainText(
            'Signature not verified'
          );
      }
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
    expect(
      await page
        .locator('.hacker-modal')
        .evaluate((element) => element.scrollWidth <= element.clientWidth)
    ).toBe(true);
  }
});

test('homepage title and trace stay static', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('.home-wordmark > *')).toHaveCount(0);
  await expect(page.locator('.home-trace-decode')).not.toHaveAttribute('data-trace-decoded');
});

test('shared About window controls collapse, expand, restore and close every tool', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/about/');
  for (const id of ['decryptor', 'ai', 'help', 'dl-data', 'all-scripts']) {
    const trigger = page.locator(`[data-modal="${id}"]`);
    await expect(trigger).toHaveCount(1);
    await trigger.click();
    if (id === 'decryptor') await expect(page.locator('[data-decoder-entry]')).toBeVisible();
    else await expect(page.locator('[data-decoder-entry]')).toBeHidden();
    if (id === 'all-scripts') {
      await expect(page.locator('#hacker-modal-body .hacker-script-folder').first()).toBeVisible();
      await expect(
        page.locator('#hacker-modal-body .hacker-script-folder').first()
      ).toHaveAttribute('href', /^\/en\/blog\//);
    }
    const modal = page.locator('.hacker-modal');
    const originalWidth = (await modal.boundingBox()).width;
    await expect(page.locator('#hacker-modal-body')).toBeVisible();
    await page.locator('[data-window-collapse]').click();
    await expect(page.locator('#hacker-modal-body')).toBeHidden();
    await expect(page.locator('[data-window-collapse]')).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-window-expand]')).toBeFocused();
    await page.locator('[data-window-collapse]').click();
    await expect(page.locator('#hacker-modal-body')).toBeVisible();
    await page.locator('[data-window-expand]').click();
    expect((await modal.boundingBox()).width).toBeGreaterThan(originalWidth);
    await expect(page.locator('[data-window-expand]')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-window-expand]').click();
    expect((await modal.boundingBox()).width).toBeCloseTo(originalWidth, 0);
    await page.locator('[data-window-close]').click();
    await expect(page.locator('#hacker-modal')).toHaveAttribute('aria-hidden', 'true');
    await expect(trigger).toBeFocused();
  }
  await page.locator('[data-modal="decryptor"]').click();
  await expect(page.locator('.hacker-decoder-formats')).toContainText('HTML entities');
  await expect(page.locator('.hacker-decoder-formats')).toContainText('JWT');
  await page.screenshot({ path: 'acceptance-results/about-shared-window.png' });
});

test('All Scripts opens localized article folders and its links navigate', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/zh/about/');
  await page.locator('[data-modal="all-scripts"]').click();
  const first = page.locator('#hacker-modal-body .hacker-script-folder').first();
  await expect(first).toBeVisible();
  const href = await first.getAttribute('href');
  expect(href).toMatch(/^\/zh\/blog\//);
  await first.click();
  await expect(page).toHaveURL(new URL(href, page.url()).href);
  expect(errors).toEqual([]);
});

test('article folders keep equal height, clamp titles, copy full names and scroll inside the window', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 1100, height: 480 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/about/');
  await page.locator('[data-modal="all-scripts"]').click();
  const cards = page.locator('#hacker-modal-body .hacker-script-card');
  const sizes = await cards.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect().height)
  );
  expect(sizes.length).toBeGreaterThan(5);
  expect(new Set(sizes).size).toBe(1);
  const labels = page.locator('#hacker-modal-body .hacker-script-folder-label');
  const titles = (await labels.allTextContents()).map((title) => title.trim());
  const index = titles.reduce(
    (best, title, i) => (title.length > titles[best].length ? i : best),
    0
  );
  await expect(labels.nth(index)).toHaveAttribute('title', titles[index]);
  await expect(labels.nth(index)).toHaveCSS('-webkit-line-clamp', '3');
  await cards.nth(index).hover();
  await cards.nth(index).locator('[data-copy-script-title]').click();
  await expect(page.locator('.hacker-script-copy-status')).toHaveText('Title copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(titles[index]);
  await expect(page.locator('#hacker-modal')).toHaveAttribute('aria-hidden', 'false');
  const body = page.locator('#hacker-modal-body');
  expect(await body.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(true);
  await body.evaluate((node) => (node.scrollTop = 0));
  await body.hover();
  await page.mouse.wheel(0, 350);
  await expect.poll(() => body.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await page.screenshot({ path: 'acceptance-results/about-script-folders.png' });
});

test('folder copy icon is revealed by card hover and keyboard focus with localized tooltips', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/about/');
  await page.locator('[data-modal="all-scripts"]').click();
  const card = page.locator('#hacker-modal-body .hacker-script-card').first();
  const copy = card.locator('[data-copy-script-title]');
  await page.mouse.move(0, 0);
  await expect(copy).toHaveCSS('opacity', '0');
  await card.hover();
  await expect(copy).toHaveCSS('opacity', '1');
  await expect(copy).toHaveAttribute('title', 'Copy article title');
  await page.mouse.move(0, 0);
  await card.locator('a').focus();
  await expect(copy).toHaveCSS('opacity', '1');
  await page.keyboard.press('Tab');
  await expect(copy).toBeFocused();
  await page.goto('/zh/about/');
  await page.locator('[data-modal="all-scripts"]').click();
  await expect(page.locator('[data-copy-script-title]').first()).toHaveAttribute(
    'title',
    '复制文章标题'
  );
});
