import { createEffectScope } from './effects/lifecycle.js';
import { initAvatarReaction } from './avatar-reaction.js';

const instances = new WeakMap();

/**
 * The caller supplies the content root and optional header boundary.
 * @param {HTMLElement} root
 * @param {Element | null} header
 */
export function initFragmentSignal(root, header = null) {
  if (instances.has(root)) return instances.get(root);
  const disclosure = /** @type {HTMLDetailsElement | null} */ (
    root.matches?.('details') ? root : root.querySelector('details')
  );
  const trigger = root.querySelector('summary');
  const closeButton = /** @type {HTMLButtonElement | null} */ (
    root.querySelector('[data-fragment-signal-close]')
  );
  if (!disclosure || !trigger || !closeButton) return;
  const scope = createEffectScope('fragment signal');
  const reaction = /** @type {HTMLImageElement | null} */ (
    root.querySelector('img[data-avatar-reaction]')
  );
  if (reaction) {
    scope.add(initAvatarReaction(root, trigger, reaction));
  }
  const position = () => {
    if (header) {
      root.style.setProperty(
        '--fragment-signal-top',
        `${Math.max(0, Math.ceil(header.getBoundingClientRect().bottom)) + 12}px`
      );
    }
  };
  const close = (restoreFocus = false) => {
    disclosure.open = false;
    if (restoreFocus) trigger.focus();
  };
  scope.listen(disclosure, 'toggle', () => {
    if (disclosure.open) closeButton.focus();
  });
  scope.listen(closeButton, 'click', () => close(true));
  scope.listen(root, 'keydown', (event) => {
    if (event.key === 'Escape' && disclosure.open) close(true);
  });
  scope.listen(window, 'resize', position);
  scope.listen(window, 'pageshow', position);
  if (header && typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(position);
    observer.observe(header);
    scope.add(() => observer.disconnect());
  }
  const dispose = () => {
    scope.dispose();
    instances.delete(root);
  };
  scope.listen(window, 'pagehide', (event) => {
    if (!event.persisted) dispose();
  });
  scope.listen(document, 'astro:before-swap', dispose);
  position();
  instances.set(root, dispose);
  return dispose;
}
