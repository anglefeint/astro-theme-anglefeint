export function initPostInteractions(prefersReducedMotion) {
  var glow = document.querySelector('.ai-mouse-glow');
  if (glow) {
    var raf;
    var x = 0;
    var y = 0;
    document.addEventListener('mousemove', function(e) {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(function() {
          glow.style.setProperty('--mouse-x', x + 'px');
          glow.style.setProperty('--mouse-y', y + 'px');
          raf = 0;
        });
      }
    });
  }

  document.querySelectorAll('.ai-prose-body a[href]').forEach(function(a) {
    var href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return;
    a.classList.add('ai-link-preview');
    try {
      a.setAttribute('data-preview', href.startsWith('http') ? new URL(href, location.origin).hostname : href);
    } catch (_err) {
      a.setAttribute('data-preview', href);
    }
  });

  var paras = document.querySelectorAll('.ai-prose-body p, .ai-prose-body h2, .ai-prose-body h3, .ai-prose-body pre, .ai-prose-body blockquote, .ai-prose-body ul, .ai-prose-body ol');
  if (window.IntersectionObserver) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('ai-para-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    paras.forEach(function(p) {
      io.observe(p);
    });
  } else {
    paras.forEach(function(p) {
      p.classList.add('ai-para-visible');
    });
  }

  var regen = document.querySelector('.ai-regenerate');
  var article = document.querySelector('.ai-article');
  var scan = document.querySelector('.ai-load-scan');
  if (regen && article) {
    regen.addEventListener('click', function() {
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
      setTimeout(function() {
        article.classList.remove('ai-regenerate-flash');
        regen.classList.remove('ai-regenerating');
        regen.disabled = false;
      }, prefersReducedMotion ? 120 : 1200);
    });
  }
}
