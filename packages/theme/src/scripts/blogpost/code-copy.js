export function initCodeCopy() {
  document.querySelectorAll('.ai-prose-body[data-code-copy]').forEach((root) => {
    const labels = JSON.parse(root.dataset.codeCopy);
    root.querySelectorAll('pre > code').forEach((code) => {
      const pre = code.parentElement;
      if (pre.parentElement.classList.contains('code-block')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy';
      button.dataset.pagefindIgnore = '';
      button.setAttribute('aria-label', labels.copy);
      button.title = labels.copy;
      button.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><g class="copy-icon"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></g><path class="copy-check" d="m5 12 4 4L19 6"/></svg>';
      const status = document.createElement('span');
      status.className = 'code-copy-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.dataset.pagefindIgnore = '';
      pre.before(wrapper);
      wrapper.append(pre, button, status);
      let timer;
      button.addEventListener('click', async () => {
        if (button.disabled) return;
        clearTimeout(timer);
        button.disabled = true;
        status.textContent = '';
        button.classList.remove('is-copied');
        try {
          await navigator.clipboard.writeText(code.textContent ?? '');
          button.classList.add('is-copied');
          status.textContent = labels.copied;
        } catch {
          status.textContent = labels.failed;
        } finally {
          button.disabled = false;
          timer = setTimeout(() => {
            status.textContent = '';
            button.classList.remove('is-copied');
          }, 2000);
        }
      });
    });
  });
}
