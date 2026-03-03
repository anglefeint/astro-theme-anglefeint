export function initHeroCanvas(prefersReducedMotion) {
  var shell = document.querySelector('.hero-shell');
  if (!shell) return;

  var canvas = shell.querySelector('.hero-canvas');
  var wrap = shell.querySelector('.hero-canvas-wrap');
  var heroStack = shell.querySelector('.hero-stack');
  if (!canvas || !wrap || !heroStack) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var src = canvas.getAttribute('data-hero-src');
  if (!src) return;

  var heroStart = 0;
  var heroRaf = 0;
  var resizeTimer = 0;
  var baseCanvas = document.createElement('canvas');
  var baseCtx = baseCanvas.getContext('2d');
  var pixelCanvas = document.createElement('canvas');
  var pixelCtx = pixelCanvas.getContext('2d');
  var noiseCanvas = document.createElement('canvas');
  var noiseCtx = noiseCanvas.getContext('2d');
  var edgeCanvas = document.createElement('canvas');
  var edgeCtx = edgeCanvas.getContext('2d');
  var edgeWorkCanvas = document.createElement('canvas');
  var edgeWorkCtx = edgeWorkCanvas.getContext('2d');
  var edgeReady = false;
  var frameCount = 0;

  var EDGE_PHASE = 1.8;
  var REVEAL_PHASE = 2.5;
  var INTRO_END = EDGE_PHASE + REVEAL_PHASE;

  function sizeCanvas() {
    var rect = heroStack.getBoundingClientRect();
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
    var workW = Math.max(2, Math.round(w * 0.5));
    var workH = Math.max(2, Math.round(h * 0.5));
    edgeWorkCanvas.width = workW;
    edgeWorkCanvas.height = workH;
    drawBase(edgeWorkCtx, img, workW, workH);

    var srcImage = edgeWorkCtx.getImageData(0, 0, workW, workH);
    var d = srcImage.data;
    var out = edgeWorkCtx.createImageData(workW, workH);
    var od = out.data;
    var rowStride = workW * 4;

    for (var y = 1; y < workH - 1; y++) {
      var row = y * rowStride;
      var rowAbove = row - rowStride;
      var rowBelow = row + rowStride;
      for (var x = 1; x < workW - 1; x++) {
        var i = row + x * 4;
        var iLeft = i - 4;
        var iRight = i + 4;
        var iAbove = rowAbove + x * 4;
        var iAboveLeft = iAbove - 4;
        var iAboveRight = iAbove + 4;
        var iBelow = rowBelow + x * 4;
        var iBelowLeft = iBelow - 4;
        var iBelowRight = iBelow + 4;

        var lumAboveLeft = d[iAboveLeft] * 0.299 + d[iAboveLeft + 1] * 0.587 + d[iAboveLeft + 2] * 0.114;
        var lumAbove = d[iAbove] * 0.299 + d[iAbove + 1] * 0.587 + d[iAbove + 2] * 0.114;
        var lumAboveRight = d[iAboveRight] * 0.299 + d[iAboveRight + 1] * 0.587 + d[iAboveRight + 2] * 0.114;
        var lumLeft = d[iLeft] * 0.299 + d[iLeft + 1] * 0.587 + d[iLeft + 2] * 0.114;
        var lumRight = d[iRight] * 0.299 + d[iRight + 1] * 0.587 + d[iRight + 2] * 0.114;
        var lumBelowLeft = d[iBelowLeft] * 0.299 + d[iBelowLeft + 1] * 0.587 + d[iBelowLeft + 2] * 0.114;
        var lumBelow = d[iBelow] * 0.299 + d[iBelow + 1] * 0.587 + d[iBelow + 2] * 0.114;
        var lumBelowRight = d[iBelowRight] * 0.299 + d[iBelowRight + 1] * 0.587 + d[iBelowRight + 2] * 0.114;

        var gx = -lumAboveLeft - 2 * lumLeft - lumBelowLeft + lumAboveRight + 2 * lumRight + lumBelowRight;
        var gy = -lumAboveLeft - 2 * lumAbove - lumAboveRight + lumBelowLeft + 2 * lumBelow + lumBelowRight;
        var mag = Math.min(255, Math.sqrt(gx * gx + gy * gy));

        od[i] = Math.min(255, mag * 0.4);
        od[i + 1] = Math.min(255, mag * 0.85);
        od[i + 2] = Math.min(255, mag * 1.0);
        od[i + 3] = mag > 20 ? Math.min(255, mag * 1.5) : 0;
      }
    }

    edgeWorkCtx.putImageData(out, 0, 0);
    edgeCtx.clearRect(0, 0, w, h);
    edgeCtx.imageSmoothingEnabled = true;
    edgeCtx.drawImage(edgeWorkCanvas, 0, 0, workW, workH, 0, 0, w, h);
    edgeReady = true;
  }

  function heroRender(t) {
    if (!heroStart) heroStart = t;
    var elapsed = (t - heroStart) * 0.001;
    frameCount++;
    if (!canvas.img) {
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

      if ((frameCount % 2) === 0 && Math.random() < 0.08) {
        var glitchY = Math.random() * h;
        var glitchH = 2 + Math.random() * 12;
        var shiftX = (Math.random() - 0.5) * 12;
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.drawImage(baseCanvas, 0, Math.floor(glitchY), w, Math.ceil(glitchH), Math.round(shiftX), Math.floor(glitchY), w, Math.ceil(glitchH));
        ctx.restore();
      }

      if ((frameCount % 3) === 0 && elapsed >= 6 && Math.random() < 0.025) {
        var dropoutY = Math.floor(Math.random() * h);
        var dropoutH = 2 + Math.floor(Math.random() * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, dropoutY, w, dropoutH);
      }

      if ((frameCount % 3) === 0 && Math.random() < 0.03) {
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
      ctx.drawImage(baseCanvas, 0, 0);
      return;
    }
    heroRaf = requestAnimationFrame(heroRender);
  };
  img.src = new URL(src, window.location.href).href;

  window.addEventListener('resize', function() {
    if (!canvas.img) return;
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      resizeTimer = 0;
      sizeCanvas();
      buildEdge(canvas.img);
    }, 180);
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
    if (resizeTimer) clearTimeout(resizeTimer);
    cancelAnimationFrame(heroRaf);
  }, { once: true });
}
