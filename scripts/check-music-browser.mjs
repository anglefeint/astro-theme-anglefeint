// Isolated real-Astro fixture: never edits the demo configuration or ships test audio.
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { build, preview } from 'astro';
import { chromium } from '@playwright/test';

const root = process.cwd();
const results = path.join(root, 'acceptance-results');
await mkdir(results, { recursive: true });
const fixture = await mkdtemp(path.join(results, 'music-browser-'));
const pages = path.join(fixture, 'src/pages');
await mkdir(pages, { recursive: true });
await mkdir(path.join(fixture, 'public/music'), { recursive: true });
const source = (file) => path.relative(pages, path.join(root, file)).replaceAll('\\', '/');
await writeFile(path.join(fixture, 'package.json'), '{"type":"module"}');
await writeFile(
  path.join(pages, '[slug].astro'),
  `---
import MusicDeck from '${source('packages/theme/src/components/shared/MusicDeck.astro')}';
import { getMessages } from '${source('packages/theme/src/i18n/messages.ts')}';
export function getStaticPaths() { return ['en','zh','ja','ko','es','off','empty','removed'].map(slug => ({params:{slug}})); }
const slug = Astro.params.slug;
const labels = getMessages(['en','zh','ja','ko','es'].includes(slug) ? slug : 'en').music;
const tracks = [{title:'Test tone',src: slug === 'removed' ? '/music/other.wav' : '/music/tone.wav'}];
---
<!doctype html><html lang={slug}><head><meta charset="utf-8"/><title>Music fixture</title></head><body>
<a href="/en/">English</a><a href="/zh/">中文</a><a href="/ja/">日本語</a>
{!['off','empty'].includes(slug) && <MusicDeck tracks={tracks} labels={labels}/>}
</body></html>`
);
// 30 seconds of a quiet generated tone, no external/copyrighted music.
const samples = 8000 * 30;
const wav = Buffer.alloc(44 + samples * 2);
wav.write('RIFF');
wav.writeUInt32LE(wav.length - 8, 4);
wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(8000, 24);
wav.writeUInt32LE(16000, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(samples * 2, 40);
for (let i = 0; i < samples; i++)
  wav.writeInt16LE(Math.round(100 * Math.sin((i * 2 * Math.PI * 220) / 8000)), 44 + i * 2);
await writeFile(path.join(fixture, 'public/music/tone.wav'), wav);
const config = {
  root: fixture,
  configFile: false,
  logLevel: 'warn',
  server: { host: '127.0.0.1', port: 4397 },
};
let server,
  browser,
  success = false;
const checks = [];
try {
  await build(config);
  for (const slug of ['off', 'empty']) {
    const html = await readFile(path.join(fixture, 'dist', slug, 'index.html'), 'utf8');
    assert.ok(!html.includes('data-music-deck'));
  }
  server = await preview(config);
  browser = await chromium.launch(); // No autoplay-policy override.
  const context = await browser.newContext();
  // Reproduce a static host that returns the entire file and never supports Range.
  await context.route('**/music/tone.wav', (route) =>
    route.fulfill({ status: 200, contentType: 'audio/wav', body: wav })
  );
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await context.addInitScript(() => {
    window['__audioRequests'] = 0;
    const Original = window.Audio;
    window.Audio = function (...args) {
      window['__audioRequests']++;
      const audio = new Original(...args);
      window['__audio'] = audio;
      return audio;
    };
  });
  const go = (slug) => page.goto(`http://127.0.0.1:4397/${slug}/`);
  const ready = () =>
    page.waitForFunction(
      () =>
        document.querySelector('[data-music-deck]')?.dataset.ready === 'true' &&
        !document.querySelector('[data-action="play"]').disabled
    );
  const status = (value) =>
    page.waitForFunction(
      (value) => document.querySelector('[data-music-deck]')?.dataset.status === value,
      value
    );
  const saved = () =>
    page.evaluate(() => JSON.parse(sessionStorage.getItem('anglefeint-music-v1')));
  await go('en');
  await ready();
  assert.equal(await page.evaluate(() => window['__audioRequests']), 0);
  await page.locator('[data-action="play"]').click();
  await status('playing');
  await page.waitForFunction(() => window['__audio'].duration > 0);
  assert.match(await page.evaluate(() => window['__audio'].src), /^blob:/);
  const seek = page.locator('[data-seek]');
  const seekBox = await seek.boundingBox();
  await page.mouse.click(seekBox.x + seekBox.width * 0.7, seekBox.y + seekBox.height / 2);
  await page.waitForFunction(() => window['__audio'].currentTime > 18, null, { timeout: 3000 });
  await page.locator('[data-action="play"]').click();
  await status('paused');
  await page.mouse.click(seekBox.x + seekBox.width * 0.25, seekBox.y + seekBox.height / 2);
  await page.waitForFunction(() => window['__audio'].currentTime < 10, null, { timeout: 3000 });
  assert.equal(await page.evaluate(() => window['__audio'].paused), true);
  await seek.press('ArrowRight');
  const beforeDrag = await page.evaluate(() => window['__audio'].currentTime);
  await page.mouse.move(seekBox.x + seekBox.width * 0.25, seekBox.y + seekBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(seekBox.x + seekBox.width * 0.6, seekBox.y + seekBox.height / 2, {
    steps: 10,
  });
  await page.mouse.up();
  assert.ok(
    await page.evaluate((before) => window['__audio'].currentTime > before + 5, beforeDrag)
  );
  await page.locator('[data-action="expand"]').click();
  const compactBox = await seek.boundingBox();
  await page.mouse.click(
    compactBox.x + compactBox.width * 0.4,
    compactBox.y + compactBox.height / 2
  );
  await page.waitForFunction(() => window['__audio'].currentTime < 14, null, { timeout: 3000 });
  await page.locator('[data-action="play"]').click();
  await status('playing');
  checks.push('HTTP 200 without Range: Blob playback, real pointer/paused/drag/compact seeking');
  await page.locator('[data-seek]').evaluate((el) => {
    el.value = '12';
    el.dispatchEvent(new Event('input'));
  });
  await page.getByRole('link', { name: '中文', exact: true }).click();
  await ready();
  await status('playing');
  assert.ok(await page.evaluate(() => window['__audio'].currentTime >= 12));
  checks.push('first visit lazy; real cross-document navigation resumes at saved position');
  await page.locator('[data-action="play"]').click();
  await status('paused');
  assert.equal((await saved()).shouldResume, false);
  await page.getByRole('link', { name: '日本語', exact: true }).click();
  await ready();
  assert.equal(await page.evaluate(() => window['__audioRequests']), 0);
  checks.push('manual pause remains paused after language navigation');
  await page.goBack();
  await ready();
  assert.equal((await saved()).shouldResume, false);
  // Explicit persisted-event coverage even when automation disables real BFCache.
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    const value = JSON.parse(sessionStorage.getItem('anglefeint-music-v1'));
    sessionStorage.setItem(
      'anglefeint-music-v1',
      JSON.stringify({ ...value, time: 19, shouldResume: true })
    );
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await status('playing');
  assert.ok(await page.evaluate(() => window['__audio'].currentTime >= 19));
  await page.reload();
  await ready();
  await page.waitForFunction(() =>
    ['playing', 'blocked'].includes(document.querySelector('[data-music-deck]')?.dataset.status)
  );
  if ((await page.locator('[data-music-deck]').getAttribute('data-status')) === 'blocked') {
    await page.locator('[data-action="play"]').click();
    await status('playing');
    checks.push('browser required manual continuation after reload');
  }
  checks.push('back navigation, simulated BFCache lifecycle and reload use latest session');
  await page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
  });
  assert.equal((await saved()).shouldResume, true);
  await go('removed');
  await ready();
  assert.equal(await page.evaluate(() => window['__audioRequests']), 0);
  assert.equal((await saved()).shouldResume, false);
  checks.push('departure pause preserves intent; removed track does not autoplay replacement');
  await context.close();
  for (const locale of ['en', 'zh', 'ja', 'ko', 'es']) {
    const blocked = await browser.newContext();
    await blocked.addInitScript(() => {
      sessionStorage.setItem(
        'anglefeint-music-v1',
        JSON.stringify({
          src: '/music/tone.wav',
          time: 9,
          volume: 0.5,
          collapsed: false,
          shouldResume: true,
        })
      );
      const original = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        HTMLMediaElement.prototype.play = original;
        return Promise.reject(new DOMException('test policy denial', 'NotAllowedError'));
      };
    });
    const tab = await blocked.newPage();
    await tab.goto(`http://127.0.0.1:4397/${locale}/`);
    await tab.waitForFunction(
      () => document.querySelector('[data-music-deck]')?.dataset.status === 'blocked'
    );
    assert.ok(
      (await tab.locator('[role="status"]').innerText()).includes('PLAY') || locale === 'en'
    );
    assert.equal(
      await tab.evaluate(
        () => JSON.parse(sessionStorage.getItem('anglefeint-music-v1')).shouldResume
      ),
      false
    );
    await tab.locator('[data-action="play"]').click();
    await tab.waitForFunction(
      () => document.querySelector('[data-music-deck]')?.dataset.status === 'playing'
    );
    await blocked.close();
  }
  checks.push('five localized blocked-playback messages and manual recovery');
  const denied = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await denied.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      get() {
        throw new Error('storage denied');
      },
    });
  });
  const mobile = await denied.newPage();
  await mobile.goto('http://127.0.0.1:4397/zh/');
  await mobile.locator('[data-action="play"]').click();
  await mobile.waitForFunction(
    () => document.querySelector('[data-music-deck]')?.dataset.status === 'playing'
  );
  assert.equal(await mobile.locator('[data-music-deck]').getAttribute('data-collapsed'), 'true');
  await mobile.goto('http://127.0.0.1:4397/removed/');
  await mobile.locator('[data-action="play"]').click();
  await mobile.waitForFunction(
    () => document.querySelector('[data-music-deck]')?.dataset.status === 'error'
  );
  await denied.close();
  checks.push('mobile compact controls work without storage; missing source reports media error');
  assert.deepEqual(errors, []);
  success = true;
  console.log(
    JSON.stringify(
      {
        checks,
        fixture,
        browser: browser.version(),
        limits:
          'Chromium only; BFCache persisted lifecycle additionally simulated; no subjective listening assertion.',
      },
      null,
      2
    )
  );
  await writeFile(
    path.join(results, 'music-browser.json'),
    JSON.stringify({ date: new Date().toISOString(), checks }, null, 2)
  );
} finally {
  await browser?.close();
  await server?.stop();
  assert.equal(path.dirname(fixture), results);
  assert.ok(path.basename(fixture).startsWith('music-browser-'));
  if (success) await rm(fixture, { recursive: true, force: true });
  else console.error(`Failed fixture retained: ${fixture}`);
}
