import { createLifetime } from './lifetime.js';

const MODES = ['normal', 'closed', 'minimized', 'maximized'];
const COMMANDS = ['open', 'close', 'minimize', 'maximize', 'restore'];

export function initAboutWindow() {
  const panel = document.querySelector('#about-reading-window');
  const bar = panel?.querySelector('.about-window-bar');
  const dock = document.querySelector('[data-about-restore]');
  const opener = document.querySelector('[data-about-open]');
  if (!panel || !bar || !dock || !opener)
    return { dispose() {}, command() {}, complete: (input) => input };
  const lifetime = createLifetime();
  const { signal } = lifetime;
  const key = `anglefeint:about-window:${location.pathname}`;
  let state = { mode: 'normal', scroll: 0, previous: 'normal' };
  let changing = false;
  let ownsFullscreen = false;
  let requestingFullscreen = false;
  let fullscreenOffset = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved?.version === 1 && MODES.includes(saved.mode)) {
      state = {
        mode: saved.mode === 'maximized' ? 'normal' : saved.mode,
        scroll: Number.isFinite(saved.scroll) ? Math.max(0, Math.min(saved.scroll, 1000000)) : 0,
        previous: 'normal',
      };
    }
  } catch {
    /* Storage may be unavailable; window controls still work. */
  }
  const visible = () => state.mode === 'normal' || state.mode === 'maximized';
  function persist() {
    try {
      // Browser fullscreen always needs a fresh user gesture, never a saved preference.
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          ...state,
          mode: state.mode === 'maximized' ? 'normal' : state.mode,
          previous: 'normal',
        })
      );
    } catch {
      /* Optional preference. */
    }
  }
  function render() {
    panel.hidden = state.mode === 'closed';
    panel.toggleAttribute('data-minimized', state.mode === 'minimized');
    panel.inert = !visible();
    if (visible()) panel.removeAttribute('aria-hidden');
    else panel.setAttribute('aria-hidden', 'true');
    dock.hidden = state.mode !== 'minimized';
    opener.hidden = state.mode !== 'closed';
    document.body.dataset.aboutWindow = state.mode;
    const maximize = panel.querySelector('[data-about-action="maximize"]');
    const maximized = state.mode === 'maximized';
    const label = maximized ? maximize.dataset.restoreLabel : maximize.dataset.expandLabel;
    maximize.setAttribute('aria-pressed', String(maximized));
    maximize.setAttribute('aria-label', label);
    maximize.title = `${label} · ${maximized ? 'restore' : 'maximize'}`;
    maximize.querySelector('span').textContent = maximized ? '↙' : '+';
  }
  function change(action, focus = false, scrollOverride) {
    if (Number.isFinite(scrollOverride)) state.scroll = scrollOverride;
    else if (visible() && state.mode !== 'maximized') state.scroll = window.scrollY;
    if (action === 'close') {
      state = { mode: 'closed', scroll: 0, previous: 'normal' };
    } else if (action === 'minimize') {
      if (!visible()) return;
      state.previous = 'normal';
      state.mode = 'minimized';
    } else if (action === 'maximize') {
      state.mode = 'maximized';
    } else if (action === 'open' || action === 'restore') {
      if (state.mode === 'minimized') state.mode = state.previous;
      else state.mode = 'normal';
    }
    const targetScroll = state.scroll;
    changing = true;
    render();
    persist();
    if (focus)
      (visible()
        ? panel.querySelector('[data-about-action="maximize"]')
        : state.mode === 'closed'
          ? opener
          : dock
      ).focus({
        preventScroll: true,
      });
    // Restore after layout changes, without an animated scroll or a new frame loop.
    lifetime.frame(() => {
      if (state.mode === 'maximized') {
        panel.scrollTo({ top: fullscreenOffset, behavior: 'instant' });
      } else {
        window.scrollTo({ top: state.mode === 'closed' ? 0 : targetScroll, behavior: 'instant' });
        state.scroll = visible() ? window.scrollY : targetScroll;
      }
      changing = false;
      persist();
    });
  }
  async function perform(action, focus = false) {
    if (requestingFullscreen) return false;
    if (action === 'maximize') {
      const root = panel;
      if (document.fullscreenElement === root && ownsFullscreen) return true;
      if (!document.fullscreenEnabled || !root.requestFullscreen) {
        panel.querySelector('[data-about-action="maximize"]').title = 'F11';
        return false;
      }
      const scroll = visible() ? window.scrollY : state.scroll;
      if (!visible()) change('open');
      fullscreenOffset = Math.max(0, scroll - (panel.getBoundingClientRect().top + window.scrollY));
      requestingFullscreen = true;
      ownsFullscreen = true;
      try {
        // Called directly from the click/terminal key event, before any await.
        await root.requestFullscreen({ navigationUI: 'hide' });
        if (signal.aborted) {
          if (document.fullscreenElement === root) void document.exitFullscreen().catch(() => {});
          return false;
        }
        if (document.fullscreenElement !== root) {
          ownsFullscreen = false;
          return false;
        }
        change('maximize', focus, scroll);
        return true;
      } catch {
        ownsFullscreen = false;
        if (!signal.aborted) {
          render();
          panel.querySelector('[data-about-action="maximize"]').title += ' · F11';
        }
        return false;
      } finally {
        requestingFullscreen = false;
      }
    }
    if (ownsFullscreen && document.fullscreenElement === panel) {
      const scroll = state.scroll;
      ownsFullscreen = false;
      try {
        await document.exitFullscreen();
      } catch {
        ownsFullscreen = document.fullscreenElement === panel;
        if (ownsFullscreen) return false;
      }
      if (!signal.aborted) change(action, focus, scroll);
    } else {
      change(action, focus);
    }
    return true;
  }
  function anchorTarget(hash = location.hash) {
    try {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      return target && panel.contains(target) ? target : null;
    } catch {
      return null;
    }
  }
  function revealAnchor(target) {
    if (ownsFullscreen && document.fullscreenElement)
      void document.exitFullscreen().catch(() => {});
    state.mode = 'normal';
    render();
    persist();
    lifetime.frame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
  bar.hidden = false;
  const initialTarget = anchorTarget();
  if (initialTarget) revealAnchor(initialTarget);
  else {
    render();
    if (state.mode !== 'closed' && state.scroll > 0) {
      const targetScroll = state.scroll;
      changing = true;
      lifetime.frame(() => {
        window.scrollTo({ top: targetScroll, behavior: 'instant' });
        changing = false;
      });
    }
  }
  panel.querySelectorAll('[data-about-action]').forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const action = button.dataset.aboutAction;
        void perform(
          action === 'maximize' && state.mode === 'maximized' ? 'restore' : action,
          true
        );
      },
      { signal }
    );
  });
  dock.addEventListener(
    'click',
    () => {
      void perform('restore', true);
    },
    { signal }
  );
  opener.addEventListener(
    'click',
    () => {
      void perform('open', true);
    },
    { signal }
  );
  document.addEventListener(
    'fullscreenchange',
    () => {
      if (!ownsFullscreen || document.fullscreenElement === panel) return;
      ownsFullscreen = false;
      // Escape/native browser exits must also restore the green button and page layout.
      if (state.mode === 'maximized') change('restore', true);
    },
    { signal }
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (
        event.key === 'Escape' &&
        !event.defaultPrevented &&
        ownsFullscreen &&
        document.fullscreenElement === panel
      ) {
        void perform('restore');
      }
    },
    { signal }
  );
  window.addEventListener(
    'scroll',
    () => {
      if (visible() && state.mode !== 'maximized' && !changing) state.scroll = window.scrollY;
    },
    { passive: true, signal }
  );
  window.addEventListener('pagehide', persist, { signal });
  // Native history restoration may run after module initialization on reload.
  window.addEventListener(
    'pageshow',
    () => {
      const target = anchorTarget();
      if (target) revealAnchor(target);
    },
    { signal }
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) persist();
    },
    { signal }
  );
  window.addEventListener(
    'hashchange',
    () => {
      const target = anchorTarget();
      if (target) revealAnchor(target);
    },
    { signal }
  );
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      if (
        !url.hash &&
        !visible() &&
        link.closest('header') &&
        (!link.target || link.target === '_self')
      ) {
        event.preventDefault();
        void perform('open', true);
        return;
      }
      const target = anchorTarget(url.hash);
      if (target && !visible()) revealAnchor(target);
    },
    { signal }
  );
  return {
    async command(input) {
      const command = input.trim();
      if (!COMMANDS.includes(command)) return;
      const performed = await perform(command);
      return {
        lines: [
          performed === false ? `${command} → F11` : command === 'close' ? 'close → open' : command,
        ],
      };
    },
    complete(input) {
      if (!input || /\s/.test(input)) return input;
      const matches = COMMANDS.filter((command) => command.startsWith(input));
      return matches.length === 1 ? matches[0] : input;
    },
    dispose() {
      persist();
      lifetime.dispose();
      if (ownsFullscreen && document.fullscreenElement === panel)
        void document.exitFullscreen().catch(() => {});
      ownsFullscreen = false;
      panel.hidden = false;
      panel.removeAttribute('data-minimized');
      panel.removeAttribute('aria-hidden');
      panel.inert = false;
      bar.hidden = true;
      dock.hidden = true;
      opener.hidden = true;
      delete document.body.dataset.aboutWindow;
    },
  };
}
