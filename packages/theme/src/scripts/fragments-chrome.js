import { createEffectScope } from './effects/lifecycle.js';

let cleanup;

// Track wrapped/localized chrome without a scroll handler or animation loop.
export function initFragmentsChrome() {
  cleanup?.();
  const feed = document.querySelector('[data-fragments]');
  const heading = feed?.querySelector('.fragments-heading');
  const header = document.querySelector('body > header');
  if (!feed || !heading || !header) return;
  const scope = createEffectScope('fragments-chrome');
  const body = document.body;
  function update() {
    body.style.setProperty('--fragments-nav-height', `${header.getBoundingClientRect().height}px`);
    feed.style.setProperty(
      '--fragments-title-height',
      `${heading.getBoundingClientRect().height}px`
    );
  }
  const observer = new ResizeObserver(update);
  observer.observe(header);
  observer.observe(heading);
  scope.add(() => {
    observer.disconnect();
    body.style.removeProperty('--fragments-nav-height');
    feed.style.removeProperty('--fragments-title-height');
  });
  scope.listen(document, 'astro:before-swap', scope.dispose, { once: true });
  scope.listen(window, 'pagehide', scope.dispose, { once: true });
  update();
  cleanup = scope.dispose;
}
