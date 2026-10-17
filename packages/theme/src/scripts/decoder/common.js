export const DECODER_INPUT_LIMIT = 16384;
export function fail(code) {
  throw new Error(code);
}

export function hasBinaryControls(text) {
  for (const char of text) {
    const code = char.charCodeAt(0);
    if ((code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127) return true;
  }
  return false;
}

export function readableUtf8(bytes) {
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    fail('binary');
  }
  if (hasBinaryControls(text)) fail('binary');
  return text;
}
