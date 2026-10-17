// Shared window behavior: no decoder, keyboard, Oracle or tool-specific dependencies.
export function createWindowController(overlay, { onClose = () => {} } = {}) {
  const listeners = new AbortController(),
    { signal } = listeners;
  const modal = overlay.querySelector('[role="dialog"]');
  const body = overlay.querySelector('.hacker-modal-body');
  const collapse = overlay.querySelector('[data-window-collapse]');
  const expand = overlay.querySelector('[data-window-expand]');
  let trigger;
  const focusable = () =>
    Array.from(
      overlay.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.getClientRects().length && el.getAttribute('aria-hidden') !== 'true');
  function setState(collapsed = false, expanded = false) {
    overlay.dispatchEvent(new Event('window:geometry'));
    body.hidden = collapsed;
    modal.classList.toggle('is-collapsed', collapsed);
    modal.classList.toggle('is-expanded', expanded);
    for (const [button, active] of [
      [collapse, collapsed],
      [expand, expanded],
    ]) {
      if (!button) continue;
      const label = active ? button.dataset.restoreLabel : button.dataset.label;
      button.setAttribute('aria-label', label);
      button.title = label;
    }
    collapse?.setAttribute('aria-expanded', String(!collapsed));
    expand?.setAttribute('aria-pressed', String(expanded));
  }
  function close() {
    if (!overlay.classList.contains('open')) return;
    onClose();
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    setState();
    if (trigger?.isConnected) trigger.focus();
  }
  function open() {
    trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setState();
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      if (overlay.classList.contains('open') && !overlay.contains(document.activeElement))
        focusable()[0]?.focus();
    });
  }
  overlay
    .querySelectorAll('[data-window-close], .hacker-modal-close')
    .forEach((button) => button.addEventListener('click', close, { signal }));
  collapse?.addEventListener(
    'click',
    () => setState(!body.hidden, modal.classList.contains('is-expanded')),
    { signal }
  );
  expand?.addEventListener(
    'click',
    () => setState(false, !modal.classList.contains('is-expanded')),
    { signal }
  );
  overlay.addEventListener(
    'click',
    (event) => {
      if (event.target === overlay) close();
    },
    { signal }
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (!overlay.classList.contains('open')) return;
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const elements = focusable(),
        index = elements.indexOf(document.activeElement);
      if (!elements.length) return;
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        elements.at(-1).focus();
      } else if (!event.shiftKey && (index < 0 || index === elements.length - 1)) {
        event.preventDefault();
        elements[0].focus();
      }
    },
    { signal }
  );
  window.addEventListener('pagehide', close, { signal });
  return {
    open,
    close,
    dispose() {
      close();
      listeners.abort();
    },
  };
}
