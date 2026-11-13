import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeMaintainerTiming } from '../scripts/maintainer-timing.mjs';

const stamp = (ms) => new Date(ms).toISOString();
test('timing separates wall coverage, operations, commands, explicit wait and coordination', () => {
  const stage = (start, end) => ({
    startedAt: stamp(start),
    endedAt: stamp(end),
    operationSeconds: 0.015,
    commandSeconds: 0.01,
    explicitWaitSeconds: 0.002,
    evidenceSeconds: 0.005,
  });
  const result = summarizeMaintainerTiming(0, 100, [stage(10, 30), stage(40, 60)]);
  assert.deepEqual(result, {
    wallSeconds: 0.1,
    stageWallSeconds: 0.04,
    betweenStagesSeconds: 0.06,
    operationSeconds: 0.03,
    commandSeconds: 0.02,
    explicitWaitSeconds: 0.004,
    evidenceSeconds: 0.01,
    overlappingStages: false,
  });
});
test('overlapping stages use interval union rather than subtracting summed durations', () => {
  const result = summarizeMaintainerTiming(0, 100, [
    { startedAt: stamp(10), endedAt: stamp(50) },
    { startedAt: stamp(30), endedAt: stamp(70) },
  ]);
  assert.equal(result.stageWallSeconds, 0.06);
  assert.equal(result.betweenStagesSeconds, 0.04);
  assert.equal(result.overlappingStages, true);
});
