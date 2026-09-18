export interface MusicTrack {
  title: string;
  artist?: string;
  src: string;
}

export function normalizeMusic(value?: { enabled?: boolean; tracks?: MusicTrack[] }) {
  if (!value?.enabled) return { enabled: false, tracks: [] as MusicTrack[] };
  if (!Array.isArray(value.tracks)) throw new Error('[theme.music] tracks must be an array.');
  const tracks = value.tracks.map((track, index) => {
    const prefix = `[theme.music.tracks.${index}]`;
    if (!track || typeof track.title !== 'string' || !track.title.trim())
      throw new Error(`${prefix} title is required.`);
    if (
      typeof track.src !== 'string' ||
      !/^(\/(?!\/)|https:\/\/)/.test(track.src) ||
      /[\s\\]/.test(track.src)
    )
      throw new Error(`${prefix} src must be a /music/file path or HTTPS audio URL.`);
    if (track.src.startsWith('https:')) {
      try {
        new URL(track.src);
      } catch {
        throw new Error(`${prefix} invalid HTTPS URL.`);
      }
    }
    if (track.artist !== undefined && typeof track.artist !== 'string')
      throw new Error(`${prefix} artist must be text.`);
    return { title: track.title.trim(), artist: track.artist?.trim() ?? '', src: track.src };
  });
  return { enabled: tracks.length > 0, tracks };
}
