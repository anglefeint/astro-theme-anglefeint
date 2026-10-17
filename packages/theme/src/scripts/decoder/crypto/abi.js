import { fail } from '../common.js';
import { decodeHexBytes } from '../codecs/hex.js';
// A deliberately bounded static ABI subset; no dynamic offsets, arrays or guessed ABI.
const methods = {
  a9059cbb: { name: 'transfer(address,uint256)', fields: ['to', 'rawAmount'] },
  '095ea7b3': { name: 'approve(address,uint256)', fields: ['spender', 'rawAmount'] },
  '23b872dd': {
    name: 'transferFrom(address,address,uint256)',
    fields: ['from', 'to', 'rawAmount'],
  },
};
export function decodeTokenCall(input) {
  const hex = input.trim().replace(/^0x/, '');
  if (!/^(?:[\da-f]{2})+$/i.test(hex)) fail('invalid');
  const method = methods[hex.slice(0, 8).toLowerCase()];
  if (!method) fail('unsupported');
  if (hex.length !== 8 + method.fields.length * 64) fail('length');
  decodeHexBytes(hex); // Same byte-validation primitive as the text codecs.
  const args = {};
  method.fields.forEach((field, index) => {
    const word = hex.slice(8 + index * 64, 8 + (index + 1) * 64);
    if (field === 'rawAmount') args[field] = BigInt('0x' + word).toString();
    else {
      if (!/^0{24}/.test(word)) fail('invalid');
      args[field] = word.slice(24).toLowerCase();
    }
  });
  return { selector: '0x' + hex.slice(0, 8).toLowerCase(), method: method.name, args };
}
