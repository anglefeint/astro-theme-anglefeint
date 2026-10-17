import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createTerminal } from '../packages/theme/src/scripts/terminal/controller.js';

function environment(run) {
  const keys = ['document', 'window', 'Element', 'ResizeObserver', 'setTimeout', 'clearTimeout'];
  const previous = new Map(
    keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)])
  );
  const document = new globalThis.EventTarget();
  document.hidden = false;
  const window = new globalThis.EventTarget();
  window.devicePixelRatio = 3;
  const timers = new Map();
  let id = 0;
  const observers = [];
  Object.assign(globalThis, {
    document,
    window,
    Element: class {},
    ResizeObserver: class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      disconnect() {
        this.disconnected = true;
      }
    },
    setTimeout(callback) {
      timers.set(++id, callback);
      return id;
    },
    clearTimeout(timer) {
      timers.delete(timer);
    },
  });
  const canvas = () => {
    const texts = [];
    const context = {
      setTransform() {},
      clearRect() {},
      fillRect() {},
      fillText(text) {
        texts.push(text);
      },
      measureText(text) {
        return { width: text.length * 8 };
      },
    };
    return {
      texts,
      width: 0,
      height: 0,
      getContext: () => context,
      getBoundingClientRect: () => ({ width: 320, height: 180 }),
    };
  };
  const key = (value) => {
    const event = new globalThis.Event('keydown', { cancelable: true });
    Object.defineProperty(event, 'key', { value });
    document.dispatchEvent(event);
    return event;
  };
  try {
    run({ canvas, document, window, timers, observers, key });
  } finally {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
}

test('terminal instances use their own canvas, configuration and input state without About DOM', () => {
  environment(({ canvas, key, timers, observers }) => {
    const a = canvas(),
      b = canvas();
    const first = createTerminal({ canvas: a, lines: ['alpha'], prompt: '$ ', maxInputLength: 2 });
    const second = createTerminal({ canvas: b, lines: ['beta'], reducedMotion: true });
    assert.equal(a.width, 640); // Supplied dimensions and bounded DPR, not viewport dimensions.
    assert.equal(a.height, 360);
    assert.ok(a.texts.includes('alpha'));
    assert.ok(!a.texts.includes('beta'));
    first.setFocused(true);
    key('a');
    key('b');
    key('c');
    assert.equal(a.texts.at(-1), '$ ab');
    assert.equal(b.texts.at(-1), '~ $ ');
    key('Enter');
    first.dispose();
    first.dispose();
    const draws = a.texts.length;
    key('z');
    assert.equal(a.texts.length, draws);
    assert.equal(a.width, 0);
    assert.equal(timers.size, 0);
    second.dispose();
    assert.ok(observers.every((observer) => observer.disconnected));
  });
});

test('terminal pauses blinking while hidden, redraws statically on resize and aborts all resources', () => {
  environment(({ canvas, document, window, timers, observers }) => {
    const target = canvas();
    const abort = new globalThis.AbortController();
    const terminal = createTerminal({ canvas: target, signal: abort.signal });
    assert.equal(timers.size, 1);
    document.hidden = true;
    document.dispatchEvent(new globalThis.Event('visibilitychange'));
    assert.equal(timers.size, 0);
    document.hidden = false;
    document.dispatchEvent(new globalThis.Event('visibilitychange'));
    assert.equal(timers.size, 1);
    abort.abort();
    assert.equal(timers.size, 0);
    assert.equal(target.width, 0);
    const count = target.texts.length;
    window.dispatchEvent(new globalThis.Event('resize'));
    assert.equal(target.texts.length, count);
    assert.ok(observers.every((observer) => observer.disconnected));
    terminal.dispose();
    const staticCanvas = canvas();
    const staticTerminal = createTerminal({ canvas: staticCanvas, reducedMotion: true });
    assert.equal(timers.size, 0);
    const before = staticCanvas.texts.length;
    window.dispatchEvent(new globalThis.Event('resize'));
    assert.ok(staticCanvas.texts.length > before);
    staticTerminal.dispose();
  });
});

test('terminal gracefully handles unavailable Canvas and already aborted lifetimes', () => {
  const missing = createTerminal({ canvas: { getContext: () => null } });
  missing.setFocused(true);
  missing.resize();
  missing.dispose();
  const controller = new globalThis.AbortController();
  controller.abort();
  createTerminal({ canvas: { getContext: () => ({}) }, signal: controller.signal }).dispose();
});
