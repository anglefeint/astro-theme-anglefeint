/* global window, document, CanvasRenderingContext2D, getComputedStyle, DOMMatrixReadOnly */
import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { URL } from 'node:url';

let server, origin;
test.beforeAll(async () => {
  const { directory } = JSON.parse(
    await readFile('tests/e2e/.generated-fragments-config.json', 'utf8')
  );
  server = createServer(async (request, response) => {
    try {
      let url = new URL(request.url, 'http://localhost').pathname;
      if (url.endsWith('/')) url += 'index.html';
      response.setHeader(
        'Content-Type',
        { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[path.extname(url)] ??
          'application/octet-stream'
      );
      response.end(await readFile(path.join(directory, url)));
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.afterAll(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
});

test('independent rain canvases resize, pause, dispose and remount without homepage hooks', async ({
  page,
}) => {
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  const first = page.locator('#first'),
    second = page.locator('#second');
  await expect.poll(() => first.evaluate((canvas) => canvas.width)).toBe(320);
  const opaquePixels = (canvas) => {
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    return data.filter((_, index) => index % 4 === 3 && data[index] > 0).length;
  };
  await expect.poll(() => first.evaluate(opaquePixels)).toBeGreaterThan(0);
  await expect.poll(() => second.evaluate(opaquePixels)).toBeGreaterThan(0);
  await first.evaluate((canvas) => {
    canvas.style.width = '240px';
  });
  await expect.poll(() => first.evaluate((canvas) => canvas.width)).toBe(240);
  await expect.poll(() => second.evaluate((canvas) => canvas.width)).toBe(320);
  expect(
    await page.evaluate(
      () =>
        window.effectFixture.mountMatrixRain(document.querySelector('#first')) ===
        window.effectFixture.first
    )
  ).toBe(true);
  await page.evaluate(() => {
    const fixture = window.effectFixture;
    window.frameCounts = [0, 0];
    fixture.first.subscribeFrame(() => window.frameCounts[0]++);
    fixture.second.subscribeFrame(() => window.frameCounts[1]++);
    fixture.first.pause();
  });
  await expect.poll(() => page.evaluate(() => window.frameCounts[1])).toBeGreaterThan(2);
  expect(await page.evaluate(() => window.frameCounts[0])).toBe(0);
  await page.evaluate(() => window.effectFixture.first.resume());
  await expect.poll(() => page.evaluate(() => window.frameCounts[0])).toBeGreaterThan(1);
  await page.evaluate(() => window.effectFixture.first.dispose());
  await expect.poll(() => first.evaluate((canvas) => canvas.width)).toBe(0);
  await first.evaluate((canvas) => {
    canvas.style.width = '200px';
  });
  await expect.poll(() => second.evaluate((canvas) => canvas.width)).toBe(320);
  expect(await first.evaluate((canvas) => canvas.width)).toBe(0);
  await page.evaluate(() => {
    window.effectFixture.first = window.effectFixture.mountMatrixRain(
      document.querySelector('#first')
    );
    window.effectFixture.first.start();
  });
  await expect.poll(() => first.evaluate((canvas) => canvas.width)).toBe(200);
});

test('signal loading works outside a dialog and each instance owns its visibility', async ({
  page,
}) => {
  await page.goto(`${origin}/effects-test/`);
  const first = page.locator('#loading-first [data-signal-loading]');
  const second = page.locator('#loading-second [data-signal-loading]');
  await expect(first).toBeVisible();
  await expect(second).toBeHidden();
  await expect(first).toHaveAttribute('aria-hidden', 'true');
  await expect(first.locator('.signal-loading-bars span')).toHaveCount(5);
  await expect(first.locator('.signal-loading-bars span').first()).not.toHaveCSS(
    'animation-name',
    'none'
  );
  await second.evaluate((element) => {
    element.hidden = false;
  });
  await first.evaluate((element) => {
    element.hidden = true;
  });
  await expect(second).toBeVisible();
  await expect(first).toBeHidden();
  await expect(first.locator('.signal-loading-bars span').first()).toHaveCSS(
    'animation-name',
    'none'
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(second.locator('.signal-loading-bars span').first()).toHaveCSS(
    'animation-name',
    'none'
  );
});

test('CSS spotlights follow independent host sizes and stop for reduced motion', async ({
  page,
}) => {
  await page.goto(`${origin}/effects-test/`);
  const first = page.locator('#light-first [data-cyber-spotlight]');
  const second = page.locator('#light-second [data-cyber-spotlight]');
  await expect(first).toHaveCSS('width', '320px');
  await expect(second).toHaveCSS('width', '200px');
  await expect(first.locator('.cyber-spotlight-tl')).toHaveCSS('animation-duration', '12s');
  await expect(first.locator('.cyber-spotlight-tr')).toHaveCSS('animation-duration', '24s');
  await expect(first).toHaveCSS('pointer-events', 'none');
  const expected = (Math.hypot(320, 180) * 1.3) / Math.SQRT2;
  expect(
    await first
      .locator('.cyber-spotlight-surface')
      .evaluate((el) => el.getBoundingClientRect().width)
  ).toBeCloseTo(expected, 1);
  await page.locator('#light-first').evaluate((el) => {
    el.style.width = '240px';
  });
  await expect(first).toHaveCSS('width', '240px');
  await expect(second).toHaveCSS('width', '200px');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const light of [first, second]) {
    await expect(light.locator('.cyber-spotlight-tl')).toHaveCSS('animation-name', 'none');
    await expect(light.locator('.cyber-spotlight-tr')).toHaveCSS('animation-name', 'none');
  }
});

test('rabbit effects bind arbitrary triggers, stop while idle and dispose independently', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.rabbitDraws = 0;
    const fillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (...args) {
      if (this.canvas.closest('[data-white-rabbit]')) window.rabbitDraws++;
      return fillText.apply(this, args);
    };
  });
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  const first = page.locator('#rabbit-first [data-white-rabbit]');
  const second = page.locator('#rabbit-second [data-white-rabbit]');
  expect(await page.evaluate(() => window.rabbitDraws)).toBe(0);
  await page.locator('#rabbit-first').focus();
  await expect(first).toHaveAttribute('data-decoding', 'true');
  await expect(second).not.toHaveAttribute('data-decoding');
  await expect.poll(() => page.evaluate(() => window.rabbitDraws)).toBeGreaterThan(0);
  await expect(first).not.toHaveAttribute('data-decoding', { timeout: 2000 });
  const draws = await page.evaluate(() => window.rabbitDraws);
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => window.rabbitDraws)).toBe(draws);
  await page.locator('#rabbit-second').focus();
  await expect(second).toHaveAttribute('data-decoding', 'true');
  await page.evaluate(() => window.effectFixture.rabbits[1].pause());
  await expect(second).not.toHaveAttribute('data-decoding');
  await page.evaluate(() => window.effectFixture.rabbits[1].resume());
  await expect(second).toHaveAttribute('data-decoding', 'true');
  expect(
    await page.evaluate(() => {
      const trigger = document.querySelector('#rabbit-first');
      return (
        window.effectFixture.mountWhiteRabbit(
          trigger,
          trigger.querySelector('[data-white-rabbit]')
        ) === window.effectFixture.rabbits[0]
      );
    })
  ).toBe(true);
  await page.evaluate(() => window.effectFixture.rabbits[0].dispose());
  expect(await first.locator('canvas').evaluate((el) => el.width)).toBe(0);
  await page.locator('#rabbit-first').focus();
  await expect(first).not.toHaveAttribute('data-decoding');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#rabbit-second').focus();
  await expect(second.locator('canvas')).toBeHidden();
  await expect(second.locator('svg')).toHaveCSS('opacity', '1');
});

test('CSS rain mounts without dust, follows host height and cleans up only its own drops', async ({
  page,
}) => {
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  const first = page.locator('#rain-first [data-cyber-rain]');
  const second = page.locator('#rain-second [data-cyber-rain]');
  for (const rain of [first, second]) {
    await expect(rain.locator('.cyber-rain-drop')).toHaveCount(48);
    await expect(rain).toHaveCSS('pointer-events', 'none');
    for (const type of ['normal', 'thin', 'fog', 'skew']) {
      await expect(rain.locator(`.cyber-rain-drop--${type}`)).toHaveCount(12);
    }
  }
  // Rain initialization itself needs no paired dust root.
  await expect(page.locator('#rain-first [data-cyber-dust]')).toHaveCount(0);
  expect(
    await first.locator('.cyber-rain-drop').evaluateAll((drops) =>
      drops.every((drop) => {
        const left = parseFloat(drop.style.left),
          delay = parseFloat(drop.style.animationDelay);
        const duration = parseFloat(drop.style.animationDuration),
          opacity = Number(drop.style.opacity);
        return (
          left >= 0 &&
          left <= 100 &&
          delay >= -5 &&
          delay <= 1 &&
          duration >= 3.3 &&
          duration <= 5 &&
          opacity >= 0.12 &&
          opacity <= 0.45
        );
      })
    )
  ).toBe(true);
  const midpoint = async (drop) =>
    drop.evaluate((el) => {
      const animation = el.getAnimations()[0];
      animation.effect.updateTiming({ delay: 0, duration: 1000, iterations: 1 });
      animation.pause();
      animation.currentTime = 500;
      return new DOMMatrixReadOnly(getComputedStyle(el).transform).m42;
    });
  expect(await midpoint(first.locator('.cyber-rain-drop--normal').first())).toBeCloseTo(90, 1);
  expect(await midpoint(second.locator('.cyber-rain-drop--normal').first())).toBeCloseTo(60, 1);
  await page.locator('#rain-first').evaluate((el) => {
    el.style.height = '240px';
  });
  expect(await midpoint(first.locator('.cyber-rain-drop--normal').first())).toBeCloseTo(120, 1);
  await page.evaluate(() => window.effectFixture.rain[0].pause());
  await expect(first.locator('.cyber-rain-drop--thin').first()).toHaveCSS(
    'animation-play-state',
    'paused'
  );
  await expect(second.locator('.cyber-rain-drop--thin').first()).toHaveCSS(
    'animation-play-state',
    'running'
  );
  await page.evaluate(() => window.effectFixture.rain[0].resume());
  await expect(first.locator('.cyber-rain-drop--thin').first()).toHaveCSS(
    'animation-play-state',
    'running'
  );
  expect(
    await page.evaluate(
      () =>
        window.effectFixture.mountCyberRain(
          document.querySelector('#rain-first [data-cyber-rain]')
        ) === window.effectFixture.rain[0]
    )
  ).toBe(true);
  await first.evaluate((el) => {
    el.append(document.createElement('span'));
  });
  await page.evaluate(() => window.effectFixture.rain[0].dispose());
  await expect(first.locator('.cyber-rain-drop')).toHaveCount(0);
  await expect(first.locator('span')).toHaveCount(1);
  await expect(second.locator('.cyber-rain-drop')).toHaveCount(48);
  await page.evaluate(() =>
    window.effectFixture.mountCyberRain(document.querySelector('#rain-first [data-cyber-rain]'))
  );
  await expect(first.locator('.cyber-rain-drop')).toHaveCount(48);
  await page.setViewportSize({ width: 390, height: 800 });
  await expect(first.locator('.cyber-rain-drop:visible')).toHaveCount(24);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(first).toBeHidden();
  await expect(second).toBeHidden();
});

test('dust has independent CSS animation, lifecycle and mobile thinning', async ({ page }) => {
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  const first = page.locator('#dust-first [data-cyber-dust]');
  const second = page.locator('#dust-second [data-cyber-dust]');
  await expect(first.locator('.cyber-dust-particle')).toHaveCount(22);
  await expect(second.locator('.cyber-dust-particle')).toHaveCount(22);
  await expect(first).toHaveCSS('position', 'absolute');
  await expect(first.locator('.cyber-dust-particle').first()).toHaveCSS(
    'animation-name',
    'cyber-dust-float'
  );
  await page.evaluate(() => window.effectFixture.dust[0].pause());
  await expect(first.locator('.cyber-dust-particle').first()).toHaveCSS(
    'animation-play-state',
    'paused'
  );
  await expect(second.locator('.cyber-dust-particle').first()).toHaveCSS(
    'animation-play-state',
    'running'
  );
  await page.evaluate(() => window.effectFixture.dust[0].dispose());
  await expect(first.locator('.cyber-dust-particle')).toHaveCount(0);
  await expect(second.locator('.cyber-dust-particle')).toHaveCount(22);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(second.locator('.cyber-dust-particle:visible')).toHaveCount(11);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(second).toBeHidden();
});

test('article and SVG backdrops resize independent containers and release their resources', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  const ai = page.locator('#ai-first .ai-network-canvas');
  const svg = page.locator('#network-first [data-network-background]');
  await expect(page.locator('#ai-first .ai-particle')).toHaveCount(12);
  await expect.poll(() => ai.evaluate((el) => el.width)).toBeGreaterThan(300);
  await expect(svg).toHaveAttribute('viewBox', '0 0 320 180');
  await page.locator('#ai-first').evaluate((el) => {
    el.style.width = '240px';
  });
  await page.locator('#network-first').evaluate((el) => {
    el.style.width = '240px';
  });
  await expect.poll(() => ai.evaluate((el) => el.width)).toBeLessThan(300);
  await expect(svg).toHaveAttribute('viewBox', '0 0 240 180');
  await expect(page.locator('#network-second [data-network-background]')).toHaveAttribute(
    'viewBox',
    '0 0 320 180'
  );
  await page.evaluate(() => window.effectFixture.ai[0]());
  // Resizing a disposed renderer must not allocate another backing buffer.
  const width = await ai.evaluate((el) => el.width);
  await page.locator('#ai-first').evaluate((el) => {
    el.style.width = '200px';
  });
  await page.waitForTimeout(100);
  expect(await ai.evaluate((el) => el.width)).toBe(width);
});

test('Red Queen includes independent play buttons, playback cleanup and reduced-motion suppression', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'ImageDecoder', { value: undefined, configurable: true });
  });
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  const first = page.locator('#queen-first [data-red-queen]');
  const second = page.locator('#queen-second [data-red-queen]');
  await expect(first.locator('canvas')).toHaveCount(0);
  await expect(first.getByRole('button')).toHaveAccessibleName('Play first');
  await first.getByRole('button').click();
  await expect(first.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  await expect(first.locator('canvas')).toHaveCount(1);
  await expect(second.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  await expect(second.locator('canvas')).toHaveCount(0);
  await page.evaluate(() => window.effectFixture.queen[0]());
  await expect(first.locator('canvas')).toHaveCount(0);
  await first.getByRole('button').click();
  await expect(first.locator('canvas')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('#queen-first [data-red-queen]')).toBeHidden();
  await expect(page.locator('#queen-first canvas')).toHaveCount(0);
});

test('key buttons are independent, cancel pending completion and skip motion when requested', async ({
  page,
}) => {
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  const first = page.locator('#key-first'),
    second = page.locator('#key-second');
  // Observe and cancel within the same task: protocol round trips under load
  // must not consume the animation's 600ms cancellation window.
  const startingStates = await page.evaluate(() => {
    const firstKey = document.querySelector('#key-first');
    firstKey.click();
    const states = [
      firstKey.dataset.keyState,
      document.querySelector('#key-second').dataset.keyState,
    ];
    window.effectFixture.keys[0].reset();
    return states;
  });
  expect(startingStates).toEqual(['unlocking', undefined]);
  await page.waitForTimeout(650);
  expect(await page.evaluate(() => window.effectFixture.unlocks)).toEqual([0, 0]);
  await second.click();
  await expect.poll(() => page.evaluate(() => window.effectFixture.unlocks[1])).toBe(1);
  await expect(second).toHaveAttribute('data-key-state', 'unlocked');
  await page.evaluate(() => window.effectFixture.keys[1].dispose());
  await second.click();
  expect(await page.evaluate(() => window.effectFixture.unlocks[1])).toBe(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await first.click();
  await expect.poll(() => page.evaluate(() => window.effectFixture.unlocks[0])).toBe(1);
  await expect(first).toHaveAttribute('data-key-state', 'unlocked');
});

test('cursor bindings control separate DOM elements and respect reduced motion', async ({
  page,
}) => {
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  const first = page.locator('#cursor-first'),
    second = page.locator('#cursor-second');
  await expect(first).toHaveCSS('animation-name', 'effect-cursor-blink');
  await page.evaluate(() => window.effectFixture.cursors[0].setActive(false));
  await expect(first).toHaveCSS('animation-name', 'none');
  await expect(second).toHaveCSS('animation-name', 'effect-cursor-blink');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(second).toHaveCSS('animation-name', 'none');
  await page.evaluate(() => window.effectFixture.cursors[0].dispose());
  await expect(first).not.toHaveAttribute('data-effect-cursor');
});

test('startup DOM binding preserves schedules, escapes custom text and restores the host', async ({
  page,
}) => {
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  const first = page.locator('#startup-first'),
    second = page.locator('#startup-second');
  await expect(first.locator('[data-startup-group=startup]')).toHaveCSS('animation-delay', '7.6s');
  await expect(first.locator('[data-startup-group=message]')).toHaveCSS('animation-delay', '8.6s');
  expect(
    await first
      .locator('.startup-text-segment')
      .first()
      .evaluate((element) => getComputedStyle(element, '::after').animationDelay)
  ).toBe('0s, 0s');
  await expect(first.locator('.startup-text-segment').nth(3).locator('span')).toHaveCSS(
    'animation-delay',
    '13.25s'
  );
  await expect(second).toContainText('你好 <script> & ready');
  await expect(second.locator('script')).toHaveCount(0);
  await expect(second.locator('[data-startup-group=message]')).toHaveCSS('animation-delay', '0s');
  await page.evaluate(() => window.effectFixture.startup[0]());
  await expect(first).toHaveText('Original first');
  await expect(first).not.toHaveAttribute('data-startup-text');
  await expect(second).toHaveAttribute('data-startup-text', '');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(second.locator('.startup-text-segment > span')).toHaveCSS('animation-name', 'none');
});

test('hidden signals bind configured text and reveal only the selected DOM subtree', async ({
  page,
}) => {
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  await page.mouse.move(0, 0);
  const first = page.locator('#hidden-first'),
    second = page.locator('#hidden-second');
  await expect(first).toHaveText('Configured secret');
  await expect(first).toHaveCSS('opacity', '0');
  await expect(second).toHaveCSS('opacity', '0');
  await second.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
  });
  await expect(second).toHaveCSS('opacity', '1');
  await expect(first).toHaveCSS('opacity', '0');
  await expect(page.locator('#hidden-cursor')).toHaveCSS('animation-name', 'effect-cursor-blink');
  await page.evaluate(() => document.getSelection().removeAllRanges());
  await expect(second).toHaveCSS('opacity', '0');
  await expect(page.locator('#hidden-cursor')).toHaveCSS('animation-name', 'none');
  await page.evaluate(() => window.effectFixture.hidden[0]());
  await expect(first).not.toHaveAttribute('data-hidden-signal');
});

test('Cyber environment retains six independent CSS layers without a page shell', async ({
  page,
}) => {
  await page.goto(`${origin}/effects-test/`);
  await page.waitForFunction(() => window.effectFixture);
  const first = page.locator('#environment-first'),
    second = page.locator('#environment-second');
  await expect(first.locator('[data-cyber-layer]')).toHaveCount(6);
  await expect(first.locator('[data-cyber-layer=fog]')).toHaveCSS('animation-duration', '20s');
  await expect(first.locator('[data-cyber-layer=glitch]')).toHaveCSS('animation-duration', '12s');
  await page.evaluate(() => window.effectFixture.environments[0].pause());
  await expect(first.locator('[data-cyber-layer=flicker]')).toHaveCSS(
    'animation-play-state',
    'paused'
  );
  await expect(second.locator('[data-cyber-layer=flicker]')).toHaveCSS(
    'animation-play-state',
    'running'
  );
  await page.evaluate(() => window.effectFixture.environments[0].dispose());
  await expect(first.locator('[data-cyber-layer]')).toHaveCount(0);
  await expect(first.locator('span')).toHaveText('Keep this content');
  await expect(second.locator('[data-cyber-layer]')).toHaveCount(6);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(second.locator('[data-cyber-layer=glitch]')).toBeHidden();
  await expect(second.locator('[data-cyber-layer=fog]')).toHaveCSS('animation-name', 'none');
});
