import { mountRedQueen } from '../../effects/red-queen/red-queen.js';
// Article policy preserves the existing delayed autoplay sequence.
export function initRedQueenTv(prefersReducedMotion) {
  return mountRedQueen(document.querySelector('.rq-tv'), {
    reducedMotion: prefersReducedMotion,
    autoPlay: true,
  });
}
