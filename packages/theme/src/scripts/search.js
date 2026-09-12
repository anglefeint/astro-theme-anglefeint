for (const root of document.querySelectorAll('[data-search]')) {
  if (root.dataset.ready) continue;
  root.dataset.ready = 'true';
  const labels = JSON.parse(root.dataset.labels);
  const dialog = root.querySelector('dialog');
  const trigger = root.querySelector('[data-search-open]');
  const input = root.querySelector('input');
  const status = root.querySelector('[role="status"]');
  const results = root.querySelector('ol');
  const retry = root.querySelector('[data-search-retry]');
  const more = root.querySelector('[data-search-more]');
  const isDev = root.dataset.dev === 'true';
  let engine;
  let pendingEngine;
  let revision = 0;
  let matches = [];
  let shown = 0;
  let timer;
  let composing = false;
  let importAttempt = 0;

  async function loadEngine() {
    if (engine) return engine;
    if (!pendingEngine)
      pendingEngine = (async () => {
        const response = await fetch(`${root.dataset.bundle}anglefeint.json`);
        if (!response.ok) throw new Error('Missing search index');
        const { languages } = await response.json();
        if (
          !languages.some(
            (language) => language.toLowerCase() === document.documentElement.lang.toLowerCase()
          )
        ) {
          return { search: async () => ({ results: [] }) };
        }
        const url = `${root.dataset.bundle}pagefind.js?attempt=${importAttempt++}`;
        return import(/* @vite-ignore */ url);
      })()
        .then((value) => (engine = value))
        .finally(() => {
          pendingEngine = undefined;
        });
    return pendingEngine;
  }

  function failure(ticket) {
    if (ticket !== revision) return;
    status.textContent = labels.error;
    retry.hidden = false;
    more.hidden = true;
    results.setAttribute('aria-busy', 'false');
  }

  async function showNext(ticket) {
    more.hidden = true;
    results.setAttribute('aria-busy', 'true');
    try {
      const data = await Promise.all(matches.slice(shown, shown + 8).map((match) => match.data()));
      if (ticket !== revision) return;
      for (const item of data) {
        const url = new URL(item.url, window.location.href);
        if (url.origin !== window.location.origin) continue;
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = url.href;
        link.textContent = item.meta.title || item.url;
        const excerpt = document.createElement('p');
        // Only preserve Pagefind's highlights, never arbitrary markup from content.
        const parsed = new DOMParser().parseFromString(item.excerpt, 'text/html');
        for (const child of parsed.body.childNodes) {
          if (child.nodeName === 'MARK') {
            const mark = document.createElement('mark');
            mark.textContent = child.textContent;
            excerpt.append(mark);
          } else excerpt.append(document.createTextNode(child.textContent));
        }
        li.append(link, excerpt);
        results.append(li);
      }
      shown += data.length;
      status.textContent = matches.length
        ? labels.results.replace('{count}', String(matches.length))
        : labels.empty;
      more.hidden = shown >= matches.length;
      results.setAttribute('aria-busy', 'false');
    } catch {
      failure(ticket);
    }
  }

  async function run(ticket) {
    const term = input.value.trim();
    if (isDev || !term || ticket !== revision) return;
    status.textContent = labels.loading;
    try {
      const api = await loadEngine();
      if (ticket !== revision) return;
      const found = await api.search(term);
      if (ticket !== revision) return;
      matches = found?.results ?? [];
      shown = 0;
      await showNext(ticket);
    } catch {
      failure(ticket);
    }
  }

  function schedule(immediate = false) {
    clearTimeout(timer);
    const ticket = ++revision;
    results.replaceChildren();
    results.setAttribute('aria-busy', 'false');
    retry.hidden = true;
    more.hidden = true;
    status.textContent = isDev ? labels.dev : input.value.trim() ? labels.loading : labels.hint;
    if (!composing) timer = setTimeout(() => run(ticket), immediate ? 0 : 200);
  }
  trigger.addEventListener('click', () => {
    dialog.showModal();
    input.focus();
    schedule(true);
    const ticket = revision;
    if (!isDev) loadEngine().catch(() => failure(ticket));
  });
  root.querySelector('[data-search-close]').addEventListener('click', () => dialog.close());
  const isBackdrop = (event) => {
    const bounds = dialog.getBoundingClientRect();
    return (
      event.target === dialog &&
      (event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom)
    );
  };
  let pressedBackdrop = false;
  dialog.addEventListener('pointerdown', (event) => {
    pressedBackdrop = event.isPrimary && event.button === 0 && isBackdrop(event);
  });
  dialog.addEventListener('pointercancel', () => {
    pressedBackdrop = false;
  });
  dialog.addEventListener('click', (event) => {
    // A drag starting inside the dialog must not dismiss it on release outside.
    if (pressedBackdrop && isBackdrop(event)) dialog.close();
    pressedBackdrop = false;
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !event.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    pressedBackdrop = false;
    ++revision;
    clearTimeout(timer);
    trigger.focus();
  });
  root.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    schedule(true);
  });
  input.addEventListener('compositionstart', () => {
    composing = true;
  });
  input.addEventListener('compositionend', () => {
    composing = false;
    schedule();
  });
  input.addEventListener('input', () => schedule());
  retry.addEventListener('click', () => {
    engine = undefined;
    schedule(true);
    if (!input.value.trim()) loadEngine().catch(() => failure(revision));
  });
  more.addEventListener('click', () => showNext(revision));
}
