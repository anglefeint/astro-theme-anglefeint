export { playPassage } from '../matrix-passage/player.js';
export { randomPassagePalette } from '../matrix-passage/palettes.js';
import fontCss from '../../styles/matrix-font.css?url';
import passageCss from '../../styles/home-passage.css?url';
import { loadStylesheet } from '../effects/stylesheet.js';

// Load only after the dynamic module's CSS has arrived, before canvas rasterization.
export const prepareFont = async () => {
  await Promise.all([loadStylesheet(fontCss), loadStylesheet(passageCss)]);
  await document.fonts.load('22px "Matrix Code NFI"').catch(() => {});
};
