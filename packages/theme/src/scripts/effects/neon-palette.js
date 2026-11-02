// Matches the nine color tokens in styles/neon-palette.css; no component selectors here.
export const NEON_COLOR_COUNT = 9;

/** @param {Element} element @param {number} variant */
export function applyNeonVariant(element, variant) {
  for (const name of Array.from(element.classList)) {
    if (/^neon-v\d+$/.test(name)) element.classList.remove(name);
  }
  element.classList.add(`neon-v${variant}`);
}
