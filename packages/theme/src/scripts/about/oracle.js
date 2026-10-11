import { playPassage } from '../matrix-passage/player.js';
import { randomPassagePalette } from '../matrix-passage/palettes.js';
import '../../styles/matrix-font.css';
import '../../styles/home-passage.css';

export function initOracle() {
  const button = document.querySelector('[data-oracle]');
  if (!button) return;
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
    document.removeEventListener('click', dismiss, true);
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
    else if (event.key === 'Tab') event.preventDefault();
  };
  button.addEventListener('click', async (event) => {
    if (closePlayer || starting) return;
    starting = true;
    const palette = randomPassagePalette(Math.random, previousPalette);
    previousPalette = palette;
    await fontReady;
    try {
      closePlayer = playPassage({
        trigger: button,
        event,
        palette,
        explore: true,
        reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      siblings = [...document.body.children]
        .filter((element) => !element.classList.contains('oracle-passage'))
        .map((element) => [element, element.inert]);
      siblings.forEach(([element]) => {
        element.inert = true;
      });
      // This click has already passed document capture; only subsequent clicks dismiss.
      document.addEventListener('click', dismiss, true);
      document.addEventListener('keydown', keyboard, true);
    } catch {
      // Keep About usable on devices without WebGL.
      button.focus({ preventScroll: true });
    } finally {
      starting = false;
    }
  });
  window.addEventListener('pagehide', close);
}
