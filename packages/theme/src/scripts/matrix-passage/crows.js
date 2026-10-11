// Local articulated crow meshes are packed once; GPU time drives their motion.
export function buildCrows(createGeometry, { floor, end }, benchZ, random = Math.random) {
  const positions = [],
    count = 18 + Math.floor(random() * 10);
  for (let attempt = 0; positions.length < count && attempt < 3000; attempt++) {
    const near = positions.length < Math.ceil(count * 0.55) && attempt < 600;
    const x = (random() - 0.5) * (near ? 12 : 28);
    const z = near ? benchZ - 5 + random() * 10 : end + 5 + random() * 21;
    if (
      (Math.abs(x) < 2.7 && Math.abs(z - benchZ) < 1.8) ||
      positions.some(([bx, bz]) => Math.hypot(x - bx, z - bz) < 2.1)
    )
      continue;
    positions.push([x, z, random() * Math.PI * 2]);
  }
  const batches = Array.from({ length: 9 }, () => []);
  for (const [x, z, yaw] of positions) {
    const parts = Array.from({ length: 7 }, () => createGeometry());
    const [body, head, left, right] = parts;
    body.coupling(0, [0, -0.3, 0.025], [0.115, 0.135, 0.245], 2.0);
    // Folded wings, angular shoulders and a long tapered tail break up the round silhouette.
    for (const side of [-1, 1]) {
      const wing = parts[side < 0 ? 4 : 5];
      wing.coupling(3, [side * 0.1, -0.31, 0.055], [0.035, 0.09, 0.18], 1.1);
      wing.face(
        2,
        [
          [side * 0.09, -0.37, -0.06],
          [side * 0.135, -0.28, 0.1],
          [side * 0.07, -0.23, 0.23],
          [side * 0.09, -0.37, -0.06],
        ],
        2.7
      );
    }
    parts[6].face(
      1,
      [
        [-0.09, -0.29, 0.19],
        [0.09, -0.29, 0.19],
        [0.035, -0.24, 0.48],
        [-0.035, -0.24, 0.48],
      ],
      2.6
    );
    head.coupling(1, [0, -0.41, -0.16], [0.068, 0.105, 0.075], 2.0);
    head.coupling(2, [0, -0.5, -0.2], [0.083, 0.078, 0.09], 2.4);
    const tip = [0, -0.485, -0.43];
    const base = [
      [-0.047, -0.48, -0.25],
      [0, -0.53, -0.26],
      [0.047, -0.48, -0.25],
      [0, -0.46, -0.25],
    ];
    for (let i = 0; i < 4; i++) head.face(1, [base[i], base[(i + 1) % 4], tip, tip], 3.1);
    for (const side of [-1, 1])
      head.coupling(2, [side * 0.075, -0.505, -0.23], [0.01, 0.01, 0.01], 5.0);
    for (const [leg, side] of [
      [left, -1],
      [right, 1],
    ]) {
      const lx = side * 0.052;
      leg.curveTube(
        2,
        [
          [lx, -0.2, 0.02],
          [lx, -0.085, 0.045],
          [lx, -0.012, -0.025],
        ],
        0.008
      );
      for (const toe of [-1, 0, 1])
        leg.curveTube(
          1,
          [
            [lx, -0.012, -0.025],
            [lx + toe * 0.027, -0.008, -0.1],
          ],
          0.005
        );
    }
    const scale = 1.1 + random() * 0.25,
      phase = random() * 12,
      behaviorSeed = random();
    parts.forEach((part, partIndex) =>
      part.batches.forEach((vertices, material) => {
        for (let i = 0; i < vertices.length; i += 6)
          batches[material].push(
            ...vertices.slice(i, i + 6),
            x,
            z,
            yaw,
            scale,
            phase,
            behaviorSeed,
            partIndex,
            floor
          );
      })
    );
  }
  return { mode: 3, staticCode: true, stride: 56, batches };
}
