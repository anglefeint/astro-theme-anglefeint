export function initNetworkCanvas(prefersReducedMotion) {
  var canvas = document.querySelector('.ai-network-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var MAX_DPR = 2;
  var rafId = 0;
  var start = 0;
  var last = 0;
  var fps = prefersReducedMotion ? 1 : 30;
  var frameMs = 1000 / fps;
  var points = [];
  var edges = [];

  function seededRandom(seed) {
    var s = seed >>> 0;
    return function() {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    canvas.width = Math.max(2, Math.round(rect.width * dpr));
    canvas.height = Math.max(2, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var w = rect.width;
    var h = rect.height;
    var rand = seededRandom(0xA13F09);
    var count = Math.max(20, Math.min(36, Math.round((w * h) / 32000)));
    var connectDist = Math.min(160, Math.max(90, Math.min(w, h) * 0.18));
    var maxEdges = 120;
    points = [];

    for (var i = 0; i < count; i++) {
      points.push({
        x: 20 + rand() * Math.max(20, w - 40),
        y: 20 + rand() * Math.max(20, h - 40),
        r: 1 + rand() * 1.6,
        p: rand() * Math.PI * 2,
        a: 0.5 + rand() * 0.5,
      });
    }

    edges = [];
    for (var a = 0; a < points.length; a++) {
      for (var b = a + 1; b < points.length; b++) {
        if (edges.length >= maxEdges) break;
        var dx = points[a].x - points[b].x;
        var dy = points[a].y - points[b].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < connectDist) edges.push([a, b, d / connectDist]);
      }
      if (edges.length >= maxEdges) break;
    }
  }

  function render(ts) {
    if (!start) start = ts;
    if (!prefersReducedMotion && ts - last < frameMs) {
      rafId = requestAnimationFrame(render);
      return;
    }

    last = ts;
    var t = (ts - start) * 0.001;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      var p1 = points[e[0]];
      var p2 = points[e[1]];
      var alpha = (1 - e[2]) * (prefersReducedMotion ? 0.2 : (0.18 + 0.06 * Math.sin(t * 0.9 + i)));
      ctx.strokeStyle = 'rgba(190, 236, 255,' + Math.max(0.06, alpha).toFixed(3) + ')';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    for (var j = 0; j < points.length; j++) {
      var p = points[j];
      var pulse = prefersReducedMotion ? 1 : (1 + 0.18 * Math.sin(t * 1.5 + p.p));
      ctx.fillStyle = 'rgba(228, 251, 255,' + (0.58 * p.a).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReducedMotion) rafId = requestAnimationFrame(render);
  }

  function stop() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  resize();
  render(performance.now());

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', function() {
    if (prefersReducedMotion) return;
    if (document.hidden) stop();
    else if (!rafId) rafId = requestAnimationFrame(render);
  });
  window.addEventListener('beforeunload', stop, { once: true });
}
