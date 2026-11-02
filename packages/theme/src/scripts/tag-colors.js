import { randomUnit, selectVisualVariant } from '../utils/visual-variant.js';
import { applyNeonVariant, NEON_COLOR_COUNT } from './effects/neon-palette.js';

export function initTagColors(root = document, random = randomUnit) {
  for (const nav of root.querySelectorAll('[data-neon-tags]')) {
    if (nav.hasAttribute('data-neon-ready')) continue;
    for (const link of nav.querySelectorAll('a[rel="tag"]')) {
      applyNeonVariant(link, selectVisualVariant({ count: NEON_COLOR_COUNT, random }));
    }
    nav.setAttribute('data-neon-ready', '');
  }
}
