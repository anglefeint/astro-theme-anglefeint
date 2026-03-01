export function initAboutReadingUi(runtimeConfig, prefersReducedMotion) {
  var progress = document.querySelector('.hacker-progress');
  var toast = document.querySelector('.hacker-toast');
  var fallbackToasts = {
    p30: 'context parsed',
    p60: 'inference stable',
    p90: 'output finalized',
  };
  var toastMessages = runtimeConfig.effects && runtimeConfig.effects.scrollToasts
    ? runtimeConfig.effects.scrollToasts
    : fallbackToasts;
  var stageSeen = { p30: false, p60: false, p90: false };
  var toastTimer = 0;
  var hasScrolled = false;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = '> ' + msg;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
      toast.classList.remove('visible');
    }, 900);
  }

  if (progress) {
    function onScroll() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      var p = scrollHeight > 0 ? Math.min(1, scrollTop / scrollHeight) : 1;
      progress.style.setProperty('--read-progress', String(p));
      var btn = document.querySelector('.hacker-back-to-top');
      if (btn) btn.classList.toggle('visible', scrollTop > 400);
      if (!hasScrolled && scrollTop > 6) hasScrolled = true;
      if (!hasScrolled) return;
      if (!stageSeen.p30 && p >= 0.3) {
        stageSeen.p30 = true;
        showToast(toastMessages.p30 || fallbackToasts.p30);
      }
      if (!stageSeen.p60 && p >= 0.6) {
        stageSeen.p60 = true;
        showToast(toastMessages.p60 || fallbackToasts.p60);
      }
      if (!stageSeen.p90 && p >= 0.9) {
        stageSeen.p90 = true;
        showToast(toastMessages.p90 || fallbackToasts.p90);
      }
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var backTop = document.querySelector('.hacker-back-to-top');
  if (backTop) {
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
}
