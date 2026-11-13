import { initHeroCanvas } from './hero-canvas.js';
import { initNetworkCanvas } from './network-canvas.js';
import { initPostInteractions } from './interactions.js';
import { initRedQueenTv } from './red-queen-tv.js';
import { createEffectScope, mountOptionalEffect } from '../effects/lifecycle.js';

/** Replace only motion-dependent resources; reading controls keep their state. */
export function initArticleMotion() {
  const scope = createEffectScope('article-motion-preference');
  const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let motion, reduced;
  const sync = () => {
    const next = !!preference?.matches;
    if (scope.disposed || (motion && next === reduced)) return;
    motion?.dispose();
    reduced = next;
    const group = createEffectScope('article-motion');
    motion = group;
    const mount = (label, init) => mountOptionalEffect(group, label, () => init(next));
    mount('hero', initHeroCanvas);
    mount('interactions', initPostInteractions);
    const startNetwork = () => mount('network', initNetworkCanvas);
    const startTv = () => mount('red queen', initRedQueenTv);
    if (typeof window.requestIdleCallback === 'function') {
      group.requestIdleCallback(
        () => {
          startNetwork();
          group.requestIdleCallback(startTv, { timeout: 2200 });
        },
        { timeout: 1200 }
      );
    } else {
      const afterLoad = () => {
        group.setTimeout(startNetwork, 120);
        group.setTimeout(startTv, 460);
      };
      if (document.readyState === 'complete') afterLoad();
      else group.listen(window, 'load', afterLoad, { once: true });
    }
  };
  scope.add(() => motion?.dispose());
  try {
    if (preference) scope.listen(preference, 'change', sync);
    // A cached page may miss preference events while its document is frozen.
    scope.listen(window, 'pageshow', sync);
    sync();
  } catch (error) {
    scope.dispose();
    throw error;
  }
  return scope.dispose;
}
