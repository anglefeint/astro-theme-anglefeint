import test from 'node:test';
import assert from 'node:assert/strict';
import { initFragmentSignal } from '../packages/theme/src/scripts/fragment-signal.js';

test('signal dismissal stays local while other widgets are used, with header tracking and cleanup', () => {
  class DomTarget extends globalThis.EventTarget {}
  const keys = ['window', 'document', 'Node', 'ResizeObserver'];
  const saved = keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]);
  try {
    const window = new DomTarget();
    const document = new DomTarget();
    let observer;
    Object.assign(globalThis, {
      window,
      document,
      Node: DomTarget,
      ResizeObserver: class {
        constructor(callback) {
          this.callback = callback;
          observer = this;
        }
        observe() {}
        disconnect() {
          this.disconnected = true;
        }
      },
    });
    const root = new DomTarget();
    const closeButton = new DomTarget();
    let closeFocusCount = 0;
    closeButton.focus = () => closeFocusCount++;
    const disclosure = root;
    root.open = true;
    root.matches = (selector) => selector === 'details';
    let focusCount = 0;
    const trigger = { focus: () => focusCount++ };
    const positions = new Map();
    root.querySelector = (selector) =>
      selector === 'details'
        ? null
        : selector === 'summary'
          ? trigger
          : selector === '[data-fragment-signal-close]'
            ? closeButton
            : null;
    root.style = { setProperty: (key, value) => positions.set(key, value) };
    root.contains = (target) => target === root || target === closeButton;
    let headerBottom = 56;
    const dispose = initFragmentSignal(root, {
      getBoundingClientRect: () => ({ bottom: headerBottom }),
    });
    root.dispatchEvent(new globalThis.Event('toggle'));
    assert.equal(closeFocusCount, 1, 'opening moves focus off the covered trigger');
    assert.equal(positions.get('--fragment-signal-top'), '68px');
    headerBottom = 120;
    observer.callback();
    assert.equal(positions.get('--fragment-signal-top'), '132px');

    // Player OPEN/CLOSE/QUEUE events must not dismiss the signal window.
    for (let i = 0; i < 3; i++) document.dispatchEvent(new globalThis.Event('click'));
    assert.equal(disclosure.open, true);
    const escape = () => {
      const event = new globalThis.Event('keydown');
      Object.defineProperty(event, 'key', { value: 'Escape' });
      return event;
    };
    document.dispatchEvent(escape());
    assert.equal(disclosure.open, true);
    root.dispatchEvent(escape());
    assert.equal(disclosure.open, false);
    assert.equal(focusCount, 1);

    disclosure.open = true;
    closeButton.dispatchEvent(new globalThis.Event('click'));
    assert.equal(disclosure.open, false);
    assert.equal(focusCount, 2);
    dispose();
    assert.equal(observer.disconnected, true);
    disclosure.open = true;
    closeButton.dispatchEvent(new globalThis.Event('click'));
    root.dispatchEvent(escape());
    assert.equal(disclosure.open, true);
  } finally {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});

test('reaction decoding starts at mount and only enables hover after readiness, with safe teardown', async () => {
  const keys = ['window', 'document'];
  const saved = keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]);
  try {
    globalThis.window = new globalThis.EventTarget();
    globalThis.document = new globalThis.EventTarget();
    const root = new globalThis.EventTarget();
    root.dataset = {};
    const reaction = new globalThis.EventTarget();
    let finishDecode;
    let decodeCalls = 0;
    reaction.complete = false;
    reaction.naturalWidth = 0;
    reaction.decode = () => {
      decodeCalls++;
      return new Promise((resolve) => {
        finishDecode = resolve;
      });
    };
    const disclosure = new globalThis.EventTarget();
    disclosure.open = false;
    const trigger = new globalThis.EventTarget();
    trigger.focus = () => {};
    const closeButton = new globalThis.EventTarget();
    root.querySelector = (selector) =>
      ({
        details: disclosure,
        summary: trigger,
        '[data-fragment-signal-close]': closeButton,
        'img[data-avatar-reaction]': reaction,
      })[selector] ?? null;
    const dispose = initFragmentSignal(root);
    assert.equal(decodeCalls, 1, 'decoding begins without waiting for hover');
    assert.equal(root.dataset.avatarReady, undefined);
    reaction.complete = true;
    reaction.naturalWidth = 128;
    finishDecode();
    await Promise.resolve();
    assert.equal(root.dataset.avatarReady, 'true');
    dispose();
    assert.equal(root.dataset.avatarReady, undefined);

    // A decode finishing after disposal cannot enable an unmounted instance.
    const disposeAgain = initFragmentSignal(root);
    disposeAgain();
    finishDecode();
    await Promise.resolve();
    assert.equal(root.dataset.avatarReady, undefined);
  } finally {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
