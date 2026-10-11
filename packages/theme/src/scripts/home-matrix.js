import { MATRIX_CHARACTERS as chars, MATRIX_CODE_FONT as matrixFont } from './matrix-glyphs.js';
const instances = new WeakMap();

export function initHomeMatrix() {
  const MAX_DPR = 2;

  const canvas = document.getElementById('matrix-bg');
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
  const fpsInput = Number(canvas.dataset.matrixFps ?? window.__ANGLEFEINT_MATRIX_FPS ?? 45);
  const matrixFps = Number.isFinite(fpsInput) ? Math.min(60, Math.max(15, fpsInput)) : 45;
  const frameIntervalMs = 1000 / matrixFps;
  let width = 0;
  let height = 0;

  function randomChar() {
    return chars[Math.floor(Math.random() * chars.length)];
  }

  function resize() {
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
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
    const dt = lastTime ? Math.min(now - lastTime, 80) / 200 : 0;
    lastTime = now;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < cols.length; i += 1) {
      const col = cols[i];
      const x = Math.round(col.x);
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
        const opacity = j === 0 ? 1 : 0.2 + 0.6 * (1 - j / col.trail);
        const alpha = opacity * col.brightness;
        ctx.fillStyle = j === 0 ? `rgba(216, 255, 229, ${alpha})` : `rgba(0, 255, 65, ${alpha})`;
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
      frames.clear();
      cols.length = 0;
      canvas.width = canvas.height = 0;
      instances.delete(canvas);
    },
  };
  instances.set(canvas, controller);
  window.addEventListener('resize', resize, { signal: listeners.signal });
  document.addEventListener(
    'mousemove',
    (event) => {
      if (!running) return;
      document.body.style.setProperty('--matrix-mx', `${event.clientX}px`);
      document.body.style.setProperty('--matrix-my', `${event.clientY}px`);
    },
    { signal: listeners.signal, passive: true }
  );
  return controller;
}
