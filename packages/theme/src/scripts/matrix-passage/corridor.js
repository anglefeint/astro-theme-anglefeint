// Rear scenery uses the same batches and textures as the entrance corridor.
// Closed side doors are shallow panels; only the nearest four pairs have solid frames.
export function buildDoorHall(shell, walls, road, { top, floor, half, doorTop }) {
  const straight = 14;
  const length = straight + half * 2;
  const wallFace = (side, x, y0, y1, z0, z1, shade) => {
    const points = [
      [side * x, y0, z0],
      [side * x, y0, z1],
      [side * x, y1, z1],
      [side * x, y1, z0],
    ];
    walls.face(
      side < 0 ? 1 : 3,
      points,
      shade,
      points.map(([, y, z]) => [z / 2.4, (y - top) / (floor - top)])
    );
  };
  for (const side of [-1, 1]) {
    // Segment the depth fog as well as the perspective texture interpolation.
    for (let bay = 0; bay < 4; bay++) {
      const start = -bay * 3.5;
      const a = start - 1,
        b = start - 2.25;
      wallFace(side, half + 0.06, top, floor, start - 3.5, start, 0.75);
      // A dark uninterrupted leaf sits behind the trim, above a narrow threshold gap.
      wallFace(side, half + 0.025, doorTop, floor - 0.07, b, a, 0.12);
      const trim = (y0, y1, z0, z1) =>
        shell.face(
          8,
          [
            [side * (half - 0.025), y0, z0],
            [side * (half - 0.025), y0, z1],
            [side * (half - 0.025), y1, z1],
            [side * (half - 0.025), y1, z0],
          ],
          0.65,
          [
            [0.1, 0.02],
            [0.2, 0.02],
            [0.2, 0.1],
            [0.1, 0.1],
          ]
        );
      for (const z of [a, b]) trim(doorTop, floor, z - 0.025, z + 0.025);
      trim(doorTop - 0.045, doorTop + 0.015, b, a);
      if (bay < 4) {
        for (const z of [a, b])
          shell.box(2, side * half, (doorTop + floor) / 2, z, 0.09, floor - doorTop, 0.065, 1.45);
        shell.box(2, side * half, doorTop, (a + b) / 2, 0.09, 0.08, a - b + 0.065, 1.45);
        shell.box(8, side * (half - 0.045), 0.05, a - 0.19, 0.06, 0.17, 0.08, 0.9);
        shell.box(8, side * (half - 0.1), 0.05, a - 0.3, 0.065, 0.045, 0.3, 1.2);
      }
    }
  }
  // The right wall ends before the back wall: a real elbow, not a painted opening.
  wallFace(-1, half + 0.06, top, floor, -length, -straight, 0.75);
  const crossFace = (material, x0, x1, y0, y1, z, shade) => {
    const points = [
      [x0, y0, z],
      [x1, y0, z],
      [x1, y1, z],
      [x0, y1, z],
    ];
    walls.face(
      material,
      points,
      shade,
      points.map(([x, y]) => [x / 2.4, (y - top) / (floor - top)])
    );
  };
  const branchEnd = 7;
  crossFace(1, -half, branchEnd, top, floor, -length, 0.85);
  crossFace(3, half, branchEnd, top, floor, -straight, 0.75);
  wallFace(1, branchEnd, top, floor, -length, -straight, 0.5);
  // Two closed doors beyond the elbow use only flat panels and narrow trim.
  for (const x of [2.3, 5.1]) {
    crossFace(0, x, x + 1.2, doorTop, floor - 0.07, -length + 0.025, 0.12);
    for (const edge of [x, x + 1.2])
      shell.box(
        8,
        edge,
        (doorTop + floor) / 2,
        -length + 0.05,
        0.045,
        floor - doorTop,
        0.045,
        0.65
      );
    shell.box(8, x + 0.6, doorTop, -length + 0.05, 1.25, 0.045, 0.045, 0.65);
    shell.box(8, x + 0.95, 0.05, -length + 0.1, 0.26, 0.045, 0.065, 1.1);
  }
  for (const [geometry, material, y, shade] of [
    [road, 6, floor, 1],
    [shell, 7, top, 0.85],
  ]) {
    const points = [
      [half, y, -straight],
      [branchEnd, y, -straight],
      [branchEnd, y, -length],
      [half, y, -length],
    ];
    geometry.face(
      material,
      points,
      shade,
      points.map(([x, , z]) => [x / 2.6, z / 1.5])
    );
  }
  for (let z = 0; z > -length; z -= 3.5) {
    const next = Math.max(-length, z - 3.5);
    for (const [geometry, material, y, shade] of [
      [road, 6, floor, 1],
      [shell, 7, top, 0.85],
    ]) {
      const points = [
        [-half, y, z],
        [half, y, z],
        [half, y, next],
        [-half, y, next],
      ];
      geometry.face(
        material,
        points,
        shade,
        points.map(([x, , depth]) => [x / 2.6, depth / 1.5])
      );
    }
  }
}

export function buildCorridor(
  geometry,
  dimensions,
  random = Math.random,
  walls = geometry,
  road = geometry
) {
  const { top, floor, half, end } = dimensions;
  // World-scaled UVs keep glyph size consistent across irregular wall panels.
  const face = (material, points, shade = 1) =>
    walls.face(
      material,
      points,
      shade,
      points.map(([x, y, z]) => [(z + Math.abs(x) - half) / 2.4, (y - top) / (floor - top)])
    );
  for (const side of [-1, 1]) {
    let z = 0,
      previous = half;
    const tile = side < 0 ? 1 : 3;
    while (z < end) {
      const next = Math.min(end, z + 0.8 + random() * 1.3);
      const inset = half + (random() - 0.35) * 0.09;
      const panelLight = side < 0 && z > 2.5 ? 0.65 : 0.95;
      face(
        tile,
        [
          [side * inset, top, z],
          [side * inset, top, next],
          [side * inset, floor, next],
          [side * inset, floor, z],
        ],
        panelLight
      );
      face(
        tile,
        [
          [side * previous, top, z],
          [side * inset, top, z],
          [side * inset, floor, z],
          [side * previous, floor, z],
        ],
        0.65
      );
      previous = inset;
      z = next;
    }
    // Only a few shallow projections interrupt the continuous surface.
    const depth = side < 0 ? 2.6 : 4.1;
    const width = side < 0 ? 0.23 : 0.36;
    const outer = half + 0.07,
      inner = half - 0.045;
    face(
      tile,
      [
        [side * inner, top, depth],
        [side * inner, top, depth + width],
        [side * inner, floor, depth + width],
        [side * inner, floor, depth],
      ],
      1.08
    );
    for (const edge of [depth, depth + width])
      face(
        tile,
        [
          [side * inner, top, edge],
          [side * outer, top, edge],
          [side * outer, floor, edge],
          [side * inner, floor, edge],
        ],
        0.7
      );
  }

  for (let z = 0; z < end; z += 1.5) {
    const next = Math.min(end, z + 1.5);
    road.face(
      6,
      [
        [-1.3, floor, z],
        [1.3, floor, z],
        [1.3, floor, next],
        [-1.3, floor, next],
      ],
      1.1,
      [
        [-1.3 / 2.6, z / 1.5],
        [1.3 / 2.6, z / 1.5],
        [1.3 / 2.6, next / 1.5],
        [-1.3 / 2.6, next / 1.5],
      ]
    );
    geometry.face(
      7,
      [
        [-1.3, top, z],
        [-1.3, top, next],
        [1.3, top, next],
        [1.3, top, z],
      ],
      0.95,
      [
        [-1.3 / 2.6, z / 1.5],
        [-1.3 / 2.6, next / 1.5],
        [1.3 / 2.6, next / 1.5],
        [1.3 / 2.6, z / 1.5],
      ]
    );
  }
}
