export function initReadProgressAndBackToTop(prefersReducedMotion) {
  var progress = document.querySelector('.ai-read-progress');
  var toast = document.querySelector('.ai-stage-toast');
  var stageSeen = { p30: false, p60: false, p90: false };
  var toastTimer = 0;
  var hasScrolled = false;

  function showStageToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
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
      var btn = document.querySelector('.ai-back-to-top');
      if (btn) btn.classList.toggle('visible', scrollTop > 400);
      if (!hasScrolled && scrollTop > 6) hasScrolled = true;
      if (!hasScrolled) return;
      if (!stageSeen.p30 && p >= 0.3) {
        stageSeen.p30 = true;
        showStageToast('context parsed');
      }
      if (!stageSeen.p60 && p >= 0.6) {
        stageSeen.p60 = true;
        showStageToast('inference stable');
      }
      if (!stageSeen.p90 && p >= 0.9) {
        stageSeen.p90 = true;
        showStageToast('output finalized');
      }
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var backTop = document.querySelector('.ai-back-to-top');
  if (backTop) {
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
}
