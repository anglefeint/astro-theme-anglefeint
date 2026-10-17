export function createLifetime() {
  const listeners = new AbortController();
  const timers = new Set();
  const observers = new Set();
  const frames = new Set();
  let disposed = false;
  return {
    signal: listeners.signal,
    timeout(callback, delay) {
      if (disposed) return 0;
      const id = setTimeout(() => {
        timers.delete(id);
        if (!disposed) callback();
      }, delay);
      timers.add(id);
      return id;
    },
    observe(observer) {
      observers.add(observer);
      return observer;
    },
    frame(callback) {
      if (disposed) return 0;
      const id = requestAnimationFrame((now) => {
        frames.delete(id);
        if (!disposed) callback(now);
      });
      frames.add(id);
      return id;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      listeners.abort();
      timers.forEach(clearTimeout);
      timers.clear();
      frames.forEach(cancelAnimationFrame);
      frames.clear();
      observers.forEach((observer) => observer.disconnect());
      observers.clear();
    },
  };
}
