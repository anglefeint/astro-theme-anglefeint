import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { WIDTH, HEIGHT, socialPath } from './model.mjs';

export async function resolveSocialImage({
  override,
  enabled,
  data,
  fallback,
  publicDir,
  base = '/',
}) {
  if (override && typeof override !== 'string') return override;
  if (override) {
    if (override.startsWith('https://')) return { src: override };
    let relative;
    try {
      relative = decodeURIComponent(override.split(/[?#]/)[0]).slice(1);
    } catch {
      throw new Error(`[ogImage] Invalid path: ${override}`);
    }
    const root = path.resolve(publicDir);
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep))
      throw new Error(`[ogImage] Path escapes public directory: ${override}`);
    let bytes;
    try {
      bytes = await readFile(file);
    } catch {
      throw new Error(`[ogImage] Image not found for "${data.title}": ${override}`);
    }
    const revision = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
    const encoded = relative.split(/[\\/]/).map(encodeURIComponent).join('/');
    return { src: `${base.replace(/\/$/, '')}/${encoded}?v=${revision}` };
  }
  if (!enabled) return fallback;
  return { src: socialPath(data, base), width: WIDTH, height: HEIGHT, format: 'png' };
}
