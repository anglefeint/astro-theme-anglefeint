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
