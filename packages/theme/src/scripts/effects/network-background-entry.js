import { mountNetworkBackground } from './network-background.js';

let currentCleanup;
export function initNetworkBackgrounds() {
  currentCleanup?.();
  const stops = [];
  for (const svg of document.querySelectorAll('[data-network-background]')) {
    try {
      stops.push(mountNetworkBackground(svg));
    } catch (error) {
      console.warn('Network background unavailable.', error);
    }
  }
  if (!stops.length) return;
  const dispose = () => {
    window.removeEventListener('pagehide', dispose);
    stops.forEach((stop) => stop());
    if (currentCleanup === dispose) currentCleanup = undefined;
  };
  currentCleanup = dispose;
  window.addEventListener('pagehide', dispose, { once: true });
}
