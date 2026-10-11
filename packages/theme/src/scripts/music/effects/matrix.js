export function mount(root) {
  const abort = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const surface = document.createElement('div');
  surface.className = 'music-matrix-surface';
  surface.setAttribute('aria-hidden', 'true');
  surface.innerHTML =
    '<div class="music-matrix-reflection"></div><div class="music-matrix-ripple"></div>';
  root.append(surface);
  const reflection = surface.firstElementChild;
  const ripple = surface.lastElementChild;
  let state = { playing: false, visible: true };
  let frame = 0;
  let animation;
  let position = { x: 0, y: 0 };
  const on = (target, name, handler) =>
    target.addEventListener(name, handler, { signal: abort.signal });
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    animation?.cancel();
    root.removeAttribute('data-matrix-hover');
  };
  on(root, 'pointermove', (event) => {
    if (!state.visible || reduced.matches || !fine.matches || event.pointerType === 'touch') return;
    const rect = root.getBoundingClientRect();
    position = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    root.dataset.matrixHover = 'true';
    if (!frame)
      frame = requestAnimationFrame(() => {
        reflection.style.transform = `translate(${position.x - 110}px, ${position.y - 75}px)`;
        frame = 0;
      });
  });
  on(root, 'pointerleave', stop);
  on(root, 'click', (event) => {
    const button = event.target.closest('[data-action="play"]');
    if (!button || button.disabled || !state.visible || reduced.matches || state.playing) return;
    const rect = root.getBoundingClientRect();
    const target = button.getBoundingClientRect();
    const x = target.left + target.width / 2 - rect.left;
    const y = target.top + target.height / 2 - rect.top;
    ripple.style.left = `${x - 80}px`;
    ripple.style.top = `${y - 80}px`;
    animation?.cancel();
    animation = ripple.animate(
      [
        { transform: 'scale(0.1)', opacity: 0 },
        { transform: 'scale(0.5)', opacity: 0.7, offset: 0.15 },
        { transform: `scale(${Math.hypot(rect.width, rect.height) / 75})`, opacity: 0 },
      ],
      { duration: 1100, easing: 'cubic-bezier(.16,.65,.3,1)' }
    );
  });
  const refresh = () => {
    root.dataset.matrixPlaying = String(state.playing && state.visible && !reduced.matches);
    if (!state.visible || reduced.matches) stop();
  };
  on(reduced, 'change', refresh);
  on(window, 'blur', stop);
  return {
    setState(next) {
      state = next;
      refresh();
    },
    destroy() {
      stop();
      abort.abort();
      surface.remove();
      root.removeAttribute('data-matrix-playing');
    },
  };
}
