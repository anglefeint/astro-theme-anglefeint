import matrix from '../../styles/music-scenes/matrix.css?url&no-inline';
import cyber from '../../styles/music-scenes/cyber.css?url&no-inline';
import hacker from '../../styles/music-scenes/hacker.css?url&no-inline';
import ai from '../../styles/music-scenes/ai.css?url&no-inline';

export type MusicScene = 'base' | 'matrix' | 'cyber' | 'hacker' | 'ai';

export const musicSceneStyles: Record<MusicScene, string | undefined> = {
  base: undefined,
  matrix,
  cyber,
  hacker,
  ai,
};

// The parent shell owns scene identity; URLs and audio track moods do not select it.
export function resolveMusicScene(bodyClass: string): MusicScene {
  const classes = new Set(bodyClass.split(/\s+/));
  if (classes.has('page-home')) return 'matrix';
  if (classes.has('cyber-page')) return 'cyber';
  if (classes.has('hacker-page')) return 'hacker';
  if (classes.has('ai-page')) return 'ai';
  return 'base';
}
