export function buildSquare({ face }, dimensions, { halfWidth = 60, depth = 100 } = {}) {
  const { end, floor } = dimensions;
  const squareHalf = halfWidth,
    squareEnd = end + depth;
  for (let z = end; z < squareEnd; z += 2.5) {
    const next = Math.min(squareEnd, z + 2.5);
    for (let x = -squareHalf; x < squareHalf; x += 3)
      face(
        6,
        [
          [x, floor, z],
          [x + 3, floor, z],
          [x + 3, floor, next],
          [x, floor, next],
        ],
        1.4
      );
  }
}
