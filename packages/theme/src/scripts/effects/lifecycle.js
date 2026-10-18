// Page composition owns lifetimes; each effect registers only its own resources.
export function createEffectScope(label) {
  const controller = new AbortController();
  const cleanups = [];
  const timers = new Set();
  const frames = new Set();
  const idle = new Set();
  let disposed = false;
  const scope = {
    get disposed() {
      return disposed;
    },
    signal: controller.signal,
    add(cleanup) {
      if (typeof cleanup !== 'function') return;
      if (disposed) cleanup();
      else cleanups.push(cleanup);
    },
    listen(target, type, handler, options = {}) {
      target.addEventListener(type, handler, { ...options, signal: controller.signal });
    },
    setTimeout(callback, delay) {
      if (disposed) return 0;
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!disposed) callback();
      }, delay);
      timers.add(id);
      return id;
    },
    clearTimeout(id) {
      window.clearTimeout(id);
      timers.delete(id);
    },
    requestAnimationFrame(callback) {
      if (disposed) return 0;
      const id = window.requestAnimationFrame((time) => {
        frames.delete(id);
        if (!disposed) callback(time);
      });
      frames.add(id);
      return id;
    },
    cancelAnimationFrame(id) {
      window.cancelAnimationFrame(id);
      frames.delete(id);
    },
    requestIdleCallback(callback, options) {
      if (disposed) return 0;
      const id = window.requestIdleCallback((deadline) => {
        idle.delete(id);
        if (!disposed) callback(deadline);
      }, options);
      idle.add(id);
      return id;
    },
    cancelIdleCallback(id) {
      window.cancelIdleCallback(id);
      idle.delete(id);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      controller.abort();
      timers.forEach((id) => window.clearTimeout(id));
      frames.forEach((id) => window.cancelAnimationFrame(id));
      idle.forEach((id) => window.cancelIdleCallback(id));
      timers.clear();
      frames.clear();
      idle.clear();
      for (const cleanup of cleanups.reverse()) {
        try {
          cleanup();
        } catch (error) {
          console.warn(`[${label}] cleanup failed`, error);
        }
      }
      cleanups.length = 0;
    },
  };
  return scope;
}

export function mountOptionalEffect(scope, label, mount) {
  if (scope.disposed) return;
  try {
    const cleanup = mount();
    scope.add(cleanup);
    return cleanup;
  } catch (error) {
    console.warn(`[${label}] initialization failed`, error);
  }
}
