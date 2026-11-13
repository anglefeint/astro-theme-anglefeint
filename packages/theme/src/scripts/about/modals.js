import { createTitleReveal } from '../effects/title-reveal.js';
import { createWindowController } from '../window-controller.js';
import { mountHelpKeyboard } from './modal-keyboard.js';
import { mountScriptFolders } from './modal-scripts.js';
import { renderProgressModal } from './modal-progress.js';
let cleanupAboutModals;
let decoderModule;
const loadDecoder = () =>
  (decoderModule ||= import('./decoder-tool.js')
    .then(async (tool) => {
      await tool.prepareStyles();
      return tool;
    })
    .catch((error) => {
      decoderModule = undefined;
      throw error;
    }));
export function initAboutModals(
  runtimeConfig,
  prefersReducedMotion,
  decoderClock,
  loadTool = loadDecoder
) {
  cleanupAboutModals?.();
  const overlay = document.getElementById('hacker-modal');
  if (!overlay) return;
  const modalBody = overlay.querySelector('.hacker-modal-body');
  const modalTitle = overlay.querySelector('.hacker-modal-title');
  const modalEl = overlay.querySelector('.hacker-modal');
  const decoderEntry = overlay.querySelector('[data-decoder-entry]');
  let cleanupKeyboard, cleanupProgress, cleanupScripts;
  const titleReveal = createTitleReveal(modalTitle, prefersReducedMotion);
  let decryptor;
  let revision = 0;
  let disposed = false;
  function stopTool() {
    revision++;
    modalBody.removeAttribute('aria-busy');
    titleReveal.stop();
    if (decoderEntry) decoderEntry.hidden = true;
    decryptor?.stop();
    cleanupScripts?.();
    cleanupScripts = undefined;
    cleanupProgress?.();
    cleanupProgress = undefined;
    cleanupKeyboard?.();
    cleanupKeyboard = undefined;
    modalEl.classList.remove('hacker-modal-wide', 'hacker-modal-decoder');
  }
  const shell = createWindowController(overlay, { onClose: stopTool });
  function openModal(data) {
    if (!data) return;
    stopTool();
    titleReveal.reveal(data.title);
    if (decoderEntry) decoderEntry.hidden = data.type !== 'decryptor';
    modalBody.innerHTML = data.body;
    modalBody.className =
      'hacker-modal-body' +
      (data.type === 'progress' ? ' hacker-modal-download' : '') +
      (data.type === 'keyboard' ? ' hacker-modal-keyboard' : '') +
      (data.type === 'scripts' ? ' hacker-modal-scripts-wrap' : '');
    if (data.type === 'decryptor') {
      modalEl.classList.add('hacker-modal-decoder');
      const request = revision;
      modalBody.setAttribute('aria-busy', 'true');
      void loadTool()
        .then(({ createDecoderController }) => {
          if (disposed || request !== revision) return;
          const template = document.getElementById('hacker-decoder-tpl');
          if (template) modalBody.replaceChildren(template.content.cloneNode(true));
          decryptor ||= createDecoderController(
            overlay,
            runtimeConfig.decoderLabels || {},
            decoderClock
          );
          decryptor.start();
        })
        .catch(() => {
          if (!disposed && request === revision) {
            decryptor?.stop();
            modalBody.textContent = runtimeConfig.decoderLabels?.loadFailed || '';
          }
        })
        .finally(() => {
          if (!disposed && request === revision) modalBody.removeAttribute('aria-busy');
        });
    } else if (data.type === 'keyboard') {
      modalEl.classList.add('hacker-modal-wide');
      cleanupKeyboard = mountHelpKeyboard(overlay, modalBody, runtimeConfig);
    } else if (data.type === 'scripts') {
      const template = document.getElementById('hacker-scripts-folders-tpl');
      if (template) modalBody.replaceChildren(template.content.cloneNode(true));
      modalEl.classList.add('hacker-modal-wide');
      cleanupScripts = mountScriptFolders(modalBody, runtimeConfig.scriptFolderLabels || {});
    } else if (data.type === 'progress') cleanupProgress = renderProgressModal(modalBody);
    shell.open();
  }
  const listeners = new AbortController();
  document
    .querySelectorAll('.hacker-folder[data-modal]')
    .forEach((button) =>
      button.addEventListener(
        'click',
        () => openModal(runtimeConfig.modalContent?.[button.dataset.modal]),
        { signal: listeners.signal }
      )
    );
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    shell.dispose();
    stopTool();
    listeners.abort();
    if (cleanupAboutModals === dispose) cleanupAboutModals = undefined;
  };
  cleanupAboutModals = dispose;
  return dispose;
}
