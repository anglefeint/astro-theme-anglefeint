import { fail, readableUtf8 } from '../common.js';
export function decodeBase64Bytes(input) {
  const value = input.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(value)) fail('invalid');
  const bare = value.replace(/=+$/, '').replace(/-/g, '+').replace(/_/g, '/');
  if (bare.length % 4 === 1 || (value.includes('=') && value.length % 4 !== 0)) fail('invalid');
  let binary;
  try {
    binary = atob(bare.padEnd(Math.ceil(bare.length / 4) * 4, '='));
  } catch {
    fail('invalid');
  }
  if (btoa(binary).replace(/=+$/, '') !== bare) fail('invalid');
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function decodeBase64(input) {
  return readableUtf8(decodeBase64Bytes(input));
}
