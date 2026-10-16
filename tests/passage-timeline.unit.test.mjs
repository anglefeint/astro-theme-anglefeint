import test from 'node:test';
import assert from 'node:assert/strict';
import {
  passageProgress,
  samplePassage,
  travelProgress,
} from '../packages/theme/src/scripts/matrix-passage/timeline.js';
import { resolvePassageQuality } from '../packages/theme/src/scripts/matrix-passage/materials.js';
import { createPassageScene } from '../packages/theme/src/scripts/matrix-passage/scene.js';
import {
  passageDoorRegion,
  passageCamera,
  passageReturnHit,
} from '../packages/theme/src/scripts/matrix-passage/camera.js';

test('fixed passage modes hold the original camera views without changing the full timeline', () => {
  for (const progress of [0, 0.2, 0.5, 1]) {
    assert.equal(passageProgress('full', progress), progress);
    const corridor = samplePassage(passageProgress('corridor', progress));
    assert.equal(Math.abs(corridor.angle), 0, 'corridor view must keep the door closed');
    assert.deepEqual(corridor, samplePassage(0.06));
    assert.deepEqual(samplePassage(passageProgress('oracle', progress)), samplePassage(1));
  }
});

test('looking changes orientation without moving the camera, and only the back corridor permits return', () => {
  const state = samplePassage(1);
  const dimensions = { half: 1.05, top: -1.9, floor: 1.35 };
  for (const yaw of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
    const { view } = passageCamera({ ...state, yaw }, 180 / 160);
    const position = [0, state.eyeY, state.distance, 1];
    for (let row = 0; row < 3; row++) {
      const cameraPosition = position.reduce(
        (sum, value, column) => sum + view[column * 4 + row] * value,
        0
      );
      assert(Math.abs(cameraPosition) < 1e-5, 'camera world position must not change');
    }
    assert.equal(
      passageReturnHit({ ...state, yaw }, dimensions, 180 / 160, 0.5, 0.5),
      yaw === Math.PI
    );
  }
  assert.equal(
    passageReturnHit({ ...state, yaw: Math.PI }, dimensions, 180 / 160, 0.05, 0.5),
    false
  );
});

test('door continuation follows the existing path and hit region matches the closed door view', () => {
  assert.equal(travelProgress(0.06, 1, 0), passageProgress('corridor', 0));
  assert.equal(travelProgress(0.06, 1, 5500), 1);
  const scene = createPassageScene(() => 0.5, { mode: 'corridor' });
  const region = passageDoorRegion(samplePassage(0.06), scene.dimensions, 180 / 160);
  assert.equal(region.length, 4);
  assert(region.every(([x, y]) => x > 0 && x < 1 && y > 0 && y < 1));
  assert(region[0][0] < 0.5 && region[1][0] > 0.5);
  assert(region[0][1] < region[3][1]);
});

test('reverse travel samples the same camera path and clamps at its origin', () => {
  for (const origin of [0, 0.06]) {
    const duration = (1 - origin) * 5500;
    for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
      const backwards = travelProgress(1, origin, duration * fraction);
      const forwards = travelProgress(origin, 1, duration * (1 - fraction));
      assert(Math.abs(backwards - forwards) < 1e-12);
    }
    assert.equal(travelProgress(1, origin, duration + 1000), origin);
  }
});

test('compact corridor excludes hidden world geometry and uses a bounded quality budget', () => {
  const quality = resolvePassageQuality(180, 160, 2);
  assert.equal(quality.textureSize, 256);
  assert.equal(quality.compact, true);
  assert.equal(resolvePassageQuality(1440, 900, 1).textureSize, 1024);
  const corridor = createPassageScene(() => 0.5, { mode: 'corridor', quality });
  const full = createPassageScene(() => 0.5);
  assert(!corridor.groups.some((group) => group.mode === 2 || group.mode === 3));
  assert(full.groups.some((group) => group.mode === 2));
  assert(full.groups.some((group) => group.mode === 3));
  assert.deepEqual(
    full.groups.filter((group) => group.behindDoor).map((group) => group.id),
    ['courtyard', 'oracle', 'crows'],
    'only scenery behind the opaque door may be skipped'
  );
  assert.equal(Math.abs(samplePassage(1 / 5.5).angle), 0);
  assert(
    samplePassage(1 / 5.5 + 0.000001).angle < 0,
    'the courtyard must become drawable as soon as the door starts opening'
  );
  const vertices = (scene) =>
    scene.groups.reduce(
      (sum, group) =>
        sum + group.batches.reduce((n, batch) => n + batch.length / ((group.stride ?? 24) / 4), 0),
      0
    );
  assert(vertices(corridor) < vertices(full) / 2);
  assert(vertices(corridor) < 7500, 'rear hall must stay within the compact geometry budget');
  const rearWall = corridor.groups.find((group) => group.id === 'walls');
  const rearDepths = rearWall.batches.flatMap((batch) =>
    batch.filter((_, index) => index % 6 === 2)
  );
  assert(
    Math.min(...rearDepths) < -16 && Math.min(...rearDepths) > -17,
    'the shared rear corridor must end at the compact elbow'
  );
  assert.equal(corridor.groups.find((group) => group.id === 'surround').staticCode, undefined);
  assert.equal(
    corridor.groups.find((group) => group.id === 'frame').staticCode,
    undefined,
    'door frame and inner reveals must retain material code flow'
  );
  const oracle = createPassageScene(() => 0.5, { mode: 'oracle', quality });
  assert(!oracle.groups.some((group) => group.rain === 'corridor'));
  assert(oracle.groups.some((group) => group.mode === 2));
});
