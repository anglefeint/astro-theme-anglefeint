import assert from 'node:assert/strict';
import test from 'node:test';
import { bindBackToTop } from '../packages/theme/src/scripts/back-to-top.js';

function fixture() {
  const viewport = new globalThis.EventTarget();
  viewport.scrollY = 0;
  viewport.reduced = false;
  viewport.calls = [];
  viewport.matchMedia = () => ({ matches: viewport.reduced });
  viewport.scrollTo = (value) => viewport.calls.push(value);
  const button = new globalThis.EventTarget();
  const classes = new Set();
  button.classList = {
    toggle: (name, value) => (value ? classes.add(name) : classes.delete(name)),
    remove: (name) => classes.delete(name),
  };
  const attributes = new Map();
  button.setAttribute = (name, value) => attributes.set(name, value);
  const page = { documentElement: { scrollTop: 0 } };
  return { viewport, button, classes, attributes, page };
}

test('shared control shows past 400px, restores keyboard state and hides on return', () => {
  const f = fixture();
  const dispose = bindBackToTop(f.button, f);
  assert.equal(f.button.tabIndex, -1);
  f.viewport.scrollY = 400;
  f.viewport.dispatchEvent(new globalThis.Event('scroll'));
  assert(!f.classes.has('visible'));
  f.viewport.scrollY = 401;
  f.viewport.dispatchEvent(new globalThis.Event('scroll'));
  assert(f.classes.has('visible'));
  assert.equal(f.button.tabIndex, 0);
  assert.equal(f.attributes.get('aria-hidden'), 'false');
  f.viewport.scrollY = 0;
  f.viewport.dispatchEvent(new globalThis.Event('scroll'));
  assert.equal(f.button.tabIndex, -1);
  dispose();
});

test('click respects current reduced motion and disposal prevents duplicate handlers', () => {
  const f = fixture();
  let dispose = bindBackToTop(f.button, f);
  f.button.dispatchEvent(new globalThis.Event('click'));
  f.viewport.reduced = true;
  f.button.dispatchEvent(new globalThis.Event('click'));
  assert.deepEqual(f.viewport.calls, [
    { top: 0, behavior: 'smooth' },
    { top: 0, behavior: 'auto' },
  ]);
  dispose();
  f.button.dispatchEvent(new globalThis.Event('click'));
  assert.equal(f.viewport.calls.length, 2);
  dispose = bindBackToTop(f.button, f);
  f.button.dispatchEvent(new globalThis.Event('click'));
  assert.equal(f.viewport.calls.length, 3);
  dispose();
});
