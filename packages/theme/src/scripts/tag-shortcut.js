import { selectVisualVariant } from '../utils/visual-variant.js';
import { applyNeonVariant, NEON_COLOR_COUNT } from './effects/neon-palette.js';

export function initTagShortcut() {
  for (const link of document.querySelectorAll('[data-tag-shortcut]')) {
    if (link.hasAttribute('data-color-ready')) continue;
    link.setAttribute('data-color-ready', '');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let timer;
    let suspended = false;
    const change = () => {
      // Sample among the other eight colors so every tick visibly changes color.
      let next = selectVisualVariant({ count: current ? NEON_COLOR_COUNT - 1 : NEON_COLOR_COUNT });
      if (current && next >= current) next += 1;
      current = next;
      applyNeonVariant(link, current);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = undefined;
    };
    const sync = () => {
      stop();
      if (
        !suspended &&
        !document.hidden &&
        !motion.matches &&
        !link.matches(':hover, :focus-within')
      ) {
        timer = window.setInterval(change, 3000);
      }
    };
    change();
    link.addEventListener('pointerenter', stop);
    link.addEventListener('pointerleave', sync);
    link.addEventListener('focusin', stop);
    link.addEventListener('focusout', () => queueMicrotask(sync));
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    window.addEventListener('pagehide', () => {
      suspended = true;
      stop();
    });
    window.addEventListener('pageshow', () => {
      suspended = false;
      sync();
    });
    sync();
  }
}
