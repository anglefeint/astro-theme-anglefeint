import { playPassage } from '../matrix-passage/player.js';
import { randomPassagePalette } from '../matrix-passage/palettes.js';
import '../../styles/matrix-font.css';
import '../../styles/home-passage.css';

export function initOracle() {
  const button = document.querySelector('[data-oracle]');
  if (!button) return;
  const listeners = new AbortController();
  let disposed = false;
  // Canvas textures need the real glyph font before their one-time rasterization.
  const fontReady = document.fonts.load('22px "Matrix Code NFI"').catch(() => {});
  let starting = false;
  let previousPalette;
  let closePlayer;
  let previousOverflow;
  let siblings = [];
  const close = () => {
    if (!closePlayer) return;
    closePlayer();
    closePlayer = undefined;
    document.removeEventListener('keydown', keyboard, true);
    document.body.style.overflow = previousOverflow;
    siblings.forEach(([element, inert]) => {
      element.inert = inert;
    });
    siblings = [];
    button.focus({ preventScroll: true });
  };
  const dismiss = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    close();
  };
  const keyboard = (event) => {
    if (event.key === 'Escape') dismiss(event);
    else if (event.key === 'Tab') {
      event.preventDefault();
      const overlay = document.querySelector('.oracle-passage');
      const exit = overlay?.querySelector('.passage-exit');
      (document.activeElement === exit ? overlay : exit)?.focus();
    }
  };
  button.addEventListener(
    'click',
    async (event) => {
      if (closePlayer || starting) return;
      starting = true;
      const palette = randomPassagePalette(Math.random, previousPalette);
      previousPalette = palette;
      await fontReady;
      if (disposed) return;
      try {
        closePlayer = playPassage({
          trigger: button,
          event,
          palette,
          explore: true,
          reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
        });
        const exit = document.createElement('button');
        exit.type = 'button';
        exit.className = 'passage-exit';
        exit.textContent = '×';
        exit.setAttribute(
          'aria-label',
          document.querySelector('.hacker-modal-close')?.getAttribute('aria-label') || 'Close'
        );
        exit.addEventListener('click', dismiss);
        document.querySelector('.oracle-passage')?.append(exit);
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        siblings = [...document.body.children]
          .filter((element) => !element.classList.contains('oracle-passage'))
          .map((element) => [element, element.inert]);
        siblings.forEach(([element]) => {
          element.inert = true;
        });
        document.addEventListener('keydown', keyboard, true);
      } catch {
        // Keep About usable on devices without WebGL.
        button.focus({ preventScroll: true });
      } finally {
        starting = false;
      }
    },
    { signal: listeners.signal }
  );
  return () => {
    disposed = true;
    listeners.abort();
    close();
  };
}
