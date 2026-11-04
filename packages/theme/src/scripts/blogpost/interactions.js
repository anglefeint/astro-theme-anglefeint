import { createEffectScope } from '../effects/lifecycle.js';
function mount(prefersReducedMotion, scope) {
  const glow = document.querySelector('.ai-mouse-glow');
  if (glow && window.__anglefeintPostGlowBound__ !== true) {
    window.__anglefeintPostGlowBound__ = true;
    scope.add(() => {
      window.__anglefeintPostGlowBound__ = false;
    });
    let raf = 0;
    let x = 0;
    let y = 0;
    scope.listen(document, 'mousemove', function (e) {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = scope.requestAnimationFrame(function () {
          glow.style.setProperty('--mouse-x', x + 'px');
          glow.style.setProperty('--mouse-y', y + 'px');
          raf = 0;
        });
      }
    });
  }

  document
    .querySelectorAll('.ai-prose-body a[href]:not([data-section-link])')
    .forEach(function (a) {
      if (a.dataset.aiLinkPreviewBound === 'true') return;
      var href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      a.dataset.aiLinkPreviewBound = 'true';
      a.classList.add('ai-link-preview');
      try {
        a.setAttribute(
          'data-preview',
          href.startsWith('http') ? new URL(href, location.origin).hostname : href
        );
      } catch (_err) {
        a.setAttribute('data-preview', href);
      }
    });

  const regen = document.querySelector('.ai-regenerate');
  const article = document.querySelector('.ai-article');
  const scan = document.querySelector('.ai-load-scan');
  if (regen && article) {
    if (regen.dataset.aiRegenerateBound === 'true') return;
    regen.dataset.aiRegenerateBound = 'true';
    scope.add(() => {
      delete regen.dataset.aiRegenerateBound;
      regen.disabled = false;
      regen.classList.remove('ai-regenerating');
      article.classList.remove('ai-regenerate-flash');
    });
    scope.listen(regen, 'click', function () {
      regen.disabled = true;
      regen.classList.add('ai-regenerating');
      article.classList.add('ai-regenerate-flash');
      if (scan) {
        scan.style.animation = 'none';
        scan.offsetHeight;
        scan.style.animation = 'ai-scan 0.8s ease-out forwards';
        scan.style.top = '0';
        scan.style.opacity = '1';
      }
      scope.setTimeout(
        function () {
          article.classList.remove('ai-regenerate-flash');
          regen.classList.remove('ai-regenerating');
          regen.disabled = false;
        },
        prefersReducedMotion ? 120 : 1200
      );
    });
  }
}

export function initPostInteractions(prefersReducedMotion) {
  const scope = createEffectScope('interactions');
  try {
    mount(prefersReducedMotion, scope);
  } catch (error) {
    scope.dispose();
    throw error;
  }
  return scope.dispose;
}
