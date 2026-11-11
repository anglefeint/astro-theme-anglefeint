// Explicit root and optional random source; no rain or route dependency.
const instances = new WeakMap();
export function mountCyberDust(root, { random = Math.random } = {}) {
  if (!(root instanceof HTMLElement)) return;
  if (instances.has(root)) return instances.get(root);
  const particles = [];
  const dustCount = 22;

  for (let i = 0; i < dustCount; i += 1) {
    const particle = document.createElement('div');
    particle.className = 'cyber-dust-particle';
    const size = 4 + random() * 4;
    particle.style.left = `${(random() * 100).toFixed(3)}%`;
    particle.style.top = `${(random() * 100).toFixed(3)}%`;
    particle.style.width = `${size.toFixed(3)}px`;
    particle.style.height = `${size.toFixed(3)}px`;
    particle.style.animationDelay = `${(random() * 10).toFixed(3)}s`;
    particle.style.animationDuration = `${(8 + random() * 12).toFixed(3)}s`;
    root.append(particle);
    particles.push(particle);
  }

  let disposed = false;
  const resume = () => {
    if (!disposed) root.removeAttribute('data-dust-paused');
  };
  const controller = {
    start: resume,
    resume,
    pause() {
      if (!disposed) root.setAttribute('data-dust-paused', '');
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      particles.forEach((drop) => drop.remove());
      particles.length = 0;
      root.removeAttribute('data-dust-paused');
      instances.delete(root);
    },
  };
  instances.set(root, controller);
  return controller;
}
