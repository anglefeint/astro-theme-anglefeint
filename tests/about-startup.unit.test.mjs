import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initAboutModals } from '../packages/theme/src/scripts/about/modals.js';
import { initOracle } from '../packages/theme/src/scripts/about/oracle.js';
import { initAboutInteractions } from '../packages/theme/src/scripts/about/interactions.js';
import { initAboutWindow } from '../packages/theme/src/scripts/about/window.js';
import { loadStylesheet } from '../packages/theme/src/scripts/effects/stylesheet.js';

class Node extends globalThis.EventTarget {
  constructor() {
    super();
    this.attrs = new Map();
    this.classes = new Set();
    this.classList = {
      add: (...names) => names.forEach((name) => this.classes.add(name)),
      remove: (...names) => names.forEach((name) => this.classes.delete(name)),
      contains: (name) => this.classes.has(name),
      toggle: (name, on) => (on ? this.classes.add(name) : this.classes.delete(name)),
    };
    this.style = {};
    this.dataset = {};
    this.children = [];
    this.one = new Map();
    this.many = new Map();
    this.textContent = '';
    this.hidden = false;
    this.inert = false;
  }
  querySelector(selector) {
    return this.one.get(selector) || null;
  }
  querySelectorAll(selector) {
    return this.many.get(selector) || [];
  }
  getAttribute(name) {
    return this.attrs.get(name) ?? null;
  }
  setAttribute(name, value) {
    this.attrs.set(name, String(value));
  }
  removeAttribute(name) {
    this.attrs.delete(name);
  }
  toggleAttribute(name, on) {
    if (on) this.setAttribute(name, '');
    else this.removeAttribute(name);
  }
  append(...nodes) {
    this.children.push(...nodes);
  }
  replaceChildren(...nodes) {
    this.children = nodes;
  }
  focus() {
    this.focused = true;
  }
  click() {
    this.dispatchEvent(new globalThis.Event('click'));
  }
}

function environment(t) {
  const doc = new Node();
  doc.body = new Node();
  doc.head = new Node();
  doc.createElement = () => new Node();
  const ids = new Map();
  doc.getElementById = (id) => ids.get(id) || null;
  const win = new Node();
  win.clearTimeout = globalThis.clearTimeout;
  win.scrollY = 0;
  const originals = new Map();
  const cleanup = [];
  const install = (name, value) => {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  };
  install('document', doc);
  install('window', win);
  install('HTMLElement', Node);
  install('requestAnimationFrame', () => 1);
  install('cancelAnimationFrame', () => {});
  install('matchMedia', () => ({ matches: true }));
  install('location', { pathname: '/en/about/', hash: '' });
  install('localStorage', { getItem: () => null, setItem() {} });
  t.after(() => {
    cleanup.forEach((dispose) => dispose());
    originals.forEach((descriptor, name) => {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    });
  });
  return { doc, win, ids, install, cleanup };
}
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
const flush = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};

function modalFixture(t, load) {
  const env = environment(t);
  const overlay = new Node(),
    body = new Node(),
    title = new Node(),
    dialog = new Node();
  overlay.one.set('.hacker-modal-body', body);
  overlay.one.set('.hacker-modal-title', title);
  overlay.one.set('.hacker-modal', dialog);
  overlay.one.set('[role="dialog"]', dialog);
  env.ids.set('hacker-modal', overlay);
  env.ids.set('hacker-decoder-tpl', { content: { cloneNode: () => new Node() } });
  const button = new Node(),
    other = new Node();
  button.dataset.modal = 'decoder';
  other.dataset.modal = 'other';
  env.doc.many.set('.hacker-folder[data-modal]', [button, other]);
  const dispose = initAboutModals(
    {
      decoderLabels: { loadFailed: 'Load failed' },
      modalContent: {
        decoder: { type: 'decryptor', title: 'Decoder', body: '' },
        other: { title: 'Other', body: 'Other content' },
      },
    },
    true,
    {},
    load
  );
  env.cleanup.push(dispose);
  const close = () => env.win.dispatchEvent(new globalThis.Event('pagehide'));
  return { ...env, overlay, body, button, other, close, dispose };
}

test('decoder stays lazy; closing/switching/disposal invalidates pending startup', async (t) => {
  const pending = [];
  let loads = 0,
    starts = 0;
  const f = modalFixture(t, () => {
    loads++;
    const p = deferred();
    pending.push(p);
    return p.promise;
  });
  const tool = {
    createDecoderController: () => ({
      start() {
        starts++;
      },
      stop() {},
    }),
  };
  assert.equal(loads, 0);
  f.button.click();
  assert.equal(f.body.getAttribute('aria-busy'), 'true');
  f.close();
  pending[0].resolve(tool);
  await flush();
  assert.equal(starts, 0);
  assert.equal(f.overlay.classList.contains('open'), false);
  f.button.click();
  f.other.click();
  pending[1].resolve(tool);
  await flush();
  assert.equal(starts, 0);
  assert.equal(f.body.innerHTML, 'Other content');
  f.button.click();
  f.dispose();
  pending[2].resolve(tool);
  await flush();
  assert.equal(starts, 0);
  assert.equal(f.body.getAttribute('aria-busy'), null);
});

test('decoder failure is readable and reopening retries; successful controllers are reused', async (t) => {
  let loads = 0,
    creates = 0,
    starts = 0,
    stops = 0;
  const f = modalFixture(t, async () => {
    if (++loads === 1) throw new Error('offline');
    return {
      createDecoderController: () => {
        creates++;
        return {
          start() {
            starts++;
          },
          stop() {
            stops++;
          },
        };
      },
    };
  });
  f.button.click();
  await flush();
  assert.equal(f.body.textContent, 'Load failed');
  assert.equal(f.body.getAttribute('aria-busy'), null);
  f.close();
  f.button.click();
  await flush();
  assert.equal(starts, 1);
  f.close();
  f.button.click();
  await flush();
  assert.equal(creates, 1);
  assert.equal(starts, 2);
  assert.ok(stops > 0);
});

test('Oracle performs no startup request and does not play after disposal while loading', async (t) => {
  const { doc } = environment(t);
  const button = new Node();
  doc.one.set('[data-oracle]', button);
  const pending = deferred();
  let loads = 0,
    plays = 0;
  const dispose = initOracle(() => {
    loads++;
    return pending.promise;
  });
  assert.equal(loads, 0);
  button.click();
  button.click();
  assert.equal(loads, 1);
  dispose();
  pending.resolve({
    prepareFont: async () => {},
    playPassage() {
      plays++;
    },
  });
  await flush();
  assert.equal(plays, 0);
});

test('Oracle retries a failed request and restores page interaction on close', async (t) => {
  const { doc } = environment(t);
  const button = new Node(),
    overlay = new Node(),
    sibling = new Node();
  overlay.classList.add('oracle-passage');
  doc.one.set('[data-oracle]', button);
  doc.one.set('.oracle-passage', overlay);
  doc.body.children = [sibling, overlay];
  doc.body.style.overflow = 'auto';
  let loads = 0,
    plays = 0,
    stops = 0;
  const dispose = initOracle(async () => {
    if (++loads === 1) throw new Error('offline');
    return {
      prepareFont: async () => {},
      randomPassagePalette: () => 'green',
      playPassage() {
        plays++;
        return () => {
          stops++;
        };
      },
    };
  });
  button.click();
  await flush();
  assert.equal(plays, 0);
  button.click();
  await flush();
  assert.equal(plays, 1);
  assert.equal(sibling.inert, true);
  assert.equal(doc.body.style.overflow, 'hidden');
  dispose();
  assert.equal(stops, 1);
  assert.equal(sibling.inert, false);
  assert.equal(doc.body.style.overflow, 'auto');
});

test('heading typing keeps full localized sizing text and only animates an aria-hidden layer', (t) => {
  const { doc, win, install } = environment(t);
  const title = new Node();
  title.textContent = '很长的多语言标题 / Long heading';
  doc.many.set('.about-section-title:not([data-static-title])', [title]);
  let observer;
  class Observer {
    constructor(callback) {
      this.callback = callback;
      observer = this;
    }
    observe() {}
    unobserve() {}
    disconnect() {
      this.disconnected = true;
    }
  }
  install('IntersectionObserver', Observer);
  win.IntersectionObserver = Observer;
  const dispose = initAboutInteractions(false);
  const [sizing, typing] = title.children[0].children;
  assert.equal(sizing.textContent, title.getAttribute('data-full-text'));
  assert.equal(typing.getAttribute('aria-hidden'), 'true');
  observer.callback([{ target: title, isIntersecting: true }]);
  assert.equal(sizing.textContent, title.getAttribute('data-full-text'));
  dispose();
  assert.equal(observer.disconnected, true);
  assert.equal(title.textContent, '很长的多语言标题 / Long heading');
  const reduced = initAboutInteractions(true);
  assert.equal(title.textContent, '很长的多语言标题 / Long heading');
  reduced();
});

test('window controls enable after binding and disable on disposal without hiding the bar', (t) => {
  const { doc } = environment(t);
  const panel = new Node(),
    bar = new Node(),
    dock = new Node(),
    opener = new Node();
  const controls = ['close', 'minimize', 'maximize'].map((action) => {
    const button = new Node();
    button.disabled = true;
    button.dataset.aboutAction = action;
    button.one.set('span', new Node());
    return button;
  });
  controls[2].dataset.expandLabel = 'Fullscreen';
  panel.one.set('.about-window-bar', bar);
  panel.one.set('[data-about-action="maximize"]', controls[2]);
  panel.many.set('[data-about-action]', controls);
  doc.one.set('#about-reading-window', panel);
  doc.one.set('[data-about-restore]', dock);
  doc.one.set('[data-about-open]', opener);
  const controller = initAboutWindow();
  assert.ok(controls.every((button) => !button.disabled));
  assert.equal(bar.hidden, false);
  controller.dispose();
  assert.ok(controls.every((button) => button.disabled));
  assert.equal(bar.hidden, false);
});

test('tool styles wait for load, share in-flight requests, and retry failed links', async (t) => {
  const { doc } = environment(t);
  const first = loadStylesheet('/tool-test.css');
  assert.equal(loadStylesheet('/tool-test.css'), first);
  assert.equal(doc.head.children.length, 1);
  let ready = false;
  void first.then(
    () => {
      ready = true;
    },
    () => {}
  );
  await flush();
  assert.equal(ready, false);
  const link = doc.head.children[0];
  link.remove = () => {
    link.removed = true;
  };
  const failure = assert.rejects(first, /Stylesheet/);
  link.dispatchEvent(new globalThis.Event('error'));
  await failure;
  assert.equal(link.removed, true);
  const retry = loadStylesheet('/tool-test.css');
  assert.notEqual(retry, first);
  doc.head.children[1].dispatchEvent(new globalThis.Event('load'));
  await retry;
  assert.equal(loadStylesheet('/tool-test.css'), retry);
});
