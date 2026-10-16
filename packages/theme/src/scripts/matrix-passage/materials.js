import { MATRIX_CHARACTERS as alphabet, MATRIX_CODE_FONT } from '../matrix-glyphs.js';
// Texture canvases and flow roles are independent of WebGL ownership.
export function resolvePassageQuality(width, height, pixelRatio = 1) {
  const compact = width * height * Math.min(pixelRatio, 1.5) ** 2 <= 320 * 240;
  return Object.freeze({
    compact,
    textureSize: compact ? 256 : width < 721 ? 512 : 1024,
    glyphStep: compact ? 2 : 1,
    curveSteps: compact ? 3 : 10,
    tubeSides: compact ? 4 : 8,
  });
}

export function createMaterials(width, random = Math.random, quality) {
  const density = quality?.glyphStep ?? 1;
  const makeTexture = (kind) => {
    const size = quality?.textureSize ?? (width < 721 ? 512 : 1024);
    const texture = document.createElement('canvas');
    texture.width = size;
    texture.height = size;
    const ink = texture.getContext('2d');
    ink.scale(size / 1024, size / 1024);
    ink.fillStyle = '#001908';
    ink.fillRect(0, 0, 1024, 1024);
    // Fine underlying code survives in dark areas; brighter streams have independent lengths.
    for (let x = 0; x < 1024; x += 14 * density) {
      const featured = random() > 0.72;
      const start = random() * 1024,
        length = 100 + random() * 700;
      ink.font = `${featured ? 'bold ' : ''}${featured ? 19 : 10}px ${MATRIX_CODE_FONT}`;
      for (let y = 0; y < 1024; y += 22 * density) {
        const run = (y - start + 1024) % 1024;
        const pulse = Math.max(0, 1 - run / length);
        const alpha = featured ? 0.35 + pulse * 0.55 : 0.12 + random() * 0.18;
        ink.fillStyle = featured && pulse > 0.82 ? '#bbffcc' : `rgba(60,255,85,${alpha})`;
        ink.fillText(alphabet[Math.floor(random() * alphabet.length)], x, y + 8);
      }
      if (featured) {
        ink.fillStyle = 'rgba(45,255,80,0.08)';
        ink.fillRect(x - 2, start, 12, length);
      }
    }
    // A second, larger code layer produces continuous luminous bands over the fine base.
    for (let stream = 0; stream < 28 / density; stream++) {
      const x = random() * 1024;
      const start = random() * 250;
      const length = 300 + random() * 700;
      const glyphSize = 20 + Math.floor(random() * 11);
      ink.font = `bold ${glyphSize}px ${MATRIX_CODE_FONT}`;
      ink.shadowColor = '#30ff65';
      ink.shadowBlur = 2;
      for (let y = start; y < Math.min(1024, start + length); y += glyphSize + 2) {
        const pulse = (y - start) / length;
        ink.fillStyle = pulse < 0.18 ? '#caffd0' : `rgba(65,255,90,${0.95 - pulse * 0.4})`;
        ink.fillText(alphabet[Math.floor(random() * alphabet.length)], x, y);
      }
      ink.shadowBlur = 0;
    }
    for (let i = 0; i < 35 / density; i++) {
      const x = random() * 1024,
        y = random() * 1024;
      const w = kind === 'wall' ? 5 + random() * 25 : 25 + random() * 90;
      const h = kind === 'wall' ? 40 + random() * 250 : 4 + random() * 22;
      ink.fillStyle = 'rgba(0,8,2,0.45)';
      ink.fillRect(x, y, w, h);
      ink.fillStyle = 'rgba(120,255,155,0.35)';
      ink.fillRect(x + w, y, 1, h);
    }
    for (let i = 0; i < 24 / density; i++) {
      const x = random() * 1024,
        y = random() * 1024,
        r = 5 + random() * 15;
      const glow = ink.createRadialGradient(x, y, 0, x, y, r);
      glow.addColorStop(0, 'rgba(225,255,232,0.95)');
      glow.addColorStop(0.2, 'rgba(105,255,145,0.65)');
      glow.addColorStop(1, 'rgba(30,255,70,0)');
      ink.fillStyle = glow;
      ink.fillRect(x - r, y - r, r * 2, r * 2);
    }
    return texture;
  };

  // Silver metal retains its pale highlights and reflects the surrounding code.
  const metal = document.createElement('canvas');
  metal.width = metal.height = 128;
  const metalInk = metal.getContext('2d');
  const reflection = metalInk.createLinearGradient(0, 0, 0, 128);
  for (const [stop, color] of [
    [0, '#c8e3d6'],
    [0.2, '#f4fff9'],
    [0.36, '#697c74'],
    [0.48, '#0c2015'],
    [0.65, '#9ab2a6'],
    [0.82, '#e9f5ee'],
    [1, '#3b5145'],
  ])
    reflection.addColorStop(stop, color);
  metalInk.fillStyle = reflection;
  metalInk.fillRect(0, 0, 128, 128);
  metalInk.font = `8px ${MATRIX_CODE_FONT}`;
  metalInk.fillStyle = 'rgba(70,255,115,0.45)';
  for (let x = 4; x < 128; x += 13)
    for (let y = 35; y < 95; y += 9)
      metalInk.fillText(alphabet[Math.floor(random() * alphabet.length)], x, y);

  return [
    ...Array.from({ length: 8 }, (_, i) => ({
      name: i < 6 ? 'wall-' + i : i === 6 ? 'floor' : 'ceiling',
      canvas: makeTexture(i < 6 ? 'wall' : 'floor'),
      flow: i < 6 ? 1 : 2,
      mipmap: true,
    })),
    { name: 'silver', canvas: metal, flow: 0, mipmap: false },
  ];
}
