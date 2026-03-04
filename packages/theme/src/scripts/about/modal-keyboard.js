const NAV_KEYS = new Set([
  'Shift',
  'Ctrl',
  'Alt',
  'CapsLock',
  'Tab',
  'Enter',
  'Backspace',
  'Space',
  'Ins',
  'Home',
  'PgUp',
  'Del',
  'End',
  'PgDn',
  'Purge',
  '↑',
  '↓',
  '←',
  '→',
]);

const CODE_MAP = {
  '`': 'Backquote',
  1: 'Digit1',
  2: 'Digit2',
  3: 'Digit3',
  4: 'Digit4',
  5: 'Digit5',
  6: 'Digit6',
  7: 'Digit7',
  8: 'Digit8',
  9: 'Digit9',
  0: 'Digit0',
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

const KEY_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'ShiftRight'],
  ['Ctrl', 'Alt', 'Space', 'AltRight', 'CtrlRight'],
];

function keyLabel(key) {
  if (key === 'Space') return '&nbsp;';
  if (key === 'ShiftRight') return 'Shift';
  if (key === 'CtrlRight') return 'Ctrl';
  if (key === 'AltRight') return 'Alt';
  if (key === 'Backspace') return 'Back ⌫';
  return key;
}

function keyData(key) {
  if (key === 'ShiftRight') return 'Shift';
  if (key === 'CtrlRight') return 'Ctrl';
  if (key === 'AltRight') return 'Alt';
  if (key === 'Backspace') return 'Backspace';
  return key;
}

function buildHelpKeyboardHtml(runtimeConfig) {
  const keyboardConfig = runtimeConfig.keyboard || {};
  const statsLabel = keyboardConfig.statsLabel || 'Stats & Achievements';
  const typedPrefix = keyboardConfig.typedPrefix || 'You typed:';
  const typedSuffix = keyboardConfig.typedSuffix || 'characters';

  let html = '<div class="hacker-vkeyboard-wrap" id="help-keyboard">';
  html += '<div class="hacker-vkeyboard hacker-vkeyboard-main">';

  KEY_ROWS.forEach((row) => {
    html += '<div class="hacker-vkeyboard-row">';
    row.forEach((key) => {
      const code = CODE_MAP[key] || key;
      let cls = 'hacker-vkey';
      if (key === 'Tab' || key === 'CapsLock' || key === 'Enter') cls += ' wide';
      if (key === 'Space') cls += ' space';
      if (key === 'Backspace') cls += ' acc backspace';
      const dataKey = keyData(key).replace("'", "\\'");

      html +=
        '<span class="' +
        cls +
        '" data-code="' +
        code +
        '" data-key="' +
        dataKey +
        '"' +
        (key === 'Backspace' ? ' title="Backspace or ESC"' : '') +
        '>' +
        keyLabel(key) +
        '</span>';
    });
    html += '</div>';
  });

  html += '</div>';
  html += '<div class="hacker-vkeyboard-side">';
  html += '<div class="hacker-vkeyboard-side-block">';
  html +=
    '<div class="hacker-vkeyboard-side-row"><span class="hacker-vkey" data-code="Insert" data-key="Ins">Insert</span><span class="hacker-vkey nav-home" data-code="Home" data-key="Home">Home</span><span class="hacker-vkey" data-code="PageUp" data-key="PgUp">PgUp</span></div>';
  html +=
    '<div class="hacker-vkeyboard-side-row"><span class="hacker-vkey" data-code="Delete" data-key="Del">Delete</span><span class="hacker-vkey nav-end" data-code="End" data-key="End">End</span><span class="hacker-vkey" data-code="PageDown" data-key="PgDn">PgDn</span></div>';
  html += '</div>';
  html +=
    '<div class="hacker-vkeyboard-side-row"><span class="hacker-vkey" data-code="Purge" data-key="Purge">Purge</span></div>';
  html += '<div class="hacker-vkeyboard-arrows-wrap">';
  html += '<div class="hacker-vkeyboard-arrows">';
  html += '<span class="hacker-vkey arr-u" data-code="ArrowUp" data-key="↑">↑</span>';
  html += '<span class="hacker-vkey arr-l" data-code="ArrowLeft" data-key="←">←</span>';
  html += '<span class="hacker-vkey arr-r" data-code="ArrowRight" data-key="→">→</span>';
  html += '<span class="hacker-vkey arr-d" data-code="ArrowDown" data-key="↓">↓</span>';
  html += '</div>';
  html += '</div></div></div>';
  html += `<div class="hacker-vkeyboard-stats"><span class="hacker-vkeyboard-stats-label">${statsLabel}</span><br>${typedPrefix} <span id="help-char-count">0</span> ${typedSuffix}</div>`;
  return html;
}

function highlightKey(modalBody, code) {
  const normalizedCode = code === 'Escape' ? 'Backspace' : code;

  let el = modalBody.querySelector(`.hacker-vkey[data-code="${normalizedCode}"]`);
  if (!el) {
    if (normalizedCode === 'ShiftRight')
      el = modalBody.querySelector('.hacker-vkey[data-code="ShiftLeft"]');
    else if (normalizedCode === 'ControlRight')
      el = modalBody.querySelector('.hacker-vkey[data-code="ControlLeft"]');
    else if (normalizedCode === 'AltRight')
      el = modalBody.querySelector('.hacker-vkey[data-code="AltLeft"]');
  }

  if (!el) return;
  el.classList.add('highlight');
  setTimeout(() => {
    el.classList.remove('highlight');
  }, 150);
}

export function mountHelpKeyboard(modalOverlay, modalBody, runtimeConfig) {
  let helpCharCount = 0;
  modalBody.innerHTML = buildHelpKeyboardHtml(runtimeConfig);

  const updateCount = () => {
    const charEl = document.getElementById('help-char-count');
    if (charEl) charEl.textContent = String(helpCharCount);
  };

  const onKeyClick = (keyEl) => {
    const code = keyEl.getAttribute('data-code');
    if (code) highlightKey(modalBody, code);

    const key = keyEl.getAttribute('data-key');
    if (!key) return;
    if (!NAV_KEYS.has(key) || key === 'Space') {
      helpCharCount += 1;
      updateCount();
    }
  };

  modalBody.querySelectorAll('.hacker-vkey').forEach((keyEl) => {
    keyEl.addEventListener('click', () => onKeyClick(keyEl));
  });
  updateCount();

  const onKeyDown = (event) => {
    if (
      !modalOverlay.classList.contains('open') ||
      !modalBody.classList.contains('hacker-modal-keyboard')
    )
      return;
    if (event.key === 'Escape') return;

    event.preventDefault();
    highlightKey(modalBody, event.code);
    if (event.key.length !== 1) return;
    helpCharCount += 1;
    updateCount();
  };

  document.addEventListener('keydown', onKeyDown);
  return () => {
    document.removeEventListener('keydown', onKeyDown);
  };
}
