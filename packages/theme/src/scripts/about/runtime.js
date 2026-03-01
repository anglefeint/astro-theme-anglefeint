export function readAboutRuntimeConfig() {
  var runtimeConfig = {};
  var runtimeConfigEl = document.getElementById('hacker-runtime-config');
  if (runtimeConfigEl && runtimeConfigEl.textContent) {
    try {
      runtimeConfig = JSON.parse(runtimeConfigEl.textContent);
    } catch (_err) {
      runtimeConfig = {};
    }
  }
  return runtimeConfig;
}

export function isReducedMotion() {
  try {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (_e) {
    return false;
  }
}
