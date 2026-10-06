// Inline only when configured in a production build. Keep local preview offline.
(() => {
  const hostname = window.location.hostname.toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname === '[::1]' ||
    hostname === '::1' ||
    hostname === '0.0.0.0' ||
    /^127\./.test(hostname)
  )
    return;

  const id = document.currentScript?.dataset.gaId;
  if (!id || window.__anglefeintGa4Initialized) return;
  window.__anglefeintGa4Initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.gtag('js', new Date());
  // config sends the initial page_view; do not send another one manually.
  window.gtag('config', id);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
})();
