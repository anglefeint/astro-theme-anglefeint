import { createMatrixCorridor } from '../matrix-corridor.js';
import { PASSAGE_DURATION_MS, SCREEN_EXPAND_MS } from './timeline.js';

// Shared overlay and animation clock; callers own navigation or exploration controls.
export function playPassage({
  trigger,
  event,
  palette = 'matrix',
  explore = false,
  reduced = false,
  onComplete,
}) {
  const overlay = document.createElement('div');
  overlay.className = `home-passage${explore ? ' oracle-passage' : ''}`;
  overlay.dataset.palette = palette;
  if (explore) {
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Oracle. Click or press Escape to return.');
    overlay.tabIndex = -1;
  } else overlay.setAttribute('aria-hidden', 'true');
  const bounds = trigger.getBoundingClientRect();
  const x = event.detail === 0 ? bounds.left + bounds.width / 2 : event.clientX;
  const y = event.detail === 0 ? bounds.top + bounds.height / 2 : event.clientY;
  const width = Math.min(96, innerWidth),
    height = Math.min(60, innerHeight);
  const left = Math.max(0, Math.min(innerWidth - width, x - width / 2));
  const top = Math.max(0, Math.min(innerHeight - height, y - height / 2));
  for (const [name, value] of Object.entries({
    top,
    right: innerWidth - left - width,
    bottom: innerHeight - top - height,
    left,
  }))
    overlay.style.setProperty(`--passage-inset-${name}`, `${value}px`);
  overlay.style.setProperty('--passage-expand-duration', `${SCREEN_EXPAND_MS}ms`);
  const canvas = document.createElement('canvas');
  overlay.append(canvas);
  document.body.append(overlay);
  let draw,
    frame = 0,
    closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    cancelAnimationFrame(frame);
    draw?.dispose?.();
    overlay.remove();
  };
  try {
    draw = createMatrixCorridor(canvas, palette);
    draw(reduced ? 1 : 0, 0);
    if (reduced) overlay.classList.add('is-static');
    else overlay.classList.add('is-revealing');
    if (explore) overlay.focus({ preventScroll: true });
    const start = performance.now();
    let last = -Infinity,
      completed = false;
    const tick = (now) => {
      if (closed) return;
      const elapsed = Math.max(0, now - start - SCREEN_EXPAND_MS);
      const progress = Math.min(1, elapsed / PASSAGE_DURATION_MS);
      if (now - last >= 1000 / 30 || (progress === 1 && !completed)) {
        draw(progress, (now - start) / 1000);
        last = now;
      }
      if (progress === 1 && !completed) {
        completed = true;
        onComplete?.();
      }
      if (!closed && (explore || !completed)) frame = requestAnimationFrame(tick);
    };
    if (!reduced) frame = requestAnimationFrame(tick);
  } catch (error) {
    close();
    throw error;
  }
  return close;
}
