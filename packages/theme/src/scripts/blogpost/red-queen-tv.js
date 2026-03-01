export function initRedQueenTv(prefersReducedMotion) {
  var shell = document.querySelector('.rq-tv');
  var stage = document.querySelector('.rq-tv-stage');
  var toggle = document.querySelector('.rq-tv-toggle');
  if (!shell || !stage || !toggle) return;

  var source = stage.getAttribute('data-rq-src') || '';
  var source2 = stage.getAttribute('data-rq-src2') || '';
  if (!source) return;

  var OPEN_DELAY_MS = 500;
  var COLLAPSE_DELAY_MS = 260;
  var FRAME_MS = 33;
  var FALLBACK_STEP_MS = 650;
  var FALLBACK_GIF_SHOW_MS = 1400;
  var WARMUP_STATIC_MS = 1000;
  var PRELOAD_RETRY_MAX = 6;
  var PRELOAD_TIMEOUT_MS = 12000;
  var RETRY_BASE_MS = 220;
  var HIDDEN_POLL_MS = 140;

  var sequenceTimer = 0;
  var renderTimer = 0;
  var revealTimer = 0;
  var preloadTimeoutTimer = 0;
  var preloadRetryTimers = new Set();

  var start = 0;
  var width = 320;
  var height = 240;
  var canvas = null;
  var ctx = null;
  var currentFrame = null;
  var playToken = 0;
  var isPlaying = false;
  var isLoading = false;
  var pendingAutoPlay = false;
  var playlistIndex = 0;
  var imageCache = Object.create(null);
  var mediaDataCache = Object.create(null);
  var hasRevealed = false;
  var forceStaticUntil = 0;

  function guessImageType(url) {
    var clean = (url || '').split('?')[0].toLowerCase();
    if (clean.endsWith('.gif')) return 'image/gif';
    if (clean.endsWith('.webp')) return 'image/webp';
    if (clean.endsWith('.png')) return 'image/png';
    if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return 'image/jpeg';
    return 'image/webp';
  }

  function resolveItemUrl(item) {
    return new URL(item.url, window.location.href).href;
  }

  var playlist = [{ url: source, type: guessImageType(source), holdLast: 360 }];
  if (source2) playlist.push({ url: source2, type: guessImageType(source2), holdLast: 500 });

  if (prefersReducedMotion) {
    setCollapsed(false);
    var staticImg = new Image();
    staticImg.className = 'rq-tv-screen';
    staticImg.alt = '';
    staticImg.decoding = 'async';
    staticImg.loading = 'lazy';
    staticImg.src = resolveItemUrl(playlist[0]);
    stage.innerHTML = '';
    stage.appendChild(staticImg);
    toggle.hidden = true;
    toggle.setAttribute('aria-hidden', 'true');
    return;
  }

  function setCollapsed(collapsed) {
    shell.classList.toggle('rq-tv-collapsed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
  }

  function setLoading(loading) {
    isLoading = loading;
    shell.classList.toggle('rq-tv-loading', loading);
    toggle.disabled = loading;
    toggle.setAttribute('aria-busy', String(loading));
  }

  function clearSequenceTimer() {
    if (!sequenceTimer) return;
    clearTimeout(sequenceTimer);
    sequenceTimer = 0;
  }

  function clearRenderTimer() {
    if (!renderTimer) return;
    clearTimeout(renderTimer);
    renderTimer = 0;
  }

  function clearPreloadTimers() {
    if (preloadTimeoutTimer) {
      clearTimeout(preloadTimeoutTimer);
      preloadTimeoutTimer = 0;
    }
    preloadRetryTimers.forEach(function(id) { clearTimeout(id); });
    preloadRetryTimers.clear();
  }

  function scheduleSequence(fn, delay) {
    clearSequenceTimer();
    sequenceTimer = setTimeout(function runTask() {
      if (document.hidden) {
        sequenceTimer = setTimeout(runTask, HIDDEN_POLL_MS);
        return;
      }
      fn();
    }, delay);
  }

  function schedulePreloadRetry(fn, delay) {
    var id = setTimeout(function() {
      preloadRetryTimers.delete(id);
      fn();
    }, delay);
    preloadRetryTimers.add(id);
  }

  function preloadGif(item, token, attempt, done) {
    if (token !== playToken || !isPlaying) return;
    var tryCount = typeof attempt === 'number' ? attempt : 0;
    var cachedData = mediaDataCache[item.url];

    if (cachedData instanceof ArrayBuffer) {
      if (typeof ImageDecoder === 'undefined') {
        done(true);
        return;
      }
      var cachedDecoder = new ImageDecoder({ data: cachedData, type: item.type });
      cachedDecoder.tracks.ready.then(async function() {
        var result = await cachedDecoder.decode({ frameIndex: 0 });
        if (result && result.image && result.image.close) result.image.close();
        done(true);
      }).catch(function() {
        if (tryCount >= PRELOAD_RETRY_MAX) {
          done(false);
          return;
        }
        var retryDelay = Math.min(1800, RETRY_BASE_MS * (tryCount + 1));
        schedulePreloadRetry(function() {
          preloadGif(item, token, tryCount + 1, done);
        }, retryDelay);
      });
      return;
    }

    fetch(resolveItemUrl(item))
      .then(function(response) { return response.arrayBuffer(); })
      .then(function(buffer) {
        mediaDataCache[item.url] = buffer;
        if (typeof ImageDecoder === 'undefined') {
          done(true);
          return;
        }
        var decoder = new ImageDecoder({ data: buffer, type: item.type });
        decoder.tracks.ready.then(async function() {
          var result = await decoder.decode({ frameIndex: 0 });
          if (result && result.image && result.image.close) result.image.close();
          done(true);
        }).catch(function() {
          if (tryCount >= PRELOAD_RETRY_MAX) {
            done(false);
            return;
          }
          var retryDelay = Math.min(1800, RETRY_BASE_MS * (tryCount + 1));
          schedulePreloadRetry(function() {
            preloadGif(item, token, tryCount + 1, done);
          }, retryDelay);
        });
      }).catch(function() {
        if (tryCount >= PRELOAD_RETRY_MAX) {
          done(false);
          return;
        }
        var retryDelay = Math.min(1800, RETRY_BASE_MS * (tryCount + 1));
        schedulePreloadRetry(function() {
          preloadGif(item, token, tryCount + 1, done);
        }, retryDelay);
      });
  }

  function preloadImage(item, token, attempt, done) {
    if (token !== playToken || !isPlaying) return;
    var tryCount = typeof attempt === 'number' ? attempt : 0;
    var cached = imageCache[item.url];
    if (cached && cached.complete) {
      done(true);
      return;
    }

    var img = new Image();
    img.onload = function() {
      imageCache[item.url] = img;
      done(true);
    };
    img.onerror = function() {
      if (tryCount >= PRELOAD_RETRY_MAX) {
        done(false);
        return;
      }
      var retryDelay = Math.min(1800, RETRY_BASE_MS * (tryCount + 1));
      schedulePreloadRetry(function() {
        preloadImage(item, token, tryCount + 1, done);
      }, retryDelay);
    };
    img.src = resolveItemUrl(item);
  }

  function preloadAssets(token, done) {
    clearPreloadTimers();
    var left = playlist.length;
    var failed = false;
    function finish(ok) {
      if (left <= -999) return;
      left = -1000;
      clearPreloadTimers();
      done(ok);
    }

    preloadTimeoutTimer = setTimeout(function() {
      finish(false);
    }, PRELOAD_TIMEOUT_MS);

    function markDone(ok) {
      if (!ok) failed = true;
      left -= 1;
      if (left <= 0) finish(!failed);
    }

    playlist.forEach(function(item) {
      if (item.type === 'image/gif') preloadGif(item, token, 0, markDone);
      else preloadImage(item, token, 0, markDone);
    });
  }

  function revealMonitor(token) {
    if (hasRevealed) return;
    hasRevealed = true;
    if (revealTimer) clearTimeout(revealTimer);
    revealTimer = setTimeout(function runReveal() {
      if (token !== playToken || !isPlaying) return;
      if (document.hidden) {
        revealTimer = setTimeout(runReveal, HIDDEN_POLL_MS);
        return;
      }
      forceStaticUntil = performance.now() + WARMUP_STATIC_MS;
      setCollapsed(false);
      startRenderLoop();
      revealTimer = 0;
    }, 0);
  }

  function createCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.className = 'rq-tv-screen';
    stage.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resizeCanvas();
  }

  function destroyCanvas() {
    if (!canvas) return;
    canvas.remove();
    canvas = null;
    ctx = null;
  }

  function resizeCanvas() {
    if (!canvas) return;
    var rect = stage.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(2, Math.round(rect.width * dpr));
    var h = Math.max(2, Math.round(rect.height * dpr));
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    width = w;
    height = h;
  }

  function releaseCurrentFrame() {
    if (currentFrame && currentFrame.close) currentFrame.close();
    currentFrame = null;
  }

  function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
  }

  function stopRenderLoop() {
    clearRenderTimer();
  }

  function teardownPlayback() {
    isPlaying = false;
    playToken++;
    setLoading(false);
    forceStaticUntil = 0;
    clearSequenceTimer();
    clearPreloadTimers();
    if (revealTimer) {
      clearTimeout(revealTimer);
      revealTimer = 0;
    }
    stopRenderLoop();
    releaseCurrentFrame();
    clearCanvas();
    destroyCanvas();
  }

  function drawFallback(elapsed) {
    if (!ctx) return;
    ctx.fillStyle = 'rgba(124, 186, 224, 0.15)';
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.52, 36, 44, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(176, 226, 250, 0.66)';
    ctx.stroke();
    ctx.fillStyle = 'rgba(182, 232, 255, 0.08)';
    for (var i = 0; i < 6; i++) {
      var y = (elapsed * 34 + i * 42) % height;
      ctx.fillRect(0, y, width, 1);
    }
  }

  function drawOverlay(elapsed) {
    if (!ctx) return;
    ctx.globalCompositeOperation = 'screen';
    for (var i = 0; i < 7; i++) {
      var y = (elapsed * 28 + i * 36) % height;
      ctx.fillStyle = i % 2 ? 'rgba(188,238,255,0.05)' : 'rgba(188,238,255,0.08)';
      ctx.fillRect(0, y, width, 1);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(154, 230, 255, 0.10)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    var sweepX = (Math.sin(elapsed * 0.9) * 0.5 + 0.5) * width;
    var sweep = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0);
    sweep.addColorStop(0, 'rgba(176, 230, 255, 0)');
    sweep.addColorStop(0.5, 'rgba(176, 230, 255, 0.12)');
    sweep.addColorStop(1, 'rgba(176, 230, 255, 0)');
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, width, height);
  }

  function drawFrame(frame) {
    if (!ctx) return;
    var item = playlist[playlistIndex] || null;
    var isGif = item && item.type === 'image/gif';
    var fw = frame.displayWidth || frame.width;
    var fh = frame.displayHeight || frame.height;
    var zoom = 1.32;
    var scale = Math.max(width / fw, height / fh) * zoom;
    var dw = fw * scale;
    var dh = fh * scale;
    var shiftX = -Math.min(74, width * 0.18);
    var shiftY = isGif ? 5 : 0;
    var dx = (width - dw) / 2 + shiftX;
    var dy = (height - dh) / 2 + shiftY;
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(frame, dx, dy, dw, dh);
    ctx.restore();
  }

  function renderTick() {
    if (!isPlaying || !ctx) {
      renderTimer = 0;
      return;
    }
    var now = performance.now();
    var elapsed = (now - start) * 0.001;
    var inStaticPhase = now < forceStaticUntil;
    ctx.clearRect(0, 0, width, height);
    if (!inStaticPhase && currentFrame) drawFrame(currentFrame);
    else drawFallback(elapsed);
    drawOverlay(elapsed);
    renderTimer = setTimeout(renderTick, FRAME_MS);
  }

  function startRenderLoop() {
    if (renderTimer) return;
    start = performance.now();
    renderTick();
  }

  function collapseAfterPlayback(token) {
    if (token !== playToken) return;
    scheduleSequence(function() {
      if (token !== playToken) return;
      isPlaying = false;
      stopRenderLoop();
      releaseCurrentFrame();
      clearCanvas();
      destroyCanvas();
      setCollapsed(true);
    }, COLLAPSE_DELAY_MS);
  }

  function fallbackPlay(index, token, attempt) {
    if (token !== playToken || !isPlaying) return;
    playlistIndex = index;
    if (index >= playlist.length) {
      collapseAfterPlayback(token);
      return;
    }

    var item = playlist[index];
    var tryCount = typeof attempt === 'number' ? attempt : 0;
    var cached = item.type === 'image/gif' ? null : imageCache[item.url];

    if (cached && cached.complete) {
      releaseCurrentFrame();
      currentFrame = cached;
      if (index === 0) revealMonitor(token);
      var cachedHold = item.holdLast || FALLBACK_STEP_MS;
      if (index === 0 && forceStaticUntil > performance.now()) {
        cachedHold += Math.ceil(forceStaticUntil - performance.now());
      }
      scheduleSequence(function() {
        fallbackPlay(index + 1, token, 0);
      }, cachedHold);
      return;
    }

    var img = new Image();
    img.onload = function() {
      if (token !== playToken || !isPlaying) return;
      if (item.type !== 'image/gif') imageCache[item.url] = img;
      releaseCurrentFrame();
      currentFrame = img;
      if (index === 0) revealMonitor(token);
      var holdMs = item.holdLast || FALLBACK_STEP_MS;
      if (item.type === 'image/gif') holdMs = Math.max(holdMs, FALLBACK_GIF_SHOW_MS);
      if (index === 0 && forceStaticUntil > performance.now()) {
        holdMs += Math.ceil(forceStaticUntil - performance.now());
      }
      scheduleSequence(function() {
        fallbackPlay(index + 1, token, 0);
      }, holdMs);
    };
    img.onerror = function() {
      var retryDelay = Math.min(1200, 180 * (tryCount + 1));
      scheduleSequence(function() {
        fallbackPlay(index, token, tryCount + 1);
      }, retryDelay);
    };
    img.src = resolveItemUrl(item);
  }

  function decodeWithImageDecoder(index, token) {
    if (token !== playToken || !isPlaying) return;
    playlistIndex = index;
    if (index >= playlist.length) {
      collapseAfterPlayback(token);
      return;
    }

    var item = playlist[index];

    function decodeFromData(data) {
      if (token !== playToken || !isPlaying) return;
      var decoder = new ImageDecoder({ data: data, type: item.type });
      var frameIndex = 0;

      function decodeNext() {
        if (token !== playToken || !isPlaying) return;
        decoder.decode({ frameIndex: frameIndex }).then(function(result) {
          if (token !== playToken || !isPlaying) return;
          releaseCurrentFrame();
          currentFrame = result.image;
          if (index === 0) revealMonitor(token);
          var baseDelay = result.image.duration ? result.image.duration / 1000 : 33;
          var delay = Math.max(16, baseDelay);
          if (index === 0 && forceStaticUntil > performance.now()) {
            delay += Math.ceil(forceStaticUntil - performance.now());
          }
          frameIndex++;
          if (frameIndex >= decoder.tracks.selectedTrack.frameCount) {
            var holdDelay = item.holdLast || 0;
            scheduleSequence(function() {
              decodeWithImageDecoder(index + 1, token);
            }, holdDelay);
            return;
          }
          scheduleSequence(decodeNext, delay);
        }).catch(function() {
          frameIndex = 0;
          scheduleSequence(decodeNext, 100);
        });
      }

      decoder.tracks.ready.then(function() {
        if (token !== playToken || !isPlaying) return;
        decodeNext();
      }).catch(function() {
        if (token !== playToken || !isPlaying) return;
        fallbackPlay(index, token, 0);
      });
    }

    var cachedData = mediaDataCache[item.url];
    if (cachedData instanceof ArrayBuffer) {
      decodeFromData(cachedData);
      return;
    }

    fetch(resolveItemUrl(item))
      .then(function(response) { return response.arrayBuffer(); })
      .then(function(buffer) {
        mediaDataCache[item.url] = buffer;
        decodeFromData(buffer);
      }).catch(function() {
        if (token !== playToken || !isPlaying) return;
        fallbackPlay(index, token, 0);
      });
  }

  function startPlayback() {
    if (isLoading) return;
    teardownPlayback();
    setLoading(true);
    createCanvas();
    if (!ctx) {
      setLoading(false);
      setCollapsed(true);
      return;
    }

    isPlaying = true;
    hasRevealed = false;
    setCollapsed(true);
    var token = playToken;

    preloadAssets(token, function(ok) {
      if (token !== playToken || !isPlaying) return;
      setLoading(false);
      if (!ok) {
        isPlaying = false;
        destroyCanvas();
        setCollapsed(true);
        return;
      }
      if (typeof ImageDecoder !== 'undefined') decodeWithImageDecoder(0, token);
      else fallbackPlay(0, token, 0);
    });
  }

  function queueAutoPlay() {
    function run() {
      clearSequenceTimer();
      sequenceTimer = setTimeout(function() {
        if (document.hidden) {
          pendingAutoPlay = true;
          return;
        }
        startPlayback();
      }, OPEN_DELAY_MS);
    }

    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run, { once: true });
  }

  toggle.addEventListener('click', function() {
    startPlayback();
  });

  function onTvVisibilityChange() {
    if (document.hidden) {
      stopRenderLoop();
    } else {
      if (pendingAutoPlay && !isPlaying) {
        pendingAutoPlay = false;
        startPlayback();
        return;
      }
      if (isPlaying && !renderTimer) startRenderLoop();
    }
  }

  window.addEventListener('resize', function() {
    if (canvas) resizeCanvas();
  }, { passive: true });
  document.addEventListener('visibilitychange', onTvVisibilityChange);
  window.addEventListener('beforeunload', function() { teardownPlayback(); }, { once: true });

  setCollapsed(true);
  queueAutoPlay();
}
