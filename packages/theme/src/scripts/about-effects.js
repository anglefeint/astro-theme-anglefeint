import { initTerminalBackground } from './about/background.js';
import { initAboutInteractions } from './about/interactions.js';
import { initAboutModals } from './about/modals.js';
import { initAboutReadingUi } from './about/reading-ui.js';
import { isReducedMotion, readAboutRuntimeConfig } from './about/runtime.js';

export function initAboutEffects() {
  var runtimeConfig = readAboutRuntimeConfig();
  var prefersReducedMotion = isReducedMotion();
  initTerminalBackground(runtimeConfig, prefersReducedMotion);
  initAboutReadingUi(runtimeConfig, prefersReducedMotion);
  initAboutModals(runtimeConfig, prefersReducedMotion);
  initAboutInteractions(prefersReducedMotion);
}
