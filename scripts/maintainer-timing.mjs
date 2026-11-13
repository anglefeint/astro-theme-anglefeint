// Command time and explicit wait are subsets of operation time, not extra wall time.
export function summarizeMaintainerTiming(started, ended, stages) {
  const intervals = stages
    .map((stage) => [Date.parse(stage.startedAt), Date.parse(stage.endedAt)])
    .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && b >= a)
    .map(([a, b]) => [Math.max(started, a), Math.min(ended, b)])
    .filter(([a, b]) => b >= a)
    .sort((a, b) => a[0] - b[0]);
  let covered = 0,
    end = started,
    overlaps = false;
  for (const [a, b] of intervals) {
    if (a < end) overlaps = true;
    covered += Math.max(0, b - Math.max(end, a));
    end = Math.max(end, b);
  }
  const sum = (key) =>
    Number(stages.reduce((total, stage) => total + (stage[key] ?? 0), 0).toFixed(3));
  const wallSeconds = (ended - started) / 1000;
  return {
    wallSeconds: Number(wallSeconds.toFixed(3)),
    stageWallSeconds: Number((covered / 1000).toFixed(3)),
    betweenStagesSeconds: Number(Math.max(0, wallSeconds - covered / 1000).toFixed(3)),
    operationSeconds: sum('operationSeconds'),
    commandSeconds: sum('commandSeconds'),
    explicitWaitSeconds: sum('explicitWaitSeconds'),
    evidenceSeconds: sum('evidenceSeconds'),
    overlappingStages: overlaps,
  };
}
