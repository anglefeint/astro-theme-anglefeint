const KEY = 'anglefeint-music-v1';
export function readMusicState(storage) {
  try {
    const value = JSON.parse(storage().getItem(KEY));
    if (!value || typeof value.src !== 'string') return null;
    return {
      src: value.src,
      time: Number.isFinite(value.time) ? Math.max(0, value.time) : 0,
      volume: Number.isFinite(value.volume) ? Math.max(0, Math.min(1, value.volume)) : 0.5,
      collapsed: value.collapsed !== false,
    };
  } catch {
    return null;
  }
}
export function writeMusicState(storage, value) {
  try {
    storage().setItem(KEY, JSON.stringify(value));
  } catch {
    /* Playback works without storage. */
  }
}
