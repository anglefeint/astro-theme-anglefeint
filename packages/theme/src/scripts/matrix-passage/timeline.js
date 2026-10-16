export const TOTAL_DURATION_MS = 8000;
export const SCREEN_EXPAND_MS = 2500;
export const PASSAGE_DURATION_MS = TOTAL_DURATION_MS - SCREEN_EXPAND_MS;
export const PASSAGE_FALLBACK_MS = TOTAL_DURATION_MS + 1500;
// Fixed views share the original camera path; only environmental time keeps advancing.
export function passageProgress(mode, progress) {
  if (mode === 'corridor') return 0.06;
  if (mode === 'oracle') return 1;
  return progress;
}
// Both directions sample the same normalized camera/door timeline.
export function travelProgress(from, to, elapsedMs) {
  const direction = Math.sign(to - from);
  const position = from + (direction * Math.max(0, elapsedMs)) / PASSAGE_DURATION_MS;
  return direction >= 0 ? Math.min(to, position) : Math.max(to, position);
}
export function samplePassage(progress, end = 6, floor = 1.35) {
  progress = Math.max(0, Math.min(1, progress));
  const ease = (t) => t * t * (3 - 2 * t);
  const approachEnd = 1 / 5.5;
  const openingEnd = (1 + 1.5) / 5.5;
  const distance =
    progress < approachEnd
      ? 2.6 * ease(progress / approachEnd)
      : progress < openingEnd
        ? 2.6 + 0.2 * ease((progress - approachEnd) / (openingEnd - approachEnd))
        : 2.8 + (end - 0.12 - 2.8) * ease((progress - openingEnd) / (1 - openingEnd));

  const opening = Math.max(0, Math.min(1, (progress - approachEnd) / (openingEnd - approachEnd)));
  return { distance, angle: ease(opening) * -1.65, eyeY: floor - 1.6, pitch: 0.055 };
}
