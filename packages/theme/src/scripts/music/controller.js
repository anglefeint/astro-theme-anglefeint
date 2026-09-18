const root = document.querySelector('[data-music-deck]');
if (root && !root.dataset.ready) {
  root.dataset.ready = 'true';
  void init(root).catch(() => {
    root.dataset.ready = 'failed';
    root.dataset.collapsed = 'false';
    root.querySelector('[data-status]').textContent = JSON.parse(root.dataset.labels).error;
  });
}

async function init(root) {
  const [{ createPlayer }, { readMusicState, writeMusicState }] = await Promise.all([
    import(/* @vite-ignore */ root.dataset.core),
    import(/* @vite-ignore */ root.dataset.storage),
  ]);
  const tracks = JSON.parse(root.dataset.tracks);
  const labels = JSON.parse(root.dataset.labels);
  const storage = () => sessionStorage;
  const saved = readMusicState(storage);
  const player = createPlayer(tracks);
  // Narrow pages start compact; opening the full deck is an explicit action.
  const narrowScreen = window.matchMedia('(max-width: 720px)');
  let collapsed = narrowScreen.matches || (saved?.collapsed ?? false);
  let state;
  let lastWrite = 0;
  const abort = new AbortController();
  const q = (selector) => root.querySelector(selector);
  const play = q('[data-action="play"]');
  const expand = q('[data-action="expand"]');
  const playlist = q('.music-deck__playlist');
  let queueOpen = false;
  let previousVolume = saved?.volume || 0.5;
  const seek = q('[data-seek]');
  const volume = q('[data-volume]');
  const time = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const persist = () => {
    if (state)
      writeMusicState(storage, {
        src: tracks[state.trackIndex].src,
        time: state.currentTime,
        volume: state.volume,
        collapsed,
      });
  };
  const renderCollapse = () => {
    root.dataset.collapsed = String(collapsed);
    for (const el of root.querySelectorAll(
      '.music-deck__status-row, .music-deck__track, .music-deck__signal-row, .music-deck__playlist, .music-deck__footer'
    ))
      el.hidden = collapsed;
    q('[data-eyebrow]').textContent = collapsed
      ? tracks[state?.trackIndex ?? 0].title
      : 'AUDIO CHANNEL';
    expand.textContent = collapsed ? 'OPEN' : 'MIN';
    expand.setAttribute('aria-expanded', String(!collapsed));
    expand.setAttribute('aria-label', collapsed ? labels.open : labels.close);
  };
  const selected = tracks.findIndex((track) => track.src === saved?.src);
  player.selectTrack(selected < 0 ? 0 : selected, selected < 0 ? 0 : saved.time);
  if (saved) player.setVolume(saved.volume);
  player.subscribe((next) => {
    state = next;
    root.dataset.status = state.status;
    q('[data-title]').textContent = tracks[state.trackIndex].title;
    q('[data-artist]').textContent = tracks[state.trackIndex].artist;
    const active = state.status === 'playing' || state.status === 'loading';
    play.textContent = active ? 'PAUSE' : 'PLAY';
    if (collapsed) q('[data-eyebrow]').textContent = tracks[state.trackIndex].title;
    q('[data-state]').textContent = {
      idle: 'STANDBY',
      loading: 'BOOTING',
      playing: 'STREAMING',
      paused: 'STANDBY',
      error: 'OFFLINE',
    }[state.status];
    const mute = q('[data-action="mute"]');
    mute.textContent = state.volume === 0 ? 'UNMUTE' : 'MUTE';
    mute.setAttribute('aria-label', state.volume === 0 ? labels.unmute : labels.mute);
    mute.setAttribute('aria-pressed', String(state.volume === 0));
    root.style.setProperty(
      '--music-progress',
      `${state.duration ? Math.min(100, (state.currentTime / state.duration) * 100) : 0}%`
    );
    play.setAttribute('aria-label', active ? labels.pause : labels.play);
    const status = q('[data-status]');
    if (status.textContent !== labels[state.status]) status.textContent = labels[state.status];
    seek.disabled = !state.duration;
    seek.max = String(state.duration || 100);
    seek.value = String(state.currentTime);
    seek.setAttribute(
      'aria-valuetext',
      `${time(state.currentTime)} / ${state.duration ? time(state.duration) : '--:--'}`
    );
    q('[data-time]').textContent =
      `${time(state.currentTime)} / ${state.duration ? time(state.duration) : '--:--'}`;
    volume.value = String(state.volume);
    for (const button of root.querySelectorAll('[data-track]')) {
      button.dataset.active = String(Number(button.dataset.track) === state.trackIndex);
      button.setAttribute(
        'aria-pressed',
        String(Number(button.dataset.track) === state.trackIndex)
      );
    }
    if (Date.now() - lastWrite > 1000) {
      persist();
      lastWrite = Date.now();
    }
  });
  const on = (target, event, handler) =>
    target.addEventListener(event, handler, { signal: abort.signal });
  on(narrowScreen, 'change', (event) => {
    if (event.matches) {
      collapsed = true;
      renderCollapse();
      persist();
    }
  });
  on(root, 'click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'expand') {
      collapsed = !collapsed;
      renderCollapse();
    } else if (action === 'queue') {
      queueOpen = !queueOpen;
      playlist.dataset.expanded = String(queueOpen);
      q('#music-deck-queue').hidden = !queueOpen;
      button.setAttribute('aria-expanded', String(queueOpen));
      q('[data-queue-label]').textContent = queueOpen ? 'HIDE' : 'SHOW';
    } else if (action === 'mute') {
      if (state.volume > 0) {
        previousVolume = state.volume;
        player.setVolume(0);
      } else player.setVolume(previousVolume);
    } else if (action === 'play') {
      if (state.status === 'playing' || state.status === 'loading') player.pause();
      else void player.play();
    } else if (action === 'prev' || action === 'next' || button.hasAttribute('data-track')) {
      const index = button.hasAttribute('data-track')
        ? Number(button.dataset.track)
        : (state.trackIndex + (action === 'prev' ? -1 : 1) + tracks.length) % tracks.length;
      if (index !== state.trackIndex) player.selectTrack(index);
      void player.play();
    }
    persist();
  });
  on(seek, 'input', () => {
    player.seek(Number(seek.value));
    persist();
  });
  on(volume, 'input', () => {
    player.setVolume(Number(volume.value));
    persist();
  });
  on(root, 'keydown', (event) => {
    if (event.key === 'Escape' && !collapsed) {
      collapsed = true;
      renderCollapse();
      expand.focus();
      persist();
    }
  });
  on(window, 'pagehide', () => {
    persist();
    player.pause();
  });
  // BFCache retains the controller; ordinary navigation discards it with the document.
  renderCollapse();
  for (const button of root.querySelectorAll('button')) button.disabled = false;
  root.addEventListener(
    'music:destroy',
    () => {
      persist();
      abort.abort();
      player.destroy();
    },
    { once: true }
  );
}
