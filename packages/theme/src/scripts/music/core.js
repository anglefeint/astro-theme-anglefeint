// No DOM, site config or storage dependencies. Each selected source owns its audio instance.
export function createPlayer(tracks, createAudio = () => new Audio(), fetchAudio = fetch) {
  let audio;
  let sourceReady;
  let download;
  let objectUrl;
  let revision = 0;
  let playAttempt = 0;
  let disposed = false;
  const listeners = new Set();
  const state = { trackIndex: 0, status: 'idle', currentTime: 0, duration: 0, volume: 0.5 };
  const emit = () => {
    for (const listener of listeners) listener({ ...state });
  };
  const stopAudio = () => {
    revision++;
    playAttempt++;
    download?.abort();
    download = undefined;
    sourceReady = undefined;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio = undefined;
    }
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = undefined;
  };
  const selectTrack = (index, time = 0) => {
    if (disposed || !tracks[index]) return;
    stopAudio();
    Object.assign(state, {
      trackIndex: index,
      status: 'idle',
      currentTime: Number.isFinite(time) ? Math.max(0, time) : 0,
      duration: 0,
    });
    emit();
  };
  async function play() {
    if (disposed || !tracks[state.trackIndex]) return;
    if (state.status === 'error') stopAudio();
    if (!audio) {
      const current = createAudio();
      audio = current;
      current.preload = 'none';
      current.volume = state.volume;
      const token = revision;
      const on = (event, fn) =>
        current.addEventListener(event, () => {
          if (!disposed && token === revision) {
            fn();
            emit();
          }
        });
      on('loadedmetadata', () => {
        state.duration = Number.isFinite(current.duration) ? current.duration : 0;
        if (state.currentTime && state.duration)
          current.currentTime = Math.min(state.currentTime, Math.max(0, state.duration - 0.1));
      });
      on('timeupdate', () => {
        state.currentTime = current.currentTime;
      });
      on('playing', () => {
        state.status = 'playing';
      });
      on('waiting', () => {
        if (!current.paused) state.status = 'loading';
      });
      on('pause', () => {
        if (state.status !== 'error') state.status = 'paused';
      });
      on('error', () => {
        state.status = 'error';
      });
      on('ended', () => {
        selectTrack((state.trackIndex + 1) % tracks.length);
        void play();
      });
      download = new AbortController();
      // A complete local Blob remains seekable even when the host ignores Range requests.
      sourceReady = (async () => {
        const response = await fetchAudio(tracks[state.trackIndex].src, {
          signal: download.signal,
        });
        if (!response.ok) throw new Error(`Audio download failed: ${response.status}`);
        const blob = await response.blob();
        if (disposed || token !== revision) return;
        objectUrl = URL.createObjectURL(blob);
        current.src = objectUrl;
        // Restore the default start position before playback begins.
        if (state.currentTime > 0) current.currentTime = state.currentTime;
      })();
    }
    const token = revision;
    const attempt = ++playAttempt;
    state.status = 'loading';
    emit();
    try {
      await sourceReady;
      if (disposed || token !== revision || attempt !== playAttempt) return;
      await audio.play();
    } catch (error) {
      if (!disposed && token === revision && attempt === playAttempt && state.status !== 'paused') {
        state.status = error?.name === 'NotAllowedError' ? 'blocked' : 'error';
        emit();
      }
    }
  }
  return {
    play,
    selectTrack,
    pause() {
      if (disposed) return;
      playAttempt++;
      audio?.pause();
      state.status = 'paused';
      emit();
    },
    seek(time) {
      if (!audio || !state.duration || !Number.isFinite(time)) return;
      audio.currentTime = Math.max(0, Math.min(time, state.duration));
      state.currentTime = audio.currentTime;
      emit();
    },
    setVolume(value) {
      if (!Number.isFinite(value)) return;
      state.volume = Math.max(0, Math.min(1, value));
      if (audio) audio.volume = state.volume;
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      listener({ ...state });
      return () => listeners.delete(listener);
    },
    destroy() {
      disposed = true;
      stopAudio();
      listeners.clear();
    },
  };
}
