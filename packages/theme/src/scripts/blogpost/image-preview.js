export function initImagePreview() {
  const root = document.querySelector('.ai-prose-body[data-image-preview]');
  if (!root || root.dataset.imagePreviewReady) return;
  root.dataset.imagePreviewReady = 'true';
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
  close.addEventListener('click', dismiss);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    dismiss();
  });
  dialog.addEventListener('pointerdown', (event) => {
    pressedBackdrop = event.target === dialog && event.button === 0 && event.isPrimary;
  });
  dialog.addEventListener('pointercancel', () => {
    pressedBackdrop = false;
  });
  dialog.addEventListener('click', (event) => {
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
  dialog.addEventListener('close', () => {
    if (!dialog.open) restore();
  });
  images.forEach((img) => {
    img.classList.add('image-preview-trigger');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-haspopup', 'dialog');
    img.setAttribute('aria-label', `${labels.open}${img.alt ? ': ' + img.alt : ''}`);
    img.addEventListener('click', () => open(img));
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(img);
      }
    });
  });
}
