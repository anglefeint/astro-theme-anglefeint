// CPU mesh generation only; no rendering or animation state.
export function createGeometry(materialCount = 9, transform = (point) => point, quality) {
  const steps = quality?.curveSteps ?? 10;
  const sides = quality?.tubeSides ?? 8;
  const batches = Array.from({ length: materialCount }, () => []);
  const meshBatches = batches;
  const face = (
    texture,
    points,
    shade = 1,
    coords = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ]
  ) => {
    for (const index of [0, 1, 2, 0, 2, 3])
      meshBatches[texture].push(...transform(points[index]), ...coords[index], shade);
  };

  const normalize = (vector) => {
    const length = Math.hypot(...vector);
    return vector.map((v) => v / length);
  };
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const curveTube = (texture, controls, radius) => {
    // Catmull-Rom interpolation preserves slack bends instead of angular pipe elbows.
    const points = [];
    for (let segment = 0; segment < controls.length - 1; segment++) {
      const p0 = controls[Math.max(0, segment - 1)],
        p1 = controls[segment],
        p2 = controls[segment + 1],
        p3 = controls[Math.min(controls.length - 1, segment + 2)];
      for (let step = 0; step < steps; step++) {
        const t = step / steps;
        points.push(
          p1.map(
            (v, i) =>
              0.5 *
              (2 * v +
                (-p0[i] + p2[i]) * t +
                (2 * p0[i] - 5 * v + 4 * p2[i] - p3[i]) * t * t +
                (-p0[i] + 3 * v - 3 * p2[i] + p3[i]) * t * t * t)
          )
        );
      }
    }
    points.push(controls.at(-1));
    const rings = points.map((center, index) => {
      const previous = points[Math.max(0, index - 1)],
        next = points[Math.min(points.length - 1, index + 1)];
      const axis = normalize(next.map((v, i) => v - previous[i]));
      const u = normalize(cross(axis, Math.abs(axis[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0])),
        v = cross(axis, u);
      return Array.from({ length: sides }, (_, side) =>
        center.map(
          (n, i) =>
            n +
            radius *
              (u[i] * Math.cos((side * Math.PI * 2) / sides) +
                v[i] * Math.sin((side * Math.PI * 2) / sides))
        )
      );
    });
    for (let i = 1; i < rings.length; i++)
      for (let side = 0; side < sides; side++) {
        const next = (side + 1) % sides,
          y0 = 0.1 + (0.8 * (i - 1)) / (rings.length - 1),
          y1 = 0.1 + (0.8 * i) / (rings.length - 1);
        face(
          texture,
          [rings[i - 1][side], rings[i][side], rings[i][next], rings[i - 1][next]],
          1.05 + 0.3 * Math.cos((side * Math.PI * 2) / sides),
          [
            [0.2 + side * 0.008, y0],
            [0.2 + side * 0.008, y1],
            [0.2 + (side + 1) * 0.008, y1],
            [0.2 + (side + 1) * 0.008, y0],
          ]
        );
      }
  };
  const coupling = (texture, center, radius, light = 1.2) => {
    const point = (latitude, longitude) => [
      center[0] + radius[0] * Math.sin(latitude) * Math.cos(longitude),
      center[1] + radius[1] * Math.cos(latitude),
      center[2] + radius[2] * Math.sin(latitude) * Math.sin(longitude),
    ];
    for (let row = 0; row < 6; row++)
      for (let col = 0; col < 8; col++) {
        const a = (row * Math.PI) / 6,
          b = ((row + 1) * Math.PI) / 6,
          c = (col * Math.PI) / 4,
          d = ((col + 1) * Math.PI) / 4;
        face(texture, [point(a, c), point(b, c), point(b, d), point(a, d)], light, [
          [col / 8, row / 6],
          [col / 8, (row + 1) / 6],
          [(col + 1) / 8, (row + 1) / 6],
          [(col + 1) / 8, row / 6],
        ]);
      }
  };

  const box = (texture, x, y, z, sx, sy, sz, light = 1.2) => {
    const l = x - sx / 2,
      r = x + sx / 2,
      t = y - sy / 2,
      b = y + sy / 2,
      n = z - sz / 2,
      f = z + sz / 2;
    face(
      texture,
      [
        [l, t, n],
        [r, t, n],
        [r, b, n],
        [l, b, n],
      ],
      light
    );
    face(
      texture,
      [
        [r, t, f],
        [l, t, f],
        [l, b, f],
        [r, b, f],
      ],
      light * 0.8
    );
    face(
      texture,
      [
        [l, t, f],
        [l, t, n],
        [l, b, n],
        [l, b, f],
      ],
      light * 0.75
    );
    face(
      texture,
      [
        [r, t, n],
        [r, t, f],
        [r, b, f],
        [r, b, n],
      ],
      light * 0.9
    );
    face(
      texture,
      [
        [l, t, n],
        [l, t, f],
        [r, t, f],
        [r, t, n],
      ],
      light * 1.4
    );
    face(
      texture,
      [
        [l, b, f],
        [l, b, n],
        [r, b, n],
        [r, b, f],
      ],
      light * 0.6
    );
  };

  return { batches, face, curveTube, coupling, box };
}
