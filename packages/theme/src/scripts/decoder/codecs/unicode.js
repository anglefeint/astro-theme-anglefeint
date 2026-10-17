import { fail, hasBinaryControls } from '../common.js';
export function decodeUnicode(input) {
  let changed = false;
  const text = input.replace(
    /\\(u\{[\da-fA-F]{1,6}\}|u[\da-fA-F]{4}|x[\da-fA-F]{2}|[\\"'/bfnrt]|.)/gs,
    (_, escape) => {
      changed = true;
      if (escape[0] === 'u' || escape[0] === 'x') {
        const value = parseInt(escape[1] === '{' ? escape.slice(2, -1) : escape.slice(1), 16);
        if (!Number.isFinite(value) || value > 0x10ffff) fail('invalid');
        return String.fromCodePoint(value);
      }
      const escapes = {
        '\\': '\\',
        '"': '"',
        "'": "'",
        '/': '/',
        b: '\b',
        f: '\f',
        n: '\n',
        r: '\r',
        t: '\t',
      };
      if (!(escape in escapes)) fail('invalid');
      return escapes[escape];
    }
  );
  if (!changed || /(?:^|[^\\])(?:\\\\)*\\$/.test(input)) fail('invalid');
  // JSON-style surrogate pairs are allowed; unpaired surrogates are not text.
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = text.charCodeAt(++i);
      if (!(next >= 0xdc00 && next <= 0xdfff)) fail('invalid');
    } else if (code >= 0xdc00 && code <= 0xdfff) fail('invalid');
  }
  if (hasBinaryControls(text)) fail('binary');
  return text;
}
