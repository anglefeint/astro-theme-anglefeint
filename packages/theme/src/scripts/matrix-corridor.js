import { createMaterials } from './matrix-passage/materials.js';
import { createPassageScene } from './matrix-passage/scene.js';
import { createPassageRenderer } from './matrix-passage/renderer.js';
import { samplePassage, PASSAGE_DURATION_MS } from './matrix-passage/timeline.js';
import { PASSAGE_PALETTES } from './matrix-passage/palettes.js';

export function createMatrixCorridor(canvas, palette = 'matrix') {
  const scene = createPassageScene();
  const render = createPassageRenderer(
    canvas,
    scene,
    createMaterials(innerWidth),
    PASSAGE_PALETTES[palette] ?? PASSAGE_PALETTES.matrix
  );
  const draw = (progress, elapsed = (progress * PASSAGE_DURATION_MS) / 1000) =>
    render({ ...samplePassage(progress, scene.dimensions.end, scene.dimensions.floor), elapsed });
  draw.dispose = render.dispose;
  return draw;
}
