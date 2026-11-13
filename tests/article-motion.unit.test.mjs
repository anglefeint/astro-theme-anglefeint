import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import vm from 'node:vm';
import {
  createEffectScope,
  mountOptionalEffect,
} from '../packages/theme/src/scripts/effects/lifecycle.js';

async function fixture(
  t,
  { reduced = false, idle = true, ready = 'complete', idleError = false } = {}
) {
  const original = globalThis.window;
  let dispose;
  const window = new globalThis.EventTarget();
  globalThis.window = window;
  t.after(() => {
    dispose?.();
    globalThis.window = original;
  });
  const media = new globalThis.EventTarget();
  media.matches = reduced;
  window.matchMedia = () => media;
  const document = new globalThis.EventTarget();
  document.readyState = ready;
  const tasks = new Map(),
    scheduled = [],
    calls = [],
    active = new Map();
  let next = 0;
  const schedule = (fn, delay) => {
    const id = ++next;
    tasks.set(id, fn);
    scheduled.push(delay);
    return id;
  };
  window.setTimeout = schedule;
  window.clearTimeout = (id) => tasks.delete(id);
  if (idle) {
    window.requestIdleCallback = (fn, options) => {
      if (idleError) throw new Error('idle scheduling failed');
      return schedule(fn, options.timeout);
    };
    window.cancelIdleCallback = window.clearTimeout;
  }
  const init = (name) => (reduced) => {
    calls.push([name, reduced]);
    assert.equal(active.has(name), false, name + ' must dispose before replacement');
    active.set(name, reduced);
    return () => active.delete(name);
  };
  const imports = {
    createEffectScope,
    mountOptionalEffect,
    window,
    document,
    initHeroCanvas: init('hero'),
    initPostInteractions: init('interactions'),
    initNetworkCanvas: init('network'),
    initRedQueenTv: init('tv'),
  };
  const motionSource = await readFile(
    new URL('../packages/theme/src/scripts/blogpost/motion.js', import.meta.url),
    'utf8'
  );
  const initArticleMotion = vm.runInNewContext(
    motionSource.replace(/^import .*;\r?\n/gm, '').replace('export function', 'function') +
      '\ninitArticleMotion;',
    imports
  );
  const source = await readFile(
    new URL('../packages/theme/src/scripts/blogpost-effects.js', import.meta.url),
    'utf8'
  );
  const initBlogpostEffects = vm.runInNewContext(
    source.replace(/^import .*;\r?\n/gm, '').replace('export function', 'function') +
      '\ninitBlogpostEffects;',
    {
      ...imports,
      initArticleMotion,
      initCodeCopy: init('copy'),
      initSectionLinks: init('sections'),
      initImagePreview: init('images'),
      initReadProgress: init('progress'),
    }
  );
  const flush = () => {
    while (tasks.size) {
      const [id, fn] = tasks.entries().next().value;
      tasks.delete(id);
      fn();
    }
  };
  const change = (value) => {
    media.matches = value;
    media.dispatchEvent(new globalThis.Event('change'));
  };
  dispose = initBlogpostEffects();
  return { window, document, media, calls, active, tasks, scheduled, flush, change, dispose };
}

test('live motion changes replace only animation resources and preserve deferred timing and reading state', async (t) => {
  const f = await fixture(t);
  f.flush();
  assert.deepEqual(f.scheduled, [1200, 2200]);
  for (const name of ['hero', 'network', 'tv', 'interactions'])
    assert.equal(f.active.get(name), false);
  f.change(true);
  f.flush();
  for (const name of ['hero', 'network', 'tv', 'interactions'])
    assert.equal(f.active.get(name), true);
  f.change(false);
  f.flush();
  for (const name of ['copy', 'sections', 'images', 'progress'])
    assert.equal(f.calls.filter(([n]) => n === name).length, 1);
  for (const name of ['hero', 'network', 'tv', 'interactions'])
    assert.equal(f.active.get(name), false);
  const count = f.calls.length;
  f.change(false);
  assert.equal(f.calls.length, count, 'duplicate change events do not remount');
  f.dispose();
  f.change(true);
  assert.equal(f.active.size, 0);
  assert.equal(f.tasks.size, 0);
  assert.equal(f.calls.length, count);
});

test('switching before idle startup cancels old work and disposal blocks late callbacks', async (t) => {
  const f = await fixture(t, { reduced: true });
  const stale = [...f.tasks.values()];
  f.change(false);
  stale.forEach((callback) => callback());
  assert.equal(
    f.calls.some(([name, reduced]) => name === 'network' && reduced),
    false
  );
  f.flush();
  assert.equal(f.active.get('tv'), false);
  f.change(true);
  const late = [...f.tasks.values()];
  f.dispose();
  late.forEach((callback) => callback());
  assert.equal(f.active.size, 0);
  assert.equal(f.tasks.size, 0);
});

test('load/timer fallback follows latest preference and cached pages retain one live listener', async (t) => {
  const f = await fixture(t, { idle: false, ready: 'loading' });
  f.change(true);
  assert.equal(f.tasks.size, 0);
  f.document.readyState = 'complete';
  f.window.dispatchEvent(new globalThis.Event('load'));
  assert.deepEqual(f.scheduled, [120, 460]);
  f.flush();
  assert.equal(f.active.get('network'), true);
  const cached = new globalThis.Event('pagehide');
  Object.defineProperty(cached, 'persisted', { value: true });
  f.window.dispatchEvent(cached);
  f.media.matches = false;
  f.window.dispatchEvent(new globalThis.Event('pageshow'));
  f.flush();
  assert.equal(f.active.get('network'), false);
  f.window.dispatchEvent(new globalThis.Event('pagehide'));
  assert.equal(f.active.size, 0);
  f.change(true);
  assert.equal(f.tasks.size, 0);
});

test('failed motion startup releases its listener/resources without removing reading controls', async (t) => {
  const warn = globalThis.console.warn;
  const warnings = [];
  let f;
  globalThis.console.warn = (...args) => warnings.push(args);
  try {
    f = await fixture(t, { idleError: true });
  } finally {
    globalThis.console.warn = warn;
  }
  assert.equal(warnings.length, 1);
  assert.deepEqual([...f.active.keys()], ['copy', 'sections', 'images', 'progress']);
  const count = f.calls.length;
  f.change(true);
  f.window.dispatchEvent(new globalThis.Event('pageshow'));
  assert.equal(f.calls.length, count, 'failed startup must not retain motion listeners');
  assert.equal(f.tasks.size, 0);
  f.dispose();
  assert.equal(f.active.size, 0);
});
