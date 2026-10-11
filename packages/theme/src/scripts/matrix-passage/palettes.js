// Route visual sources: home-page.css, theme-cyber.css, ai/base.css,
// about/base.css and about/sidebar.css. Matrix bypasses recoloring entirely.
const rgb = (r, g, b) => [r / 255, g / 255, b / 255];
export const PASSAGE_PALETTES = {
  matrix: { recolor: false, primary: rgb(96, 255, 128), accent: rgb(176, 255, 192) },
  cyber: { recolor: true, primary: rgb(112, 196, 255), accent: rgb(228, 158, 224) },
  ai: { recolor: true, primary: rgb(132, 214, 255), accent: rgb(255, 106, 132) },
  hacker: { recolor: true, primary: rgb(224, 224, 224), accent: rgb(255, 221, 154) },
};

export function randomPassagePalette(random = Math.random, previous) {
  const names = Object.keys(PASSAGE_PALETTES).filter((name) => name !== previous);
  return names[Math.floor(random() * names.length)];
}
