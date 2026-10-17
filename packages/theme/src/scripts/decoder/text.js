import { fail, DECODER_INPUT_LIMIT } from './common.js';
import { decodeHtml } from './codecs/html.js';
import { decodeUnicode } from './codecs/unicode.js';
import { decodeJwt } from './codecs/jwt.js';
import { decodeBase64 } from './codecs/base64.js';
import { decodeHex } from './codecs/hex.js';
import { decodeUrl } from './codecs/url.js';
export { DECODER_INPUT_LIMIT } from './common.js';
const codecs = {
  html: decodeHtml,
  unicode: decodeUnicode,
  jwt: decodeJwt,
  base64: decodeBase64,
  hex: decodeHex,
  url: decodeUrl,
};
function decodeAs(input, format) {
  if (!codecs[format]) fail('invalid');
  return codecs[format](input);
}
export function decodeText(input, format = 'auto') {
  if (typeof input !== 'string' || !input.trim()) fail('empty');
  if (input.length > DECODER_INPUT_LIMIT) fail('tooLong');
  if (format !== 'auto') return { format, text: decodeAs(input, format) };
  const candidates = [];
  for (const candidate of ['base64', 'url', 'hex', 'html', 'unicode', 'jwt']) {
    if (candidate === 'url' && !/%[\da-f]{2}/i.test(input)) continue;
    if (candidate === 'html' && !/&(?:#\d+|#[xX][\da-f]+|[a-z][a-z\d]+);/i.test(input)) continue;
    if (candidate === 'unicode' && !/\\(?:u|x)[\da-f{]/i.test(input)) continue;
    if (candidate === 'jwt' && input.trim().split('.').length !== 3) continue;
    try {
      candidates.push({ format: candidate, text: decodeAs(input, candidate) });
    } catch {
      /* A failed candidate is not a successful auto-detection. */
    }
  }
  if (!candidates.length) fail('unknown');
  if (candidates.length > 1) fail('ambiguous');
  return candidates[0];
}
