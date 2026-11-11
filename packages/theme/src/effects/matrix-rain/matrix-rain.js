import { MATRIX_CHARACTERS as chars, MATRIX_CODE_FONT as matrixFont } from './glyphs.js';
const instances = new WeakMap();

/**
 * Mount a paused renderer on the supplied canvas. The caller owns start/pause/dispose.
 * Element sizing uses the canvas CSS box; viewport sizing preserves full-screen effects.
 */
export function mountMatrixRain(canvas, { fps = 45, sizing = 'element', onPointerMove } = {}) {
  const MAX_DPR = 2;

  if (!(canvas instanceof HTMLCanvasElement)) return;
  if (instances.has(canvas)) return instances.get(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationId = 0;
  let running = false;
  let disposed = false;
  const listeners = new AbortController();
  const frames = new Set();
  let lastTime = 0;
  let lastFrameTime = 0;
  const cols = [];
  const fontSize = 22;
  const speed = 80;
  const fpsInput = Number(fps);
  const matrixFps = Number.isFinite(fpsInput) ? Math.min(60, Math.max(15, fpsInput)) : 45;
  const frameIntervalMs = 1000 / matrixFps;
  let width = 0;
  let height = 0;
  let offsetX = 0,
    offsetY = 0;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let pointerX = -1000,
    pointerY = -1000,
    pointerAt = -Infinity;

  function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function resize() {
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    const rect = sizing === 'viewport' ? null : canvas.getBoundingClientRect();
    width = rect ? rect.width : window.innerWidth;
    height = rect ? rect.height : window.innerHeight;
    offsetX = rect?.left ?? 0;
    offsetY = rect?.top ?? 0;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    if (sizing === 'viewport') {
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols.length = 0;
    const layers = [
      { size: 13, spacing: 17, brightness: 0.32, velocity: 0.48, glow: 2 },
      { size: fontSize, spacing: fontSize, brightness: 1, velocity: 1, glow: 8 },
      { size: 32, spacing: 135, brightness: 0.85, velocity: 1.35, glow: 12 },
    ];
    for (const layer of layers) {
      for (let i = 0; i < Math.ceil(width / layer.spacing); i += 1) {
        const y = Math.random() * height;
        const row = Math.floor(y / layer.size);
        const trail = 14 + Math.floor(Math.random() * 10);
        cols.push({
          ...layer,
          x: i * layer.spacing + (layer.size === 32 ? 45 : 0),
          y,
          speed: speed * layer.velocity * (0.75 + Math.random() * 0.55),
          trail,
          drops: Array.from({ length: trail }, (_, j) => ({
            y: (row - j) * layer.size,
            c: randomChar(),
          })),
        });
      }
    }
  }

  function draw(now) {
    animationId = 0;
    if (!running || disposed) return;
    if (lastFrameTime && now - lastFrameTime < frameIntervalMs) {
      animationId = window.requestAnimationFrame(draw);
      return;
    }
    lastFrameTime = now;
    const elapsed = lastTime ? Math.min(now - lastTime, 80) / 1000 : 0;
    const dt = elapsed * 5;
    lastTime = now;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < cols.length; i += 1) {
      const col = cols[i];
      const x = Math.round(col.x);
      const dx = x - pointerX;
      const nearby = fine.matches && now - pointerAt < 140 && Math.abs(dx) < 110;
      const fade = Math.exp(-elapsed * 3.2);
      ctx.font = `${col.size}px ${matrixFont}`;

      const prevRow = Math.floor(col.y / col.size);
      col.y += col.speed * dt;
      const currRow = Math.floor(col.y / col.size);

      for (let row = prevRow + 1; row <= currRow; row += 1) {
        const dropY = row * col.size;
        col.drops.unshift({ y: dropY, c: randomChar() });
      }

      while (col.drops.length > col.trail) col.drops.pop();

      for (let j = col.drops.length - 1; j >= 0; j -= 1) {
        const drop = col.drops[j];
        drop.wake = (drop.wake ?? 0) * fade;
        if (nearby) {
          const dy = drop.y - pointerY;
          const distance = dx * dx + dy * dy;
          if (distance < 12100) drop.wake = Math.max(drop.wake, (1 - distance / 12100) * 0.85);
        }
        const opacity = j === 0 ? 1 : 0.2 + 0.6 * (1 - j / col.trail);
        const alpha = Math.min(1, opacity * col.brightness + drop.wake * 0.35);
        ctx.fillStyle =
          j === 0
            ? `rgba(216, 255, 229, ${alpha})`
            : `rgba(${Math.round(216 * drop.wake)}, 255, ${Math.round(65 + 164 * drop.wake)}, ${alpha})`;
        // Only the leading glyph gets bloom, keeping canvas blur work bounded.
        ctx.shadowColor = '#50ff90';
        ctx.shadowBlur = j === 0 ? col.glow : 0;
        ctx.fillText(col.drops[j].c, x, col.drops[j].y);
      }
      ctx.shadowBlur = 0;

      if (col.y > height && Math.random() > 0.975) {
        col.y = 0;
        col.drops = [{ y: 0, c: randomChar() }];
      }
    }

    frames.forEach((callback) => callback(now));
    if (running && !disposed) animationId = window.requestAnimationFrame(draw);
  }

  resize();
  const pause = () => {
    running = false;
    pointerAt = -Infinity;
    cancelAnimationFrame(animationId);
    animationId = 0;
  };
  const resume = () => {
    if (running || disposed) return;
    running = true;
    lastTime = 0;
    lastFrameTime = 0;
    animationId = window.requestAnimationFrame(draw);
  };
  const controller = {
    start: resume,
    resume,
    pause,
    subscribeFrame(callback) {
      frames.add(callback);
      return () => frames.delete(callback);
    },
    dispose() {
      if (disposed) return;
      pause();
      disposed = true;
      listeners.abort();
      observer?.disconnect();
      frames.clear();
      cols.length = 0;
      canvas.width = canvas.height = 0;
      instances.delete(canvas);
    },
  };
  instances.set(canvas, controller);
  const observer = sizing === 'viewport' ? null : new ResizeObserver(resize);
  observer?.observe(canvas);
  window.addEventListener('resize', resize, { signal: listeners.signal });
  document.addEventListener(
    'mousemove',
    (event) => {
      if (!running) return;
      if (sizing !== 'viewport') {
        const rect = canvas.getBoundingClientRect();
        offsetX = rect.left;
        offsetY = rect.top;
      }
      if (fine.matches) {
        pointerX = event.clientX - offsetX;
        pointerY = event.clientY - offsetY;
        pointerAt = performance.now();
      }
      onPointerMove?.(event);
    },
    { signal: listeners.signal, passive: true }
  );
  document.addEventListener(
    'pointerleave',
    () => {
      pointerAt = -Infinity;
    },
    { signal: listeners.signal }
  );
  return controller;
}
