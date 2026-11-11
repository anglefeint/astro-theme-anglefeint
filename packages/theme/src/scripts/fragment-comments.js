// One official client.js embed per list page; closing only hides the dialog.
export function initFragmentComments() {
  const dialog = document.querySelector('[data-fragment-dialog]');
  if (!(dialog instanceof HTMLDialogElement) || dialog.dataset.ready) return;
  dialog.dataset.ready = 'true';
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const host = dialog.querySelector('[data-fragment-widget]');
  const status = dialog.querySelector('[data-fragment-status]');
  const loading = dialog.querySelector('[data-signal-loading]');
  const retry = dialog.querySelector('[data-fragment-retry]');
  const template = dialog.querySelector('[data-giscus-template]');
  const config = JSON.parse(dialog.querySelector('[data-fragment-config]').textContent);
  let script, frame, active, timer, oldOverflow;
  let initialTerm = '',
    requested = '',
    resolved = '',
    desired = '';
  let pending = false,
    frameLoaded = false,
    failed = false,
    earlyMessage;

  function state(value) {
    if (!dialog.open) return;
    window.clearTimeout(timer);
    dialog.dataset.commentState = value;
    loading.hidden = value !== 'loading';
    host.hidden = value === 'failed';
    host.style.visibility = value === 'ready' ? 'visible' : 'hidden';
    host.inert = value !== 'ready';
    host.setAttribute('aria-busy', String(value === 'loading'));
    status.textContent =
      value === 'loading' ? status.dataset.loading : value === 'failed' ? status.dataset.error : '';
    retry.hidden = value !== 'failed';
    if (value === 'loading') timer = window.setTimeout(() => state('failed'), 15000);
  }

  function receive(data) {
    if (!pending) return;
    // Serialize target changes so an old response never reveals the wrong thread.
    if (data.discussion?.title !== requested && typeof data.error !== 'string') return;
    if (!frameLoaded) {
      earlyMessage = data;
      return;
    }
    pending = false;
    resolved = requested;
    failed = typeof data.error === 'string' && !data.error.includes('Discussion not found');
    if (dialog.open) showDiscussion();
  }

  function bindFrame() {
    if (frame) return;
    frame = host.querySelector('iframe.giscus-frame');
    if (!frame) return;
    frame.addEventListener(
      'load',
      () => {
        // The official client may reload after a session change. Its original
        // URL still targets initialTerm; resynchronize before revealing it.
        if (frameLoaded) {
          requested = initialTerm;
          resolved = '';
          pending = true;
          earlyMessage = undefined;
          state('loading');
        }
        frameLoaded = true;
        if (earlyMessage) {
          const message = earlyMessage;
          earlyMessage = undefined;
          receive(message);
        }
      },
      options
    );
    frame.addEventListener('error', () => state('failed'), options);
  }
  const observer = new MutationObserver(bindFrame);
  observer.observe(host, { childList: true });
  window.addEventListener(
    'message',
    (event) => {
      if (event.origin !== 'https://giscus.app' || event.source !== frame?.contentWindow) return;
      if (event.data?.giscus && typeof event.data.giscus === 'object') receive(event.data.giscus);
    },
    options
  );

  function showDiscussion() {
    if (!dialog.open) return;
    if (!script) {
      if (document.querySelector('.giscus') !== host) {
        state('failed');
        return;
      }
      initialTerm = requested = desired;
      pending = true;
      state('loading');
      script = document.createElement('script');
      for (const attribute of template.content.querySelector('script').attributes)
        script.setAttribute(attribute.name, attribute.value);
      script.setAttribute('data-term', desired);
      script.async = true;
      script.addEventListener(
        'error',
        () => {
          // No client was initialized when its download failed.
          script.remove();
          script = undefined;
          pending = false;
          state('failed');
        },
        { once: true, signal: controller.signal }
      );
      script.addEventListener(
        'load',
        () => {
          bindFrame();
          if (!frame) {
            script.remove();
            script = undefined;
            pending = false;
            state('failed');
          }
        },
        { once: true, signal: controller.signal }
      );
      dialog.append(script);
      return;
    }
    if (!frameLoaded || pending) {
      state('loading');
      return;
    }
    if (resolved === desired) {
      state(failed ? 'failed' : 'ready');
      return;
    }
    requested = desired;
    pending = true;
    state('loading');
    frame.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            term: desired,
            strict: true,
            emitMetadata: true,
            lang: config.lang,
          },
        },
      },
      'https://giscus.app'
    );
  }

  retry.addEventListener(
    'click',
    () => {
      if (frame) {
        // Reload the same iframe; do not create another client or listener.
        frameLoaded = false;
        pending = true;
        failed = false;
        earlyMessage = undefined;
        requested = initialTerm;
        resolved = '';
        state('loading');
        frame.setAttribute('src', frame.getAttribute('src'));
      } else showDiscussion();
    },
    options
  );
  document.querySelectorAll('[data-fragment-comments]').forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        active = button;
        desired = button.dataset.fragmentTerm;
        dialog.querySelector('[data-fragment-summary]').textContent = button
          .closest('article')
          .querySelector('.fragment-body')
          .textContent.trim()
          .slice(0, 300);
        oldOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
        showDiscussion();
      },
      options
    );
  });
  dialog
    .querySelector('[data-fragment-close]')
    .addEventListener('click', () => dialog.close(), options);
  dialog.addEventListener(
    'click',
    (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    },
    options
  );
  function hide() {
    window.clearTimeout(timer);
    loading.hidden = true;
    host.style.visibility = 'hidden';
    host.inert = true;
    status.textContent = '';
    retry.hidden = true;
    delete dialog.dataset.commentState;
    if (oldOverflow !== undefined) document.body.style.overflow = oldOverflow;
  }
  dialog.addEventListener(
    'close',
    () => {
      hide();
      active?.focus();
    },
    options
  );
  document.addEventListener(
    'astro:before-swap',
    () => {
      if (dialog.open) dialog.close();
      hide();
      observer.disconnect();
      controller.abort();
      delete dialog.dataset.ready;
    },
    { once: true, signal: controller.signal }
  );
}
