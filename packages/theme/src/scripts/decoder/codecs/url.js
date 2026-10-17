import { fail, hasBinaryControls } from '../common.js';
export function decodeUrl(input) {
  try {
    const text = decodeURIComponent(input);
    if (hasBinaryControls(text)) fail('binary');
    return text;
  } catch {
    fail('invalid');
  }
}
