import { createDecryptorController } from './modal-decryptor.js';
import { mountHelpKeyboard } from './modal-keyboard.js';
import { renderProgressModal } from './modal-progress.js';

let cleanupAboutModals = null;

export function initAboutModals(runtimeConfig, prefersReducedMotion) {
  if (cleanupAboutModals) cleanupAboutModals();

  const modalOverlay = document.getElementById('hacker-modal');
  const modalBody = document.getElementById('hacker-modal-body');
  const modalTitle = document.querySelector('.hacker-modal-title');
  const closeButton = document.querySelector('.hacker-modal-close');
  if (!modalOverlay || !modalBody || !modalTitle) return;
  let lastFocusedElement = null;
  let titleTimer = 0;
  let resolvedTitle = '';

  function stopTitleReveal() {
    window.clearTimeout(titleTimer);
    titleTimer = 0;
    modalTitle.textContent = resolvedTitle;
  }

  function revealTitle(title) {
    stopTitleReveal();
    resolvedTitle = String(title ?? '');
    modalTitle.textContent = resolvedTitle;
    if (prefersReducedMotion || document.hidden || !resolvedTitle) return;
    const glyphs = Array.from(
      new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(resolvedTitle),
      (part) => part.segment
    );
    // Long customized labels stay immediate; keep the accessible name stable.
    if (glyphs.length > 64) return;
    const label = document.createElement('span');
    label.className = 'hacker-title-source';
    label.textContent = resolvedTitle;
    const visual = document.createElement('span');
    visual.className = 'hacker-title-decode';
    visual.setAttribute('aria-hidden', 'true');
    modalTitle.replaceChildren(label, visual);
    const noise = '01/<>_#';
    let frame = 0;
    function tick() {
      if (document.hidden || frame >= 10) {
        stopTitleReveal();
        return;
      }
      const count = Math.floor((glyphs.length * frame) / 10);
      visual.textContent = glyphs
        .map((glyph, index) =>
          index < count || /^\s+$/u.test(glyph) ? glyph : noise[(index + frame) % noise.length]
        )
        .join('');
      frame += 1;
      titleTimer = window.setTimeout(tick, 36);
    }
    tick();
  }

  function getFocusableElements() {
    return Array.from(
      modalOverlay.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true'
    );
  }

  const decryptorKeysLabel =
    typeof runtimeConfig.decryptorKeysLabel === 'string' ? runtimeConfig.decryptorKeysLabel : '';
  const decryptor = createDecryptorController(
    modalOverlay,
    prefersReducedMotion,
    decryptorKeysLabel
  );
  let cleanupKeyboard = null;

  const scriptsTpl = document.getElementById('hacker-scripts-folders-tpl');
  const modalContent = runtimeConfig.modalContent;
  if (!modalContent || typeof modalContent !== 'object') return;

  const closeModal = () => {
    stopTitleReveal();
    decryptor.stop();
    if (cleanupKeyboard) {
      cleanupKeyboard();
      cleanupKeyboard = null;
    }

    const modalEl = modalOverlay.querySelector('.hacker-modal');
    if (modalEl) modalEl.classList.remove('hacker-modal-wide');
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  const openModal = (data) => {
    if (!data) return;
    lastFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    decryptor.stop();
    if (cleanupKeyboard) {
      cleanupKeyboard();
      cleanupKeyboard = null;
    }

    const modalEl = modalOverlay.querySelector('.hacker-modal');
    if (modalEl) modalEl.classList.remove('hacker-modal-wide');

    revealTitle(data.title);
    modalBody.innerHTML = data.body;
    modalBody.className =
      'hacker-modal-body' +
      (data.type === 'progress' ? ' hacker-modal-download' : '') +
      (data.type === 'keyboard' ? ' hacker-modal-keyboard' : '') +
      (data.type === 'scripts' ? ' hacker-modal-scripts-wrap' : '');

    if (data.type === 'progress') {
      renderProgressModal();
    } else if (data.type === 'decryptor') {
      decryptor.prime();
      decryptor.start();
    } else if (data.type === 'keyboard') {
      if (modalEl) modalEl.classList.add('hacker-modal-wide');
      cleanupKeyboard = mountHelpKeyboard(modalOverlay, modalBody, runtimeConfig);
    } else if (data.type === 'scripts' && scriptsTpl) {
      modalBody.innerHTML = '';
      if ('content' in scriptsTpl && scriptsTpl.content) {
        modalBody.appendChild(scriptsTpl.content.cloneNode(true));
      } else {
        modalBody.appendChild(scriptsTpl.cloneNode(true));
        const cloned = modalBody.querySelector('#hacker-scripts-folders-tpl');
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
    window.requestAnimationFrame(() => {
      const focusables = getFocusableElements();
      const nextFocus = focusables[0] || closeButton || modalOverlay;
      if (nextFocus && typeof nextFocus.focus === 'function') {
        nextFocus.focus();
      }
    });
  };

  const folderButtons = Array.from(document.querySelectorAll('.hacker-folder[data-modal]'));
  const buttonHandlers = folderButtons.map((button) => {
    const onClick = () => {
      const id = button.getAttribute('data-modal');
      if (!id) return;
      openModal(modalContent[id]);
    };
    button.addEventListener('click', onClick);
    return [button, onClick];
  });

  if (closeButton) closeButton.addEventListener('click', closeModal);

  const onOverlayClick = (event) => {
    if (event.target === modalOverlay) closeModal();
  };
  modalOverlay.addEventListener('click', onOverlayClick);

  const onDocumentKeydown = (event) => {
    if (!modalOverlay.classList.contains('open')) return;
    if (event.key === 'Escape') {
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusables = getFocusableElements();
    if (focusables.length === 0) {
      event.preventDefault();
      if (closeButton && typeof closeButton.focus === 'function') {
        closeButton.focus();
      }
      return;
    }

    const currentIndex = focusables.indexOf(document.activeElement);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first || currentIndex === -1) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  document.addEventListener('keydown', onDocumentKeydown);

  cleanupAboutModals = () => {
    stopTitleReveal();
    decryptor.stop();
    if (cleanupKeyboard) {
      cleanupKeyboard();
      cleanupKeyboard = null;
    }
    if (closeButton) closeButton.removeEventListener('click', closeModal);
    modalOverlay.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onDocumentKeydown);
    buttonHandlers.forEach(([button, handler]) => {
      button.removeEventListener('click', handler);
    });
  };

  return cleanupAboutModals;
}
