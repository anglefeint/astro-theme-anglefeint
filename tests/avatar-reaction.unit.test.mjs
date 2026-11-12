import test from 'node:test';
import assert from 'node:assert/strict';
import { initAvatarReaction } from '../packages/theme/src/scripts/avatar-reaction.js';

async function fixture(run) {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const fine = new globalThis.EventTarget();
  const motion = new globalThis.EventTarget();
  fine.matches = motion.matches = true;
  const window = new globalThis.EventTarget();
  window.matchMedia = (query) => (query.includes('pointer') ? fine : motion);
  globalThis.window = window;
  const root = { dataset: {} };
  const trigger = new globalThis.EventTarget();
  const state = { hover: false, focus: false };
  trigger.matches = (selector) => (selector === ':hover' ? state.hover : state.focus);
  const image = new globalThis.EventTarget();
  image.complete = true;
  image.naturalWidth = 128;
  image.decode = async () => {};
  const animations = [];
  image.animate = (frames, options) => {
    assert.equal(options.duration, 900);
    assert.equal(options.easing, 'steps(15, end)');
    assert.equal(frames[1].transform, 'translateY(-960px)');
    const animation = {
      currentTime: 0,
      playbackRate: 1,
      playCalls: 0,
      cancelled: false,
      pause() {},
      play() {
        this.playCalls++;
      },
      cancel() {
        this.cancelled = true;
      },
      onfinish: null,
    };
    animations.push(animation);
    return animation;
  };
  const event = (name) => {
    const event = new globalThis.Event(name);
    Object.defineProperty(event, 'pointerType', { value: 'mouse' });
    trigger.dispatchEvent(event);
  };
  const dispose = initAvatarReaction(root, trigger, image);
  try {
    await Promise.resolve();
    assert.equal(root.dataset.avatarReady, 'true');
    await run({ root, state, animations, motion, fine, event, dispose });
  } finally {
    dispose();
    if (original) Object.defineProperty(globalThis, 'window', original);
    else delete globalThis.window;
  }
}

test('hover plays forward, holds smile, and leaves through the full reverse before restoring idle', async () => {
  await fixture(({ root, state, animations, event }) => {
    state.hover = true;
    event('pointerenter');
    const animation = animations[0];
    assert.equal(root.dataset.avatarActive, 'true');
    animation.currentTime = 900;
    animation.onfinish();
    assert.equal(root.dataset.avatarActive, 'true');
    state.hover = false;
    event('pointerleave');
    assert.equal(animation.playbackRate, -1);
    assert.equal(animation.currentTime, 900);
    assert.equal(root.dataset.avatarActive, 'true');
    animation.currentTime = 0;
    animation.onfinish();
    assert.equal(root.dataset.avatarActive, undefined);
  });
});

test('rapid enter/leave reverses from the current pose and pointer exit preserves keyboard focus', async () => {
  await fixture(({ root, state, animations, event }) => {
    state.hover = true;
    event('pointerenter');
    const animation = animations[0];
    animation.currentTime = 300;
    state.hover = false;
    event('pointerleave');
    assert.equal(animation.currentTime, 300);
    assert.equal(animation.playbackRate, -1);
    animation.currentTime = 210;
    state.hover = true;
    event('pointerenter');
    assert.equal(animation.currentTime, 210);
    assert.equal(animation.playbackRate, 1);
    assert.equal(animations.length, 1);
    state.focus = true;
    event('focusin');
    state.hover = false;
    event('pointerleave');
    assert.equal(animation.playbackRate, 1);
    state.focus = false;
    event('focusout');
    assert.equal(animation.playbackRate, -1);
    assert.equal(root.dataset.avatarActive, 'true');
    // A stale forward finish must not hide a reverse that is still in progress.
    animation.onfinish();
    assert.equal(root.dataset.avatarActive, 'true');
  });
});

test('zero-progress exit does not jump to the smile, and reduced motion/disposal cancel playback', async () => {
  await fixture(({ root, state, animations, motion, event, dispose }) => {
    state.hover = true;
    event('pointerenter');
    state.hover = false;
    event('pointerleave');
    assert.equal(root.dataset.avatarActive, undefined);
    state.hover = true;
    event('pointerenter');
    motion.matches = false;
    motion.dispatchEvent(new globalThis.Event('change'));
    assert.equal(root.dataset.avatarActive, undefined);
    assert.equal(animations[0].cancelled, true);
    motion.matches = true;
    motion.dispatchEvent(new globalThis.Event('change'));
    assert.equal(animations.length, 2);
    dispose();
    assert.equal(animations[1].cancelled, true);
    assert.equal(root.dataset.avatarReady, undefined);
    assert.equal(root.dataset.avatarActive, undefined);
  });
});
