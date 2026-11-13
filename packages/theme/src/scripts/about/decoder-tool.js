import decoderCss from '../../styles/decoder.css?url';
import { loadStylesheet } from '../effects/stylesheet.js';
export { createDecoderController } from '../decoder/controller.js';
export const prepareStyles = () => loadStylesheet(decoderCss);
