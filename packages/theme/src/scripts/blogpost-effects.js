import { initHeroCanvas } from './blogpost/hero-canvas.js';
import { initNetworkCanvas } from './blogpost/network-canvas.js';
import { initPostInteractions } from './blogpost/interactions.js';
import { initReadProgressAndBackToTop } from './blogpost/read-progress.js';
import { initRedQueenTv } from './blogpost/red-queen-tv.js';

const NETWORK_FALLBACK_DELAY_MS = 120;
const RED_QUEEN_FALLBACK_DELAY_MS = 460;
const NETWORK_IDLE_TIMEOUT_MS = 1200;
const RED_QUEEN_IDLE_TIMEOUT_MS = 2200;

function prefersReducedMotionEnabled() {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (_e) {
    return false;
  }
}

export function initBlogpostEffects() {
  var prefersReducedMotion = prefersReducedMotionEnabled();
  var networkStarted = false;
  var redQueenStarted = false;

  function startNetworkCanvas() {
    if (networkStarted) return;
    networkStarted = true;
    initNetworkCanvas(prefersReducedMotion);
  }

  function startRedQueenTv() {
    if (redQueenStarted) return;
    if (!document.querySelector('.rq-tv-stage')) return;
    redQueenStarted = true;
    initRedQueenTv(prefersReducedMotion);
  }

  function scheduleDeferredStarts() {
    function fallbackSchedule() {
      function runAfterLoad() {
        setTimeout(startNetworkCanvas, NETWORK_FALLBACK_DELAY_MS);
        setTimeout(startRedQueenTv, RED_QUEEN_FALLBACK_DELAY_MS);
      }

      if (document.readyState === 'complete') runAfterLoad();
      else window.addEventListener('load', runAfterLoad, { once: true });
    }

    if (typeof window.requestIdleCallback !== 'function') {
      fallbackSchedule();
      return;
    }

    window.requestIdleCallback(
      function () {
        startNetworkCanvas();
        window.requestIdleCallback(
          function () {
            startRedQueenTv();
          },
          { timeout: RED_QUEEN_IDLE_TIMEOUT_MS }
        );
      },
      { timeout: NETWORK_IDLE_TIMEOUT_MS }
    );
  }

  initReadProgressAndBackToTop(prefersReducedMotion);
  initHeroCanvas(prefersReducedMotion);
  initPostInteractions(prefersReducedMotion);
  scheduleDeferredStarts();
}
