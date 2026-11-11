import './cursor.css';
const instances = new WeakMap();
export function mountCursor(element, { active = true, shape = 'block', period = 1000 } = {}) {
  if (!(element instanceof HTMLElement)) return;
  if (instances.has(element)) return instances.get(element);
  const names = ['data-effect-cursor', 'data-cursor-active', 'data-cursor-shape', 'aria-hidden'];
  const previous = names.map((name) => element.getAttribute(name));
  const oldPeriod = element.style.getPropertyValue('--cursor-period');
  element.setAttribute('data-effect-cursor', '');
  element.setAttribute('aria-hidden', 'true');
  element.dataset.cursorShape = shape;
  element.style.setProperty(
    '--cursor-period',
    `${Number.isFinite(period) ? Math.max(1, period) : 1000}ms`
  );
  const setActive = (value) => {
    element.dataset.cursorActive = String(Boolean(value));
  };
  setActive(active);
  let disposed = false;
  const controller = {
    setActive,
    dispose() {
      if (disposed) return;
      disposed = true;
      names.forEach((name, index) =>
        previous[index] === null
          ? element.removeAttribute(name)
          : element.setAttribute(name, previous[index])
      );
      if (oldPeriod) element.style.setProperty('--cursor-period', oldPeriod);
      else element.style.removeProperty('--cursor-period');
      instances.delete(element);
    },
  };
  instances.set(element, controller);
  return controller;
}
