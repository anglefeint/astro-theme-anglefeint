// Run from the repository root. Mirror GIF pixel indices without changing palettes.
import sharp from 'sharp';
import { Buffer } from 'node:buffer';
import { log } from 'node:console';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

function decodeIndices(data, minimum) {
  const clear = 1 << minimum,
    end = clear + 1;
  let dictionary,
    next,
    size,
    previous,
    bit = 0;
  const output = [];
  const reset = () => {
    dictionary = Array.from({ length: clear }, (_, i) => [i]);
    next = clear + 2;
    size = minimum + 1;
    previous = undefined;
  };
  reset();
  while (bit + size <= data.length * 8) {
    let code = 0;
    for (let i = 0; i < size; i++, bit++) code |= ((data[bit >> 3] >> (bit & 7)) & 1) << i;
    if (code === clear) {
      reset();
      continue;
    }
    if (code === end) break;
    const entry =
      dictionary[code] ?? (code === next && previous ? [...previous, previous[0]] : null);
    if (!entry) throw new Error('Invalid GIF LZW stream');
    for (const value of entry) output.push(value);
    if (previous && next < 4096) {
      dictionary[next++] = [...previous, entry[0]];
      if (next === 1 << size && size < 12) size++;
    }
    previous = entry;
  }
  return Uint8Array.from(output);
}

// Short literal runs with clear codes keep the code width constant and encoding lossless.
function encodeIndices(indices, minimum) {
  const clear = 1 << minimum,
    size = minimum + 1;
  const bytes = [];
  let bits = 0,
    value = 0;
  const emit = (code) => {
    value |= code << bits;
    bits += size;
    while (bits >= 8) {
      bytes.push(value & 255);
      value >>>= 8;
      bits -= 8;
    }
  };
  for (let offset = 0; offset < indices.length; offset += clear - 2) {
    emit(clear);
    for (let i = offset; i < Math.min(offset + clear - 2, indices.length); i++) emit(indices[i]);
  }
  emit(clear + 1);
  if (bits) bytes.push(value & 255);
  const blocks = [Buffer.from([minimum])];
  for (let i = 0; i < bytes.length; i += 255) {
    const block = Buffer.from(bytes.slice(i, i + 255));
    blocks.push(Buffer.from([block.length]), block);
  }
  blocks.push(Buffer.from([0]));
  return Buffer.concat(blocks);
}

function mirrorGif(bytes) {
  const width = bytes.readUInt16LE(6);
  const paletteBytes = bytes[10] & 128 ? 3 * 2 ** ((bytes[10] & 7) + 1) : 0;
  let position = 13 + paletteBytes;
  const output = [bytes.subarray(0, position)];
  while (position < bytes.length) {
    const start = position;
    if (bytes[position] === 0x3b) {
      output.push(bytes.subarray(position));
      break;
    }
    if (bytes[position] === 0x21) {
      position += 2;
      while (bytes[position]) position += bytes[position] + 1;
      position++;
      output.push(bytes.subarray(start, position));
      continue;
    }
    if (bytes[position] !== 0x2c) throw new Error('Unexpected GIF block');
    const descriptor = Buffer.from(bytes.subarray(position, position + 10));
    const frameWidth = descriptor.readUInt16LE(5),
      frameHeight = descriptor.readUInt16LE(7);
    descriptor.writeUInt16LE(width - descriptor.readUInt16LE(1) - frameWidth, 1);
    position += 10;
    const localSize = descriptor[9] & 128 ? 3 * 2 ** ((descriptor[9] & 7) + 1) : 0;
    const palette = bytes.subarray(position, position + localSize);
    position += localSize;
    const minimum = bytes[position++],
      blocks = [];
    while (bytes[position]) {
      const size = bytes[position++];
      blocks.push(bytes.subarray(position, position + size));
      position += size;
    }
    position++;
    const indices = decodeIndices(Buffer.concat(blocks), minimum);
    assert.equal(indices.length, frameWidth * frameHeight);
    for (let row = 0; row < frameHeight; row++) {
      const start = row * frameWidth;
      indices.subarray(start, start + frameWidth).reverse();
    }
    output.push(descriptor, palette, encodeIndices(indices, minimum));
  }
  return Buffer.concat(output);
}

const source = 'design/avatars/anglefeint-matrix-v2';
const target = 'design/avatars/anglefeint-matrix-v2-left-facing';
for (const file of ['animation-256.gif', 'logo-128.gif']) {
  const input = `${source}/${file}`;
  const result = mirrorGif(await readFile(input));
  const expected = await sharp(input, { animated: true }).flop().ensureAlpha().raw().toBuffer();
  const actual = await sharp(result, { animated: true }).ensureAlpha().raw().toBuffer();
  assert(expected.equals(actual), `${file}: mirrored pixels must match exactly`);
  await writeFile(`${target}/${file}`, result);
  log(`${file}: mirrored animation verified pixel for pixel.`);
}
