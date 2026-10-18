import { initSignalPreview } from './home-signal-preview.js';
import { createEffectScope, mountOptionalEffect } from './effects/lifecycle.js';
import { initHomeMatrix } from './home-matrix.js';
import { createHomeMirror } from './home-mirror.js';
import { initHomeRabbitDecode } from './home-rabbit-decode.js';
import { initHomePassage } from './home-passage.js';
import '../styles/home-passage.css';

const instances = new WeakMap();

// Reveal each signal independently, including the trace's non-text cursor.
function initHiddenStatus(signal) {
  const items = document.querySelectorAll('.home-pirate-signal, .home-trace-text');
  if (!items.length) return;
  const syncSelection = () => {
    const selection = document.getSelection();
    for (const item of items) {
      let selected = false;
      if (selection && !selection.isCollapsed) {
        for (let index = 0; index < selection.rangeCount; index++) {
          if (selection.getRangeAt(index).intersectsNode(item)) {
            selected = true;
            break;
          }
        }
      }
      item.toggleAttribute('data-selected', selected);
    }
  };
  document.addEventListener('selectionchange', syncSelection, { signal });
  window.addEventListener('pageshow', syncSelection, { signal });
  signal.addEventListener(
    'abort',
    () => items.forEach((item) => item.removeAttribute('data-selected')),
    { once: true }
  );
  syncSelection();
}

// Page lifecycle belongs here; renderers own only their local resources.
export function initHomeEffects() {
  const canvas = document.getElementById('matrix-bg');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  if (instances.has(canvas)) return instances.get(canvas);
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  initHiddenStatus(listeners.signal);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scope = createEffectScope('home');
  const mount = (label, init) => {
    let control;
    mountOptionalEffect(scope, label, () => {
      control = init();
      return () => control?.dispose();
    });
    return control;
  };
  const rain = mount('matrix', initHomeMatrix);
  let detachMirror;
  const mirror = mount('mirror', () =>
    createHomeMirror(canvas, { onDispose: () => detachMirror?.() })
  );
  mountOptionalEffect(scope, 'mirror frame subscription', () => {
    if (mirror && rain) detachMirror = rain.subscribeFrame(mirror.draw);
    return () => detachMirror?.();
  });
  const rabbits = mount('rabbit', initHomeRabbitDecode);
  const passage = mount('passage', initHomePassage);
  const preview = mount('signal preview', () => initSignalPreview(listeners.signal));
  const controls = [rain, mirror, rabbits, passage, preview].filter(Boolean);
  let frozen = false,
    disposed = false;
  const sync = () => {
    if (disposed) return;
    canvas.style.display = reduced.matches ? 'none' : '';
    if (frozen || document.hidden) {
      controls.forEach((control) => control.pause());
      return;
    }
    mirror?.resume();
    rabbits?.resume();
    preview?.resume();
    if (reduced.matches) {
      rain?.pause();
      passage?.pause();
    } else {
      rain?.resume();
      passage?.resume();
    }
  };
  const pause = () => {
    frozen = true;
    controls.forEach((control) => control.pause());
  };
  const resume = () => {
    frozen = false;
    sync();
  };
  const controller = {
    start: resume,
    resume,
    pause,
    dispose() {
      if (disposed) return;
      disposed = true;
      listeners.abort();
      scope.dispose();
      controls.length = 0;
      instances.delete(canvas);
    },
  };
  instances.set(canvas, controller);
  document.addEventListener('visibilitychange', sync, options);
  reduced.addEventListener('change', sync, options);
  window.addEventListener(
    'pagehide',
    (event) => (event.persisted ? pause() : controller.dispose()),
    options
  );
  window.addEventListener('pageshow', resume, options);
  resume();
  return controller;
}
