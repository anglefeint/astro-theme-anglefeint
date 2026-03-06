export function initPostInteractions(prefersReducedMotion) {
  const glow = document.querySelector('.ai-mouse-glow');
  if (glow && window.__anglefeintPostGlowBound__ !== true) {
    window.__anglefeintPostGlowBound__ = true;
    let raf = 0;
    let x = 0;
    let y = 0;
    document.addEventListener('mousemove', function (e) {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(function () {
          glow.style.setProperty('--mouse-x', x + 'px');
          glow.style.setProperty('--mouse-y', y + 'px');
          raf = 0;
        });
      }
    });
  }

  document.querySelectorAll('.ai-prose-body a[href]').forEach(function (a) {
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

  const paras = document.querySelectorAll(
    '.ai-prose-body p, .ai-prose-body h2, .ai-prose-body h3, .ai-prose-body pre, .ai-prose-body blockquote, .ai-prose-body ul, .ai-prose-body ol'
  );
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('ai-para-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    paras.forEach(function (p) {
      if (p.dataset.aiRevealObserved === 'true') return;
      p.dataset.aiRevealObserved = 'true';
      io.observe(p);
    });
  } else {
    paras.forEach(function (p) {
      p.classList.add('ai-para-visible');
    });
  }

  const regen = document.querySelector('.ai-regenerate');
  const article = document.querySelector('.ai-article');
  const scan = document.querySelector('.ai-load-scan');
  if (regen && article) {
    if (regen.dataset.aiRegenerateBound === 'true') return;
    regen.dataset.aiRegenerateBound = 'true';
    regen.addEventListener('click', function () {
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
      setTimeout(
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
