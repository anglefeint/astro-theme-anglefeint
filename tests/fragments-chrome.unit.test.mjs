/* global EventTarget, Event */
import test from 'node:test';
import assert from 'node:assert/strict';
import { initFragmentsChrome } from '../packages/theme/src/scripts/fragments-chrome.js';

test('fragment chrome resizes, replaces observers and cleans up across page lifetimes', () => {
  const names = ['window', 'document', 'ResizeObserver'];
  const previous = names.map((name) => Object.getOwnPropertyDescriptor(globalThis, name));
  const window = new EventTarget();
  const document = new EventTarget();
  const style = () => ({
    values: new Map(),
    setProperty(name, value) {
      this.values.set(name, value);
    },
    removeProperty(name) {
      this.values.delete(name);
    },
  });
  let headerHeight = 80;
  let titleHeight = 64;
  let present = true;
  const heading = { getBoundingClientRect: () => ({ height: titleHeight }) };
  const header = { getBoundingClientRect: () => ({ height: headerHeight }) };
  const feed = { style: style(), querySelector: () => heading };
  document.body = { style: style() };
  document.querySelector = (selector) =>
    present ? (selector === '[data-fragments]' ? feed : header) : null;
  const observers = [];
  class Observer {
    constructor(callback) {
      this.callback = callback;
      this.targets = [];
      this.disconnected = false;
      observers.push(this);
    }
    observe(target) {
      this.targets.push(target);
    }
    disconnect() {
      this.disconnected = true;
    }
  }
  Object.assign(globalThis, { window, document, ResizeObserver: Observer });
  try {
    initFragmentsChrome();
    assert.deepEqual(observers[0].targets, [header, heading]);
    assert.equal(document.body.style.values.get('--fragments-nav-height'), '80px');
    assert.equal(feed.style.values.get('--fragments-title-height'), '64px');
    headerHeight = 96;
    titleHeight = 88;
    observers[0].callback();
    assert.equal(document.body.style.values.get('--fragments-nav-height'), '96px');
    assert.equal(feed.style.values.get('--fragments-title-height'), '88px');

    initFragmentsChrome();
    assert.equal(observers.length, 2);
    assert.equal(observers[0].disconnected, true);
    assert.equal(observers[1].disconnected, false);
    window.dispatchEvent(new Event('pagehide'));
    assert.equal(observers[1].disconnected, true);
    assert.equal(document.body.style.values.size, 0);
    assert.equal(feed.style.values.size, 0);

    // The route reinitializes on persisted pageshow without needing a new module.
    initFragmentsChrome();
    assert.equal(observers.length, 3);
    assert.equal(document.body.style.values.get('--fragments-nav-height'), '96px');
    document.dispatchEvent(new Event('astro:before-swap'));
    assert.equal(observers[2].disconnected, true);
    assert.equal(document.body.style.values.size, 0);
    assert.equal(feed.style.values.size, 0);
    present = false;
    initFragmentsChrome();
    assert.equal(observers.length, 3);
  } finally {
    document.dispatchEvent(new Event('astro:before-swap'));
    names.forEach((name, index) => {
      if (previous[index]) Object.defineProperty(globalThis, name, previous[index]);
      else delete globalThis[name];
    });
  }
});
