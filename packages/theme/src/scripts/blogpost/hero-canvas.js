export function initHeroCanvas(prefersReducedMotion) {
  var shell = document.querySelector('.hero-shell');
  if (!shell) return;

  var canvas = shell.querySelector('.hero-canvas');
  var wrap = shell.querySelector('.hero-canvas-wrap');
  if (!canvas || !wrap) return;

  var src = canvas.getAttribute('data-hero-src');
  if (!src) return;

  var heroStart = 0;
  var heroRaf = 0;
  var baseCanvas = document.createElement('canvas');
  var baseCtx = baseCanvas.getContext('2d');
  var pixelCanvas = document.createElement('canvas');
  var pixelCtx = pixelCanvas.getContext('2d');
  var noiseCanvas = document.createElement('canvas');
  var noiseCtx = noiseCanvas.getContext('2d');
  var edgeCanvas = document.createElement('canvas');
  var edgeCtx = edgeCanvas.getContext('2d');
  var edgeReady = false;

  var EDGE_PHASE = 1.8;
  var REVEAL_PHASE = 2.5;
  var INTRO_END = EDGE_PHASE + REVEAL_PHASE;

  function sizeCanvas() {
    var rect = shell.querySelector('.hero-stack').getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(2, Math.round(rect.width * dpr));
    canvas.height = Math.max(2, Math.round(rect.height * dpr));
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    noiseCanvas.width = canvas.width;
    noiseCanvas.height = 64;
  }

  function drawBase(ctx, img, w, h) {
    var iw = img.width;
    var ih = img.height;
    var scale = Math.max(w / iw, h / ih);
    var sw = w / scale;
    var sh = h / scale;
    var sx = (iw - sw) / 2;
    var sy = (ih - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }

  function buildEdge(img) {
    var w = canvas.width;
    var h = canvas.height;
    edgeCanvas.width = w;
    edgeCanvas.height = h;
    baseCanvas.width = w;
    baseCanvas.height = h;
    drawBase(baseCtx, img, w, h);
    drawBase(edgeCtx, img, w, h);

    var srcImage = edgeCtx.getImageData(0, 0, w, h);
    var d = srcImage.data;
    var out = edgeCtx.createImageData(w, h);
    var od = out.data;

    for (var y = 1; y < h - 1; y++) {
      for (var x = 1; x < w - 1; x++) {
        var idx = function(px, py) {
          return ((py * w) + px) * 4;
        };
        var i = idx(x, y);
        function luma(px, py) {
          var j = idx(px, py);
          return d[j] * 0.299 + d[j + 1] * 0.587 + d[j + 2] * 0.114;
        }

        var gx = -luma(x - 1, y - 1) - 2 * luma(x - 1, y) - luma(x - 1, y + 1)
          + luma(x + 1, y - 1) + 2 * luma(x + 1, y) + luma(x + 1, y + 1);
        var gy = -luma(x - 1, y - 1) - 2 * luma(x, y - 1) - luma(x + 1, y - 1)
          + luma(x - 1, y + 1) + 2 * luma(x, y + 1) + luma(x + 1, y + 1);
        var mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));

        od[i] = Math.min(255, mag * 0.4);
        od[i + 1] = Math.min(255, mag * 0.85);
        od[i + 2] = Math.min(255, mag * 1.0);
        od[i + 3] = mag > 20 ? Math.min(255, mag * 1.5) : 0;
      }
    }

    edgeCtx.putImageData(out, 0, 0);
    edgeReady = true;
  }

  function heroRender(t) {
    if (!heroStart) heroStart = t;
    var elapsed = (t - heroStart) * 0.001;
    var ctx = canvas.getContext('2d');
    if (!ctx || !canvas.img) {
      heroRaf = requestAnimationFrame(heroRender);
      return;
    }

    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (elapsed < EDGE_PHASE && edgeReady) {
      var edgeFade = Math.min(1, elapsed / 0.5);
      ctx.fillStyle = 'rgba(8, 16, 28, 1)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = edgeFade;
      ctx.drawImage(edgeCanvas, 0, 0);
      ctx.globalAlpha = 1;

      var scanY = (elapsed / EDGE_PHASE) * h;
      ctx.fillStyle = 'rgba(120, 220, 255, 0.3)';
      ctx.fillRect(0, scanY - 1, w, 2);
      var scanGlow = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGlow.addColorStop(0, 'rgba(120, 220, 255, 0)');
      scanGlow.addColorStop(0.5, 'rgba(120, 220, 255, 0.15)');
      scanGlow.addColorStop(1, 'rgba(120, 220, 255, 0)');
      ctx.fillStyle = scanGlow;
      ctx.fillRect(0, scanY - 30, w, 60);
    } else if (elapsed < INTRO_END) {
      var revealT = (elapsed - EDGE_PHASE) / REVEAL_PHASE;
      var maxBlock = 32;
      var blockSize = Math.max(1, Math.round(maxBlock * (1 - revealT * revealT)));

      if (blockSize > 1) {
        var smallW = Math.max(1, Math.ceil(w / blockSize));
        var smallH = Math.max(1, Math.ceil(h / blockSize));
        if (pixelCanvas.width !== smallW || pixelCanvas.height !== smallH) {
          pixelCanvas.width = smallW;
          pixelCanvas.height = smallH;
        }
        pixelCtx.clearRect(0, 0, smallW, smallH);
        pixelCtx.drawImage(baseCanvas, 0, 0, smallW, smallH);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(pixelCanvas, 0, 0, smallW, smallH, 0, 0, w, h);
        ctx.imageSmoothingEnabled = true;
      } else {
        ctx.drawImage(baseCanvas, 0, 0);
      }

      var tintAlpha = 0.18 * (1 - revealT);
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(100, 200, 255, ' + tintAlpha + ')';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.drawImage(baseCanvas, 0, 0);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      for (var i = 0; i < h; i += 3) {
        ctx.fillRect(0, i, w, 1);
      }

      var scanPos = ((elapsed * 40) % (h + 60)) - 30;
      var barGrad = ctx.createLinearGradient(0, scanPos - 30, 0, scanPos + 30);
      barGrad.addColorStop(0, 'rgba(120, 220, 255, 0)');
      barGrad.addColorStop(0.5, 'rgba(120, 220, 255, 0.06)');
      barGrad.addColorStop(1, 'rgba(120, 220, 255, 0)');
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, scanPos - 30, w, 60);

      if (Math.random() < 0.08) {
        var glitchY = Math.random() * h;
        var glitchH = 2 + Math.random() * 12;
        var shiftX = (Math.random() - 0.5) * 12;
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.drawImage(baseCanvas, 0, Math.floor(glitchY), w, Math.ceil(glitchH), Math.round(shiftX), Math.floor(glitchY), w, Math.ceil(glitchH));
        ctx.restore();
      }

      if (elapsed >= 6 && Math.random() < 0.025) {
        var dropoutY = Math.floor(Math.random() * h);
        var dropoutH = 2 + Math.floor(Math.random() * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, dropoutY, w, dropoutH);
      }

      if (Math.random() < 0.03) {
        var burstY = Math.random() * h * 0.8;
        var burstH = 4 + Math.random() * 20;
        if (noiseCanvas.width !== w) {
          noiseCanvas.width = w;
          noiseCanvas.height = 64;
        }

        noiseCtx.clearRect(0, 0, noiseCanvas.width, noiseCanvas.height);
        for (var n = 0; n < 180; n++) {
          var nx = Math.random() * noiseCanvas.width;
          var ny = Math.random() * noiseCanvas.height;
          var nw = 1 + Math.random() * 3;
          var nh = 1 + Math.random() * 2;
          var alpha = 0.08 + Math.random() * 0.18;
          noiseCtx.fillStyle = 'rgba(160,220,255,' + alpha.toFixed(3) + ')';
          noiseCtx.fillRect(nx, ny, nw, nh);
        }

        ctx.drawImage(
          noiseCanvas,
          0,
          0,
          w,
          Math.ceil(Math.min(burstH, noiseCanvas.height)),
          0,
          Math.floor(burstY),
          w,
          Math.ceil(burstH)
        );
      }
    }

    heroRaf = requestAnimationFrame(heroRender);
  }

  var img = new Image();
  img.onload = function() {
    canvas.img = img;
    sizeCanvas();
    buildEdge(img);
    wrap.classList.add('ready');
    if (prefersReducedMotion) {
      var staticCtx = canvas.getContext('2d');
      if (staticCtx) staticCtx.drawImage(baseCanvas, 0, 0);
      return;
    }
    heroRaf = requestAnimationFrame(heroRender);
  };
  img.src = new URL(src, window.location.href).href;

  window.addEventListener('resize', function() {
    if (canvas.img) {
      sizeCanvas();
      buildEdge(canvas.img);
    }
  }, { passive: true });

  function onHeroVisibilityChange() {
    if (prefersReducedMotion) return;
    if (document.hidden) {
      if (heroRaf) cancelAnimationFrame(heroRaf);
      heroRaf = 0;
    } else if (canvas.img && !heroRaf) {
      heroRaf = requestAnimationFrame(heroRender);
    }
  }

  document.addEventListener('visibilitychange', onHeroVisibilityChange);
  window.addEventListener('beforeunload', function() {
    cancelAnimationFrame(heroRaf);
  }, { once: true });
}
