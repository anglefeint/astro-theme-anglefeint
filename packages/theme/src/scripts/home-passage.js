import { PASSAGE_FALLBACK_MS } from './matrix-passage/timeline.js';
import { playPassage } from './matrix-passage/player.js';
const instances = new WeakMap();

export function initHomePassage() {
  if (!document.body.classList.contains('page-home')) return;
  if (document.querySelector('.home-post-list')?.dataset.homePassageEnabled === 'false') return;
  const root = document.querySelector('.home-post-list');
  if (!root) return;
  if (instances.has(root)) return instances.get(root);
  const listeners = new AbortController();
  let paused = false,
    disposed = false;
  let state = 'idle';
  let closePlayer;
  let timer = 0;
  const reset = () => {
    clearTimeout(timer);
    closePlayer?.();
    closePlayer = undefined;
    state = 'idle';
  };
  const handleClick = (event) => {
    if (paused || disposed) return;
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (
      !link ||
      !event.currentTarget.contains(link) ||
      (event.currentTarget.matches('.home-post-list') && !link.matches('.home-post-title'))
    )
      return;
    const url = new URL(link.href, location.href);
    if (
      url.origin !== location.origin ||
      link.hasAttribute('download') ||
      (link.target && link.target !== '_self') ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    event.preventDefault();
    if (state !== 'idle') return;
    state = 'animating';
    const navigate = () => {
      if (state === 'navigating' || paused || disposed) return;
      state = 'navigating';
      clearTimeout(timer);
      location.assign(url.href);
    };
    timer = setTimeout(navigate, PASSAGE_FALLBACK_MS);
    try {
      closePlayer = playPassage({ trigger: link, event, palette: 'matrix', onComplete: navigate });
    } catch {
      navigate();
    }
  };
  root.addEventListener('click', handleClick, { signal: listeners.signal });
  document
    .querySelector('header a[data-home-passage]')
    ?.addEventListener('click', handleClick, { signal: listeners.signal });
  const resume = () => {
    if (!disposed) paused = false;
  };
  const pause = () => {
    paused = true;
    reset();
  };
  const controller = {
    start: resume,
    resume,
    pause,
    dispose() {
      if (disposed) return;
      pause();
      disposed = true;
      listeners.abort();
      instances.delete(root);
    },
  };
  instances.set(root, controller);
  return controller;
}
