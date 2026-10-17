import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bech32, bech32m } from '@scure/base';
import { runCrypto, cryptoExample } from '../packages/theme/src/scripts/decoder/crypto/index.js';
import { decodeTokenCall } from '../packages/theme/src/scripts/decoder/crypto/abi.js';
import {
  inspectEvm,
  inspectTron,
  inspectBitcoin,
  tronFromBody,
  base58check,
} from '../packages/theme/src/scripts/decoder/crypto/addresses.js';
import { formatUnits } from '../packages/theme/src/scripts/decoder/crypto/units.js';
import { createPipeline } from '../packages/theme/src/scripts/decoder/pipeline.js';
import { decodeBase64Bytes } from '../packages/theme/src/scripts/decoder/codecs/base64.js';
import { decodeHexBytes } from '../packages/theme/src/scripts/decoder/codecs/hex.js';

test('binary primitives preserve bytes rejected by text decoders', () => {
  assert.deepEqual([...decodeHexBytes('00ff')], [0, 255]);
  assert.deepEqual([...decodeBase64Bytes('AP8=')], [0, 255]);
});
test('EVM EIP-55 checksum distinguishes supplied and computed checksums', () => {
  const address = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
  assert.equal(inspectEvm(address).checksum, 'verified');
  assert.equal(inspectEvm(address.toLowerCase()).checksum, 'not-provided');
  assert.equal(inspectEvm(address.toLowerCase()).address, address);
  assert.throws(() => inspectEvm(address.replace('aA', 'aa')), /checksum/);
  assert.throws(() => inspectEvm('0x123'), /invalid/);
});
test('TRON checksums, lengths and network prefix are verified before conversion', () => {
  const body = '0000000000000000000000000000000000000001';
  const value = tronFromBody(body);
  assert.ok(value.startsWith('T'));
  assert.equal(inspectTron(value).hex, '41' + body);
  assert.equal(inspectTron('41' + body).checksum, 'not-provided');
  assert.throws(() => inspectTron(value.slice(0, -1) + '0'), /checksum/);
  assert.throws(() => inspectTron(base58check.encode(new Uint8Array(21))), /invalid/);
});
test('Bitcoin address inspection produces scripts for legacy and witness addresses', () => {
  const genesis = inspectBitcoin('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
  assert.equal(genesis.type, 'P2PKH');
  assert.equal(genesis.scriptPubKey, '76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac');
  assert.throws(() => inspectBitcoin(genesis.address, 'testnet'), /wrongNetwork/);
  assert.equal(inspectBitcoin('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy').type, 'P2SH');
  for (const [version, size, codec, type] of [
    [0, 20, bech32, 'P2WPKH'],
    [0, 32, bech32, 'P2WSH'],
    [1, 32, bech32m, 'P2TR'],
  ]) {
    const program = new Uint8Array(size).fill(1);
    const address = codec.encode('bc', [version, ...codec.toWords(program)]);
    const result = inspectBitcoin(address);
    assert.equal(result.type, type);
    assert.equal(
      result.scriptPubKey,
      (version ? '51' : '00') + size.toString(16) + '01'.repeat(size)
    );
    assert.equal(inspectBitcoin(address.toUpperCase()).address, address);
    assert.throws(() => inspectBitcoin('bC' + address.slice(2)), /checksum/);
    assert.throws(() => inspectBitcoin(address, 'testnet'), /wrongNetwork/);
  }
  const badVersion = bech32.encode('bc', [1, ...bech32.toWords(new Uint8Array(32))]);
  assert.throws(() => inspectBitcoin(badVersion), /invalid/);
  const badSize = bech32.encode('bc', [0, ...bech32.toWords(new Uint8Array(24))]);
  assert.throws(() => inspectBitcoin(badSize), /invalid/);
});
test('bounded token ABI parsing validates padding, selector and exact length', () => {
  const input = cryptoExample('call', 'evm');
  assert.equal(decodeTokenCall(input).args.rawAmount, '1000000');
  assert.throws(() => decodeTokenCall(input + '00'), /length/);
  assert.throws(() => decodeTokenCall(input.replace('a9059cbb', 'deadbeef')), /unsupported/);
  assert.throws(() => decodeTokenCall('0xa9059cbb' + 'f'.repeat(64) + '0'.repeat(64)), /invalid/);
  for (const chain of ['evm', 'hyperevm', 'tron']) {
    const result = JSON.parse(runCrypto(input, { task: 'call', chain, decimals: '6' }).text);
    assert.equal(result.amount, '1');
    assert.equal(result.args.rawAmount, '1000000');
    assert.ok(chain === 'tron' ? result.args.to.startsWith('T') : result.args.to.startsWith('0x'));
  }
  assert.equal(JSON.parse(runCrypto(input, { task: 'call', chain: 'evm' }).text).amount, undefined);
  const maximum = '0x095ea7b3' + '0'.repeat(63) + '1' + 'f'.repeat(64);
  assert.equal(
    JSON.parse(runCrypto(maximum, { task: 'call', chain: 'evm' }).text).maximumUint256,
    true
  );
  const transferFrom = '0x23b872dd' + ('0'.repeat(63) + '1').repeat(3);
  assert.equal(decodeTokenCall(transferFrom).args.from.length, 40);
});
test('unit formatting retains uint256 precision and rejects invalid decimals', () => {
  assert.equal(formatUnits('1000001', '6'), '1.000001');
  assert.equal(formatUnits('0', '18'), '0');
  assert.equal(formatUnits('9007199254740993', '0'), '9007199254740993');
  for (const precision of ['-1', '1.2', '256', '1e2', ''])
    assert.throws(() => formatUnits('1', precision), /decimals/);
});
test('pipeline branches truncate stale steps and enforce count and memory budgets', () => {
  const pipeline = createPipeline({ maxSteps: 2, maxCodeUnits: 20 });
  pipeline.add({ input: 'a', text: 'b' });
  pipeline.add({ input: 'b', text: 'c' });
  assert.throws(() => pipeline.add({ input: 'c', text: 'd' }), /stepLimit/);
  pipeline.truncate(1);
  assert.equal(pipeline.list().length, 1);
  pipeline.add({ input: 'b', text: 'new' });
  assert.equal(pipeline.list()[1].text, 'new');
  pipeline.clear();
  assert.equal(pipeline.list().length, 0);
  assert.throws(() => pipeline.add({ input: 'a', text: 'x'.repeat(20) }), /budget/);
});

test('address examples follow Bitcoin network selection and accept uppercase hex prefixes', () => {
  for (const network of ['mainnet', 'testnet', 'regtest']) {
    const source = cryptoExample('address', 'btc', network);
    assert.doesNotThrow(() => runCrypto(source, { task: 'address', chain: 'btc', network }));
    if (network !== 'mainnet')
      assert.throws(() => inspectBitcoin(source, 'mainnet'), /wrongNetwork/);
  }
  const address = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
  assert.equal(inspectEvm('0X' + address.slice(2)).address, address);
  assert.equal(inspectTron('0X410000000000000000000000000000000000000001').bytes, 21);
});
