import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import { randomUnit, selectVisualVariant } from '../packages/theme/src/utils/visual-variant.js';
import { NEON_COLOR_COUNT } from '../packages/theme/src/scripts/effects/neon-palette.js';
import { initTagColors } from '../packages/theme/src/scripts/tag-colors.js';
import { initCyberPagination } from '../packages/theme/src/scripts/cyber-pagination.js';

test('visual policy supports fixed/sequential modes and samples anew for every random choice', () => {
  assert.equal(selectVisualVariant({ count: 9, mode: 'fixed', fixed: 20 }), 9);
  assert.equal(selectVisualVariant({ count: 9, mode: 'fixed', fixed: 0 }), 1);
  assert.equal(selectVisualVariant({ count: 9, mode: 'sequential', index: 10 }), 2);
  assert.equal(selectVisualVariant({ count: NaN, random: () => 0.5 }), 1);
  let calls = 0;
  const random = () => [0, 0.99, 0.3][calls++];
  assert.deepEqual(
    Array.from({ length: 3 }, () => selectVisualVariant({ count: 9, random })),
    [1, 9, 3]
  );
  assert.equal(calls, 3);
});

test('default randomness reads fresh browser entropy and falls back when unavailable', (t) => {
  let calls = 0;
  const entropy = t.mock.method(globalThis.crypto, 'getRandomValues', (array) => {
    array[0] = calls++ ? 0xffffffff : 0;
    return array;
  });
  assert.equal(randomUnit(), 0);
  assert(randomUnit() > 0.99 && calls === 2);
  entropy.mock.restore();
  t.mock.method(globalThis.crypto, 'getRandomValues', () => {
    throw Error('Unavailable');
  });
  t.mock.method(Math, 'random', () => 0.25);
  assert.equal(randomUnit(), 0.25);
});

class Element {
  constructor(className = '') {
    this.className = className;
    this.dataset = {};
    this.attributes = new Map();
    this.listeners = {};
    this.nodes = {};
    this.classList = {
      [Symbol.iterator]: () => this.className.split(/\s+/).filter(Boolean)[Symbol.iterator](),
      add: (name) => {
        this.className = [...new Set([...this.classList, name])].join(' ');
      },
      remove: (name) => {
        this.className = [...this.classList].filter((x) => x !== name).join(' ');
      },
    };
  }
  hasAttribute(name) {
    return this.attributes.has(name);
  }
  setAttribute(name, value) {
    this.attributes.set(name, value);
  }
  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
  querySelectorAll(selector) {
    return this.nodes[selector] ?? [];
  }
  querySelector(selector) {
    return this.nodes[selector] ?? null;
  }
  addEventListener(name, callback) {
    this.listeners[name] = callback;
  }
}

test('tags resample on a new document and do not recolor repeatedly within one visit', () => {
  const makePage = () => {
    const nav = new Element();
    const link = new Element('neon-v2 unrelated');
    link.setAttribute('href', '/en/tags/example/');
    nav.nodes['a[rel="tag"]'] = [link];
    return { root: { querySelectorAll: () => [nav] }, link };
  };
  const first = makePage(),
    reload = makePage();
  initTagColors(first.root, () => 0);
  initTagColors(first.root, () => {
    throw Error('Must not resample same visit');
  });
  initTagColors(reload.root, () => 0.99);
  assert.equal(first.link.className, 'unrelated neon-v1');
  assert.equal(reload.link.className, 'unrelated neon-v9');
  assert.equal(first.link.getAttribute('href'), '/en/tags/example/');
});

test('pagination shares fresh choices while preserving modes, current state and jump behavior', () => {
  const keys = ['HTMLElement', 'HTMLFormElement', 'HTMLInputElement', 'window'];
  const previous = keys.map((key) => Object.getOwnPropertyDescriptor(globalThis, key));
  const destinations = [];
  for (const key of keys.slice(0, 3))
    Object.defineProperty(globalThis, key, { configurable: true, value: Element });
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { location: { assign: (url) => destinations.push(url) } },
  });
  try {
    const wrap = new Element('pagination-wrap cyber-pg-v2 neon-v2');
    wrap.dataset = { styleEnabled: 'true', styleMode: 'random', styleVariants: '9' };
    const item = new Element('pg-item current pg-var-random neon-v1');
    wrap.nodes['.pagination .pg-item'] = [item];
    const form = new Element(),
      input = new Element();
    form.setAttribute('data-blog-root', '/zh/blog/');
    form.setAttribute('data-total-pages', '3');
    form.setAttribute('data-enter-to-go', 'false');
    form.nodes['.pagination-jump-input'] = input;
    wrap.nodes['.pagination-jump'] = form;
    const root = { querySelectorAll: () => [wrap] };
    let calls = 0;
    initCyberPagination(root, () => [0.99, 0][calls++]);
    assert.match(wrap.className, /cyber-pg-v9 neon-v9/);
    assert.match(item.className, /current pg-var-1 neon-v1/);
    input.value = '999';
    form.listeners.submit({ preventDefault() {} });
    assert.deepEqual(destinations, ['/zh/blog/3/']);
    let prevented = false;
    input.listeners.keydown({
      key: 'Enter',
      preventDefault() {
        prevented = true;
      },
    });
    assert(prevented);
    initCyberPagination(root, () => {
      throw Error('Duplicate mount');
    });
    for (const [enabled, mode, expected] of [
      ['true', 'fixed', 4],
      ['false', 'random', 1],
    ]) {
      wrap.attributes.delete('data-pagination-ready');
      wrap.dataset = {
        styleEnabled: enabled,
        styleMode: mode,
        styleVariants: '9',
        styleFixedVariant: '4',
      };
      initCyberPagination(root, () => {
        throw Error('Fixed/disabled must not sample');
      });
      assert.match(item.className, new RegExp(`pg-var-${expected} neon-v${expected}`));
    }
    wrap.attributes.delete('data-pagination-ready');
    wrap.dataset.styleEnabled = 'true';
    wrap.dataset.styleMode = 'sequential';
    const original = item.className;
    initCyberPagination(root, () => {
      throw Error('Sequential keeps rendered choice');
    });
    assert.equal(item.className, original);
  } finally {
    keys.forEach((key, i) => {
      if (previous[i]) Object.defineProperty(globalThis, key, previous[i]);
      else delete globalThis[key];
    });
  }
});

test('all selectable neon variants have one complete shared token set', async () => {
  const css = await readFile(
    new URL('../packages/theme/src/styles/neon-palette.css', import.meta.url),
    'utf8'
  );
  const palettes = [...css.matchAll(/\.neon-v(\d+)\s*\{([^}]+)\}/g)];
  assert.equal(palettes.length, NEON_COLOR_COUNT);
  assert.deepEqual(
    palettes.map((m) => Number(m[1])),
    Array.from({ length: NEON_COLOR_COUNT }, (_, i) => i + 1)
  );
  for (const [, , body] of palettes)
    for (const token of ['accent', 'border', 'bg', 'glow'])
      assert(body.includes(`--neon-${token}:`));
});
