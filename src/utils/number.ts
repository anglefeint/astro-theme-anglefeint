export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function int(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.floor(value);
}
