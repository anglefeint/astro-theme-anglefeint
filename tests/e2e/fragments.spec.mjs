/* global document, Event, window, navigator, MessageEvent, parent */
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
  test(`shared pagination follows fragment routes and clamps jump input (${width})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${origin}/zh/fragments/`);
    const pagination = page.locator('[data-pagination-component="cyber"]');
    await expect(pagination).toHaveAttribute('data-pagination-ready', '');
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('1');
    await pagination.getByRole('link', { name: '2', exact: true }).click();
    await expect(page).toHaveURL(`${origin}/zh/fragments/2/`);
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('2');
    await expect(page.locator('[data-fragment-link]')).toHaveAttribute(
      'href',
      '/zh/fragments/#fragment-first'
    );
    const input = pagination.locator('.pagination-jump-input');
    await input.fill('0');
    await input.press('Enter');
    await expect(page).toHaveURL(`${origin}/zh/fragments/`);
    await input.fill('999');
    await pagination.locator('.pagination-jump-btn').click();
    await expect(page).toHaveURL(`${origin}/zh/fragments/2/`);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    ).toBeLessThanOrEqual(1);
  });
}

test('fragment dates and copy links stay on the current page without fetching an index', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.fragmentCopied = value;
        },
      },
    });
  });
  const indexes = [];
  page.on('request', (request) => {
    if (request.url().includes('/fragments/index/')) indexes.push(request.url());
  });
  await page.goto(`${origin}/zh/fragments/2/`);
  const date = page.locator('[data-fragment-link]');
  await expect(date).toHaveAttribute('href', '/zh/fragments/#fragment-first');
  await date.click();
  await expect(page).toHaveURL(`${origin}/zh/fragments/2/#fragment-first`);
  await expect(page.locator('[data-fragment-id="first"]')).toBeFocused();
  await page.locator('[data-fragment-copy]').click();
  await expect
    .poll(() => page.evaluate(() => window.fragmentCopied))
    .toBe(`${origin}/zh/fragments/#fragment-first`);
  await expect(page.locator('[data-fragment-copy]')).toHaveAttribute('data-copied', '');
  expect(indexes).toHaveLength(0);
});

test('a stable root link locates a fragment across pages, then handles another hash', async ({
  page,
}) => {
  const indexes = [];
  page.on('request', (request) => {
    if (request.url().includes('/fragments/index/')) indexes.push(request.url());
  });
  await page.goto(`${origin}/en/fragments/#fragment-first`);
  await expect(page).toHaveURL(`${origin}/en/fragments/2/#fragment-first`);
  await expect(page.locator('[data-fragment-id="first"]')).toBeFocused();
  expect(indexes).toHaveLength(1);
  await page.evaluate(() => {
    window.location.hash = 'fragment-third';
  });
  await expect(page).toHaveURL(`${origin}/en/fragments/#fragment-third`);
  await expect(page.locator('[data-fragment-id="third"]')).toBeFocused();
  expect(indexes).toHaveLength(2);
});

test('an on-page hash needs no index and a missing ID reports a localized message', async ({
  page,
}) => {
  const indexes = [];
  page.on('request', (request) => {
    if (request.url().includes('/fragments/index/')) indexes.push(request.url());
  });
  await page.goto(`${origin}/zh/fragments/#fragment-third`);
  await expect(page.locator('[data-fragment-id="third"]')).toBeFocused();
  expect(indexes).toHaveLength(0);
  await page.evaluate(() => {
    window.location.hash = 'fragment-deleted';
  });
  await expect(page.locator('[data-fragment-link-status]')).toHaveText(
    '找不到这条碎片，它可能已被移除。'
  );
  await expect(page).toHaveURL(`${origin}/zh/fragments/#fragment-deleted`);
  expect(indexes).toHaveLength(1);
});

test('clipboard rejection exposes a selectable canonical link', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('denied');
        },
      },
    });
  });
  await page.goto(`${origin}/en/fragments/2/`);
  await page.locator('[data-fragment-copy]').click();
  const input = page.locator('[data-fragment-copy-feedback] input');
  await expect(input).toBeFocused();
  await expect(input).toHaveValue(`${origin}/en/fragments/#fragment-first`);
  expect(await input.evaluate((node) => node.selectionEnd - node.selectionStart)).toBe(
    (await input.inputValue()).length
  );
});

for (const mode of ['network', 'invalid', 'same-page']) {
  test(`fragment index ${mode} failure stays put instead of looping`, async ({ page }) => {
    let calls = 0;
    await page.route('**/fragments/index/*.json', async (route) => {
      calls++;
      await route.fulfill({
        status: mode === 'network' ? 503 : 200,
        contentType: 'application/json',
        body: JSON.stringify(
          mode === 'invalid' ? { version: 99 } : { version: 1, totalPages: 2, pages: { first: 1 } }
        ),
      });
    });
    await page.goto(`${origin}/en/fragments/#fragment-first`);
    await expect(page.locator('[data-fragment-link-status]')).toHaveText(
      'Unable to locate this fragment. Refresh the page and try again.'
    );
    await expect(page).toHaveURL(`${origin}/en/fragments/#fragment-first`);
    expect(calls).toBe(1);
  });
}

test('a late index response cannot navigate an obsolete hash', async ({ page }) => {
  let release;
  const held = new Promise((resolve) => {
    release = resolve;
  });
  let started;
  const requested = new Promise((resolve) => {
    started = resolve;
  });
  await page.route('**/fragments/index/*.json', async (route) => {
    started();
    await held;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ version: 1, totalPages: 2, pages: { first: 2 } }),
    });
  });
  await page.goto(`${origin}/en/fragments/#fragment-first`);
  await requested;
  await page.evaluate(() => {
    window.location.hash = 'fragment-third';
  });
  await expect(page.locator('[data-fragment-id="third"]')).toBeFocused();
  release();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(`${origin}/en/fragments/#fragment-third`);
});

test('a stale destination cannot bounce between pages, even without storage', async ({ page }) => {
  await page.addInitScript(() => {
    for (const name of ['localStorage', 'sessionStorage'])
      Object.defineProperty(window, name, {
        configurable: true,
        get() {
          throw new Error('Storage blocked');
        },
      });
  });
  let indexes = 0;
  await page.route('**/fragments/index/*.json', async (route) => {
    indexes++;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ version: 1, totalPages: 2, pages: { first: indexes === 1 ? 2 : 1 } }),
    });
  });
  await page.route('**/en/fragments/2/?*', async (route) => {
    const html = (
      await readFile(path.join(directory, 'en/fragments/2/index.html'), 'utf8')
    ).replace('data-fragment-id="first"', 'data-fragment-id="stale"');
    await route.fulfill({ contentType: 'text/html', body: html });
  });
  await page.goto(`${origin}/en/fragments/#fragment-first`);
  await expect(page).toHaveURL(`${origin}/en/fragments/2/#fragment-first`);
  await expect(page.locator('[data-fragment-link-status]')).toHaveText(
    'Unable to locate this fragment. Refresh the page and try again.'
  );
  expect(indexes).toBe(1);
});

test('without JavaScript dates remain native links and copy controls stay hidden', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${origin}/en/fragments/2/`);
    await expect(page.locator('[data-fragment-link]')).toHaveAttribute(
      'href',
      '/en/fragments/#fragment-first'
    );
    await expect(page.locator('[data-fragment-copy]')).toBeHidden();
    await expect(page.locator('[data-fragment-id="first"]')).toContainText('first');
    await page.locator('.pagination .pg-nav').click();
    await expect(page).toHaveURL(`${origin}/en/fragments/`);
  } finally {
    await context.close();
  }
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

for (const width of [1280, 390]) {
  test(`loading does not scroll; long comments scroll below the fixed heading (${width})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 540 });
    await stub(page, () => providerHTML(null));
    await page.goto(`${origin}/en/fragments/`);
    await page.locator('[data-fragment-comments]').first().click();
    const dialog = page.locator('[data-fragment-dialog]');
    const body = dialog.locator('[data-fragment-scroll]');
    const frame = dialog.locator('iframe.giscus-frame');
    await expect(frame).not.toHaveClass(/--loading/);
    // The official client can resize its still-hidden iframe before metadata is ready.
    await frame.evaluate((el) => {
      el.style.height = '1600px';
    });
    await expect(dialog).toHaveAttribute('data-comment-state', 'loading');
    for (const region of [dialog, body]) {
      expect(await region.evaluate((el) => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(
        1
      );
    }
    await page
      .frameLocator('iframe.giscus-frame')
      .locator('body')
      .evaluate(() =>
        parent.postMessage({ giscus: { discussion: { title: 'fragment/third' } } }, '*')
      );
    await expect(dialog).toHaveAttribute('data-comment-state', 'ready');
    expect(await body.evaluate((el) => el.scrollHeight - el.clientHeight)).toBeGreaterThan(500);
    const close = dialog.locator('[data-fragment-close]');
    const before = await close.boundingBox();
    await body.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    expect(await body.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect((await close.boundingBox()).y).toBe(before.y);
    await close.click();
    await expect(dialog).not.toBeVisible();
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

test('reduced motion keeps the connection signal static while waiting for comments', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await stub(page, () => providerHTML(null));
  await page.goto(`${origin}/en/fragments/`);
  await page.locator('[data-fragment-comments]').first().click();
  const dialog = page.locator('[data-fragment-dialog]');
  await expect(dialog).toHaveAttribute('data-comment-state', 'loading');
  await expect(dialog.locator('.fragment-connection')).toHaveAttribute('aria-hidden', 'true');
  await expect(dialog.locator('.signal-loading-bars span')).toHaveCount(5);
  for (const bar of await dialog.locator('.signal-loading-bars span').all())
    await expect(bar).toHaveCSS('animation-name', 'none');
  await expect(dialog.locator('[data-fragment-status]')).toContainText('Loading');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
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
