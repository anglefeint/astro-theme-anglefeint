import { environmentLayers } from './layers.js';
import './environment.css';
const instances = new WeakMap();
export function mountCyberEnvironment(root, { sizing = 'container' } = {}) {
  if (!(root instanceof HTMLElement)) return;
  if (instances.has(root)) return instances.get(root);
  const layers = environmentLayers.map(([layer, className]) => {
    const element = document.createElement('div');
    element.className = className;
    element.dataset.cyberLayer = layer;
    element.dataset.sizing = sizing;
    element.setAttribute('aria-hidden', 'true');
    root.append(element);
    return element;
  });
  let disposed = false;
  const resume = () => {
    if (!disposed) layers.forEach((element) => element.removeAttribute('data-environment-paused'));
  };
  const controller = {
    start: resume,
    resume,
    pause() {
      if (!disposed)
        layers.forEach((element) => element.setAttribute('data-environment-paused', ''));
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      layers.forEach((element) => element.remove());
      instances.delete(root);
    },
  };
  instances.set(root, controller);
  return controller;
}
