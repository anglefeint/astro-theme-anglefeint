import { createDecoderController } from '../decoder/controller.js';
import { createWindowController } from '../window-controller.js';
import { mountHelpKeyboard } from './modal-keyboard.js';
import { mountScriptFolders } from './modal-scripts.js';
import { renderProgressModal } from './modal-progress.js';
let cleanupAboutModals;
export function initAboutModals(runtimeConfig, prefersReducedMotion, decoderClock) {
  cleanupAboutModals?.();
  const overlay = document.getElementById('hacker-modal');
  if (!overlay) return;
  const modalBody = overlay.querySelector('.hacker-modal-body');
  const modalTitle = overlay.querySelector('.hacker-modal-title');
  const modalEl = overlay.querySelector('.hacker-modal');
  const decoderEntry = overlay.querySelector('[data-decoder-entry]');
  let titleTimer = 0,
    resolvedTitle = '',
    cleanupKeyboard,
    cleanupProgress,
    cleanupScripts;
  function stopTitleReveal() {
    window.clearTimeout(titleTimer);
    titleTimer = 0;
    modalTitle.textContent = resolvedTitle;
  }

  function revealTitle(title) {
    stopTitleReveal();
    resolvedTitle = String(title ?? '');
    modalTitle.textContent = resolvedTitle;
    if (
      prefersReducedMotion ||
      document.hidden ||
      !resolvedTitle ||
      typeof Intl.Segmenter !== 'function'
    )
      return;
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

  const decryptor = createDecoderController(
    overlay,
    runtimeConfig.decoderLabels || {},
    decoderClock
  );
  function stopTool() {
    stopTitleReveal();
    if (decoderEntry) decoderEntry.hidden = true;
    decryptor.stop();
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
    revealTitle(data.title);
    if (decoderEntry) decoderEntry.hidden = data.type !== 'decryptor';
    modalBody.innerHTML = data.body;
    modalBody.className =
      'hacker-modal-body' +
      (data.type === 'progress' ? ' hacker-modal-download' : '') +
      (data.type === 'keyboard' ? ' hacker-modal-keyboard' : '') +
      (data.type === 'scripts' ? ' hacker-modal-scripts-wrap' : '');
    if (data.type === 'decryptor') {
      modalEl.classList.add('hacker-modal-decoder');
      const template = document.getElementById('hacker-decoder-tpl');
      if (template) modalBody.replaceChildren(template.content.cloneNode(true));
      decryptor.start();
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
  let disposed = false;
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
