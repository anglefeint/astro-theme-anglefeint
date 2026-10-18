import { createEffectScope } from '../effects/lifecycle.js';
function mount(scope) {
  const root = document.querySelector('.ai-prose-body[data-image-preview]');
  if (!root || root.dataset.imagePreviewReady) return;
  root.dataset.imagePreviewReady = 'true';
  scope.add(() => delete root.dataset.imagePreviewReady);
  const labels = JSON.parse(root.dataset.imagePreview);
  const images = [...root.querySelectorAll('img')].filter((img) => !img.closest('a, button'));
  if (!images.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'article-image-preview';
  dialog.setAttribute('aria-label', labels.open);
  const enlarged = document.createElement('img');
  const caption = document.createElement('p');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'image-preview-close';
  close.textContent = '×';
  close.setAttribute('aria-label', labels.close);
  close.title = labels.close;
  dialog.append(enlarged, caption, close);
  document.body.append(dialog);
  scope.add(() => {
    dismiss();
    dialog.remove();
  });
  let trigger;
  let overflow;
  let locked = false;
  let pressedBackdrop = false;
  function open(img) {
    if (dialog.open) return;
    trigger = img;
    enlarged.src = img.currentSrc || img.src;
    enlarged.alt = img.alt;
    caption.textContent = img.alt;
    caption.hidden = !img.alt;
    overflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    locked = true;
    close.focus({ preventScroll: true });
  }
  function dismiss() {
    dialog.close();
    restore();
  }
  scope.listen(close, 'click', dismiss);
  scope.listen(dialog, 'cancel', (event) => {
    event.preventDefault();
    dismiss();
  });
  scope.listen(dialog, 'pointerdown', (event) => {
    pressedBackdrop = event.target === dialog && event.button === 0 && event.isPrimary;
  });
  scope.listen(dialog, 'pointercancel', () => {
    pressedBackdrop = false;
  });
  scope.listen(dialog, 'click', (event) => {
    if (pressedBackdrop && event.target === dialog) dismiss();
    pressedBackdrop = false;
  });
  function restore() {
    if (!locked) return;
    locked = false;
    document.documentElement.style.overflow = overflow;
    enlarged.removeAttribute('src');
    pressedBackdrop = false;
    trigger?.focus({ preventScroll: true });
  }
  scope.listen(dialog, 'close', () => {
    if (!dialog.open) restore();
  });
  images.forEach((img) => {
    const attrs = ['tabindex', 'role', 'aria-haspopup', 'aria-label'].map((key) => [
      key,
      img.getAttribute(key),
    ]);
    const hadClass = img.classList.contains('image-preview-trigger');
    scope.add(() => {
      if (!hadClass) img.classList.remove('image-preview-trigger');
      for (const [key, value] of attrs) {
        if (value === null) img.removeAttribute(key);
        else img.setAttribute(key, value);
      }
    });
    img.classList.add('image-preview-trigger');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-haspopup', 'dialog');
    img.setAttribute('aria-label', `${labels.open}${img.alt ? ': ' + img.alt : ''}`);
    scope.listen(img, 'click', () => open(img));
    scope.listen(img, 'keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(img);
      }
    });
  });
}

export function initImagePreview() {
  const scope = createEffectScope('image-preview');
  try {
    mount(scope);
  } catch (error) {
    scope.dispose();
    throw error;
  }
  return scope.dispose;
}
