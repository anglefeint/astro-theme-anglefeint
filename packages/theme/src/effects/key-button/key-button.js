import './key-button.css';
const instances = new WeakMap();

// Only the key animation lives here. The owner decides what unlocking opens.
export function mountKeyButton(button, { duration = 600, onStart, onUnlock, signal } = {}) {
  if (!(button instanceof HTMLButtonElement)) return;
  if (instances.has(button)) return instances.get(button);
  const events = new AbortController();
  const milliseconds = Number.isFinite(duration) ? Math.max(0, duration) : 600;
  const previousDuration = button.style.getPropertyValue('--key-duration');
  button.style.setProperty('--key-duration', `${milliseconds}ms`);
  button.setAttribute('data-key-button', '');
  let timer,
    disposed = false;
  const reset = () => {
    clearTimeout(timer);
    timer = undefined;
    button.removeAttribute('data-key-state');
  };
  const finish = () => {
    timer = undefined;
    if (disposed) return;
    button.dataset.keyState = 'unlocked';
    onUnlock?.();
  };
  button.addEventListener(
    'click',
    () => {
      if (disposed || button.dataset.keyState === 'unlocking' || onStart?.() === false) return;
      reset();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
      else {
        button.dataset.keyState = 'unlocking';
        timer = setTimeout(finish, milliseconds);
      }
    },
    { signal: events.signal }
  );
  const controller = {
    reset,
    dispose() {
      if (disposed) return;
      disposed = true;
      reset();
      events.abort();
      signal?.removeEventListener('abort', controller.dispose);
      if (previousDuration) button.style.setProperty('--key-duration', previousDuration);
      else button.style.removeProperty('--key-duration');
      instances.delete(button);
    },
  };
  instances.set(button, controller);
  signal?.addEventListener('abort', controller.dispose, { once: true });
  if (signal?.aborted) controller.dispose();
  return controller;
}
