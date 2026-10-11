// Geometry only: the scene supplies placement, materials and its mesh writer.
export function buildBench({ box }, { position: [x, floor, benchZ], materials }) {
  const localBox = box;
  box = (material, px, ...rest) => localBox(material, px + x, ...rest);
  // Broad code-covered slats, seat, arms and legs read as a bench from the doorway.
  for (const y of [floor - 1.1, floor - 0.88, floor - 0.66])
    box(materials.slats, 0, y, benchZ - 0.28, 3.3, 0.14, 0.1, 2);
  for (const x of [-1.35, 1.35]) {
    box(materials.supports, x, floor - 0.59, benchZ - 0.22, 0.13, 1.18, 0.13, 1.8);
    box(materials.supports, x, floor - 0.26, benchZ + 0.33, 0.13, 0.52, 0.13, 1.5);
    box(materials.slats, x, floor - 0.73, benchZ + 0.06, 0.12, 0.1, 0.68, 2);
  }
  box(materials.slats, 0, floor - 0.49, benchZ + 0.04, 3.35, 0.11, 0.7, 1.8);

  return { anchors: { oracleSeat: [x - 0.55, floor - 0.49, benchZ + 0.04] } };
}
