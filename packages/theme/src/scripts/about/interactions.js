import { createLifetime } from './lifetime.js';
export function initAboutInteractions(prefersReducedMotion) {
  const lifetime = createLifetime();
  const { signal } = lifetime;
  var glow = document.querySelector('.hacker-mouse-glow');
  if (glow && !prefersReducedMotion) {
    var glowRaf;
    var mx = 0;
    var my = 0;
    document.addEventListener(
      'mousemove',
      function (e) {
        mx = e.clientX;
        my = e.clientY;
        if (!glowRaf) {
          glowRaf = lifetime.frame(function () {
            glow.style.setProperty('--mouse-x', mx + 'px');
            glow.style.setProperty('--mouse-y', my + 'px');
            glowRaf = 0;
          });
        }
      },
      { signal }
    );
  }

  var titles = document.querySelectorAll('.about-section-title:not([data-static-title])');
  if (!prefersReducedMotion && window.IntersectionObserver && titles.length) {
    const overlays = new Map();
    titles.forEach((el) => {
      const fullText = el.getAttribute('data-full-text') || el.textContent || '';
      el.setAttribute('data-full-text', fullText);
      const wrapper = document.createElement('span');
      wrapper.className = 'about-title-text';
      const sizing = document.createElement('span');
      sizing.className = 'about-title-sizing';
      sizing.textContent = fullText;
      const typing = document.createElement('span');
      typing.className = 'about-title-typing';
      typing.setAttribute('aria-hidden', 'true');
      wrapper.append(sizing, typing);
      el.replaceChildren(wrapper);
      overlays.set(el, typing);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const text = entry.target.getAttribute('data-full-text') || '';
          const typing = overlays.get(entry.target);
          let i = 0;
          function type() {
            typing.textContent = text.slice(0, ++i);
            if (i < text.length) lifetime.timeout(type, 32);
            else entry.target.textContent = text;
          }
          type();
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );
    lifetime.observe(observer);
    titles.forEach((el) => observer.observe(el));
  }

  var regen = document.querySelector('.hacker-regenerate');
  var article = document.querySelector('.about-shell');
  var scan = document.querySelector('.hacker-load-scan');
  if (regen && article) {
    regen.addEventListener(
      'click',
      function () {
        if (prefersReducedMotion) {
          article.classList.add('hacker-flash');
          lifetime.timeout(function () {
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
        lifetime.timeout(function () {
          article.classList.remove('hacker-flash');
          regen.disabled = false;
        }, 1200);
      },
      { signal }
    );
  }
  return () => {
    lifetime.dispose();
    titles.forEach((el) => {
      el.textContent = el.getAttribute('data-full-text') || el.textContent;
    });
    article?.classList.remove('hacker-flash');
    if (regen) regen.disabled = false;
  };
}
