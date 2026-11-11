import './hidden-signal.css';

// One selection listener per group, preserving independent signals and native selection.
export function mountHiddenSignals(elements, { signal } = {}) {
  const items = Array.from(elements).filter((element) => element instanceof HTMLElement);
  const events = new AbortController();
  const owned = items.map((element) => !element.hasAttribute('data-hidden-signal'));
  items.forEach((element) => element.setAttribute('data-hidden-signal', ''));
  const sync = () => {
    const selection = document.getSelection();
    for (const item of items) {
      let selected = false;
      if (selection && !selection.isCollapsed) {
        for (let index = 0; index < selection.rangeCount; index++) {
          if (selection.getRangeAt(index).intersectsNode(item)) {
            selected = true;
            break;
          }
        }
      }
      item.toggleAttribute('data-selected', selected);
    }
  };
  document.addEventListener('selectionchange', sync, { signal: events.signal });
  window.addEventListener('pageshow', sync, { signal: events.signal });
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    events.abort();
    signal?.removeEventListener('abort', dispose);
    items.forEach((element, index) => {
      element.removeAttribute('data-selected');
      if (owned[index]) element.removeAttribute('data-hidden-signal');
    });
  };
  signal?.addEventListener('abort', dispose, { once: true });
  if (signal?.aborted) dispose();
  else sync();
  return dispose;
}

export function mountHiddenSignal(element, { text, signal } = {}) {
  if (!(element instanceof HTMLElement)) return () => {};
  if (text !== undefined) element.textContent = String(text);
  return mountHiddenSignals([element], { signal });
}
