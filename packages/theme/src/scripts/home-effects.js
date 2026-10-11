import { initHomeMatrix } from './home-matrix.js';
import { createHomeMirror } from './home-mirror.js';
import { initHomeRabbitDecode } from './home-rabbit-decode.js';
import { initHomePassage } from './home-passage.js';
import '../styles/home-passage.css';

const instances = new WeakMap();

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
  const controls = [rain, mirror, rabbits, passage].filter(Boolean);
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
