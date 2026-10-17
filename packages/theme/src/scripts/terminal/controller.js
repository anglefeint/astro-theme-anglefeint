import { createTerminalReader } from './reader.js';
import { createTerminalRenderer } from './renderer.js';

// Input/transcript lifecycle; commands and document readers are injected by the host.
export function createTerminal({
  canvas,
  inputElement,
  outputElement,
  lines = [],
  prompt = '~ $ ',
  fontSize = 14,
  lineHeight = 21,
  fontFamily = 'Consolas, "SFMono-Regular", "Liberation Mono", monospace',
  padding = { x: 24, y: 22 },
  colors = {},
  reducedMotion = false,
  interactive = true,
  maxInputLength = 512,
  maxHistory = 50,
  onCommand,
  onComplete,
  onModeChange = () => {},
  acceptsWheel = () => true,
  labels = {},
  signal,
} = {}) {
  const renderer = createTerminalRenderer(canvas, {
    fontSize,
    lineHeight,
    fontFamily,
    padding,
    colors: {
      background: '#08080a',
      command: 'rgba(232, 197, 135, 0.86)',
      message: 'rgba(190, 188, 181, 0.72)',
      listing: 'rgba(150, 150, 160, 0.58)',
      text: 'rgba(171, 171, 180, 0.64)',
      cursor: 'rgba(239, 189, 102, 0.9)',
      ...colors,
    },
  });
  if (!renderer || signal?.aborted) {
    if (inputElement) inputElement.disabled = true;
    renderer?.dispose();
    return { dispose() {}, setFocused() {}, resize() {}, async run() {} };
  }
  if (inputElement) inputElement.disabled = !interactive;
  const listeners = new AbortController();
  const { signal: ownSignal } = listeners;
  let disposed = false,
    focused = false,
    input = '',
    commands = [],
    timer = 0;
  let cursorVisible = true,
    transcript = [...lines].map(String),
    scroll = 0,
    maxScroll = 0,
    busy = false,
    historyIndex = 0;
  let currentPrompt = prompt;
  let reader;
  const inputLabel = inputElement?.getAttribute('aria-label');
  function closeReader() {
    reader = undefined;
    input = '';
    if (inputElement) {
      inputElement.value = '';
      inputElement.setAttribute('aria-label', inputLabel || '');
    }
    if (outputElement) outputElement.textContent = transcript.slice(-20).join('\n').slice(-4096);
    onModeChange('terminal');
    draw();
  }
  function append(next) {
    transcript = [...transcript, ...next.map(String)].slice(-500);
    let remaining = 65536;
    const bounded = [];
    for (const line of transcript.reverse()) {
      if (remaining <= 0) break;
      const value = line.slice(0, Math.min(4096, remaining));
      bounded.push(value);
      remaining -= value.length || 1;
    }
    transcript = bounded.reverse();
    if (outputElement) outputElement.textContent = transcript.slice(-20).join('\n').slice(-4096);
  }
  function draw() {
    if (!disposed)
      maxScroll = renderer.draw({
        lines: transcript,
        prompt: currentPrompt,
        input: busy ? labels.loading || '...' : input,
        cursor: cursorVisible && !busy,
        scroll,
        reader,
      });
  }
  function stopBlink() {
    clearTimeout(timer);
    timer = 0;
  }
  function blink() {
    stopBlink();
    if (disposed || reducedMotion || document.hidden) return;
    timer = setTimeout(() => {
      cursorVisible = !cursorVisible;
      draw();
      blink();
    }, 530);
  }
  function resize(nextPadding) {
    if (!disposed) {
      renderer.resize(nextPadding);
      draw();
    }
  }
  function setFocused(value) {
    if (disposed) return;
    focused = interactive && Boolean(value);
    if (focused) inputElement?.focus({ preventScroll: true });
    else if (inputElement && document.activeElement === inputElement) inputElement.blur();
  }
  async function run(command) {
    if (disposed || busy) return;
    command = String(command).slice(0, maxInputLength);
    if (reader) {
      if (reader.execute(command).exit) closeReader();
      input = '';
      if (inputElement) inputElement.value = '';
      draw();
      return;
    }
    append([currentPrompt + command]);
    if (command.trim()) {
      commands.push(command);
      commands = commands.slice(-maxHistory);
    }
    historyIndex = commands.length;
    input = '';
    if (inputElement) inputElement.value = '';
    scroll = 0;
    busy = true;
    draw();
    try {
      const result = await onCommand?.(command);
      if (disposed) return;
      if (result?.clear) {
        transcript = [];
        if (outputElement) outputElement.textContent = '';
      }
      if (result?.lines) append(result.lines);
      if (result?.prompt) currentPrompt = result.prompt;
      if (result?.reader) {
        reader = createTerminalReader(result.reader, labels);
        if (inputElement)
          inputElement.setAttribute('aria-label', labels.readerCommand || inputLabel || '');
        if (outputElement)
          outputElement.textContent = `${reader.title}\n${result.reader.content.slice(0, 4096)}\n${reader.hint}`;
        onModeChange('reader');
      }
    } catch {
      if (!disposed) append([labels.failed || 'Command failed.']);
    } finally {
      busy = false;
      draw();
    }
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    stopBlink();
    listeners.abort();
    observer?.disconnect();
    transcript.length = commands.length = 0;
    input = '';
    if (inputElement) inputElement.value = '';
    if (outputElement) outputElement.textContent = '';
    if (reader) {
      reader = undefined;
      onModeChange('terminal');
    }
    renderer.dispose();
  }
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(() => resize()) : null;
  observer?.observe(canvas);
  window.addEventListener('resize', () => resize(), { signal: ownSignal, passive: true });
  document.addEventListener(
    'visibilitychange',
    () => {
      stopBlink();
      if (!document.hidden) {
        draw();
        blink();
      }
    },
    { signal: ownSignal }
  );
  if (interactive) {
    inputElement?.addEventListener(
      'focus',
      () => {
        focused = true;
        draw();
      },
      { signal: ownSignal }
    );
    inputElement?.addEventListener(
      'blur',
      () => {
        focused = false;
      },
      { signal: ownSignal }
    );
    inputElement?.addEventListener(
      'input',
      () => {
        if (busy) {
          inputElement.value = '';
          return;
        }
        input = inputElement.value.replace(/[\r\n]+/gu, ' ').slice(0, maxInputLength);
        if (inputElement.value !== input) inputElement.value = input;
        scroll = 0;
        cursorVisible = true;
        draw();
      },
      { signal: ownSignal }
    );
    document.addEventListener(
      'keydown',
      (event) => {
        if (
          !focused ||
          event.defaultPrevented ||
          event.isComposing ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey
        )
          return;
        if (
          event.target !== inputElement &&
          event.target instanceof Element &&
          event.target.closest(
            'input, textarea, select, button, a, [contenteditable], [role="dialog"]'
          )
        )
          return;
        if (busy) {
          if (event.target === inputElement) event.preventDefault();
          return;
        }
        if (reader) {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeReader();
            return;
          }
          let amount;
          if (!input && ['ArrowUp', 'k'].includes(event.key)) amount = -1;
          else if (!input && ['ArrowDown', 'j'].includes(event.key)) amount = 1;
          else if (event.key === 'PageUp') amount = -renderer.pageSize;
          else if (event.key === 'PageDown') amount = renderer.pageSize;
          else if (!input && event.key === 'Home') amount = -maxScroll;
          else if (!input && event.key === 'End') amount = maxScroll;
          if (amount !== undefined) {
            event.preventDefault();
            reader.move(amount, maxScroll);
            draw();
            return;
          }
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          void run(input);
          return;
        }
        if (
          event.target === inputElement &&
          ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
        )
          return;
        if (event.target === inputElement && event.key.length === 1) return;
        if (event.key === 'Backspace') input = Array.from(input).slice(0, -1).join('');
        else if (event.key === 'ArrowUp') {
          historyIndex = Math.max(0, historyIndex - 1);
          input = commands[historyIndex] || '';
        } else if (event.key === 'ArrowDown') {
          historyIndex = Math.min(commands.length, historyIndex + 1);
          input = commands[historyIndex] || '';
        } else if (event.key === 'Tab' && onComplete)
          input = onComplete(input).slice(0, maxInputLength);
        else if (event.key.length === 1 && input.length < maxInputLength) input += event.key;
        else return;
        event.preventDefault();
        if (inputElement) inputElement.value = input;
        cursorVisible = true;
        scroll = 0;
        draw();
      },
      { signal: ownSignal }
    );
    document.addEventListener(
      'paste',
      (event) => {
        if (
          !focused ||
          busy ||
          (event.target instanceof Element &&
            event.target.closest('input,textarea,[contenteditable],[role="dialog"]'))
        )
          return;
        const text = event.clipboardData?.getData('text/plain');
        if (!text) return;
        event.preventDefault();
        input = (input + text.replace(/[\r\n]+/gu, ' ')).slice(0, maxInputLength);
        scroll = 0;
        draw();
      },
      { signal: ownSignal }
    );
    let touchY;
    canvas.addEventListener?.(
      'pointerdown',
      (event) => {
        if (!reader || event.pointerType !== 'touch') return;
        touchY = event.clientY;
        canvas.setPointerCapture?.(event.pointerId);
      },
      { signal: ownSignal }
    );
    canvas.addEventListener?.(
      'pointermove',
      (event) => {
        if (!reader || touchY === undefined || event.pointerType !== 'touch') return;
        const amount = Math.trunc((touchY - event.clientY) / lineHeight);
        if (amount) {
          reader.move(amount, maxScroll);
          touchY = event.clientY;
          draw();
        }
      },
      { signal: ownSignal }
    );
    for (const type of ['pointerup', 'pointercancel'])
      canvas.addEventListener?.(
        type,
        () => {
          touchY = undefined;
        },
        { signal: ownSignal }
      );
    document.addEventListener(
      'wheel',
      (event) => {
        if (!focused || !maxScroll || event.ctrlKey) return;
        if (!acceptsWheel(event)) return;
        if (reader) reader.move(Math.sign(event.deltaY) * 3, maxScroll);
        else scroll = Math.max(0, Math.min(maxScroll, scroll + Math.sign(event.deltaY) * 3));
        event.preventDefault();
        draw();
      },
      { signal: ownSignal, passive: false }
    );
  }
  signal?.addEventListener('abort', dispose, { signal: ownSignal, once: true });
  resize();
  blink();
  return { dispose, setFocused, resize, run };
}
