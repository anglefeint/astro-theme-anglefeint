/* global console, setTimeout, clearTimeout, EventTarget, Event */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createEffectScope,
  mountOptionalEffect,
} from '../packages/theme/src/scripts/effects/lifecycle.js';

test('optional failures and broken cleanup do not block independent modules', () => {
  const scope = createEffectScope('test');
  const events = [];
  const warn = console.warn;
  console.warn = () => {};
  try {
    mountOptionalEffect(scope, 'broken', () => {
      throw new Error('mount');
    });
    mountOptionalEffect(scope, 'first', () => () => events.push('first'));
    mountOptionalEffect(scope, 'broken cleanup', () => () => {
      throw new Error('cleanup');
    });
    mountOptionalEffect(scope, 'last', () => () => events.push('last'));
    scope.dispose();
    scope.dispose();
    mountOptionalEffect(scope, 'too late', () => events.push('unexpected'));
    assert.deepEqual(events, ['last', 'first']);
  } finally {
    console.warn = warn;
  }
});

test('disposal cancels deferred work and removes listeners', async () => {
  const previous = globalThis.window;
  globalThis.window = { setTimeout, clearTimeout };
  try {
    const scope = createEffectScope('test');
    const target = new EventTarget();
    let calls = 0;
    scope.listen(target, 'test', () => calls++);
    scope.setTimeout(() => calls++, 5);
    scope.dispose();
    target.dispatchEvent(new Event('test'));
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.equal(calls, 0);
  } finally {
    globalThis.window = previous;
  }
});
