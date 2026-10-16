import { createMaterials, resolvePassageQuality } from './matrix-passage/materials.js';
import { createPassageScene } from './matrix-passage/scene.js';
import { createPassageRenderer } from './matrix-passage/renderer.js';
import { samplePassage, PASSAGE_DURATION_MS } from './matrix-passage/timeline.js';
import { PASSAGE_PALETTES } from './matrix-passage/palettes.js';
import { passageDoorRegion, passageReturnHit } from './matrix-passage/camera.js';

export function createMatrixCorridor(canvas, palette = 'matrix', viewport, mode = 'full') {
  const width = viewport?.width ?? innerWidth;
  const quality = viewport
    ? resolvePassageQuality(width, viewport.height, devicePixelRatio || 1)
    : undefined;
  const scene = createPassageScene(Math.random, { mode, quality });
  const render = createPassageRenderer(
    canvas,
    scene,
    createMaterials(width, Math.random, quality),
    PASSAGE_PALETTES[palette] ?? PASSAGE_PALETTES.matrix,
    viewport
  );
  const cameraState = (progress, look = {}) => {
    const state = samplePassage(progress, scene.dimensions.end, scene.dimensions.floor);
    return { ...state, yaw: look.yaw ?? 0, pitch: state.pitch + (look.pitch ?? 0) };
  };
  const draw = (progress, elapsed = (progress * PASSAGE_DURATION_MS) / 1000, look) =>
    render({ ...cameraState(progress, look), elapsed });
  draw.returnHit = (progress, look, u, v) =>
    passageReturnHit(
      cameraState(progress, look),
      scene.dimensions,
      (viewport?.width ?? innerWidth) / (viewport?.height ?? innerHeight),
      u,
      v
    );
  draw.dispose = render.dispose;
  let revealed = mode !== 'corridor';
  draw.reveal = () => {
    if (revealed) return;
    const courtyard = createPassageScene(Math.random, { mode: 'oracle', quality });
    render.addGroups(courtyard.groups);
    revealed = true;
  };
  draw.doorRegion = (progress) =>
    passageDoorRegion(
      samplePassage(progress, scene.dimensions.end, scene.dimensions.floor),
      scene.dimensions,
      (viewport?.width ?? innerWidth) / (viewport?.height ?? innerHeight)
    );
  return draw;
}
