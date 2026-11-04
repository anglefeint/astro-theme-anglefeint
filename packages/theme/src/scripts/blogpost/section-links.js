import { createEffectScope } from '../effects/lifecycle.js';

export function initSectionLinks() {
  const scope = createEffectScope('section-links');
  try {
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    document.querySelectorAll('.ai-prose-body[data-section-links]').forEach((root) => {
      const labels = JSON.parse(root.dataset.sectionLinks);
      root.querySelectorAll('h2[id], h3[id]').forEach((heading) => {
        if (heading.querySelector('[data-section-link]')) return;
        const url = new URL(canonical || window.location.href);
        url.hash = heading.id;
        const link = document.createElement('a');
        link.className = 'ai-section-link';
        link.dataset.sectionLink = '';
        link.dataset.pagefindIgnore = '';
        link.href = url.href;
        link.title = labels.copy;
        link.setAttribute('aria-label', `${labels.copy}: ${heading.textContent.trim()}`);
        link.innerHTML =
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m10 13 4-4M8 15l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 3 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 0)"/></svg>';
        const feedback = document.createElement('span');
        feedback.className = 'ai-section-feedback';
        feedback.dataset.pagefindIgnore = '';
        const status = document.createElement('span');
        status.className = 'ai-section-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.dataset.pagefindIgnore = '';
        const actions = document.createElement('span');
        actions.className = 'ai-section-actions';
        actions.append(link, status);
        heading.append(actions);
        heading.after(feedback);
        scope.add(() => {
          actions.remove();
          feedback.remove();
        });
        let timer;
        let pending = false;
        scope.listen(link, 'click', async (event) => {
          event.preventDefault();
          if (pending) return;
          pending = true;
          scope.clearTimeout(timer);
          feedback.querySelector('input')?.remove();
          status.textContent = '';
          try {
            await navigator.clipboard.writeText(url.href);
            if (scope.disposed) return;
            status.textContent = labels.copied;
            timer = scope.setTimeout(() => {
              status.textContent = '';
            }, 2000);
          } catch {
            if (scope.disposed) return;
            status.textContent = labels.failed;
            const input = document.createElement('input');
            input.type = 'text';
            input.readOnly = true;
            input.value = url.href;
            input.setAttribute('aria-label', labels.copy);
            feedback.append(input);
            input.focus();
            input.select();
          } finally {
            pending = false;
          }
        });
      });
    });
  } catch (error) {
    scope.dispose();
    throw error;
  }
  return scope.dispose;
}
