import { initHeroCanvas } from './blogpost/hero-canvas.js';
import { initCodeCopy } from './blogpost/code-copy.js';
import { initImagePreview } from './blogpost/image-preview.js';
import { initNetworkCanvas } from './blogpost/network-canvas.js';
import { initPostInteractions } from './blogpost/interactions.js';
import { initReadProgressAndBackToTop } from './blogpost/read-progress.js';
import { initRedQueenTv } from './blogpost/red-queen-tv.js';

import { createEffectScope, mountOptionalEffect } from './effects/lifecycle.js';

let disposePost;
export function initBlogpostEffects() {
  disposePost?.();
  const scope = createEffectScope('article');
  const reduced = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const mount = (label, init) => mountOptionalEffect(scope, label, () => init(reduced));
  mount('code copy', initCodeCopy);
  mount('image preview', initImagePreview);
  mount('reading progress', initReadProgressAndBackToTop);
  mount('hero', initHeroCanvas);
  mount('interactions', initPostInteractions);
  const startNetwork = () => mount('network', initNetworkCanvas);
  const startTv = () => mount('red queen', initRedQueenTv);
  if (typeof window.requestIdleCallback === 'function') {
    scope.requestIdleCallback(
      () => {
        startNetwork();
        scope.requestIdleCallback(startTv, { timeout: 2200 });
      },
      { timeout: 1200 }
    );
  } else {
    const afterLoad = () => {
      scope.setTimeout(startNetwork, 120);
      scope.setTimeout(startTv, 460);
    };
    if (document.readyState === 'complete') afterLoad();
    else scope.listen(window, 'load', afterLoad, { once: true });
  }
  const dispose = () => {
    scope.dispose();
    if (disposePost === dispose) disposePost = undefined;
  };
  disposePost = dispose;
  // Keep a cached document alive; its modules already pause on visibility changes.
  scope.listen(window, 'pagehide', (event) => {
    if (!event.persisted) dispose();
  });
  scope.listen(document, 'astro:before-swap', dispose);
  return dispose;
}
