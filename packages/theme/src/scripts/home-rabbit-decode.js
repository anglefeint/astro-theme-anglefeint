import { mountWhiteRabbit } from '../effects/white-rabbit/white-rabbit.js';
const instances = new WeakMap();

// Homepage policy: shuffled modes, article/archive triggers and one resize listener.
export function initHomeRabbitDecode() {
  const root = document.querySelector('.home-post-list');
  if (!root) return;
  if (instances.has(root)) return instances.get(root);
  const listeners = new AbortController();
  const rows = [
    ...document.querySelectorAll(
      '.home-post-record[data-decode], .home-archive-command[data-decode]'
    ),
  ];
  const modes = ['scatter', 'rain', 'rebuild', 'scan'];
  for (let i = modes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [modes[i], modes[j]] = [modes[j], modes[i]];
  }
  const controls = rows
    .map((row, index) => {
      row.dataset.decode = modes[index % modes.length];
      return mountWhiteRabbit(row, row.querySelector('[data-white-rabbit]'), {
        mode: row.dataset.decode,
      });
    })
    .filter(Boolean);
  let disposed = false;
  const resume = () => {
    if (!disposed) controls.forEach((control) => control.resume());
  };
  const controller = {
    start: resume,
    resume,
    pause() {
      controls.forEach((control) => control.pause());
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      listeners.abort();
      controls.forEach((control) => control.dispose());
      controls.length = 0;
      instances.delete(root);
    },
  };
  window.addEventListener('resize', () => controls.forEach((control) => control.reset()), {
    signal: listeners.signal,
  });
  instances.set(root, controller);
  return controller;
}
