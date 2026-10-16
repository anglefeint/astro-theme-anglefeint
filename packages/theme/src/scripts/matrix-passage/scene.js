import { createGeometry } from './geometry.js';
import { buildCorridor, buildDoorHall } from './corridor.js';
import { buildDoor, buildDoorFrame } from './door.js';
import { buildSquare } from './square.js';
import { buildBench } from './bench.js';
import { buildOracle } from './oracle.js';
import { buildCrows } from './crows.js';
import { buildAttachments } from './attachments.js';
import { createWallSignals, createDoorSignals } from './wall-signals.js';

export function createPassageScene(random = Math.random, { mode = 'full', quality } = {}) {
  const geometry = () => createGeometry(9, undefined, quality);
  const dimensions = { top: -1.9, floor: 1.35, half: 1.05, end: 6, doorTop: -1.5, doorHalf: 0.93 };
  const environment = geometry();
  const corridorWalls = geometry();
  const corridorRoad = geometry();
  const attachments = geometry();
  if (mode !== 'oracle') {
    buildCorridor(environment, dimensions, random, corridorWalls, corridorRoad);
    buildDoorHall(environment, corridorWalls, corridorRoad, dimensions);
    buildAttachments(attachments, dimensions, random);
  }
  const frame = geometry();
  const surround = geometry();
  buildDoorFrame(frame, dimensions, surround);
  const oracle = geometry();
  const courtyard = geometry();
  let crows;
  if (mode !== 'corridor') {
    buildSquare(courtyard, dimensions);
    const benchZ = dimensions.end + 10;
    const bench = buildBench(courtyard, {
      position: [0, dimensions.floor, benchZ],
      materials: { slats: 1, supports: 2 },
    });
    buildOracle(oracle, {
      seatAnchor: bench.anchors.oracleSeat,
      materials: { clothing: 3, skin: 2, hair: 0, curls: 1, shoes: 1 },
    });
    crows = buildCrows(geometry, dimensions, benchZ, random);
  }
  const door = geometry();
  const doorway = buildDoor(door, dimensions);
  return {
    dimensions,
    doorway,
    wallSignals: createWallSignals(random),
    doorSignals: createDoorSignals(random),
    groups: [
      { id: 'shell', mode: 0, batches: environment.batches },
      { id: 'courtyard', mode: 0, behindDoor: true, batches: courtyard.batches },
      { id: 'walls', mode: 0, rain: 'corridor', batches: corridorWalls.batches },
      { id: 'road', mode: 0, roadRain: true, batches: corridorRoad.batches },
      { id: 'attachments', mode: 0, lightBoost: 1.7, batches: attachments.batches },
      { id: 'frame', mode: 0, batches: frame.batches },
      { id: 'surround', mode: 0, batches: surround.batches },
      { id: 'door', mode: 1, rain: 'door', batches: door.batches },
      { id: 'oracle', mode: 2, behindDoor: true, batches: oracle.batches },
      crows && { ...crows, id: 'crows', behindDoor: true },
    ].filter((group) => group && group.batches.some((batch) => batch.length)),
  };
}
