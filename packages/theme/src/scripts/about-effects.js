import { initTerminalBackground } from './about/background.js';
import { initAboutInteractions } from './about/interactions.js';
import { initAboutModals } from './about/modals.js';
import { initAboutReadingUi } from './about/reading-ui.js';
import { isReducedMotion, readAboutRuntimeConfig } from './about/runtime.js';
import { initOracle } from './about/oracle.js';
import { createDecoderClock } from './decoder/clock.js';

let disposeAbout;
export function initAboutEffects() {
  disposeAbout?.();
  const runtimeConfig = readAboutRuntimeConfig();
  const reduced = isReducedMotion();
  const decoderClock = createDecoderClock();
  const cleanups = [];
  const listeners = new AbortController();
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    listeners.abort();
    cleanups.reverse().forEach((cleanup) => cleanup?.());
    decoderClock.dispose();
    if (disposeAbout === dispose) disposeAbout = undefined;
  };
  disposeAbout = dispose;
  try {
    cleanups.push(initTerminalBackground(runtimeConfig, reduced));
    cleanups.push(initAboutReadingUi(runtimeConfig, reduced));
    cleanups.push(initAboutModals(runtimeConfig, reduced, decoderClock));
    cleanups.push(initAboutInteractions(reduced));
    cleanups.push(initOracle());
  } catch (error) {
    dispose();
    throw error;
  }
  window.addEventListener('pagehide', dispose, { signal: listeners.signal });
  document.addEventListener('astro:before-swap', dispose, { signal: listeners.signal });
  return dispose;
}
// A bfcache restoration does not execute the page script again.
window.addEventListener('pageshow', (event) => {
  if (event.persisted && document.querySelector('.about-shell')) initAboutEffects();
});
