import { createFilesystem } from '../terminal/filesystem.js';
import { createTerminalSession } from '../terminal/session.js';
import { createTerminalLoader } from '../terminal/loader.js';
import { createTerminal } from '../terminal/controller.js';

// About owns activation/layout policy; terminal rendering is page-independent.
export function initTerminalBackground(runtimeConfig, prefersReducedMotion) {
  const canvas = document.querySelector('.hacker-bg-canvas');
  if (!canvas) return () => {};
  const listeners = new AbortController();
  const lines = runtimeConfig.effects?.backgroundLines;
  const config = runtimeConfig.terminal;
  const loader = createTerminalLoader({ signal: listeners.signal });
  let terminal;
  let reading = false;
  const session = config
    ? createTerminalSession({
        filesystem: createFilesystem(config.entries),
        cwd: config.cwd,
        labels: config.labels,
        readFile: (file) => loader.read(file),
      })
    : null;
  terminal = createTerminal({
    canvas,
    inputElement: document.querySelector('.terminal-backdrop__input'),
    outputElement: document.querySelector('.terminal-backdrop__log'),
    prompt: session?.prompt,
    labels: config?.labels,
    onModeChange: (mode) => {
      reading = mode === 'reader';
      canvas.closest('.terminal-backdrop')?.classList.toggle('terminal-backdrop--reading', reading);
      position();
    },
    onComplete: session ? (input) => session.complete(input) : undefined,
    acceptsWheel: (event) =>
      !(
        event.target instanceof Element &&
        event.target.closest(
          '.about-shell,header,footer,.hacker-modal-overlay,.music-deck,.hacker-sidebar,button,a,input,textarea'
        )
      ),
    onCommand: session
      ? async (input) => {
          const result = await session.execute(input);
          if (listeners.signal.aborted) return;
          return { ...result, prompt: session.prompt };
        }
      : undefined,
    lines: session ? [config.labels.hint] : Array.isArray(lines) ? lines : [],
    reducedMotion: prefersReducedMotion,
    signal: listeners.signal,
  });
  const position = () => {
    const header = document.querySelector('header');
    terminal.resize({
      y: reading ? 32 : Math.max(80, (header?.getBoundingClientRect().bottom || 56) + 26),
    });
  };
  position();
  // Startup uses the exact same JSON-backed command engine as user input.
  if (session) void terminal.run('pwd');
  const header = document.querySelector('header');
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(position) : null;
  if (header) observer?.observe(header);
  window.addEventListener('resize', position, { signal: listeners.signal, passive: true });
  document.addEventListener(
    'click',
    (event) => {
      const blocked =
        event.target instanceof Element &&
        event.target.closest(
          '.about-shell, header, footer, .music-deck, .hacker-sidebar, .hacker-modal-overlay, .oracle-passage, button, a, input, textarea, select, [contenteditable]'
        );
      terminal.setFocused(!blocked);
    },
    { signal: listeners.signal }
  );
  return () => {
    listeners.abort();
    observer?.disconnect();
    loader.dispose();
    terminal.dispose();
  };
}
