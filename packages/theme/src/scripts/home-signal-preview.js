import { mountKeyButton } from '../effects/key-button/key-button.js';
// Interaction only: scene timing and rendering belong to the shared passage player.
export function initSignalPreview(signal) {
  const panel = document.querySelector('.home-signal-monitor');
  const viewport = panel?.querySelector('.home-signal-viewport');
  if (!viewport) return;
  const entrance = panel.querySelector('.home-signal-enter');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let proximityBounds = panel.getBoundingClientRect();
  let activated = false;
  let close,
    loading,
    timer = 0,
    idleTimer = 0,
    collapseTimer = 0,
    revision = 0,
    paused = false,
    pointerInside = false;
  const interested = () => activated && (pointerInside || panel.contains(document.activeElement));
  const release = () => {
    clearTimeout(idleTimer);
    idleTimer = 0;
    close?.();
    close = undefined;
  };
  const clear = (dispose = true) => {
    activated = false;
    key?.reset();
    delete panel.dataset.unlocking;
    delete panel.dataset.unlocked;
    revision++;
    clearTimeout(timer);
    timer = 0;
    clearTimeout(collapseTimer);
    close?.pause();
    if (dispose) release();
    else if (close) {
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(release, 15000);
    }
    delete panel.dataset.preview;
    if (entrance) entrance.inert = false;
    viewport.inert = true;
    if (dispose) delete panel.dataset.expanded;
    else
      collapseTimer = window.setTimeout(
        () => {
          if (!interested()) delete panel.dataset.expanded;
        },
        matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1000
      );
  };
  const show = () => {
    if (panel.hasAttribute('data-unlocking')) return;
    if (paused || !interested() || !panel.getClientRects().length) return;
    if (panel.hasAttribute('data-expanded') && (timer || panel.hasAttribute('data-preview')))
      return;
    clearTimeout(collapseTimer);
    clearTimeout(timer);
    clearTimeout(idleTimer);
    if (!panel.style.getPropertyValue('--signal-rest-width')) {
      const bounds = panel.getBoundingClientRect();
      panel.style.setProperty('--signal-rest-width', `${bounds.width}px`);
      panel.style.setProperty('--signal-rest-height', `${bounds.height}px`);
      // Commit numeric resting dimensions before transitioning away from intrinsic size.
      void panel.offsetWidth;
    }
    panel.dataset.expanded = '';
    const request = ++revision;
    timer = window.setTimeout(async () => {
      timer = 0;
      try {
        loading ??= import('./matrix-passage/player.js');
        const { playPassage } = await loading;
        if (signal.aborted || paused || request !== revision || !interested()) return;
        if (close) close.resume();
        else close = playPassage({ container: viewport, mode: 'corridor' });
        panel.dataset.preview = '';
        viewport.inert = false;
        if (document.activeElement === entrance)
          panel.querySelector('.home-signal-scroll')?.focus({ preventScroll: true });
        if (entrance) entrance.inert = true;
      } catch {
        clear();
      }
    }, 800);
  };
  const leave = () => {
    if (interested()) return;
    clear(false);
  };
  const options = { signal };
  document.addEventListener(
    'pointermove',
    (event) => {
      if (
        paused ||
        activated ||
        !fine.matches ||
        event.pointerType === 'touch' ||
        !proximityBounds.width
      ) {
        delete panel.dataset.near;
        return;
      }
      const dx = Math.max(
        proximityBounds.left - event.clientX,
        0,
        event.clientX - proximityBounds.right
      );
      const dy = Math.max(
        proximityBounds.top - event.clientY,
        0,
        event.clientY - proximityBounds.bottom
      );
      panel.toggleAttribute('data-near', dx * dx + dy * dy < 14400);
    },
    { signal, passive: true }
  );
  document.addEventListener(
    'pointerleave',
    () => {
      delete panel.dataset.near;
    },
    options
  );
  panel.addEventListener(
    'pointerenter',
    () => {
      pointerInside = true;
    },
    options
  );
  panel.addEventListener(
    'pointerleave',
    () => {
      pointerInside = false;
      if (activated) clear(false);
    },
    options
  );
  const key = mountKeyButton(entrance, {
    signal,
    onStart() {
      if (paused || activated) return false;
      activated = true;
      clearTimeout(collapseTimer);
      clearTimeout(idleTimer);
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) panel.dataset.unlocking = '';
    },
    onUnlock() {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) panel.dataset.unlocked = '';
      delete panel.dataset.unlocking;
      if (!signal.aborted && interested()) show();
    },
  });
  panel.addEventListener('focusout', leave, options);
  panel.addEventListener(
    'passage-door-opened',
    () => {
      if (panel.contains(document.activeElement))
        panel.querySelector('.home-signal-scroll')?.focus({ preventScroll: true });
    },
    options
  );
  window.addEventListener(
    'resize',
    () => {
      clear();
      panel.style.removeProperty('--signal-rest-width');
      panel.style.removeProperty('--signal-rest-height');
      proximityBounds = panel.getBoundingClientRect();
    },
    options
  );
  window.addEventListener('pagehide', () => clear(), options);
  return {
    pause() {
      paused = true;
      delete panel.dataset.near;
      clear(false);
    },
    resume() {
      paused = false;
      show();
    },
    dispose: clear,
  };
}
