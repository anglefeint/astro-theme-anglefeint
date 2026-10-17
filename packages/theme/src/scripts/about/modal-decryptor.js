// Compatibility entry; hosts share the decoder modules.
export { decodeText, DECODER_INPUT_LIMIT } from '../decoder/text.js';
export { estimateDecoderDuration } from '../decoder/timing.js';
export { createDecoderController as createDecryptorController } from '../decoder/controller.js';
