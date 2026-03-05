import { createDecryptorController } from './modal-decryptor.js';
import { mountHelpKeyboard } from './modal-keyboard.js';
import { renderProgressModal } from './modal-progress.js';

export function initAboutModals(runtimeConfig, prefersReducedMotion) {
  const modalOverlay = document.getElementById('hacker-modal');
  const modalBody = document.getElementById('hacker-modal-body');
  const modalTitle = document.querySelector('.hacker-modal-title');
  if (!modalOverlay || !modalBody || !modalTitle) return;

  const decryptorKeysLabel = runtimeConfig.decryptorKeysLabel || 'keys tested';
  const decryptor = createDecryptorController(
    modalOverlay,
    prefersReducedMotion,
    decryptorKeysLabel
  );
  let cleanupKeyboard = null;

  const scriptsTpl = document.getElementById('hacker-scripts-folders-tpl');
  const fallbackModalContent = {
    'dl-data': {
      title: 'Downloading...',
      body: '<div class="hacker-modal-download"><div class="modal-subtitle">Critical Data</div><div class="hacker-modal-progress" id="dl-progress"></div></div>',
      type: 'progress',
    },
    ai: {
      title: 'AI',
      body: '<pre>~ $ ai --status --verbose\n\nmodel: runtime-default\nmode: standard\ncontext window: 32k\nlatency: 100-250ms\nsafety: enabled\n\n&gt;&gt; system online\n&gt;&gt; ready</pre>',
      type: 'plain',
    },
    decryptor: {
      title: 'Password Decryptor',
      body: '<pre class="hacker-decryptor-pre">Calculating Hashes\n\n<span id="dec-keys">[00:00:01] 0 keys tested</span>\n\nCurrent passphrase: <span id="dec-pass">********</span>\n\nMaster key\n<span id="dec-master1"></span>\n<span id="dec-master2"></span>\n\nTransient key\n<span id="dec-trans1"></span>\n<span id="dec-trans2"></span>\n<span id="dec-trans3"></span>\n<span id="dec-trans4"></span></pre>',
      type: 'decryptor',
    },
    help: { title: 'Help', body: '', type: 'keyboard' },
    'all-scripts': { title: '/root/bash/scripts', body: '', type: 'scripts' },
  };
  const modalContent = runtimeConfig.modalContent || fallbackModalContent;

  const closeModal = () => {
    decryptor.stop();
    if (cleanupKeyboard) {
      cleanupKeyboard();
      cleanupKeyboard = null;
    }

    const modalEl = modalOverlay.querySelector('.hacker-modal');
    if (modalEl) modalEl.classList.remove('hacker-modal-wide');
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
  };

  const openModal = (data) => {
    if (!data) return;

    decryptor.stop();
    if (cleanupKeyboard) {
      cleanupKeyboard();
      cleanupKeyboard = null;
    }

    const modalEl = modalOverlay.querySelector('.hacker-modal');
    if (modalEl) modalEl.classList.remove('hacker-modal-wide');

    modalTitle.textContent = data.title;
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
  };

  document.querySelectorAll('.hacker-folder[data-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-modal');
      if (!id) return;
      openModal(modalContent[id]);
    });
  });

  const closeButton = document.querySelector('.hacker-modal-close');
  if (closeButton) closeButton.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });
}
