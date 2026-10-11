import { createGeometry } from './geometry.js';
import { buildCorridor } from './corridor.js';
import { buildDoor, buildDoorFrame } from './door.js';
import { buildSquare } from './square.js';
import { buildBench } from './bench.js';
import { buildOracle } from './oracle.js';
import { buildCrows } from './crows.js';
import { buildAttachments } from './attachments.js';
import { createWallSignals, createDoorSignals } from './wall-signals.js';

export function createPassageScene(random = Math.random) {
  const dimensions = { top: -1.9, floor: 1.35, half: 1.05, end: 6, doorTop: -1.5, doorHalf: 0.93 };
  const environment = createGeometry();
  const corridorWalls = createGeometry();
  const corridorRoad = createGeometry();
  const attachments = createGeometry();
  buildCorridor(environment, dimensions, random, corridorWalls, corridorRoad);
  buildAttachments(attachments, dimensions, random);
  const frame = createGeometry();
  buildDoorFrame(frame, dimensions);
  buildSquare(environment, dimensions);
  const benchZ = dimensions.end + 10;
  const bench = buildBench(environment, {
    position: [0, dimensions.floor, benchZ],
    materials: { slats: 1, supports: 2 },
  });
  const oracle = createGeometry();
  buildOracle(oracle, {
    seatAnchor: bench.anchors.oracleSeat,
    materials: { clothing: 3, skin: 2, hair: 0, curls: 1, shoes: 1 },
  });
  const crows = buildCrows(createGeometry, dimensions, benchZ, random);
  const door = createGeometry();
  const doorway = buildDoor(door, dimensions);
  return {
    dimensions,
    doorway,
    wallSignals: createWallSignals(random),
    doorSignals: createDoorSignals(random),
    groups: [
      { mode: 0, batches: environment.batches },
      { mode: 0, rain: 'corridor', batches: corridorWalls.batches },
      { mode: 0, roadRain: true, batches: corridorRoad.batches },
      { mode: 0, lightBoost: 1.7, batches: attachments.batches },
      { mode: 0, staticCode: true, batches: frame.batches },
      { mode: 1, rain: 'door', batches: door.batches },
      { mode: 2, batches: oracle.batches },
      crows,
    ],
  };
}
