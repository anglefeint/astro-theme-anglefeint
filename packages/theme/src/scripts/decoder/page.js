import { createDecoderController } from './controller.js';
import { createDecoderClock } from './clock.js';
let cleanup;
export function initDecoderPage() {
  cleanup?.();
  const root = document.querySelector('[data-decoder-page]');
  if (!root) return;
  const data = JSON.parse(document.getElementById('decoder-page-labels').textContent);
  const clock = createDecoderClock();
  const controller = createDecoderController(root, data.decoder, clock, data.page);
  controller.start();
  cleanup = () => {
    controller.stop();
    clock.dispose();
  };
}
