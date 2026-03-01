import { initHeroCanvas } from './blogpost/hero-canvas.js';
import { initNetworkCanvas } from './blogpost/network-canvas.js';
import { initPostInteractions } from './blogpost/interactions.js';
import { initReadProgressAndBackToTop } from './blogpost/read-progress.js';
import { initRedQueenTv } from './blogpost/red-queen-tv.js';

function prefersReducedMotionEnabled() {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (_e) {
    return false;
  }
}

export function initBlogpostEffects() {
  var prefersReducedMotion = prefersReducedMotionEnabled();
  initReadProgressAndBackToTop(prefersReducedMotion);
  initNetworkCanvas(prefersReducedMotion);
  initHeroCanvas(prefersReducedMotion);
  initRedQueenTv(prefersReducedMotion);
  initPostInteractions(prefersReducedMotion);
}
