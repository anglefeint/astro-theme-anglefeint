export function initReadProgressAndBackToTop(prefersReducedMotion) {
  var progress = document.querySelector('.ai-read-progress');
  var toast = document.querySelector('.ai-stage-toast');
  var stageSeen = { p10: false, p30: false, p60: false, done: false };
  var toastTimer = 0;
  var hasScrolled = false;
  var toastText = {
    p10: 'context parsed 10%',
    p30: 'context parsed 30%',
    p60: 'inference stable 60%',
    done: 'output finalized',
  };

  if (toast && toast.dataset) {
    toastText.p10 = toast.dataset.toastP10 || toastText.p10;
    toastText.p30 = toast.dataset.toastP30 || toastText.p30;
    toastText.p60 = toast.dataset.toastP60 || toastText.p60;
    toastText.done = toast.dataset.toastDone || toastText.done;
  }

  function showStageToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('visible');
    }, 1800);
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
      if (!stageSeen.p10 && p >= 0.1) {
        stageSeen.p10 = true;
        showStageToast(toastText.p10);
      }
      if (!stageSeen.p30 && p >= 0.3) {
        stageSeen.p30 = true;
        showStageToast(toastText.p30);
      }
      if (!stageSeen.p60 && p >= 0.6) {
        stageSeen.p60 = true;
        showStageToast(toastText.p60);
      }
      if (!stageSeen.done && p >= 0.9) {
        stageSeen.done = true;
        showStageToast(toastText.done);
      }
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var backTop = document.querySelector('.ai-back-to-top');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
}
