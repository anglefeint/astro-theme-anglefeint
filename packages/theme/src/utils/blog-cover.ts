import path from 'node:path';
import { realpathSync } from 'node:fs';
import { responsiveImage } from '../covers/responsive.mjs';
import type { ImageManifest } from '../covers/types';

export function blogCover(
  data: Pick<ImageManifest, 'root' | 'posts' | 'sources'>,
  filePath: string | undefined,
  original: { src: string; width: number; height: number }
) {
  let key: string | undefined;
  if (filePath) {
    try {
      key = path
        .relative(data.root, realpathSync(path.resolve(data.root, filePath)))
        .replaceAll('\\', '/');
    } catch {
      /* Synthetic callers can still render their supplied original URL. */
    }
  }
  const cover = key && data.sources[data.posts[key]];
  return (
    responsiveImage(cover) ?? { src: original.src, width: original.width, height: original.height }
  );
}
