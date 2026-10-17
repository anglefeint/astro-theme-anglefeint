import { numericRevealDuration } from '../effects/numeric-reveal-timing.js';
// Compatibility export; animation timing belongs to the shared numeric effect.
export function estimateDecoderDuration(inputLength, random = Math.random) {
  return numericRevealDuration({ inputLength, random });
}
