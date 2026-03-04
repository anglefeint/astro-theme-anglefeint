function randHex() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return chars[Math.floor(Math.random() * chars.length)];
}

function randKeyLine(pairs) {
  const chunks = [];
  for (let i = 0; i < pairs; i += 1) chunks.push(randHex() + randHex());
  return chunks.join(' ');
}

function randPass() {
  let pass = '';
  for (let i = 0; i < 6; i += 1) pass += randHex().toLowerCase();
  pass += '@' + randHex() + randHex() + randHex() + randHex() + randHex();
  return pass;
}

function setDecryptorFields(keysLabel, keys = 0, sec = 1) {
  let el = document.getElementById('dec-keys');
  if (el) el.textContent = `[00:00:${String(sec).padStart(2, '0')}] ${keys} ${keysLabel}`;

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
}

export function createDecryptorController(modalOverlay, prefersReducedMotion, keysLabel) {
  let decryptorInterval = null;

  const stop = () => {
    if (!decryptorInterval) return;
    clearInterval(decryptorInterval);
    decryptorInterval = null;
  };

  const prime = () => {
    setDecryptorFields(keysLabel, 0, 1);
  };

  const start = () => {
    if (prefersReducedMotion) return;
    stop();

    let keys = 0;
    let sec = 1;
    decryptorInterval = setInterval(() => {
      if (!modalOverlay.classList.contains('open')) {
        stop();
        return;
      }

      keys += 1 + Math.floor(Math.random() * 3);
      sec = Math.min(59, Math.floor(keys / 15) + 1);
      setDecryptorFields(keysLabel, keys, sec);
    }, 180);
  };

  return { prime, start, stop };
}
