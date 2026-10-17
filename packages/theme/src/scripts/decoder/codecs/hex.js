import { fail, readableUtf8 } from '../common.js';
export function decodeHexBytes(input) {
  const value = input
    .trim()
    .replace(/(^|[\s:,])0x/gi, '$1')
    .replace(/[\s:,]/g, '');
  if (!/^(?:[\da-f]{2})+$/i.test(value)) fail('invalid');
  return Uint8Array.from(value.match(/../g), (byte) => parseInt(byte, 16));
}

export function decodeHex(input) {
  return readableUtf8(decodeHexBytes(input));
}
