const root = document.querySelector('[data-music-deck]');
if (root && !root.dataset.ready) {
  root.dataset.ready = 'true';
  void import(/* @vite-ignore */ root.dataset.mount)
    .then(({ mountMusicDeck }) => mountMusicDeck(root))
    .catch(() => {
      root.dataset.ready = 'failed';
      root.dataset.collapsed = 'false';
      root.querySelector('[data-status]').textContent = JSON.parse(root.dataset.labels).error;
    });
}
