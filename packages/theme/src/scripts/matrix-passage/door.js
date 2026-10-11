export function buildDoorFrame({ face }, dimensions) {
  const { floor, half, end, doorTop, doorHalf } = dimensions;
  const outerTop = doorTop - 0.15;
  const front = end - 0.06,
    back = end + 0.15;
  const wallFace = (material, points, shade = 1) =>
    face(
      material,
      points,
      shade,
      points.map(([x, y, z]) => [(x + z - end) / 1.6, y / 3.25])
    );
  const rectangle = (material, left, right, top, bottom, z, shade) =>
    wallFace(
      material,
      [
        [left, top, z],
        [right, top, z],
        [right, bottom, z],
        [left, bottom, z],
      ],
      shade
    );

  // Partition the opaque wall around the OUTER frame, so no wall lies under its face.
  rectangle(1, -20, -half, -20, 20, end, 0.9);
  rectangle(1, half, 20, -20, 20, end, 0.9);
  rectangle(4, -half, half, -20, outerTop, end, 0.9);
  rectangle(4, -half, half, floor, 20, end, 0.9);

  // A continuous three-sided frame, with separate front/back faces and real reveals.
  for (const depth of [front, back]) {
    rectangle(2, -half, half, outerTop, doorTop, depth, depth === front ? 1.8 : 1.0);
    rectangle(1, -half, -doorHalf, doorTop, floor, depth, depth === front ? 1.6 : 0.9);
    rectangle(1, doorHalf, half, doorTop, floor, depth, depth === front ? 1.6 : 0.9);
  }
  for (const side of [-1, 1]) {
    for (const [x, shade] of [
      [side * doorHalf, 1.1],
      [side * half, 0.75],
    ])
      wallFace(
        1,
        [
          [x, doorTop, front],
          [x, doorTop, back],
          [x, floor, back],
          [x, floor, front],
        ],
        shade
      );
    const x = side * half;
    wallFace(
      2,
      [
        [x, outerTop, front],
        [x, outerTop, back],
        [x, doorTop, back],
        [x, doorTop, front],
      ],
      0.8
    );
  }
  for (const [y, shade] of [
    [doorTop, 1.15],
    [outerTop, 0.75],
  ])
    wallFace(
      2,
      [
        [-half, y, front],
        [half, y, front],
        [half, y, back],
        [-half, y, back],
      ],
      shade
    );
}
export function buildDoor({ face, coupling, curveTube }, dimensions) {
  const { floor, end, doorTop, doorHalf } = dimensions;
  const front = end - 0.025,
    back = end + 0.035;
  face(
    0,
    [
      [-doorHalf, doorTop, front],
      [doorHalf, doorTop, front],
      [doorHalf, floor, front],
      [-doorHalf, floor, front],
    ],
    0.7
  );
  face(
    0,
    [
      [doorHalf, doorTop, back],
      [-doorHalf, doorTop, back],
      [-doorHalf, floor, back],
      [doorHalf, floor, back],
    ],
    0.85
  );
  for (const side of [-1, 1])
    face(
      1,
      [
        [side * doorHalf, doorTop, front],
        [side * doorHalf, doorTop, back],
        [side * doorHalf, floor, back],
        [side * doorHalf, floor, front],
      ],
      1.4
    );
  face(
    1,
    [
      [-doorHalf, doorTop, front],
      [-doorHalf, doorTop, back],
      [doorHalf, doorTop, back],
      [doorHalf, doorTop, front],
    ],
    1.5
  );

  // A circular rose, short neck and round silver knob, inspired by the Oracle's door.
  // Center vertically on the leaf; all knob parts share this fixed local height.
  const handleY = (doorTop + floor) / 2;
  coupling(8, [doorHalf - 0.22, handleY, front - 0.025], [0.09, 0.09, 0.018]);
  curveTube(
    8,
    [
      [doorHalf - 0.22, handleY, front - 0.03],
      [doorHalf - 0.22, handleY, front - 0.1],
    ],
    0.03
  );
  coupling(8, [doorHalf - 0.22, handleY, front - 0.14], [0.085, 0.085, 0.075]);

  return { hinge: -doorHalf, depth: end };
}
