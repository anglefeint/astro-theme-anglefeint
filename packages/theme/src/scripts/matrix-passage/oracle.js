// Seated anatomy and curved code UVs; no navigation, renderer or bench dependency.
export function buildOracle({ face, coupling, curveTube }, { seatAnchor, materials }) {
  // A seated green code figure: rounded short hair, shoulders and relaxed arms.
  const [personX, seatY, personZ] = seatAnchor;
  const floor = seatY + 0.49;
  // A tailored torso replaces the sphere: neck, sloping shoulders, back and seated hips.
  // Code coordinates follow its curved shoulder lines rather than pinching at spherical poles.
  const torso = [
    [floor - 1.59, 0.14, 0.12],
    [floor - 1.49, 0.29, 0.18],
    [floor - 1.37, 0.39, 0.23],
    [floor - 1.12, 0.36, 0.24],
    [floor - 0.87, 0.35, 0.25],
    [floor - 0.65, 0.41, 0.26],
  ];
  const torsoPoint = (ring, angle) => [
    personX + Math.cos(angle) * torso[ring][1],
    torso[ring][0],
    personZ + Math.sin(angle) * torso[ring][2],
  ];
  const torsoUV = (ring, column) => [
    column / 24,
    (torso[ring][0] - torso[0][0]) * 0.9 +
      Math.pow(Math.cos((column / 24) * Math.PI * 2), 2) * 0.16 * (1 - ring / 6),
  ];
  for (let ring = 0; ring < torso.length - 1; ring++)
    for (let column = 0; column < 24; column++) {
      const a = (column / 24) * Math.PI * 2,
        b = ((column + 1) / 24) * Math.PI * 2;
      face(
        materials.clothing,
        [
          torsoPoint(ring, a),
          torsoPoint(ring + 1, a),
          torsoPoint(ring + 1, b),
          torsoPoint(ring, b),
        ],
        3.4,
        [
          torsoUV(ring, column),
          torsoUV(ring + 1, column),
          torsoUV(ring + 1, column + 1),
          torsoUV(ring, column + 1),
        ]
      );
    }
  coupling(materials.skin, [personX, floor - 1.64, personZ + 0.015], [0.13, 0.13, 0.12]);
  coupling(materials.hair, [personX, floor - 1.83, personZ], [0.25, 0.21, 0.21], 3.3);
  for (let curl = 0; curl < 13; curl++) {
    const angle = (curl * Math.PI * 2) / 13;
    coupling(
      [materials.hair, materials.curls, materials.skin][curl % 3],
      [personX + Math.cos(angle) * 0.22, floor - 1.84 + Math.sin(angle) * 0.16, personZ - 0.08],
      [0.075, 0.068, 0.075],
      2.8
    );
  }
  for (const side of [-1, 1]) {
    curveTube(
      materials.clothing,
      [
        [personX + side * 0.3, floor - 1.43, personZ],
        [personX + side * 0.43, floor - 1.1, personZ + 0.1],
        [personX + side * 0.35, floor - 0.76, personZ + 0.33],
      ],
      0.095
    );
    coupling(
      materials.skin,
      [personX + side * 0.34, floor - 0.76, personZ + 0.35],
      [0.075, 0.07, 0.11]
    );
    curveTube(
      materials.clothing,
      [
        [personX + side * 0.17, floor - 0.48, personZ + 0.17],
        [personX + side * 0.19, floor - 0.45, personZ + 0.48],
        [personX + side * 0.2, floor - 0.12, personZ + 0.5],
      ],
      0.11
    );
    coupling(
      materials.shoes,
      [personX + side * 0.2, floor - 0.07, personZ + 0.59],
      [0.13, 0.07, 0.21]
    );
  }
}
