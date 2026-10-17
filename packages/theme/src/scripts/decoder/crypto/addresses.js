import { createBase58check, bech32, bech32m } from '@scure/base';
import { sha256 } from '@noble/hashes/sha2.js';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { fail } from '../common.js';
import { decodeHexBytes } from '../codecs/hex.js';
export const base58check = createBase58check(sha256);
export const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
export function checksumEvm(input) {
  const hex = input.replace(/^0x/i, '');
  if (!/^[\da-f]{40}$/i.test(hex)) fail('invalid');
  const lower = hex.toLowerCase();
  const hash = toHex(keccak_256(new TextEncoder().encode(lower)));
  return (
    '0x' + Array.from(lower, (c, i) => (parseInt(hash[i], 16) >= 8 ? c.toUpperCase() : c)).join('')
  );
}
export function inspectEvm(input) {
  const value = input.trim();
  if (!/^0x[\da-f]{40}$/i.test(value)) fail('invalid');
  const address = checksumEvm(value);
  const hex = value.slice(2);
  const mixed = hex !== hex.toLowerCase() && hex !== hex.toUpperCase();
  if (mixed && hex !== address.slice(2)) fail('checksum');
  return {
    address,
    bytes: 20,
    checksum: mixed ? 'verified' : 'not-provided',
    network: 'not-encoded',
  };
}
export function tronFromBody(hex) {
  if (!/^[\da-f]{40}$/i.test(hex)) fail('invalid');
  return base58check.encode(decodeHexBytes('41' + hex));
}
export function inspectTron(input) {
  const value = input.trim();
  let bytes;
  if (/^(?:0x)?41[\da-f]{40}$/i.test(value)) bytes = decodeHexBytes(value.replace(/^0x/i, ''));
  else {
    try {
      bytes = base58check.decode(value);
    } catch {
      fail('checksum');
    }
  }
  if (bytes.length !== 21 || bytes[0] !== 0x41) fail('invalid');
  return {
    address: base58check.encode(bytes),
    hex: toHex(bytes),
    bytes: 21,
    checksum: value.startsWith('T') ? 'verified' : 'not-provided',
    network: 'not-encoded',
  };
}
export function inspectBitcoin(input, network = 'mainnet') {
  const value = input.trim();
  const main = network === 'mainnet';
  if (/^(bc|tb|bcrt)1/i.test(value)) {
    let decoded, encoding;
    try {
      decoded = bech32.decode(value, 90);
      encoding = 'bech32';
    } catch {
      try {
        decoded = bech32m.decode(value, 90);
        encoding = 'bech32m';
      } catch {
        fail('checksum');
      }
    }
    const expected = main ? 'bc' : network === 'regtest' ? 'bcrt' : 'tb';
    if (decoded.prefix !== expected) fail('wrongNetwork');
    const version = decoded.words[0];
    if (version > 16 || (version === 0 ? encoding !== 'bech32' : encoding !== 'bech32m'))
      fail('invalid');
    let program;
    try {
      program = Uint8Array.from(bech32.fromWords(decoded.words.slice(1)));
    } catch {
      fail('invalid');
    }
    if (
      program.length < 2 ||
      program.length > 40 ||
      (version === 0 && ![20, 32].includes(program.length))
    )
      fail('invalid');
    const type =
      version === 0
        ? program.length === 20
          ? 'P2WPKH'
          : 'P2WSH'
        : version === 1 && program.length === 32
          ? 'P2TR'
          : 'witness';
    return {
      address: value.toLowerCase(),
      network,
      type,
      encoding,
      checksum: 'verified',
      witnessVersion: version,
      scriptPubKey:
        (version === 0 ? '00' : (0x50 + version).toString(16)) +
        program.length.toString(16).padStart(2, '0') +
        toHex(program),
    };
  }
  let bytes;
  try {
    bytes = base58check.decode(value);
  } catch {
    fail('checksum');
  }
  if (bytes.length !== 21) fail('invalid');
  const pkh = main ? 0 : 111,
    sh = main ? 5 : 196;
  if (![pkh, sh].includes(bytes[0])) fail('wrongNetwork');
  const hash = toHex(bytes.slice(1));
  return {
    address: value,
    network: main ? 'mainnet' : 'testnet/regtest',
    type: bytes[0] === pkh ? 'P2PKH' : 'P2SH',
    checksum: 'verified',
    scriptPubKey: bytes[0] === pkh ? '76a914' + hash + '88ac' : 'a914' + hash + '87',
  };
}
