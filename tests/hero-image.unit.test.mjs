import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initHeroCanvas } from '../packages/theme/src/scripts/blogpost/hero-canvas.js';

for (const cached of [false, true]) {
  test(`hero reuses the ${cached ? 'cached' : 'loading'} DOM image, natural dimensions and disposal`, (t) => {
    const draws = [];
    const ctx = {
      clearRect() {},
      drawImage(...args) {
        draws.push(args);
      },
    };
    const image = new globalThis.EventTarget();
    Object.assign(image, {
      complete: cached,
      naturalWidth: 1200,
      naturalHeight: 600,
      width: 320,
      height: 160,
    });
    const canvas = { getContext: () => ctx, style: {} };
    const wrap = { classList: { add() {} } };
    const stack = { getBoundingClientRect: () => ({ width: 320, height: 160 }) };
    const shell = {
      querySelector: (selector) =>
        ({
          '.hero-canvas': canvas,
          '.hero-canvas-wrap': wrap,
          '.hero-stack': stack,
          '.hero-base-image': image,
        })[selector],
    };
    const document = new globalThis.EventTarget();
    document.querySelector = () => shell;
    document.createElement = () => ({ getContext: () => ctx });
    const window = new globalThis.EventTarget();
    window.devicePixelRatio = 1;
    const descriptors = new Map();
    for (const [key, value] of Object.entries({
      document,
      window,
      Image: class {
        constructor() {
          throw new Error('Must not request a separate image');
        }
      },
    })) {
      descriptors.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
      Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
    }
    let dispose;
    t.after(() => {
      dispose?.();
      for (const [key, descriptor] of descriptors) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else delete globalThis[key];
      }
    });
    dispose = initHeroCanvas(true);
    if (!cached) {
      assert.equal(draws.length, 0);
      image.complete = true;
      image.dispatchEvent(new globalThis.Event('load'));
    }
    const draw = draws.find((args) => args[0] === image);
    assert.ok(draw);
    assert.deepEqual(draw.slice(1, 5), [0, 0, 1200, 600]);
    assert.equal(canvas.img, image);
    image.naturalWidth = 1600;
    image.naturalHeight = 800;
    image.dispatchEvent(new globalThis.Event('load'));
    assert.deepEqual(
      draws
        .filter((args) => args[0] === image)
        .at(-1)
        .slice(1, 5),
      [0, 0, 1600, 800]
    );
    dispose();
    const count = draws.length;
    image.dispatchEvent(new globalThis.Event('load'));
    assert.equal(draws.length, count);
  });
}
