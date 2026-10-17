import { fail } from '../common.js';
export function formatUnits(value, decimals) {
  if (!/^(0|[1-9]\d{0,2})$/.test(String(decimals)) || Number(decimals) > 255) fail('decimals');
  const digits = BigInt(value).toString();
  const count = Number(decimals);
  if (!count) return digits;
  const padded = digits.padStart(count + 1, '0');
  const fraction = padded.slice(-count).replace(/0+$/, '');
  return padded.slice(0, -count) + (fraction ? '.' + fraction : '');
}
