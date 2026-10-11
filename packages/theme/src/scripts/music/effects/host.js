// Effects depend only on the deck's presentation state, never on the audio engine.
const root = document.querySelector('[data-music-deck][data-effect]');
if (root) {
  const abort = new AbortController();
  let effect;
  root.addEventListener(
    'music:destroy',
    () => {
      abort.abort();
      effect?.destroy();
    },
    { once: true }
  );
  void import(/* @vite-ignore */ root.dataset.effect)
    .then(({ mount }) => {
      if (abort.signal.aborted || !root.isConnected) return;
      effect = mount(root);
      const update = () =>
        effect.setState({
          playing: root.dataset.status === 'playing',
          visible: !document.hidden,
          collapsed: root.dataset.collapsed === 'true',
        });
      const observer = new MutationObserver(update);
      observer.observe(root, {
        attributes: true,
        attributeFilter: ['data-status', 'data-collapsed'],
      });
      const on = (target, name, handler) =>
        target.addEventListener(name, handler, { signal: abort.signal });
      on(document, 'visibilitychange', update);
      on(window, 'pagehide', () =>
        effect.setState({ playing: false, visible: false, collapsed: true })
      );
      on(window, 'pageshow', update);
      abort.signal.addEventListener('abort', () => observer.disconnect(), { once: true });
      update();
    })
    .catch(() => {
      // An optional visual failure must not affect playback or controls.
    });
}
