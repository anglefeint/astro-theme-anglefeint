import { DECODER_INPUT_LIMIT, fail } from '../common.js';
import { decodeTokenCall } from './abi.js';
import { checksumEvm, inspectEvm, inspectTron, inspectBitcoin, tronFromBody } from './addresses.js';
import { formatUnits } from './units.js';
export function runCrypto(input, { task, chain, decimals = '', network = 'mainnet' }) {
  if (!input.trim()) fail('empty');
  if (input.length > DECODER_INPUT_LIMIT) fail('tooLong');
  if (task === 'address') {
    if (input.length > 128) fail('tooLong');
    const result =
      chain === 'btc'
        ? inspectBitcoin(input, network)
        : chain === 'tron'
          ? inspectTron(input)
          : inspectEvm(input);
    return {
      text: JSON.stringify(result, null, 2),
      steps: ['addressParse', 'addressCheck', 'addressResult'],
      notice: 'addressNotice',
    };
  }
  if (!['evm', 'hyperevm', 'tron'].includes(chain)) fail('unsupported');
  const decoded = decodeTokenCall(input);
  const args = Object.fromEntries(
    Object.entries(decoded.args).map(([key, value]) => [
      key,
      key === 'rawAmount' ? value : chain === 'tron' ? tronFromBody(value) : checksumEvm(value),
    ])
  );
  const result = { interpretation: chain === 'tron' ? 'TRC-20' : 'ERC-20', ...decoded, args };
  if (String(decimals) !== '') {
    result.decimals = Number(decimals);
    result.amount = formatUnits(args.rawAmount, decimals);
  }
  if (decoded.method.startsWith('approve(') && args.rawAmount === ((1n << 256n) - 1n).toString())
    result.maximumUint256 = true;
  return {
    data: result,
    text: JSON.stringify(result, null, 2),
    steps: ['callParse', 'addressResult', String(decimals) === '' ? 'rawOnly' : 'amountResult'],
    notice: 'callNotice',
  };
}
export { cryptoExample } from '../examples.js';

export function updateCallPrecision(data, decimals) {
  const result = { ...data };
  delete result.amount;
  delete result.decimals;
  if (String(decimals) !== '') {
    result.amount = formatUnits(data.args.rawAmount, decimals);
    result.decimals = Number(decimals);
  }
  return {
    data: result,
    text: JSON.stringify(result, null, 2),
    steps: ['callParse', 'addressResult', String(decimals) === '' ? 'rawOnly' : 'amountResult'],
    notice: 'callNotice',
  };
}
