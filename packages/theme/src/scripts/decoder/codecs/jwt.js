import { fail } from '../common.js';
import { decodeBase64 } from './base64.js';
export function decodeJwt(input) {
  const parts = input.trim().split('.');
  if (parts.length !== 3 || !parts.every((part, i) => (i === 2 && !part) || /^[\w-]+$/.test(part)))
    fail('invalid');
  try {
    const header = JSON.parse(decodeBase64(parts[0]));
    const payload = JSON.parse(decodeBase64(parts[1]));
    if (
      !header ||
      typeof header !== 'object' ||
      Array.isArray(header) ||
      !payload ||
      typeof payload !== 'object' ||
      Array.isArray(payload)
    )
      fail('invalid');
    const compact = JSON.stringify({ header, payload });
    // Bound indentation expansion for deeply nested claims without walking the object again.
    let depth = 0,
      maxDepth = 0,
      quoted = false,
      escaped = false;
    for (const char of compact) {
      if (quoted) {
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === '"') quoted = false;
      } else if (char === '"') quoted = true;
      else if (char === '{' || char === '[') maxDepth = Math.max(maxDepth, ++depth);
      else if (char === '}' || char === ']') depth--;
    }
    return maxDepth > 16 ? compact : JSON.stringify({ header, payload }, null, 2);
  } catch {
    fail('invalid');
  }
}
