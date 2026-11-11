/* global document, Event, window, MessageEvent, parent */
import { test, expect } from '@playwright/test';
import { URL } from 'node:url';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Minimal provider contract stub; production loads the unmodified remote client.js.
const clientStub = `const s=document.currentScript,d=s.dataset,f=document.createElement('iframe');
f.className='giscus-frame giscus-frame--loading';f.title='Comments';
f.src='https://giscus.app/'+d.lang+'/widget?'+new URLSearchParams({term:d.term,strict:d.strict,emitMetadata:d.emitMetadata});
f.addEventListener('load',()=>f.classList.remove('giscus-frame--loading'));
document.querySelector('.giscus').append(f);`;
function providerHTML(initial = 'ready', holdUpdates = false) {
  return `<!doctype html><body><p>Giscus fixture</p><script>
let term=new URLSearchParams(location.search).get('term');document.body.dataset.term=term;
const report=()=>parent.postMessage({giscus:{discussion:{title:term}}},'*');
addEventListener('load',()=>{${initial === 'ready' ? 'report();' : initial ? `parent.postMessage({giscus:{error:${JSON.stringify(initial)}}},'*');` : ''}});
addEventListener('message',e=>{const c=e.data?.giscus?.setConfig;if(!c)return;
term=c.term;document.body.dataset.term=term;${holdUpdates ? '' : 'report();'}});
</script>`;
}
async function stub(page, provider = () => providerHTML()) {
  const counts = { clients: 0, frames: 0 };
  await page.route('https://giscus.app/**', async (route) => {
    if (new URL(route.request().url()).pathname === '/client.js') {
      counts.clients++;
      await route.fulfill({
        contentType: 'application/javascript',
        headers: { 'access-control-allow-origin': '*' },
        body: clientStub,
      });
    } else {
      counts.frames++;
      await route.fulfill({ contentType: 'text/html', body: provider(counts.frames) });
    }
  });
  return counts;
}
let directory, server, origin;
test.beforeAll(async () => {
  ({ directory } = JSON.parse(
    await readFile('tests/e2e/.generated-fragments-config.json', 'utf8')
  ));
  server = createServer(async (request, response) => {
    try {
      let url = new URL(request.url, 'http://localhost').pathname;
      if (url.endsWith('/')) url += 'index.html';
      const mime = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
      };
      response.setHeader('Content-Type', mime[path.extname(url)] ?? 'application/octet-stream');
      response.end(await readFile(path.join(directory, url)));
    } catch {
      response.writeHead(404);
      response.end();
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.afterAll(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

for (const width of [1280, 390]) {
  test(`one lazy client/iframe survives close, target switches and session reload (${width})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const counts = await stub(page);
    await page.goto(`${origin}/zh/fragments/`);
    const buttons = page.locator('[data-fragment-comments]'),
      dialog = page.locator('[data-fragment-dialog]');
    const frame = page.locator('iframe.giscus-frame');
    expect(counts).toEqual({ clients: 0, frames: 0 });
    await expect(frame).toHaveCount(0);
    await buttons.first().click();
    await expect(dialog).toHaveAttribute('data-comment-state', 'ready');
    await frame.evaluate((el) => {
      el.dataset.retained = 'yes';
    });
    const script = dialog.locator('script[src="https://giscus.app/client.js"]');
    await expect(script).toHaveAttribute('data-term', 'fragment/third');
    await expect(script).toHaveAttribute('data-mapping', 'specific');
    await expect(script).toHaveAttribute('data-strict', '1');
    await expect(script).toHaveAttribute('data-lang', 'zh-CN');
    await expect(script).toHaveAttribute('data-emit-metadata', '1');
    const bounds = await dialog.boundingBox(),
      close = await dialog.locator('[data-fragment-close]').boundingBox();
    expect(close.x).toBeGreaterThanOrEqual(bounds.x);
    expect(close.y).toBeGreaterThanOrEqual(bounds.y);
    expect(close.x + close.width).toBeLessThanOrEqual(bounds.x + bounds.width);
    expect(close.y + close.height).toBeLessThanOrEqual(bounds.y + bounds.height);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(buttons.first()).toBeFocused();
    await expect(frame).toHaveCount(1);
    expect(await page.locator('body').evaluate((el) => el.style.overflow)).toBe('');
    await buttons.nth(1).click();
    await expect(dialog).toHaveAttribute('data-comment-state', 'ready');
    await expect(page.frameLocator('iframe.giscus-frame').locator('body')).toHaveAttribute(
      'data-term',
      'fragment/second'
    );
    await expect(frame).toHaveAttribute('data-retained', 'yes');
    expect(counts).toEqual({ clients: 1, frames: 1 });
    // Emulate the official client's session-triggered reload to its original URL.
    await frame.evaluate((el) => el.setAttribute('src', el.getAttribute('src')));
    await expect.poll(() => counts.frames).toBe(2);
    await expect(dialog).toHaveAttribute('data-comment-state', 'ready');
    await expect(page.frameLocator('iframe.giscus-frame').locator('body')).toHaveAttribute(
      'data-term',
      'fragment/second'
    );
    await expect(frame).toHaveAttribute('data-retained', 'yes');
    await dialog.locator('[data-fragment-close]').click();
    await buttons.nth(1).click();
    await expect(dialog).toHaveAttribute('data-comment-state', 'ready');
    expect(counts).toEqual({ clients: 1, frames: 2 });
    await page.evaluate(() => document.dispatchEvent(new Event('astro:before-swap')));
    await expect(dialog).not.toBeVisible();
    expect(await page.locator('body').evaluate((el) => el.style.overflow)).toBe('');
  });
}

test('silent remote load times out; retry reuses the same iframe and client', async ({ page }) => {
  await page.clock.install();
  const counts = await stub(page, (n) => providerHTML(n === 1 ? null : 'ready'));
  await page.goto(`${origin}/zh/fragments/`);
  await page.locator('[data-fragment-comments]').first().click();
  const dialog = page.locator('[data-fragment-dialog]'),
    frame = page.locator('iframe.giscus-frame');
  await expect(frame).not.toHaveClass(/--loading/);
  await frame.evaluate((el) => {
    el.dataset.retained = 'yes';
  });
  await expect(dialog).toHaveAttribute('data-comment-state', 'loading');
  await expect(dialog.locator('[data-fragment-status]')).toContainText('正在加载');
  await page.evaluate(() =>
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://giscus.app',
        source: window,
        data: { giscus: { discussion: { title: 'fragment/third' } } },
      })
    )
  );
  await expect(dialog).toHaveAttribute('data-comment-state', 'loading');
  await page.clock.fastForward(15001);
  await expect(dialog).toHaveAttribute('data-comment-state', 'failed');
  await expect(dialog.locator('[data-fragment-status]')).toContainText('网络');
  await dialog.locator('[data-fragment-retry]').click();
  await expect(dialog).toHaveAttribute('data-comment-state', 'ready');
  await expect(frame).toHaveAttribute('data-retained', 'yes');
  expect(counts).toEqual({ clients: 1, frames: 2 });
});

for (const error of ['Bad credentials', 'Discussion not found']) {
  test(`provider result ${error} is handled explicitly`, async ({ page }) => {
    await stub(page, () => providerHTML(error));
    await page.goto(`${origin}/en/fragments/`);
    await page.locator('[data-fragment-comments]').first().click();
    const dialog = page.locator('[data-fragment-dialog]');
    await expect(dialog).toHaveAttribute(
      'data-comment-state',
      error === 'Discussion not found' ? 'ready' : 'failed'
    );
    await dialog.locator('[data-fragment-close]').click();
    await expect(page.locator('iframe.giscus-frame')).toHaveCount(1);
  });
}

test('closing while loading keeps the instance and caches a late ready response', async ({
  page,
}) => {
  await page.clock.install();
  const counts = await stub(page, () => providerHTML(null));
  await page.goto(`${origin}/en/fragments/`);
  const button = page.locator('[data-fragment-comments]').first(),
    dialog = page.locator('[data-fragment-dialog]');
  await button.click();
  await expect(page.locator('iframe.giscus-frame')).not.toHaveClass(/--loading/);
  await page.keyboard.press('Escape');
  await page.clock.fastForward(20000);
  await expect(dialog).not.toHaveAttribute('data-comment-state');
  await expect(dialog.locator('[data-fragment-status]')).toBeEmpty();
  await page
    .frameLocator('iframe.giscus-frame')
    .locator('body')
    .evaluate(() =>
      parent.postMessage({ giscus: { discussion: { title: 'fragment/third' } } }, '*')
    );
  await button.click();
  await expect(dialog).toHaveAttribute('data-comment-state', 'ready');
  expect(counts).toEqual({ clients: 1, frames: 1 });
});

test('a late old response cannot reveal the old discussion under a new summary', async ({
  page,
}) => {
  const counts = await stub(page, () => providerHTML(null, true));
  await page.goto(`${origin}/en/fragments/`);
  const buttons = page.locator('[data-fragment-comments]'),
    dialog = page.locator('[data-fragment-dialog]');
  const remote = page.frameLocator('iframe.giscus-frame').locator('body');
  await buttons.first().click();
  await expect(page.locator('iframe.giscus-frame')).not.toHaveClass(/--loading/);
  await page.keyboard.press('Escape');
  await buttons.nth(1).click();
  await remote.evaluate(() =>
    parent.postMessage({ giscus: { discussion: { title: 'fragment/third' } } }, '*')
  );
  await expect(remote).toHaveAttribute('data-term', 'fragment/second');
  await remote.evaluate(() =>
    parent.postMessage({ giscus: { discussion: { title: 'fragment/third' } } }, '*')
  );
  await expect(dialog).toHaveAttribute('data-comment-state', 'loading');
  await expect(dialog.locator('[data-fragment-summary]')).toContainText('second body');
  await remote.evaluate(() =>
    parent.postMessage({ giscus: { discussion: { title: 'fragment/second' } } }, '*')
  );
  await expect(dialog).toHaveAttribute('data-comment-state', 'ready');
  expect(counts).toEqual({ clients: 1, frames: 1 });
});

test('a failed client download can be retried without creating multiple instances', async ({
  page,
}) => {
  let clients = 0;
  await page.route('https://giscus.app/**', async (route) => {
    if (new URL(route.request().url()).pathname === '/client.js') {
      if (++clients === 1) await route.abort();
      else
        await route.fulfill({
          contentType: 'application/javascript',
          headers: { 'access-control-allow-origin': '*' },
          body: clientStub,
        });
    } else await route.fulfill({ contentType: 'text/html', body: providerHTML() });
  });
  await page.goto(`${origin}/en/fragments/`);
  await page.locator('[data-fragment-comments]').first().click();
  const dialog = page.locator('[data-fragment-dialog]');
  await expect(dialog).toHaveAttribute('data-comment-state', 'failed');
  await dialog.locator('[data-fragment-retry]').click();
  await expect(dialog).toHaveAttribute('data-comment-state', 'ready');
  await expect(page.locator('iframe.giscus-frame')).toHaveCount(1);
  expect(clients).toBe(2);
});
