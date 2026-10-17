import { numericRevealDuration } from '../packages/theme/src/scripts/effects/numeric-reveal-timing.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Buffer } from 'node:buffer';
import {
  decodeText,
  DECODER_INPUT_LIMIT,
  estimateDecoderDuration,
} from '../packages/theme/src/scripts/about/modal-decryptor.js';

test('Base64 and Base64URL decode UTF-8, padding and whitespace', () => {
  const value = '你好、世界 👩🏽‍💻\nFollow the white rabbit.';
  const base64 = Buffer.from(value).toString('base64');
  assert.equal(decodeText(base64, 'base64').text, value);
  assert.equal(decodeText(`\n ${base64} \n`, 'base64').text, value);
  assert.equal(decodeText(Buffer.from(value).toString('base64url'), 'base64').text, value);
  assert.equal(decodeText('SGVsbG8=', 'auto').text, 'Hello');
});

test('URL decoding preserves plus signs and rejects malformed escapes', () => {
  assert.equal(decodeText('%E4%BD%A0%E5%A5%BD%20%F0%9F%90%87', 'url').text, '你好 🐇');
  assert.equal(decodeText('a+b%2Bc', 'url').text, 'a+b+c');
  assert.throws(() => decodeText('%E4%B8', 'url'), /invalid/);
  assert.throws(() => decodeText('%ZZ', 'url'), /invalid/);
});

test('Hex accepts UTF-8 bytes, spacing, colons and 0x notation', () => {
  for (const value of ['e4bda0e5a5bd', 'E4 BD A0 E5 A5 BD', '0xe4:0xbd:0xa0:0xe5:0xa5:0xbd']) {
    assert.equal(decodeText(value, 'hex').text, '你好');
  }
  assert.equal(decodeText('48 65 6c 6c 6f').format, 'hex');
  assert.throws(() => decodeText('123', 'hex'), /invalid/);
});

test('auto detection rejects ambiguity and unrecognized input', () => {
  assert.throws(() => decodeText('64646464'), /ambiguous/);
  assert.throws(() => decodeText('hello world!'), /unknown/);
  assert.equal(decodeText('%3Cscript%3E').text, '<script>');
});

test('text decoder rejects binary, bad padding, invalid UTF-8 and excessive input', () => {
  for (const value of ['Zg=', 'A', 'Zg===', 'Zh==']) {
    assert.throws(() => decodeText(value, 'base64'), /invalid/);
  }
  assert.throws(() => decodeText('/w==', 'base64'), /binary/);
  assert.throws(() => decodeText('AA==', 'base64'), /binary/);
  assert.throws(() => decodeText('ff', 'hex'), /binary/);
  assert.throws(() => decodeText(''), /empty/);
  assert.throws(() => decodeText('a'.repeat(DECODER_INPUT_LIMIT + 1)), /tooLong/);
});

test('animation duration uses bounded input-size buckets', () => {
  for (const [length, min, max] of [
    [1, 1500, 1800],
    [128, 1500, 1800],
    [129, 1800, 2400],
    [2048, 1800, 2400],
    [2049, 2400, 3000],
    [DECODER_INPUT_LIMIT, 2400, 3000],
  ]) {
    assert.equal(
      estimateDecoderDuration(length, () => 0),
      min
    );
    assert.equal(
      estimateDecoderDuration(length, () => 1),
      max
    );
    assert.equal(
      estimateDecoderDuration(length, () => 0.5),
      (min + max) / 2
    );
  }
});

test('Unicode escapes decode without executing code and validate surrogate pairs', () => {
  assert.equal(decodeText('\\u4F60\\u597D \\u{1F407}', 'unicode').text, '你好 🐇');
  assert.equal(decodeText('\\uD83D\\uDC07\\n\\x41', 'unicode').text, '🐇\nA');
  assert.equal(decodeText('\\\\u0041', 'unicode').text, '\\u0041');
  assert.equal(decodeText('\\u4F60').format, 'unicode');
  for (const value of ['\\uZZZZ', '\\u{110000}', '\\uD800', '\\uDC00', 'abc\\', '\\q']) {
    assert.throws(() => decodeText(value, 'unicode'), /invalid/);
  }
  assert.throws(() => decodeText('\\u0000', 'unicode'), /binary/);
});

test('JWT decodes objects without treating a signature as verified', () => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { sub: '你好', admin: false };
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const token = `${encode(header)}.${encode(payload)}.unverified`;
  assert.deepEqual(JSON.parse(decodeText(token).text), { header, payload });
  assert.equal(decodeText(token).format, 'jwt');
  let nested = { text: 'deep' };
  for (let i = 0; i < 100; i++) nested = { child: nested };
  const deepResult = decodeText(`${encode(header)}.${encode(nested)}.x`, 'jwt').text;
  assert.ok(deepResult.length < 2000, 'deep nesting must not expand into excessive indentation');
  assert.deepEqual(JSON.parse(deepResult).payload, nested);
  assert.equal(
    JSON.parse(decodeText(`${encode(header)}.${encode(payload)}.`, 'jwt').text).payload.sub,
    '你好'
  );
  for (const value of ['a.b', 'a.b.c.d', 'e30.W10.x', 'e30.bm90LWpzb24.x']) {
    assert.throws(() => decodeText(value, 'jwt'), /invalid/);
  }
});

test('shared numeric timing supports custom ranges, fixed values and bounded invalid options', () => {
  assert.equal(
    numericRevealDuration({ rangeMs: [2000, 4000], inputLength: 1, random: () => 0 }),
    2000
  );
  assert.equal(
    numericRevealDuration({ rangeMs: [2000, 4000], inputLength: 16384, random: () => 1 }),
    4000
  );
  assert.equal(
    numericRevealDuration({ rangeMs: [4000, 2000], inputLength: 16384, random: () => 1 }),
    4000
  );
  assert.equal(numericRevealDuration({ rangeMs: [1700, 1700] }), 1700);
  assert.equal(
    numericRevealDuration({ rangeMs: [-5, 20000], inputLength: 16384, random: () => 5 }),
    10000
  );
  assert.equal(numericRevealDuration({ rangeMs: null, random: () => NaN }), 1650);
});
