import { createEffectScope } from '../packages/theme/src/scripts/effects/lifecycle.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import vm from 'node:vm';
import { createDecoderPool } from '../packages/theme/src/effects/red-queen/decoder-pool.js';
import { mountRedQueen } from '../packages/theme/src/effects/red-queen/red-queen.js';

test('reduced motion hides the monitor without images, requests or timers', async () => {
  const shell = { style: {}, hidden: false };
  const elements = {
    '.rq-tv': shell,
    '.rq-tv-stage': { getAttribute: () => '/animated.webp' },
    '.rq-tv-toggle': {},
  };
  shell.querySelector = (selector) => elements[selector];
  const source = await readFile(
    new URL('../packages/theme/src/effects/red-queen/red-queen.js', import.meta.url),
    'utf8'
  );
  const context = vm.createContext({
    createEffectScope,
    createDecoderPool,
    document: { querySelector: (selector) => elements[selector] },
    Image: class {
      constructor() {
        assert.fail('must not load animated images');
      }
    },
    setTimeout: () => assert.fail('must not schedule animation'),
    fetch: () => assert.fail('must not fetch playlist'),
  });
  vm.runInContext(
    source.replace(/^import .*;\r?\n/gm, '').replace('export function', 'function') +
      '\nmountRedQueen(document.querySelector(".rq-tv"), { reducedMotion: true });',
    context
  );
  assert.equal(shell.hidden, true);
  assert.equal(shell.style.display, 'none');
});

test('decoder ownership releases late frames and closes each session once', async () => {
  let resolveFrame;
  let closed = 0;
  const frame = {
    close() {
      closed++;
    },
  };
  let decoderClosed = 0;
  const pool = createDecoderPool(
    class {
      tracks = { ready: Promise.resolve(), selectedTrack: { frameCount: 2 } };
      decode() {
        return new Promise((resolve) => {
          resolveFrame = resolve;
        });
      }
      close() {
        decoderClosed++;
      }
    }
  );
  const session = pool.open(new ArrayBuffer(1), 'image/gif');
  const pending = session.decode(0);
  pool.clear();
  resolveFrame({ image: frame });
  assert.equal(await pending, undefined);
  session.close();
  pool.clear();
  assert.equal(closed, 1);
  assert.equal(decoderClosed, 1);
});

test('leaving reduced motion restores original monitor visibility before normal remount', () => {
  const previousWindow = globalThis.window,
    previousDocument = globalThis.document;
  globalThis.window = new globalThis.EventTarget();
  globalThis.document = new globalThis.EventTarget();
  const toggle = new globalThis.EventTarget();
  toggle.setAttribute = () => {};
  const stage = { getAttribute: (name) => (name === 'data-rq-src' ? '/test.gif' : '') };
  const shell = {
    hidden: false,
    style: { display: 'inline-flex' },
    classList: { toggle() {} },
    querySelector: (selector) => (selector === '.rq-tv-stage' ? stage : toggle),
  };
  let dispose;
  try {
    dispose = mountRedQueen(shell, { reducedMotion: true });
    assert.equal(shell.hidden, true);
    assert.equal(shell.style.display, 'none');
    dispose();
    assert.equal(shell.hidden, false);
    assert.equal(shell.style.display, 'inline-flex');
    dispose = mountRedQueen(shell, { reducedMotion: false });
    assert.equal(shell.hidden, false);
    assert.equal(shell.style.display, 'inline-flex');
  } finally {
    dispose?.();
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
  }
});

async function playerFixture({
  broken = false,
  pending = false,
  pendingAt = 1,
  readinessFailure = false,
} = {}) {
  let now = 0,
    nextId = 0,
    completePending;
  const timers = new Map(),
    callbacks = new Map(),
    cleanups = [],
    decoders = [],
    frames = [];
  const scope = {
    signal: new globalThis.AbortController().signal,
    setTimeout(fn, delay) {
      const id = ++nextId;
      timers.set(id, { fn, due: now + delay });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    listen(target, type, fn) {
      callbacks.set(target === toggle ? 'toggle:' + type : type, fn);
    },
    add(fn) {
      cleanups.push(fn);
    },
    dispose() {
      for (const fn of cleanups.toReversed()) fn();
      timers.clear();
    },
  };
  const toggle = { setAttribute() {} };
  const ctx = new Proxy(
    {},
    { get: (_, key) => (key === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {}) }
  );
  const stage = {
    getAttribute: (name) => (name === 'data-rq-src' ? '/test.gif' : ''),
    appendChild() {},
    getBoundingClientRect: () => ({ width: 320, height: 240 }),
  };
  const shell = {
    querySelector: (selector) => (selector === '.rq-tv-stage' ? stage : toggle),
    classList: { toggle() {} },
  };
  const newFrame = () => {
    const frame = {
      duration: 33000,
      width: 320,
      height: 240,
      closes: 0,
      close() {
        this.closes++;
      },
    };
    frames.push(frame);
    return frame;
  };
  class Decoder {
    tracks = { ready: Promise.resolve(), selectedTrack: { frameCount: 2 } };
    closes = 0;
    constructor() {
      decoders.push(this);
      if (readinessFailure) this.tracks.ready = Promise.reject(new Error('unreadable tracks'));
    }
    async decode({ frameIndex }) {
      if (pending && decoders.indexOf(this) === pendingAt)
        return new Promise((resolve) => {
          completePending = () => resolve({ image: newFrame() });
        });
      if (broken && frameIndex === 1) throw new Error('broken later frame');
      return { image: newFrame() };
    }
    close() {
      this.closes++;
    }
  }
  let imageAttempts = 0;
  const context = vm.createContext({
    createEffectScope: () => scope,
    createDecoderPool: () => createDecoderPool(Decoder),
    document: {
      hidden: false,
      createElement: () => ({ className: '', style: {}, getContext: () => ctx, remove() {} }),
    },
    window: { location: { href: 'https://example.com/en/post/' }, devicePixelRatio: 1 },
    performance: { now: () => now },
    fetch: async () => ({ arrayBuffer: async () => new ArrayBuffer(1) }),
    ImageDecoder: Decoder,
    ArrayBuffer,
    URL,
    Image: class {
      set src(_) {
        imageAttempts++;
        globalThis.queueMicrotask(() => this.onerror());
      }
    },
    shell,
  });
  const source = await readFile(
    new URL('../packages/theme/src/effects/red-queen/red-queen.js', import.meta.url),
    'utf8'
  );
  const dispose = vm.runInContext(
    source.replace(/^import .*;\r?\n/gm, '').replace('export function', 'function') +
      '\nmountRedQueen(shell, { reducedMotion: false });',
    context
  );
  const flush = async () => {
    for (let i = 0; i < 25; i++) await Promise.resolve();
  };
  const tick = async () => {
    const entry = [...timers].sort((a, b) => a[1].due - b[1].due)[0];
    if (!entry) return false;
    timers.delete(entry[0]);
    now = entry[1].due;
    entry[1].fn();
    await flush();
    return true;
  };
  return {
    decoders,
    frames,
    timers,
    flush,
    tick,
    dispose,
    start: () => callbacks.get('toggle:click')(),
    complete: () => completePending(),
    pending: () => Boolean(completePending),
    imageAttempts: () => imageAttempts,
  };
}

test('successful playback closes verification/playback decoders and all frames', async () => {
  const f = await playerFixture();
  f.start();
  await f.flush();
  for (let i = 0; i < 500 && (await f.tick()); i++);
  assert.equal(f.timers.size, 0);
  assert.equal(f.decoders.length, 2);
  assert.ok(f.decoders.every((d) => d.closes === 1));
  assert.ok(f.frames.every((frame) => frame.closes === 1));
  f.dispose();
});

test('a persistently broken later frame falls back, exhausts finite image retries and stops', async () => {
  const f = await playerFixture({ broken: true });
  f.start();
  await f.flush();
  for (let i = 0; i < 1500 && (await f.tick()); i++);
  assert.equal(f.timers.size, 0, 'failure must not leave an endless render/retry loop');
  assert.ok(f.imageAttempts() > 0 && f.imageAttempts() <= 7);
  assert.ok(f.decoders.every((d) => d.closes === 1));
  assert.ok(f.frames.every((frame) => frame.closes === 1));
  f.dispose();
});

test('disposing during decode closes the late frame instead of adopting it', async () => {
  const f = await playerFixture({ pending: true });
  f.start();
  await f.flush();
  assert.equal(f.pending(), true);
  f.dispose();
  f.complete();
  await f.flush();
  assert.equal(f.timers.size, 0);
  assert.ok(f.decoders.every((d) => d.closes === 1));
  assert.ok(f.frames.every((frame) => frame.closes === 1));
});

test('failed track readiness has bounded preload retries and closes all attempted decoders', async () => {
  const f = await playerFixture({ readinessFailure: true });
  f.start();
  await f.flush();
  for (let i = 0; i < 100 && (await f.tick()); i++);
  assert.equal(f.timers.size, 0);
  assert.equal(f.decoders.length, 7);
  assert.ok(f.decoders.every((d) => d.closes === 1));
  f.dispose();
});

test('preload timeout closes a pending decoder and safely discards its eventual frame', async () => {
  const f = await playerFixture({ pending: true, pendingAt: 0 });
  f.start();
  await f.flush();
  await f.tick();
  assert.equal(f.timers.size, 0);
  f.complete();
  await f.flush();
  assert.equal(f.decoders[0].closes, 1);
  assert.equal(f.frames[0].closes, 1);
  assert.equal(f.timers.size, 0);
  f.dispose();
});
