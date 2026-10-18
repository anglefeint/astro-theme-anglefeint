const NS = 'http://www.w3.org/2000/svg';
const element = (name, attrs = {}) => {
  const el = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
  return el;
};

// Fixed neighbouring topology: no per-frame neighbour search or layout reads.
export function mountNetworkBackground(svg) {
  if (!svg) return () => {};
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let nodes = [],
    edges = [],
    signals = [],
    frame = 0,
    resizeFrame = 0,
    width = 0,
    height = 0,
    columns = 0,
    rowCount = 0,
    last = 0,
    time = 0,
    disposed = false;
  const random = (min, max) => min + Math.random() * (max - min);
  const set = (el, key, value) => el.setAttribute(key, value.toFixed(2));
  function draw() {
    for (const n of nodes) {
      n.x = n.baseX + Math.sin(time * n.speed + n.phase) * n.rangeX;
      n.y = n.baseY + Math.cos(time * n.speed * 0.83 + n.phase * 1.7) * n.rangeY;
      set(n.el, 'cx', n.x);
      set(n.el, 'cy', n.y);
    }
    for (const e of edges) {
      set(e.el, 'x1', e.a.x);
      set(e.el, 'y1', e.a.y);
      set(e.el, 'x2', e.b.x);
      set(e.el, 'y2', e.b.y);
    }
    for (const s of signals) {
      const phase = (time / s.duration + s.phase) % 1;
      const progress = Math.min(1, phase / 0.85);
      set(s.el, 'cx', s.edge.a.x + (s.edge.b.x - s.edge.a.x) * progress);
      set(s.el, 'cy', s.edge.a.y + (s.edge.b.y - s.edge.a.y) * progress);
      set(s.el, 'opacity', phase < 0.85 ? Math.min(0.9, progress * 12, (1 - progress) * 12) : 0);
    }
  }
  function rebuild() {
    const w = svg.clientWidth,
      h = svg.clientHeight;
    if (!w || !h) return;
    if (w === width && h === height) return;
    const cols = Math.max(2, Math.min(6, Math.ceil(w / 350)));
    const rows = Math.max(3, Math.min(5, Math.ceil(h / 280)));
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    if (nodes.length && cols === columns && rows === rowCount && w <= 720 === width <= 720) {
      for (const n of nodes) {
        n.baseX *= w / width;
        n.baseY *= h / height;
        n.rangeX = Math.min(38, (w / cols) * 0.16);
        n.rangeY = Math.min(38, (h / rows) * 0.17);
      }
      width = w;
      height = h;
      draw();
      return;
    }
    width = w;
    height = h;
    columns = cols;
    rowCount = rows;
    const wires = element('g', { class: 'network-background-edges' });
    const points = element('g', { class: 'network-background-nodes' });
    const packets = element('g');
    nodes = [];
    edges = [];
    signals = [];
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < cols; col++) {
        const el = element('circle', { r: random(3, 4.5) });
        points.append(el);
        nodes.push({
          el,
          baseX: ((col + random(0.15, 0.85)) * w) / cols,
          baseY: ((row + random(0.15, 0.85)) * h) / rows,
          rangeX: Math.min(38, (w / cols) * 0.16),
          rangeY: Math.min(38, (h / rows) * 0.17),
          speed: random(0.35, 0.65),
          phase: random(0, Math.PI * 2),
          x: 0,
          y: 0,
        });
      }
    const connect = (a, b) => {
      const el = element('line');
      wires.append(el);
      edges.push({ a: nodes[a], b: nodes[b], el });
    };
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        if (col + 1 < cols) connect(i, i + 1);
        if (row + 1 < rows) connect(i, i + cols);
        if (col + 1 < cols && row + 1 < rows && Math.random() < 0.4) connect(i, i + cols + 1);
      }
    const choices = [...edges];
    for (let i = 0; i < Math.min(w <= 720 ? 3 : 7, edges.length); i++) {
      const edge = choices.splice(Math.floor(Math.random() * choices.length), 1)[0];
      const el = element('circle', { class: 'network-background-signal', r: 2.5 });
      packets.append(el);
      signals.push({ edge, el, duration: random(3, 6), phase: Math.random() });
    }
    svg.replaceChildren(wires, points, packets);
    draw();
  }
  function tick(now) {
    if (disposed || document.hidden || motion.matches) return;
    if (!last) last = now;
    if (now - last >= 50) {
      time += Math.min(0.1, (now - last) / 1000);
      last = now;
      try {
        draw();
      } catch (error) {
        fail(error);
        return;
      }
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    const paused = disposed || document.hidden || motion.matches;
    svg.dataset.paused = String(paused);
    if (!paused) frame = requestAnimationFrame(tick);
  }
  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    cancelAnimationFrame(resizeFrame);
    events.abort();
    svg.dataset.paused = 'true';
  }
  function fail(error) {
    dispose();
    console.warn('Network background stopped.', error);
  }
  function resize() {
    if (resizeFrame || disposed) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      if (disposed) return;
      try {
        rebuild();
      } catch (error) {
        fail(error);
      }
    });
  }
  try {
    rebuild();
    sync();
    document.addEventListener('visibilitychange', sync, { signal: events.signal });
    motion.addEventListener('change', sync, { signal: events.signal });
    window.addEventListener('resize', resize, { signal: events.signal, passive: true });
  } catch (error) {
    dispose();
    throw error;
  }
  return dispose;
}
