/* global window, document */
import { test, expect } from '@playwright/test';
import { URL } from 'node:url';
import process from 'node:process';
const input = '[name="decoder-input"]',
  output = '.hacker-decoder-output';

for (const phase of ['initialization', 'animation']) {
  test(`decoder remains usable when SVG background fails during ${phase}`, async ({ page }) => {
    const injectFailure = () => {
      const original = window.SVGElement.prototype.setAttribute;
      window.SVGElement.prototype.setAttribute = function (name, value) {
        if (name === 'cx' && this.closest('[data-network-background]')) {
          window.SVGElement.prototype.setAttribute = original;
          throw new Error('Injected decorative SVG failure');
        }
        return original.call(this, name, value);
      };
    };
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    if (phase === 'initialization') await page.addInitScript(injectFailure);
    await open(page);
    if (phase === 'animation') await page.evaluate(injectFailure);
    await expect(page.locator('[data-network-background]')).toHaveAttribute('data-paused', 'true');
    await page.locator('[name="decoder-format"]').selectOption('base64');
    await page.locator(input).fill('SGVsbG8=');
    await run(page);
    await expect(page.locator(output)).toHaveText('Hello');
  });
}

test('resize preserves the graph within a density band and adapts it for mobile', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await open(page);
  const network = page.locator('[data-network-background]');
  await network
    .locator('.network-background-nodes circle')
    .first()
    .evaluate((el) => {
      el.dataset.resizeWitness = 'kept';
    });
  await page.setViewportSize({ width: 1420, height: 880 });
  await expect(network).toHaveAttribute('viewBox', '0 0 1420 880');
  await expect(network.locator('[data-resize-witness="kept"]')).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(network).toHaveAttribute('viewBox', '0 0 390 844');
  await expect(network.locator('.network-background-nodes circle')).toHaveCount(8);
  await expect(network.locator('.network-background-signal')).toHaveCount(3);
});
test('SVG network signals move along existing edges and stop for reduced motion and pagehide', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/en/decoder/');
  const network = page.locator('[data-network-background]');
  const signal = network.locator('.network-background-signal').first();
  await expect(network).toHaveAttribute('aria-hidden', 'true');
  await expect(network).toHaveAttribute('data-paused', 'false');
  const node = network.locator('.network-background-nodes circle').first();
  const before = await node.getAttribute('cx');
  await expect.poll(() => node.getAttribute('cx')).not.toBe(before);
  const edge = network.locator('line').first();
  await expect.poll(() => edge.getAttribute('x1')).not.toBe(before);
  await expect(network.locator('pattern')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(network).toHaveAttribute('data-paused', 'true');
  const stopped = await node.getAttribute('cx');
  await page.waitForTimeout(150);
  await expect(node).toHaveAttribute('cx', stopped);
  await expect(signal).toHaveCSS('display', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(network).toHaveAttribute('data-paused', 'false');
  await page.evaluate(() => window.dispatchEvent(new window.PageTransitionEvent('pagehide')));
  await expect(network).toHaveAttribute('data-paused', 'true');
  await page.evaluate(() =>
    window.dispatchEvent(new window.PageTransitionEvent('pageshow', { persisted: true }))
  );
  await expect(network).toHaveAttribute('data-paused', 'false');
});
async function open(page, locale = 'en') {
  await page.goto(`/${locale}/decoder/`);
  await expect(page.locator('[data-decoder-page]')).toBeVisible();
}
async function run(page) {
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'done');
}

test('localized static pages expose canonical, reciprocal languages and an independent tool', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const locale of ['en', 'zh', 'zh-hant', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru']) {
    await page.setViewportSize({ width: locale === 'en' ? 1440 : 390, height: 1000 });
    await open(page, locale);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`/${locale}/decoder/$`)
    );
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', /\/en\/decoder\/$/);
    await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute(
      'href',
      /\/zh\/decoder\/$/
    );
    await expect(page.locator('#hacker-modal')).toHaveCount(0);
    await expect(page.locator('script[src*="about-effects"]')).toHaveCount(0);
    if (locale === 'en') {
      for (const width of [1440, 1024, 768]) {
        await page.setViewportSize({ width, height: 1000 });
        const source = await page.locator(input).boundingBox();
        const result = await page.locator(output).boundingBox();
        expect(source.x).toBeLessThan(80);
        expect(Math.abs(source.width - result.width)).toBeLessThan(2);
        expect(Math.abs(source.y - result.y)).toBeLessThan(2);
        expect(Math.abs((source.x + source.width + result.x) / 2 - width / 2)).toBeLessThan(4);
        await expect(page.locator('[data-music-deck]')).toHaveCSS('position', 'fixed');
        const player = await page.locator('[data-music-deck]').boundingBox();
        expect(player.x).toBeLessThan(25);
        expect(Math.abs(player.y + player.height - 984)).toBeLessThan(2);
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      const title = await page.locator('.decoder-page-heading h1').boundingBox();
      const description = await page.locator('.decoder-page-description').boundingBox();
      expect(description.x).toBeGreaterThan(title.x + title.width);
      const decode = await page.locator('.hacker-decoder-submit').boundingBox();
      const formats = await page
        .locator('.hacker-decoder-formats[data-text-control]')
        .boundingBox();
      expect(formats.x).toBeGreaterThan(decode.x + decode.width);
      const player = page.locator('[data-music-deck]');
      await expect(player).toHaveCount(1);
      await expect(player).toHaveAttribute('data-collapsed', 'true');
      await player.locator('[data-action="expand"]').click();
      await expect(player).toHaveAttribute('data-collapsed', 'false');
      await player.locator('[data-action="expand"]').click();
      await expect(player).toHaveAttribute('data-collapsed', 'true');
      await expect(page.locator('body')).not.toHaveClass(/hacker-page/);
    }
    await page.locator('[name="decoder-format"]').selectOption('unicode');
    await page.locator('[data-decoder-example]').click();
    await run(page);
    await expect(page.locator(output)).toHaveText('你好 🐇');
    await page.locator('[data-decoder-task="address"]').click();
    await expect(page.locator('#decoder-address-hint')).toBeVisible();
    await expect(page.locator(input)).toHaveAttribute('aria-describedby', 'decoder-address-hint');
    if (locale === 'en') {
      await expect(page.locator('#decoder-address-hint')).toContainText(
        'No balance or transaction lookup'
      );
      await expect(page.locator('#decoder-address-hint')).toContainText('scriptPubKey');
    }
    await page.locator('[name="decoder-chain"]').selectOption('btc');
    await page.locator('[data-decoder-example]').click();
    await run(page);
    expect(JSON.parse(await page.locator(output).textContent()).type).toBe('P2PKH');
    if (locale === 'zh')
      await page.screenshot({
        path: 'acceptance-results/decoder-page-mobile-zh.png',
        fullPage: true,
      });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true);
  }
});
test('text pipeline records, branches and exports without leaking user input into URLs', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await expect(page.locator('#decoder-address-hint')).toBeHidden();
  await page.locator('[name="decoder-format"]').selectOption('url');
  await page.locator(input).fill('SGVsbG8%3D');
  await run(page);
  await expect(page.locator(output)).toHaveText('SGVsbG8=');
  await page.locator('[data-decoder-reuse]').click();
  await run(page);
  await expect(page.locator(output)).toHaveText('Hello');
  await expect(page.locator('[data-decoder-history] > li')).toHaveCount(2);
  await page.locator('[data-decoder-history] summary').first().click();
  await page.locator('[data-decoder-history] button').first().click();
  await run(page);
  await expect(page.locator('[data-decoder-history] > li')).toHaveCount(2);
  const download = page.waitForEvent('download');
  await page.locator('[data-decoder-export]').click();
  expect((await download).suggestedFilename()).toBe('decoder-results.json');
  expect(new URL(page.url()).search).toBe('');
  await page.locator('[data-decoder-clear]').click();
  await expect(page.locator('[data-decoder-history] > li')).toHaveCount(0);
});
test('crypto loads only on demand and completes local call/address workflows', async ({ page }) => {
  const external = [],
    chunks = [];
  page.on('request', (request) => {
    if (
      ['fetch', 'xhr'].includes(request.resourceType()) &&
      new URL(request.url()).origin !==
        new URL(process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4321').origin
    )
      external.push(request.url());
    if (request.resourceType() === 'script' && /crypto|addresses/.test(request.url()))
      chunks.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  expect(chunks).toEqual([]);
  await page.locator('[data-decoder-task="call"]').click();
  await page.locator('[name="decoder-chain"]').selectOption('tron');
  await page.locator('[name="decoder-decimals"]').fill('6');
  const parameters = await page.locator('.decoder-taskbar').boundingBox();
  const example = await page.locator('[data-decoder-example]').boundingBox();
  expect(Math.abs(parameters.y - example.y)).toBeLessThan(2);
  const reuse = await page.locator('[data-decoder-reuse]').boundingBox();
  const submit = await page.locator('.hacker-decoder-submit').boundingBox();
  expect(submit.x - (reuse.x + reuse.width)).toBeLessThan(16);
  const precision = await page.locator('#decoder-precision-hint').boundingBox();
  expect(precision.x).toBeGreaterThan(submit.x + submit.width);
  await page.locator('[data-decoder-example]').click();
  await run(page);
  let result = JSON.parse(await page.locator(output).textContent());
  expect(result.amount).toBe('1');
  expect(result.args.to.startsWith('T')).toBe(true);
  await page.locator('[name="decoder-decimals"]').fill('18');
  await expect(page.locator(output)).toContainText('0.000000000001');
  await page.locator('[name="decoder-decimals"]').fill('6');
  await expect(page.locator(output)).toContainText('"amount": "1"');
  await expect(page.locator('.decoder-notice')).toContainText('not verified');
  for (const chain of ['evm', 'hyperevm']) {
    await page.locator('[name="decoder-chain"]').selectOption(chain);
    await run(page);
    result = JSON.parse(await page.locator(output).textContent());
    expect(result.args.to.startsWith('0x')).toBe(true);
  }
  await page.locator('[data-decoder-task="address"]').click();
  await page.locator('[name="decoder-chain"]').selectOption('btc');
  await page.locator('[data-decoder-example]').click();
  await run(page);
  result = JSON.parse(await page.locator(output).textContent());
  expect(result.type).toBe('P2PKH');
  expect(result.scriptPubKey).toMatch(/^76a914/);
  await page.locator('[name="decoder-network"]').selectOption('testnet');
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator('.hacker-decoder-status')).toContainText('does not match');
  expect(external).toEqual([]);
  expect(chunks.length).toBeGreaterThan(0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('[name="decoder-network"]').selectOption('mainnet');
  await run(page);
  await page.screenshot({ path: 'acceptance-results/decoder-page-desktop.png', fullPage: true });
});
test('page reveal uses a single canvas and cancels immediately on edits and navigation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    globalThis.sessionStorage.setItem(
      'anglefeint-music-v1',
      JSON.stringify({ src: '/unused-test-track.mp3', collapsed: false, shouldResume: false })
    );
  });
  await open(page);
  await expect(page.locator('[data-music-deck]')).toHaveAttribute('data-collapsed', 'true');
  await expect(page.getByRole('tab')).toHaveCount(3);
  await page.getByRole('tab', { name: 'Text decoding', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Token call', exact: true })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: 'Text decoding', exact: true })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  await expect(page.locator('[data-music-deck]')).toHaveCSS('position', 'fixed');
  await page.locator(input).fill('SGVsbG8=');
  await page.locator('.hacker-decoder-submit').click();
  await expect(page.locator(`${output} canvas`)).toHaveCount(1);
  await page.locator(input).fill('5L2g5aW9');
  await expect(page.locator(`${output} canvas`)).toHaveCount(0);
  await run(page);
  await expect(page.locator(output)).toHaveText('你好');
  await page.goto('/en/about/');
  await page.locator('[data-modal="decryptor"]').click();
  await expect(page.locator('.decoder-full-link')).toHaveAttribute('href', '/en/decoder/');
  await page.locator('.decoder-full-link').click();
  await expect(page).toHaveURL(/\/en\/decoder\/$/);
});

test('result crossfades over the same numeric canvas and releases its layers', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await open(page);
  await page.locator(input).fill('SGVsbG8=');
  await page.locator('.hacker-decoder-submit').click();
  await page.waitForFunction(() => {
    const result = document.querySelector('.hacker-decoder-original');
    const code = document.querySelector('.hacker-decoder-code');
    return (
      result &&
      code &&
      Number(result.style.opacity) > 0.2 &&
      Number(result.style.opacity) < 0.8 &&
      Number(code.style.opacity) > 0.2
    );
  });
  await expect(page.locator(`${output} canvas`)).toHaveCount(1);
  await expect(page.locator(`${output} .hacker-decoder-original`)).toHaveText('Hello');
  await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'done');
  await expect(page.locator(`${output} canvas, ${output} .hacker-decoder-original`)).toHaveCount(0);
  await expect(page.locator(output)).toHaveText('Hello');
});

test('SEO explanations, application schema and localized links are static HTML', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const locale of ['en', 'zh', 'zh-hant', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru']) {
    await open(page, locale);
    await expect(page).toHaveTitle(/^Decoder Lab \| Base64.*JWT/);
    await expect(page.locator('.decoder-guide h2')).toHaveCount(3);
    await expect(page.locator('.decoder-guide')).toContainText('SGVsbG8%3D');
    await expect(page.locator(`footer a[href="/${locale}/decoder/"]`)).toHaveCount(1);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const app = schemas
      .flatMap((text) => {
        const value = JSON.parse(text);
        return Array.isArray(value) ? value : value['@graph'] || [value];
      })
      .find((value) => value['@type'] === 'WebApplication');
    expect(app?.url).toMatch(new RegExp(`/${locale}/decoder/$`));
    expect(app?.isAccessibleForFree).toBe(true);
    expect(app?.aggregateRating).toBeUndefined();
  }
  await context.close();
});

test('shared numeric reveal receives the host palette in the lab and About modal', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    window.numericColors = [];
    window.numericAlphas = [];
    const draw = window.CanvasRenderingContext2D.prototype.fillText;
    window.CanvasRenderingContext2D.prototype.fillText = function (text, ...args) {
      if (/^\d$/.test(text)) {
        window.numericColors.push(this.fillStyle);
        if (this.canvas.closest('.hacker-decoder-output'))
          window.numericAlphas.push(this.globalAlpha);
      }
      return draw.call(this, text, ...args);
    };
  });
  for (const [path, color, highlight] of [
    ['/en/decoder/', '#78dcb2', '#78dcb2'],
    ['/en/about/', '#efbd66', '#ffda93'],
  ]) {
    await page.goto(path);
    if (path.includes('about')) await page.locator('[data-modal="decryptor"]').click();
    await page.locator(input).fill('SGVsbG8=');
    await page.locator('.hacker-decoder-submit').click();
    await expect.poll(() => page.evaluate(() => window.numericColors)).toContain(color);
    await expect.poll(() => page.evaluate(() => window.numericColors)).toContain(highlight);
    await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'done');
    await expect(page.locator(output)).toHaveText('Hello');
    if (path.includes('decoder'))
      expect(await page.evaluate(() => [...new Set(window.numericAlphas)])).toEqual([1]);
  }
});
