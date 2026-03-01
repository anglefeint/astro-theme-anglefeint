export function initAboutInteractions(prefersReducedMotion) {
  var glow = document.querySelector('.hacker-mouse-glow');
  if (glow && !prefersReducedMotion) {
    var glowRaf;
    var mx = 0;
    var my = 0;
    document.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
      if (!glowRaf) {
        glowRaf = requestAnimationFrame(function() {
          glow.style.setProperty('--mouse-x', mx + 'px');
          glow.style.setProperty('--mouse-y', my + 'px');
          glowRaf = 0;
        });
      }
    });
  }

  var paras = document.querySelectorAll('.hacker-body p, .hacker-body h2, .hacker-body blockquote, .about-manifest');
  if (window.IntersectionObserver) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('hacker-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    paras.forEach(function(p) { io.observe(p); });
  } else {
    paras.forEach(function(p) { p.classList.add('hacker-visible'); });
  }

  var titles = document.querySelectorAll('.about-section-title');
  if (prefersReducedMotion && titles.length) {
    titles.forEach(function(el) {
      var fullText = el.textContent || '';
      el.setAttribute('data-full-text', fullText);
      el.textContent = fullText;
      el.style.minHeight = '1.2em';
    });
  } else if (window.IntersectionObserver && titles.length) {
    titles.forEach(function(el) {
      var fullText = el.textContent || '';
      el.setAttribute('data-full-text', fullText);
      el.textContent = '';
      el.style.minHeight = '1.2em';
    });

    var tio = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          tio.unobserve(entry.target);
          var text = entry.target.getAttribute('data-full-text') || '';
          var i = 0;
          entry.target.textContent = '';
          function type() {
            if (i <= text.length) {
              entry.target.textContent = text.slice(0, i);
              i++;
              setTimeout(type, 32);
            }
          }
          type();
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

    titles.forEach(function(el) { tio.observe(el); });
  }

  var regen = document.querySelector('.hacker-regenerate');
  var article = document.querySelector('.about-shell');
  var scan = document.querySelector('.hacker-load-scan');
  if (regen && article) {
    regen.addEventListener('click', function() {
      if (prefersReducedMotion) {
        article.classList.add('hacker-flash');
        setTimeout(function() {
          article.classList.remove('hacker-flash');
        }, 120);
        return;
      }

      regen.disabled = true;
      article.classList.add('hacker-flash');
      if (scan) {
        scan.style.animation = 'none';
        scan.offsetHeight;
        scan.style.animation = 'hacker-scan 0.8s ease-out forwards';
        scan.style.top = '0';
        scan.style.opacity = '1';
      }
      setTimeout(function() {
        article.classList.remove('hacker-flash');
        regen.disabled = false;
      }, 1200);
    });
  }
}
