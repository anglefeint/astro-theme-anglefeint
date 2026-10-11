export function buildAttachments({ curveTube, coupling }, dimensions, random = Math.random) {
  const { top, half } = dimensions;
  // Loose cable bundles live mainly on the left, with unequal loops and dangling ends.
  for (const depth of [3.4]) {
    const z = depth + random() * 0.3;
    for (let strand = 0; strand < 3; strand++) {
      const offset = strand * 0.035,
        slack = random() * 0.15;
      curveTube(
        1 + strand,
        [
          [-half + 0.03, top + 0.12, z - 0.35 + offset],
          [-half + 0.09, -1.1, z - 0.24 + offset],
          [-half + 0.35, -0.72 + slack, z - 0.12 + offset],
          [-half + 0.48, -0.45 + slack, z + 0.12 + offset],
          [-half + 0.25, -0.25 + slack, z + 0.27 + offset],
          [-half + 0.08, -0.61, z + 0.2 + offset],
          [-half + 0.17, -0.85, z + 0.06 + offset],
          [-half + 0.32, -0.52, z - 0.06 + offset],
          [-half + 0.22, 0.25 + strand * 0.12, z + 0.07 + offset],
          [-half + 0.3, 0.53 + strand * 0.12, z + 0.15 + offset],
        ],
        0.01 + strand * 0.003
      );
    }
    coupling(2, [-half + 0.04, top + 0.14, z - 0.3], [0.06, 0.07, 0.08]);
  }
  // A few rounded conduits hang below the right ceiling; no mirrored cable arrangement.
  for (const depth of [2.2, 4.9]) {
    const z = depth + random() * 0.35;
    curveTube(
      3,
      [
        [half - 0.01, top + 0.18, z - 0.35],
        [half - 0.18, top + 0.3, z - 0.15],
        [half - 0.32, top + 0.58, z + 0.04],
        [half - 0.25, top + 0.74, z + 0.28],
        [half - 0.1, top + 0.55, z + 0.53],
        [half - 0.02, top + 0.35, z + 0.72],
      ],
      0.035
    );
    coupling(4, [half - 0.08, top + 0.37, z + 0.63], [0.06, 0.055, 0.09]);
    curveTube(
      1,
      [
        [half - 0.15, top + 0.35, z + 0.2],
        [half - 0.21, top + 0.7, z + 0.22],
        [half - 0.18, top + 1.05, z + 0.26],
      ],
      0.009
    );
  }
}
