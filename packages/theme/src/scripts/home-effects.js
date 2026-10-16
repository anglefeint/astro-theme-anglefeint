import { initHomeMatrix } from './home-matrix.js';
import { createHomeMirror } from './home-mirror.js';
import { initHomeRabbitDecode } from './home-rabbit-decode.js';
import { initHomePassage } from './home-passage.js';
import '../styles/home-passage.css';

const instances = new WeakMap();

// Interaction only: scene timing and rendering belong to the shared passage player.
function initSignalPreview(signal) {
  const panel = document.querySelector('.home-signal-monitor');
  const viewport = panel?.querySelector('.home-signal-viewport');
  if (!viewport) return;
  const entrance = panel.querySelector('.home-signal-enter');
  let activated = false;
  let close,
    loading,
    timer = 0,
    idleTimer = 0,
    collapseTimer = 0,
    revision = 0,
    paused = false,
    pointerInside = false;
  const interested = () => activated && (pointerInside || panel.contains(document.activeElement));
  const release = () => {
    clearTimeout(idleTimer);
    idleTimer = 0;
    close?.();
    close = undefined;
  };
  const clear = (dispose = true) => {
    activated = false;
    delete panel.dataset.unlocking;
    delete panel.dataset.unlocked;
    revision++;
    clearTimeout(timer);
    timer = 0;
    clearTimeout(collapseTimer);
    close?.pause();
    if (dispose) release();
    else if (close) {
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(release, 15000);
    }
    delete panel.dataset.preview;
    if (entrance) entrance.inert = false;
    viewport.inert = true;
    if (dispose) delete panel.dataset.expanded;
    else
      collapseTimer = window.setTimeout(
        () => {
          if (!interested()) delete panel.dataset.expanded;
        },
        matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1000
      );
  };
  const show = () => {
    if (panel.hasAttribute('data-unlocking')) return;
    if (paused || !interested() || !panel.getClientRects().length) return;
    if (panel.hasAttribute('data-expanded') && (timer || panel.hasAttribute('data-preview')))
      return;
    clearTimeout(collapseTimer);
    clearTimeout(timer);
    clearTimeout(idleTimer);
    if (!panel.style.getPropertyValue('--signal-rest-width')) {
      const bounds = panel.getBoundingClientRect();
      panel.style.setProperty('--signal-rest-width', `${bounds.width}px`);
      panel.style.setProperty('--signal-rest-height', `${bounds.height}px`);
      // Commit numeric resting dimensions before transitioning away from intrinsic size.
      void panel.offsetWidth;
    }
    panel.dataset.expanded = '';
    const request = ++revision;
    timer = window.setTimeout(async () => {
      timer = 0;
      try {
        loading ??= import('./matrix-passage/player.js');
        const { playPassage } = await loading;
        if (signal.aborted || paused || request !== revision || !interested()) return;
        if (close) close.resume();
        else close = playPassage({ container: viewport, mode: 'corridor' });
        panel.dataset.preview = '';
        viewport.inert = false;
        if (document.activeElement === entrance)
          panel.querySelector('.home-signal-scroll')?.focus({ preventScroll: true });
        if (entrance) entrance.inert = true;
      } catch {
        clear();
      }
    }, 800);
  };
  const leave = () => {
    if (interested()) return;
    clear(false);
  };
  const options = { signal };
  panel.addEventListener(
    'pointerenter',
    () => {
      pointerInside = true;
    },
    options
  );
  panel.addEventListener(
    'pointerleave',
    () => {
      pointerInside = false;
      if (activated) clear(false);
    },
    options
  );
  const activate = () => {
    if (paused || activated) return;
    activated = true;
    clearTimeout(collapseTimer);
    clearTimeout(idleTimer);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show();
      return;
    }
    panel.dataset.unlocking = '';
    timer = window.setTimeout(() => {
      timer = 0;
      panel.dataset.unlocked = '';
      delete panel.dataset.unlocking;
      if (!signal.aborted && interested()) show();
    }, 600);
  };
  entrance?.addEventListener('click', activate, options);
  panel.addEventListener('focusout', leave, options);
  panel.addEventListener(
    'passage-door-opened',
    () => {
      if (panel.contains(document.activeElement))
        panel.querySelector('.home-signal-scroll')?.focus({ preventScroll: true });
    },
    options
  );
  window.addEventListener(
    'resize',
    () => {
      clear();
      panel.style.removeProperty('--signal-rest-width');
      panel.style.removeProperty('--signal-rest-height');
    },
    options
  );
  window.addEventListener('pagehide', () => clear(), options);
  return {
    pause() {
      paused = true;
      clear(false);
    },
    resume() {
      paused = false;
      show();
    },
    dispose: clear,
  };
}

// Page lifecycle belongs here; renderers own only their local resources.
export function initHomeEffects() {
  const canvas = document.getElementById('matrix-bg');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  if (instances.has(canvas)) return instances.get(canvas);
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const rain = initHomeMatrix();
  let detachMirror;
  const mirror = createHomeMirror(canvas, { onDispose: () => detachMirror?.() });
  if (mirror && rain) detachMirror = rain.subscribeFrame(mirror.draw);
  const rabbits = initHomeRabbitDecode();
  const passage = initHomePassage();
  const preview = initSignalPreview(listeners.signal);
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
      detachMirror?.();
      controls.forEach((control) => control.dispose());
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
