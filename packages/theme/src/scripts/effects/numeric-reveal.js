import { numericRevealDuration } from './numeric-reveal-timing.js';

function playReveal(heading, clock, duration, onFinish, options) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!heading || !heading.textContent?.trim() || options.signal?.aborted) return;
  const content = Array.from(heading.childNodes);
  heading.dataset.decoderState = 'done';
  if (reduced.matches || document.hidden || !clock?.enabled) return;
  const bounds = heading.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const decodeHeight = Math.min(bounds.height, 420);
  const digits = document.createElement('canvas');
  const ctx = digits.getContext('2d');
  if (!ctx) return;
  const previousPosition = heading.style.position;
  const positioned = getComputedStyle(heading).position === 'static';
  if (positioned) heading.style.position = 'relative';
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  digits.width = Math.ceil(bounds.width * dpr);
  digits.height = Math.ceil(decodeHeight * dpr);
  ctx.scale(dpr, dpr);
  const original = document.createElement('span');
  original.className = 'hacker-decoder-original';
  original.style.opacity = '0';
  original.style.position = 'relative';
  original.style.zIndex = '1';
  original.append(...content);
  heading.append(original);
  const overlay = document.createElement('span');
  overlay.className = 'hacker-decoder-code';
  overlay.style.height = `${decodeHeight}px`;
  Object.assign(overlay.style, {
    position: 'absolute',
    inset: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
    userSelect: 'none',
  });
  Object.assign(digits.style, { width: '100%', height: '100%', display: 'block' });
  overlay.setAttribute('aria-hidden', 'true');
  overlay.append(digits);
  const fontSize = Math.max(8, Math.min(options.fontSize || 13, 24));
  const boundedOpacity = (value, fallback) =>
    Number.isFinite(value) ? Math.max(0, Math.min(value, 1)) : fallback;
  const opacityRange = [
    boundedOpacity(options.opacityRange?.[0], 0.7),
    boundedOpacity(options.opacityRange?.[1], 1),
  ].sort((a, b) => a - b);
  const trailOpacity = boundedOpacity(options.trailOpacity, 0.16);
  const stepX = 11;
  const stepY = fontSize * 1.3;
  // Fill the result box independently of text length, wrapping or letter spacing.
  const slots = [];
  for (let x = fontSize * 0.3; x + fontSize * 0.3 <= bounds.width; x += stepX) {
    for (let y = 0; y + fontSize <= decodeHeight - 2; y += stepY) {
      slots.push({
        x,
        y,
        phase: Math.random(),
        digit: Math.floor(Math.random() * 10),
      });
    }
  }
  heading.append(overlay);
  heading.dataset.decoding = '';
  heading.dataset.decoderState = 'running';
  const listeners = new AbortController();
  const { signal } = listeners;
  let detach;
  let timer,
    finished = false,
    last = 0;
  const finish = (notify = true) => {
    if (finished) return;
    finished = true;
    listeners.abort();
    detach?.();
    clearTimeout(timer);
    window.removeEventListener('resize', finish);
    original.replaceWith(...content);
    overlay.replaceChildren();
    overlay.remove();
    digits.width = digits.height = 0;
    slots.length = 0;
    delete heading.dataset.decoding;
    heading.dataset.decoderState = 'done';
    if (positioned) heading.style.position = previousPosition;
    if (notify) onFinish();
  };
  options.signal?.addEventListener('abort', () => finish(false), { signal, once: true });
  const totalDuration = duration;
  const fadeMs = Math.max(0, Math.min(options.fadeMs ?? 1200, 2000, totalDuration));
  const fadeStart = totalDuration - fadeMs;
  const start = performance.now();
  const draw = (now) => {
    if (finished) return;
    const elapsed = now - start;
    if (elapsed >= totalDuration) {
      finish();
      return;
    }
    if (now - last < 1000 / 30) return;
    last = now;
    if (elapsed >= fadeStart) {
      heading.dataset.decoderState = 'revealing';
      const progress = Math.min(1, (elapsed - fadeStart) / fadeMs);
      const opacity = progress * progress * (3 - 2 * progress);
      original.style.opacity = String(opacity);
      overlay.style.opacity = String(1 - opacity);
    }
    ctx.clearRect(0, 0, bounds.width, decodeHeight);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.save();
    for (const slot of slots) {
      if (Math.random() < 0.45) slot.digit = Math.floor(Math.random() * 10);
      const light = (Math.sin(elapsed / 110 + slot.phase * Math.PI * 2) + 1) / 2;
      ctx.globalAlpha = opacityRange[0] + light * (opacityRange[1] - opacityRange[0]);
      ctx.fillStyle = light > 0.85 ? options.highlight || '#72ff91' : options.color || '#35e76c';
      ctx.fillText(String(slot.digit), slot.x, slot.y);
      // A faint displaced impression gives the changing digits a phosphor trail.
      if (trailOpacity > 0) {
        ctx.globalAlpha *= trailOpacity;
        ctx.fillText(String((slot.digit + 3) % 10), slot.x, slot.y - 2);
      }
    }
    ctx.restore();
  };
  draw(start);
  detach = clock?.subscribeFrame(draw);
  timer = window.setTimeout(finish, totalDuration);
  window.addEventListener('resize', finish, { signal, once: true });
  window.addEventListener('pagehide', finish, { signal, once: true });
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) finish();
    },
    { signal }
  );
  reduced.addEventListener(
    'change',
    () => {
      if (reduced.matches) finish();
    },
    { signal }
  );
  heading.addEventListener('decoder:finish', finish, { signal, once: true });
  heading.addEventListener(
    'scroll',
    () => {
      if (heading.scrollTop > 0 || heading.scrollLeft > 0) finish();
    },
    { signal }
  );
  return { finish: () => finish(), dispose: () => finish(false) };
}

export function createNumericReveal({
  target,
  clock,
  durationMs,
  durationRangeMs = [1500, 3000],
  inputLength = 0,
  random = Math.random,
  ...options
}) {
  let active;
  return {
    play(onFinish = () => {}) {
      active?.dispose();
      active = playReveal(
        target,
        clock,
        Number.isFinite(durationMs)
          ? Math.max(0, Math.min(durationMs, 10000))
          : numericRevealDuration({ rangeMs: durationRangeMs, inputLength, random }),
        onFinish,
        options
      );
      if (!active && !options.signal?.aborted) onFinish();
    },
    finish() {
      active?.finish();
    },
    cancel() {
      active?.dispose();
    },
    dispose() {
      active?.dispose();
      active = undefined;
    },
  };
}
