export function initTerminalBackground(runtimeConfig, prefersReducedMotion) {
  var bgCanvas = document.querySelector('.hacker-bg-canvas');
  if (!bgCanvas) return;

  var bgCtx = bgCanvas.getContext('2d');
  var fontSize = 13;
  var lineHeight = 18;
  var bgAnimationId = 0;
  var fallbackDirLines = [
    '~ $ ls -la',
    'total 42',
    'drwxr-xr-x  12 void  staff   384  Jan 12  about  blog  projects',
    'drwxr-xr-x   8 void  staff   256  Jan 11  .config  .ssh  keys',
    '-rw-r--r--   1 void  staff  2048  Jan 10  README.md  .env.gpg',
    '-rwxr-xr-x   1 void  staff   512  Jan  9  deploy.sh  hack',
    '~ $ cat .motd',
    '>> welcome to the void | access granted',
  ];
  var dirLines = runtimeConfig.effects && Array.isArray(runtimeConfig.effects.backgroundLines) && runtimeConfig.effects.backgroundLines.length > 0
    ? runtimeConfig.effects.backgroundLines
    : fallbackDirLines;
  var hackerFocused = false;
  var hackerInput = '';
  var hackerHistory = [];

  function sizeBackground() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    bgCanvas.width = window.innerWidth * dpr;
    bgCanvas.height = window.innerHeight * dpr;
    bgCanvas.style.width = window.innerWidth + 'px';
    bgCanvas.style.height = window.innerHeight + 'px';
    bgCtx.scale(dpr, dpr);
  }

  function renderBg(t) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bgCtx.clearRect(0, 0, w, h);
    bgCtx.fillStyle = '#0a0a0a';
    bgCtx.fillRect(0, 0, w, h);

    bgCtx.font = fontSize + 'px ui-monospace, SFMono-Regular, Menlo, monospace';
    var padX = 24;
    var baseY = 22;

    for (var i = 0; i < dirLines.length; i++) {
      var line = dirLines[i];
      if (line.indexOf('~ $') === 0) {
        bgCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      } else if (line.indexOf('>>') === 0) {
        bgCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      } else if (line.indexOf('total') === 0 || line.indexOf('drwx') === 0 || line.indexOf('-rw') === 0) {
        bgCtx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      } else {
        bgCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      }
      bgCtx.fillText(line, padX, baseY + i * lineHeight);
    }

    var promptY = baseY + dirLines.length * lineHeight + 10;

    for (var j = 0; j < hackerHistory.length; j++) {
      bgCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      bgCtx.fillText('~ $ ' + hackerHistory[j], padX, promptY + j * lineHeight);
    }

    var currentY = promptY + hackerHistory.length * lineHeight;
    bgCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    bgCtx.fillText('~ $ ', padX, currentY);
    var promptW = bgCtx.measureText('~ $ ').width;
    bgCtx.fillText(hackerInput, padX + promptW, currentY);
    var inputW = bgCtx.measureText(hackerInput).width;
    var blink = Math.floor(t / 530) % 2;
    if (blink && hackerFocused) {
      bgCtx.fillStyle = 'rgba(0, 255, 100, 0.9)';
      bgCtx.fillRect(padX + promptW + inputW, currentY - fontSize + 4, 8, fontSize - 2);
    } else if (!hackerFocused && blink) {
      bgCtx.fillStyle = 'rgba(0, 255, 100, 0.9)';
      bgCtx.fillRect(padX + promptW + inputW, currentY - fontSize + 4, 8, fontSize - 2);
    }

    bgAnimationId = requestAnimationFrame(renderBg);
  }

  function startBackgroundLoop() {
    if (bgAnimationId || document.hidden) return;
    bgAnimationId = requestAnimationFrame(renderBg);
  }

  function stopBackgroundLoop() {
    if (!bgAnimationId) return;
    cancelAnimationFrame(bgAnimationId);
    bgAnimationId = 0;
  }

  sizeBackground();

  if (prefersReducedMotion) {
    renderBg(performance.now());
    stopBackgroundLoop();
  } else {
    startBackgroundLoop();
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        stopBackgroundLoop();
        return;
      }
      startBackgroundLoop();
    });
  }

  document.addEventListener('click', function(e) {
    var content = document.querySelector('.about-shell');
    var header = document.querySelector('header');
    var footer = document.querySelector('footer');
    if (content && content.contains(e.target)) {
      hackerFocused = false;
    } else if (header && header.contains(e.target)) {
      hackerFocused = false;
    } else if (footer && footer.contains(e.target)) {
      hackerFocused = false;
    } else if (e.target.closest('.hacker-back-to-top, .hacker-regenerate')) {
      hackerFocused = false;
    } else {
      hackerFocused = true;
    }
  });

  document.addEventListener('keydown', function(e) {
    if (!hackerFocused) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
    if (e.key === 'Enter') {
      hackerHistory.push(hackerInput);
      hackerInput = '';
      if (hackerHistory.length > 8) hackerHistory.shift();
    } else if (e.key === 'Backspace') {
      hackerInput = hackerInput.slice(0, -1);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && hackerInput.length < 80) {
      hackerInput += e.key;
    }
  });

  window.addEventListener('resize', function() {
    sizeBackground();
  }, { passive: true });
}
