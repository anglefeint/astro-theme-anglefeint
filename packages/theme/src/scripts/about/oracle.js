let playerModule;
const loadPlayer = () =>
  (playerModule ||= import('./oracle-player.js').catch((error) => {
    playerModule = undefined;
    throw error;
  }));

export function initOracle(load = loadPlayer) {
  const button = document.querySelector('[data-oracle]');
  if (!button) return;
  const listeners = new AbortController();
  let disposed = false;
  const warm = () => {
    void load()
      .then((player) => player.prepareFont())
      .catch(() => {});
  };
  button.addEventListener('pointerenter', warm, { signal: listeners.signal, once: true });
  button.addEventListener('focus', warm, { signal: listeners.signal, once: true });
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
      try {
        const { playPassage, randomPassagePalette, prepareFont } = await load();
        await prepareFont();
        if (disposed) return;
        const palette = randomPassagePalette(Math.random, previousPalette);
        previousPalette = palette;
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
        if (!disposed) button.focus({ preventScroll: true });
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
