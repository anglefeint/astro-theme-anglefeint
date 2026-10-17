// Article folders own their copy action, independent of window and Decoder lifetimes.
export function mountScriptFolders(root, labels) {
  const listeners = new AbortController();
  let revision = 0;
  root.addEventListener(
    'click',
    async (event) => {
      const button = event.target.closest('[data-copy-script-title]');
      if (!button || !root.contains(button)) return;
      const label = button
        .closest('.hacker-script-card')
        ?.querySelector('.hacker-script-folder-label');
      if (!label) return;
      const request = ++revision;
      const status = root.querySelector('.hacker-script-copy-status');
      try {
        await navigator.clipboard.writeText(
          label.getAttribute('title') || label.textContent.trim()
        );
        if (!listeners.signal.aborted && request === revision && status)
          status.textContent = labels.copied;
      } catch {
        if (listeners.signal.aborted || request !== revision) return;
        const range = document.createRange();
        range.selectNodeContents(label);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        if (status) status.textContent = labels.failed;
      }
    },
    { signal: listeners.signal }
  );
  return () => {
    revision++;
    listeners.abort();
  };
}
