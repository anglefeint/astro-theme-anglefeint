const pending = new Map();

// Keep successful styles for later activations; failed requests can be retried.
export function loadStylesheet(href) {
  if (pending.has(href)) return pending.get(href);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  const ready = new Promise((resolve, reject) => {
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener(
      'error',
      () => {
        pending.delete(href);
        link.remove();
        reject(new Error('Stylesheet could not load'));
      },
      { once: true }
    );
  });
  pending.set(href, ready);
  document.head.append(link);
  return ready;
}
