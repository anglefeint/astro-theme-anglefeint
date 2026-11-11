import { FRAGMENT_ID } from '../utils/fragments';
import { createEffectScope } from './effects/lifecycle.js';

// Transport a one-hop guard across documents, even with storage disabled.
// It is removed immediately and never included in copied links.
const JUMP_PARAM = '_fragment_jump';
let currentCleanup;

export function initFragmentLinks() {
  currentCleanup?.();
  const root = document.querySelector('[data-fragments][data-fragment-index]');
  if (!(root instanceof HTMLElement)) return;
  const scope = createEffectScope('fragment-links');
  const labels = JSON.parse(root.dataset.fragmentLinkLabels);
  const feed = new URL(root.dataset.fragmentRoot, window.location.href);
  const indexURL = new URL(root.dataset.fragmentIndex, window.location.href);
  if (feed.origin !== window.location.origin || indexURL.origin !== feed.origin) return;
  const currentPage = Number(root.dataset.fragmentPage);
  const status = root.querySelector('[data-fragment-link-status]');
  const arrivalURL = new URL(window.location.href);
  let arrivalId = arrivalURL.searchParams.get(JUMP_PARAM);
  if (arrivalURL.searchParams.has(JUMP_PARAM)) {
    arrivalURL.searchParams.delete(JUMP_PARAM);
    window.history.replaceState(window.history.state, '', arrivalURL);
  }
  let indexPromise,
    sequence = 0,
    lastHref;
  const pendingCopies = new WeakSet();
  const copyTimers = new WeakMap();
  root.querySelectorAll('[data-fragment-copy]').forEach((button) => {
    button.hidden = false;
  });
  function hashId(hash) {
    if (!hash.startsWith('#')) return;
    const id = hash.slice(1);
    return FRAGMENT_ID.test(id) ? id : undefined;
  }
  const cardFor = (id) => root.querySelector(`[data-fragment-id="${id}"]`);
  function message(value) {
    if (scope.disposed) return;
    status.hidden = false;
    status.textContent = value;
    status.scrollIntoView({ block: 'nearest' });
  }
  function locate(card) {
    card.focus({ preventScroll: true });
    card.scrollIntoView({ block: 'start' });
  }
  function loadIndex() {
    if (!indexPromise) {
      const request = new AbortController();
      const abort = () => request.abort();
      scope.signal.addEventListener('abort', abort, { once: true });
      const timeout = scope.setTimeout(abort, 10000);
      indexPromise = fetch(indexURL.href, { signal: request.signal, cache: 'force-cache' })
        .then(async (response) => {
          if (!response.ok) throw new Error('Fragment index unavailable.');
          const data = await response.json();
          if (
            data?.version !== 1 ||
            !Number.isSafeInteger(data.totalPages) ||
            data.totalPages < 1 ||
            !data.pages ||
            typeof data.pages !== 'object' ||
            Array.isArray(data.pages)
          )
            throw new Error('Invalid fragment index.');
          return data;
        })
        .catch((error) => {
          indexPromise = undefined;
          throw error;
        })
        .finally(() => {
          scope.clearTimeout(timeout);
          scope.signal.removeEventListener('abort', abort);
        });
    }
    return indexPromise;
  }
  async function resolveHash() {
    if (scope.disposed || lastHref === window.location.href) return;
    lastHref = window.location.href;
    const token = ++sequence;
    status.hidden = true;
    status.textContent = '';
    const id = hashId(window.location.hash);
    if (!id) {
      arrivalId = null;
      return;
    }
    const card = cardFor(id);
    if (card) {
      arrivalId = null;
      locate(card);
      return;
    }
    // A stale/mismatched destination must never bounce back to another page.
    if (arrivalId === id) {
      arrivalId = null;
      message(labels.indexError);
      return;
    }
    arrivalId = null;
    try {
      const index = await loadIndex();
      if (scope.disposed || token !== sequence) return;
      if (!Object.hasOwn(index.pages, id)) {
        message(labels.missing);
        return;
      }
      const page = index.pages[id];
      if (
        !Number.isSafeInteger(page) ||
        page < 1 ||
        page > index.totalPages ||
        page === currentPage
      ) {
        message(labels.indexError);
        return;
      }
      const target = new URL(page === 1 ? './' : `${page}/`, feed);
      target.search = window.location.search;
      target.searchParams.set(JUMP_PARAM, id);
      target.hash = id;
      window.location.replace(target.href);
    } catch {
      if (!scope.disposed && token === sequence) message(labels.indexError);
    }
  }
  async function copy(button) {
    if (pendingCopies.has(button)) return;
    pendingCopies.add(button);
    const card = button.closest('[data-fragment-id]');
    const href = card.querySelector('[data-fragment-link]').href;
    const feedback = card.querySelector('[data-fragment-copy-feedback]');
    const live = card.querySelector('[data-fragment-copy-status]');
    scope.clearTimeout(copyTimers.get(button));
    button.removeAttribute('data-copied');
    button.setAttribute('aria-label', labels.copy);
    button.title = labels.copy;
    feedback.replaceChildren();
    feedback.hidden = true;
    live.textContent = '';
    try {
      await navigator.clipboard.writeText(href);
      if (scope.disposed) return;
      button.dataset.copied = '';
      button.setAttribute('aria-label', labels.copied);
      button.title = labels.copied;
      live.textContent = labels.copied;
      copyTimers.set(
        button,
        scope.setTimeout(() => {
          button.removeAttribute('data-copied');
          button.setAttribute('aria-label', labels.copy);
          button.title = labels.copy;
          live.textContent = '';
        }, 2000)
      );
    } catch {
      if (scope.disposed) return;
      button.removeAttribute('data-copied');
      live.textContent = labels.failed;
      const input = document.createElement('input');
      input.type = 'text';
      input.readOnly = true;
      input.value = href;
      input.setAttribute('aria-label', labels.copy);
      feedback.append(input);
      feedback.hidden = false;
      input.focus();
      input.select();
    } finally {
      pendingCopies.delete(button);
    }
  }
  scope.listen(root, 'click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('[data-fragment-copy]');
    if (button instanceof HTMLButtonElement) {
      void copy(button);
      return;
    }
    const link = event.target.closest('[data-fragment-link]');
    if (
      !(link instanceof HTMLAnchorElement) ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute('download')
    )
      return;
    const id = hashId(link.hash);
    if (!id || !cardFor(id)) return;
    event.preventDefault();
    // Keep the current list page; opening/copying the actual href remains stable.
    if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
    lastHref = undefined;
    void resolveHash();
  });
  scope.listen(window, 'hashchange', resolveHash);
  scope.listen(window, 'popstate', resolveHash);
  scope.listen(window, 'pagehide', scope.dispose, { once: true });
  scope.add(() => {
    root.querySelectorAll('[data-fragment-copy]').forEach((button) => {
      button.removeAttribute('data-copied');
      button.hidden = true;
      button.title = labels.copy;
      button.setAttribute('aria-label', labels.copy);
    });
    root.querySelectorAll('[data-fragment-copy-status]').forEach((node) => {
      node.textContent = '';
    });
    root.querySelectorAll('[data-fragment-copy-feedback]').forEach((node) => {
      node.replaceChildren();
      node.hidden = true;
    });
  });
  currentCleanup = scope.dispose;
  void resolveHash();
  return scope.dispose;
}
