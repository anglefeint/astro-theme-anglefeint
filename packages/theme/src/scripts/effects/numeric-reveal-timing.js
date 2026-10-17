// Total time includes the crossfade. Input length only biases the sampled range.
export function numericRevealDuration({
  rangeMs = [1500, 3000],
  inputLength = 0,
  random = Math.random,
} = {}) {
  const clamp = (value, fallback) =>
    Number.isFinite(value) ? Math.max(0, Math.min(value, 10000)) : fallback;
  const endpoints = [clamp(rangeMs?.[0], 1500), clamp(rangeMs?.[1], 3000)].sort((a, b) => a - b);
  const [min, max] = endpoints;
  const [from, to] = inputLength <= 128 ? [0, 0.2] : inputLength <= 2048 ? [0.2, 0.6] : [0.6, 1];
  const sample = random();
  const fraction = Number.isFinite(sample) ? Math.max(0, Math.min(sample, 1)) : 0.5;
  return Math.round(min + (max - min) * (from + fraction * (to - from)));
}
