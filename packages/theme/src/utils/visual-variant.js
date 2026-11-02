/** A fresh sample per call; no route, label, saved state or build-time seed. */
export function randomUnit() {
  try {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] / 0x100000000;
  } catch {
    return Math.random();
  }
}

/**
 * Pure variant policy shared by unrelated visual components.
 * @param {{count: number, mode?: string, index?: number, fixed?: number, random?: () => number}} options
 */
export function selectVisualVariant({
  count,
  mode = 'random',
  index = 0,
  fixed = 1,
  random = randomUnit,
}) {
  const total = Number.isFinite(count) ? Math.max(1, Math.trunc(count)) : 1;
  if (mode === 'fixed') return Math.min(total, Math.max(1, Math.trunc(fixed) || 1));
  if (mode === 'sequential') return (Math.max(0, Math.trunc(index) || 0) % total) + 1;
  const sample = random();
  return Math.min(
    total,
    Math.max(1, Math.floor((Number.isFinite(sample) ? sample : 0) * total) + 1)
  );
}
