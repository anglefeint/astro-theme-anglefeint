// Short, scene-local particle effects. Titles and audio/background runtimes are independent.
const instances = new WeakMap();
export function initHomeRabbitDecode() {
  const root = document.querySelector('.home-post-list');
  if (!root) return;
  if (instances.has(root)) return instances.get(root);
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  let paused = false,
    disposed = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const runners = [];
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
  rows.forEach((row, index) => {
    row.dataset.decode = modes[index % modes.length];
  });
  for (const row of rows) {
    const canvas = row.querySelector('.home-rabbit-particles');
    const icon = row.querySelector('.home-white-rabbit svg');
    const ctx = canvas?.getContext('2d');
    if (!ctx || !icon) continue;
    let frame = 0;
    let start = 0;
    let last = 0;
    let hovering = false;
    let focused = false;
    let active = false;
    let width = 0;
    let height = 0;
    let particles = [];
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      row.removeAttribute('data-decoding');
      ctx.clearRect(0, 0, width, height);
    };
    function prepare() {
      const rect = icon.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const silhouette = new Path2D(icon.querySelector('path').getAttribute('d'));
      particles = [];
      for (let y = 3; y < 34; y += 4) {
        for (let x = 3; x < 30; x += 4) {
          // Test the rabbit silhouette in its native SVG coordinates.
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          const inside = ctx.isPointInPath(silhouette, x, y);
          ctx.restore();
          if (!inside) continue;
          particles.push({
            tx: (x / 32) * width,
            ty: (y / 36) * height,
            x: Math.random() * width,
            y: Math.random() * height,
            seed: Math.random() * 100,
          });
        }
      }
    }
    function draw(now) {
      frame = 0;
      if (paused || disposed) return;
      const elapsed = now - start;
      if (elapsed >= 1000) {
        stop();
        return;
      }
      frame = requestAnimationFrame(draw);
      if (now - last < 1000 / 30) return;
      last = now;
      const p = elapsed / 1000;
      const settle = Math.max(0, (p - 0.55) / 0.45);
      const baseEase = settle * settle * (3 - 2 * settle);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${Math.max(4, width / 4)}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const cell of particles) {
        const scan = row.dataset.decode === 'scan';
        const local = Math.max(0, Math.min(1, (p - (cell.tx / width) * 0.65) / 0.25));
        const ease = scan ? local * local * (3 - 2 * local) : baseEase;
        const phase = now / 180 + cell.seed;
        let x = cell.x;
        let y = cell.y;
        if (row.dataset.decode === 'scatter') {
          x += Math.sin(phase) * width * 0.18;
          y += Math.cos(phase * 0.8) * height * 0.16;
        } else if (row.dataset.decode === 'rain') {
          x = cell.tx;
          y = (cell.y + elapsed * (0.035 + cell.seed * 0.0004)) % height;
          ctx.fillStyle = 'rgba(50,255,120,0.15)';
          ctx.fillText('0', x, y - height * 0.18);
        } else if (scan) {
          x = cell.tx + Math.sin(phase) * width * 0.1;
          y = cell.ty;
        } else {
          const slice = (Math.floor(elapsed / 90 + cell.seed) % 3) - 1;
          x = cell.tx + slice * width * 0.3;
          y = cell.ty + Math.sin(phase) * height * 0.08;
        }
        x = x * (1 - ease) + cell.tx * ease;
        y = y * (1 - ease) + cell.ty * ease;
        const bright = Math.sin(phase) > 0.65;
        ctx.fillStyle = bright ? 'rgba(220,255,235,0.95)' : 'rgba(85,255,140,0.7)';
        ctx.shadowColor = '#60ff90';
        ctx.shadowBlur = bright ? 3 : 0;
        ctx.fillText(
          String(Math.floor(elapsed / 70 + cell.seed) % 2),
          Math.max(2, Math.min(width - 2, x)),
          Math.max(2, Math.min(height - 2, y))
        );
      }
      ctx.shadowBlur = 0;
      if (row.dataset.decode === 'scan' && p < 0.9) {
        const x = (p / 0.9) * width;
        ctx.strokeStyle = 'rgba(225,255,235,0.9)';
        ctx.shadowColor = '#60ff90';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
    const update = () => {
      const next = hovering || focused;
      if (next && !active && !paused && !disposed && !reduced.matches && !document.hidden) {
        prepare();
        row.dataset.decoding = 'true';
        start = performance.now();
        last = 0;
        frame = requestAnimationFrame(draw);
      } else if (!next || paused || disposed || reduced.matches || document.hidden) stop();
      active = next && !paused && !reduced.matches;
    };
    row.addEventListener(
      'pointerenter',
      (event) => {
        if (fine.matches && event.pointerType !== 'touch') {
          hovering = true;
          update();
        }
      },
      options
    );
    row.addEventListener(
      'pointerleave',
      () => {
        hovering = false;
        update();
      },
      options
    );
    row.addEventListener(
      'focusin',
      () => {
        focused = true;
        update();
      },
      options
    );
    row.addEventListener(
      'focusout',
      (event) => {
        if (!row.contains(event.relatedTarget)) {
          focused = false;
          update();
        }
      },
      options
    );
    runners.push({
      update,
      pause() {
        stop();
        active = false;
        hovering = false;
      },
      resume() {
        focused = row.contains(document.activeElement);
        update();
      },
      dispose() {
        stop();
        particles = [];
        canvas.width = canvas.height = 0;
      },
    });
  }
  const pause = () => {
    paused = true;
    runners.forEach((r) => r.pause());
  };
  const resume = () => {
    if (disposed) return;
    paused = false;
    runners.forEach((r) => r.resume());
  };
  const controller = {
    start: resume,
    resume,
    pause,
    dispose() {
      if (disposed) return;
      disposed = true;
      listeners.abort();
      runners.forEach((r) => r.dispose());
      runners.length = 0;
      instances.delete(root);
    },
  };
  window.addEventListener('resize', () => runners.forEach((r) => r.pause()), options);
  instances.set(root, controller);
  return controller;
}
