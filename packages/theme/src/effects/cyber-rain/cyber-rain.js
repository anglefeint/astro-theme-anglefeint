// The owner supplies the root and optional random source; no route or dust dependency.
const instances = new WeakMap();
export function mountCyberRain(root, { random = Math.random } = {}) {
  if (!(root instanceof HTMLElement)) return;
  if (instances.has(root)) return instances.get(root);
  const drops = [];
  const rainTypes = ['normal', 'thin', 'fog', 'skew'];
  const rainCount = 48;

  for (let i = 0; i < rainCount; i += 1) {
    const type = rainTypes[i % rainTypes.length];
    const drop = document.createElement('div');
    drop.className = `cyber-rain-drop cyber-rain-drop--${type}`;
    const durationBase = type === 'thin' ? 1.1 : type === 'fog' || type === 'skew' ? 1.7 : 1.4;
    drop.style.left = `${(random() * 100).toFixed(3)}%`;
    drop.style.animationDelay = `${(-5 + random() * 6).toFixed(3)}s`;
    drop.style.animationDuration = `${(3.3 + random() * durationBase).toFixed(3)}s`;
    drop.style.opacity = String(type === 'fog' ? 0.12 + random() * 0.1 : 0.2 + random() * 0.25);
    root.append(drop);
    drops.push(drop);
  }

  let disposed = false;
  const resume = () => {
    if (!disposed) root.removeAttribute('data-rain-paused');
  };
  const controller = {
    start: resume,
    resume,
    pause() {
      if (!disposed) root.setAttribute('data-rain-paused', '');
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      drops.forEach((drop) => drop.remove());
      drops.length = 0;
      root.removeAttribute('data-rain-paused');
      instances.delete(root);
    },
  };
  instances.set(root, controller);
  return controller;
}
