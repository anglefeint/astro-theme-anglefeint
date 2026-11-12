import { createEffectScope } from './effects/lifecycle.js';

// One binding per button; no article progress/toast selectors or animation loop.
export function bindBackToTop(button, { viewport = window, page = document } = {}) {
  const scope = createEffectScope('back-to-top');
  function update() {
    const visible = (viewport.scrollY || page.documentElement.scrollTop) > 400;
    button.classList.toggle('visible', visible);
    button.setAttribute('aria-hidden', String(!visible));
    button.tabIndex = visible ? 0 : -1;
  }
  scope.listen(viewport, 'scroll', update, { passive: true });
  scope.listen(viewport, 'resize', update, { passive: true });
  scope.listen(button, 'click', () => {
    const reduced = viewport.matchMedia('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });
  scope.add(() => {
    button.classList.remove('visible');
    button.setAttribute('aria-hidden', 'true');
    button.tabIndex = -1;
  });
  update();
  return scope.dispose;
}

let cleanup;
export function initBackToTop() {
  cleanup?.();
  const buttons = document.querySelectorAll('[data-back-to-top]');
  if (!buttons.length) return;
  const scope = createEffectScope('back-to-top-page');
  for (const button of buttons) scope.add(bindBackToTop(button));
  scope.listen(window, 'pagehide', scope.dispose, { once: true });
  cleanup = scope.dispose;
  return cleanup;
}
