import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { URL } from 'node:url';

test('failed preview imports can retry, successful imports are reused and stale failures do not clear a newer activation', async () => {
  const source = await readFile(
    new URL('../packages/theme/src/scripts/home-signal-preview.js', import.meta.url),
    'utf8'
  );
  const timers = new Map(),
    listeners = new Map();
  let id = 0,
    key,
    imports = 0,
    plays = 0,
    paused = 0;
  const viewport = {},
    entrance = {},
    controller = new globalThis.AbortController();
  const panel = {
    dataset: {},
    style: { getPropertyValue: () => '100', removeProperty() {} },
    querySelector: (selector) => (selector === '.home-signal-viewport' ? viewport : entrance),
    getBoundingClientRect: () => ({ width: 100, height: 100 }),
    getClientRects: () => [1],
    contains: () => true,
    hasAttribute: () => false,
    addEventListener: (type, fn) => listeners.set(type, fn),
  };
  let rejectFirst;
  const first = new Promise((_, reject) => {
    rejectFirst = reject;
  });
  const load = () => {
    imports++;
    return imports === 1
      ? first
      : Promise.resolve({
          playPassage: () => {
            plays++;
            return Object.assign(() => {}, {
              pause() {
                paused++;
              },
              resume() {},
            });
          },
        });
  };
  const context = vm.createContext({
    mountKeyButton: (_, options) => {
      key = options;
      return { reset() {} };
    },
    document: { querySelector: () => panel, activeElement: null, addEventListener() {} },
    matchMedia: () => ({ matches: false }),
    clearTimeout: (id) => timers.delete(id),
    window: {
      setTimeout: (fn) => {
        const n = ++id;
        timers.set(n, fn);
        return n;
      },
      addEventListener() {},
    },
  });
  const init = vm.runInContext(
    source.replace(/^import .*;\r?\n/gm, '').replace('export function', 'function') +
      '\ninitSignalPreview;',
    context
  );
  const ui = init(controller.signal, load);
  const activate = () => {
    assert.notEqual(key.onStart(), false);
    key.onUnlock();
  };
  const run = async () => {
    const [n, fn] = timers.entries().next().value;
    timers.delete(n);
    await fn();
  };
  activate();
  const pending = run();
  listeners.get('pointerleave')();
  activate();
  rejectFirst(new Error('temporary module failure'));
  await pending;
  assert.equal(timers.size, 1, 'obsolete rejection must leave the newer activation scheduled');
  await run();
  assert.equal(imports, 2);
  assert.equal(plays, 1);
  ui.pause();
  ui.resume();
  activate();
  await run();
  assert.equal(imports, 2, 'success remains cached');
  assert.ok(paused > 0);
  ui.dispose();
});
