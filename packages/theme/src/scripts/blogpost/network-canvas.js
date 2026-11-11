import { mountAiNetwork } from '../../effects/ai-background/ai-network.js';
// Article orchestration retains idle startup and window-driven sizing.
export function initNetworkCanvas(prefersReducedMotion) {
  return mountAiNetwork(document.querySelector('.ai-network-canvas'), {
    reducedMotion: prefersReducedMotion,
    observeResize: false,
  });
}
