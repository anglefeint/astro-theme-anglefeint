function randHex() {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return chars[Math.floor(Math.random() * chars.length)];
}

function randKeyLine(pairs) {
  var s = [];
  for (var i = 0; i < pairs; i++) s.push(randHex() + randHex());
  return s.join(' ');
}

function randPass() {
  var s = '';
  for (var i = 0; i < 6; i++) s += randHex().toLowerCase();
  s += '@' + randHex() + randHex() + randHex() + randHex() + randHex();
  return s;
}

export function initAboutModals(runtimeConfig, prefersReducedMotion) {
  var modalOverlay = document.getElementById('hacker-modal');
  var modalBody = document.getElementById('hacker-modal-body');
  var modalTitle = document.querySelector('.hacker-modal-title');
  if (!modalOverlay || !modalBody || !modalTitle) return;

  var decryptorKeysLabel = runtimeConfig.decryptorKeysLabel || 'keys tested';
  var decryptorInterval = null;
  var helpCharCount = 0;

  function startDecryptorFlash() {
    if (prefersReducedMotion) return;
    if (decryptorInterval) clearInterval(decryptorInterval);
    var keys = 0;
    var sec = 1;
    decryptorInterval = setInterval(function() {
      if (!modalOverlay.classList.contains('open')) {
        clearInterval(decryptorInterval);
        decryptorInterval = null;
        return;
      }
      keys += 1 + Math.floor(Math.random() * 3);
      sec = Math.min(59, Math.floor(keys / 15) + 1);
      var el = document.getElementById('dec-keys');
      if (el) el.textContent = '[00:00:' + String(sec).padStart(2, '0') + '] ' + keys + ' ' + decryptorKeysLabel;
      el = document.getElementById('dec-pass');
      if (el) el.textContent = randPass();
      el = document.getElementById('dec-master1');
      if (el) el.textContent = randKeyLine(8);
      el = document.getElementById('dec-master2');
      if (el) el.textContent = randKeyLine(8);
      el = document.getElementById('dec-trans1');
      if (el) el.textContent = randKeyLine(7);
      el = document.getElementById('dec-trans2');
      if (el) el.textContent = randKeyLine(7);
      el = document.getElementById('dec-trans3');
      if (el) el.textContent = randKeyLine(8);
      el = document.getElementById('dec-trans4');
      if (el) el.textContent = randKeyLine(8);
    }, 180);
  }

  function buildHelpKeyboard() {
    var keyboardConfig = runtimeConfig.keyboard || {};
    var statsLabel = keyboardConfig.statsLabel || 'Stats & Achievements';
    var typedPrefix = keyboardConfig.typedPrefix || 'You typed:';
    var typedSuffix = keyboardConfig.typedSuffix || 'characters';
    var rows = [
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
      ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
      ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'ShiftRight'],
      ['Ctrl', 'Alt', 'Space', 'AltRight', 'CtrlRight'],
    ];
    var codeMap = {
      '`': 'Backquote',
      '1': 'Digit1',
      '2': 'Digit2',
      '3': 'Digit3',
      '4': 'Digit4',
      '5': 'Digit5',
      '6': 'Digit6',
      '7': 'Digit7',
      '8': 'Digit8',
      '9': 'Digit9',
      '0': 'Digit0',
      '-': 'Minus',
      '=': 'Equal',
      Backspace: 'Backspace',
      Tab: 'Tab',
      Q: 'KeyQ',
      W: 'KeyW',
      E: 'KeyE',
      R: 'KeyR',
      T: 'KeyT',
      Y: 'KeyY',
      U: 'KeyU',
      I: 'KeyI',
      O: 'KeyO',
      P: 'KeyP',
      '[': 'BracketLeft',
      ']': 'BracketRight',
      CapsLock: 'CapsLock',
      A: 'KeyA',
      S: 'KeyS',
      D: 'KeyD',
      F: 'KeyF',
      G: 'KeyG',
      H: 'KeyH',
      J: 'KeyJ',
      K: 'KeyK',
      L: 'KeyL',
      ';': 'Semicolon',
      "'": 'Quote',
      Enter: 'Enter',
      Shift: 'ShiftLeft',
      ShiftRight: 'ShiftRight',
      Z: 'KeyZ',
      X: 'KeyX',
      C: 'KeyC',
      V: 'KeyV',
      B: 'KeyB',
      N: 'KeyN',
      M: 'KeyM',
      ',': 'Comma',
      '.': 'Period',
      '/': 'Slash',
      Ctrl: 'ControlLeft',
      CtrlRight: 'ControlRight',
      Alt: 'AltLeft',
      AltRight: 'AltRight',
      Space: 'Space',
    };

    var html = '<div class="hacker-vkeyboard-wrap" id="help-keyboard">';
    html += '<div class="hacker-vkeyboard hacker-vkeyboard-main">';
    rows.forEach(function(row) {
      html += '<div class="hacker-vkeyboard-row">';
      row.forEach(function(k) {
        var code = codeMap[k] || k;
        var cls = 'hacker-vkey';
        if (k === 'Tab' || k === 'CapsLock' || k === 'Enter') cls += ' wide';
        if (k === 'Space') cls += ' space';
        if (k === 'Backspace') cls += ' acc backspace';
        var label =
          k === 'Space'
            ? '&nbsp;'
            : k === 'ShiftRight'
              ? 'Shift'
              : k === 'CtrlRight'
                ? 'Ctrl'
                : k === 'AltRight'
                  ? 'Alt'
                  : k === 'Backspace'
                    ? 'Back ⌫'
                    : k;
        html +=
          '<span class="' +
          cls +
          '" data-code="' +
          code +
          '" data-key="' +
          (k === 'ShiftRight' ? 'Shift' : k === 'CtrlRight' ? 'Ctrl' : k === 'AltRight' ? 'Alt' : k === 'Backspace' ? 'Backspace' : k).replace("'", "\\'") +
          '"' +
          (k === 'Backspace' ? ' title="Backspace or ESC"' : '') +
          '>' +
          label +
          '</span>';
      });
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="hacker-vkeyboard-side">';
    html += '<div class="hacker-vkeyboard-side-block">';
    html += '<div class="hacker-vkeyboard-side-row"><span class="hacker-vkey" data-code="Insert" data-key="Ins">Insert</span><span class="hacker-vkey nav-home" data-code="Home" data-key="Home">Home</span><span class="hacker-vkey" data-code="PageUp" data-key="PgUp">PgUp</span></div>';
    html += '<div class="hacker-vkeyboard-side-row"><span class="hacker-vkey" data-code="Delete" data-key="Del">Delete</span><span class="hacker-vkey nav-end" data-code="End" data-key="End">End</span><span class="hacker-vkey" data-code="PageDown" data-key="PgDn">PgDn</span></div>';
    html += '</div>';
    html += '<div class="hacker-vkeyboard-side-row"><span class="hacker-vkey" data-code="Purge" data-key="Purge">Purge</span></div>';
    html += '<div class="hacker-vkeyboard-arrows-wrap">';
    html += '<div class="hacker-vkeyboard-arrows">';
    html += '<span class="hacker-vkey arr-u" data-code="ArrowUp" data-key="↑">↑</span>';
    html += '<span class="hacker-vkey arr-l" data-code="ArrowLeft" data-key="←">←</span>';
    html += '<span class="hacker-vkey arr-r" data-code="ArrowRight" data-key="→">→</span>';
    html += '<span class="hacker-vkey arr-d" data-code="ArrowDown" data-key="↓">↓</span>';
    html += '</div>';
    html += '</div></div></div>';
    html += '<div class="hacker-vkeyboard-stats"><span class="hacker-vkeyboard-stats-label">' + statsLabel + '</span><br>' + typedPrefix + ' <span id="help-char-count">0</span> ' + typedSuffix + '</div>';
    return html;
  }

  function highlightKey(code) {
    if (code === 'Escape') code = 'Backspace';
    var el = modalBody.querySelector('.hacker-vkey[data-code="' + code + '"]');
    if (!el) {
      if (code === 'ShiftRight') el = modalBody.querySelector('.hacker-vkey[data-code="ShiftLeft"]');
      else if (code === 'ControlRight') el = modalBody.querySelector('.hacker-vkey[data-code="ControlLeft"]');
      else if (code === 'AltRight') el = modalBody.querySelector('.hacker-vkey[data-code="AltLeft"]');
    }
    if (el) {
      el.classList.add('highlight');
      setTimeout(function() {
        el.classList.remove('highlight');
      }, 150);
    }
  }

  function initHelpKeyboard() {
    helpCharCount = 0;
    var charEl = document.getElementById('help-char-count');
    if (charEl) charEl.textContent = '0';
    modalBody.querySelectorAll('.hacker-vkey').forEach(function(k) {
      k.addEventListener('click', function() {
        var code = k.getAttribute('data-code');
        highlightKey(code);
        var key = k.getAttribute('data-key');
        var navKeys = ['Shift', 'Ctrl', 'Alt', 'CapsLock', 'Tab', 'Enter', 'Backspace', 'Space', 'Ins', 'Home', 'PgUp', 'Del', 'End', 'PgDn', 'Purge', '↑', '↓', '←', '→'];
        if (key && navKeys.indexOf(key) === -1) {
          helpCharCount++;
          charEl = document.getElementById('help-char-count');
          if (charEl) charEl.textContent = helpCharCount;
        } else if (key === 'Space') {
          helpCharCount++;
          charEl = document.getElementById('help-char-count');
          if (charEl) charEl.textContent = helpCharCount;
        }
      });
    });
  }

  function handleHelpKeydown(e) {
    if (!modalOverlay.classList.contains('open') || !modalBody.classList.contains('hacker-modal-keyboard')) return;
    if (e.key === 'Escape') return;
    e.preventDefault();
    highlightKey(e.code);
    if (e.key.length === 1) {
      helpCharCount++;
      var charEl = document.getElementById('help-char-count');
      if (charEl) charEl.textContent = helpCharCount;
    }
  }

  var scriptsTpl = document.getElementById('hacker-scripts-folders-tpl');
  var fallbackModalContent = {
    'dl-data': { title: 'Downloading...', body: '<div class="hacker-modal-download"><div class="modal-subtitle">Critical Data</div><div class="hacker-modal-progress" id="dl-progress"></div></div>', type: 'progress' },
    ai: { title: 'AI', body: '<pre>~ $ model --status\n\ninference: stable\ncontext: 8k tokens\nlatency: &lt; 200ms\n\n&gt;&gt; system online</pre>' },
    decryptor: { title: 'Password Decryptor', body: '<pre class="hacker-decryptor-pre">Calculating Hashes\n\n<span id="dec-keys">[00:00:01] 0 keys tested</span>\n\nCurrent passphrase: <span id="dec-pass">********</span>\n\nMaster key\n<span id="dec-master1"></span>\n<span id="dec-master2"></span>\n\nTransient key\n<span id="dec-trans1"></span>\n<span id="dec-trans2"></span>\n<span id="dec-trans3"></span>\n<span id="dec-trans4"></span></pre>', type: 'decryptor' },
    help: { title: 'Help', body: '', type: 'keyboard' },
    'all-scripts': { title: '/root/bash/scripts', body: '', type: 'scripts' },
  };

  var modalContent = runtimeConfig.modalContent || fallbackModalContent;
  document.querySelectorAll('.hacker-folder[data-modal]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id = btn.getAttribute('data-modal');
      var data = modalContent[id];
      if (!data) return;

      var modalEl = modalOverlay.querySelector('.hacker-modal');
      if (modalEl) modalEl.classList.remove('hacker-modal-wide');
      modalTitle.textContent = data.title;
      modalBody.innerHTML = data.body;
      modalBody.className =
        'hacker-modal-body' +
        (data.type === 'progress' ? ' hacker-modal-download' : '') +
        (data.type === 'keyboard' ? ' hacker-modal-keyboard' : '') +
        (data.type === 'scripts' ? ' hacker-modal-scripts-wrap' : '');

      if (data.type === 'progress') {
        var bar = document.getElementById('dl-progress');
        if (bar) {
          bar.innerHTML = '';
          for (var i = 0; i < 48; i++) bar.appendChild(document.createElement('span'));
          var idx = 0;
          function fillNext() {
            if (idx < 48) {
              bar.children[idx].classList.add('filled');
              idx++;
              setTimeout(fillNext, 80 + Math.random() * 60);
            }
          }
          fillNext();
        }
      } else if (data.type === 'decryptor') {
        var el = document.getElementById('dec-keys');
        if (el) el.textContent = '[00:00:01] 0 ' + decryptorKeysLabel;
        el = document.getElementById('dec-pass');
        if (el) el.textContent = randPass();
        el = document.getElementById('dec-master1');
        if (el) el.textContent = randKeyLine(8);
        el = document.getElementById('dec-master2');
        if (el) el.textContent = randKeyLine(8);
        el = document.getElementById('dec-trans1');
        if (el) el.textContent = randKeyLine(7);
        el = document.getElementById('dec-trans2');
        if (el) el.textContent = randKeyLine(7);
        el = document.getElementById('dec-trans3');
        if (el) el.textContent = randKeyLine(8);
        el = document.getElementById('dec-trans4');
        if (el) el.textContent = randKeyLine(8);
        startDecryptorFlash();
      } else if (data.type === 'keyboard') {
        modalBody.innerHTML = buildHelpKeyboard();
        if (modalEl) modalEl.classList.add('hacker-modal-wide');
        initHelpKeyboard();
        document.addEventListener('keydown', handleHelpKeydown);
      } else if (data.type === 'scripts' && scriptsTpl) {
        modalBody.innerHTML = '';
        if ('content' in scriptsTpl && scriptsTpl.content) {
          modalBody.appendChild(scriptsTpl.content.cloneNode(true));
        } else {
          modalBody.appendChild(scriptsTpl.cloneNode(true));
          var cloned = modalBody.querySelector('#hacker-scripts-folders-tpl');
          if (cloned) {
            cloned.removeAttribute('id');
            cloned.hidden = false;
            cloned.removeAttribute('aria-hidden');
          }
        }
        if (modalEl) modalEl.classList.add('hacker-modal-wide');
      }

      modalOverlay.classList.add('open');
      modalOverlay.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal() {
    if (decryptorInterval) {
      clearInterval(decryptorInterval);
      decryptorInterval = null;
    }
    document.removeEventListener('keydown', handleHelpKeydown);
    var modalEl = modalOverlay.querySelector('.hacker-modal');
    if (modalEl) modalEl.classList.remove('hacker-modal-wide');
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }

  var closeButton = document.querySelector('.hacker-modal-close');
  if (closeButton) closeButton.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });
}
