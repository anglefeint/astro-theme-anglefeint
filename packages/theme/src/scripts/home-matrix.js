import { mountMatrixRain } from '../effects/matrix-rain/matrix-rain.js';

// Homepage adapter: selectors, theme configuration and chrome feedback stay here.
export function initHomeMatrix() {
  const canvas = document.getElementById('matrix-bg');
  return mountMatrixRain(canvas, {
    fps: canvas?.dataset.matrixFps ?? window.__ANGLEFEINT_MATRIX_FPS ?? 45,
    sizing: 'viewport',
    onPointerMove(event) {
      document.body.style.setProperty('--matrix-mx', `${event.clientX}px`);
      document.body.style.setProperty('--matrix-my', `${event.clientY}px`);
    },
  });
}
