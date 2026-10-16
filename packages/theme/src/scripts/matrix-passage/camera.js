// Standard perspective camera: world Y points down, world Z points forward.
export function passageCamera({ distance, eyeY, pitch, yaw = 0 }, aspect) {
  const c = Math.cos(pitch),
    s = Math.sin(pitch),
    cy = Math.cos(yaw),
    sy = Math.sin(yaw);
  const view = new Float32Array([
    cy,
    s * sy,
    -c * sy,
    0,
    0,
    -c,
    -s,
    0,
    -sy,
    s * cy,
    -c * cy,
    0,
    sy * distance,
    c * eyeY - s * cy * distance,
    s * eyeY + c * cy * distance,
    1,
  ]);
  const f = 1 / Math.tan((65 * Math.PI) / 360),
    near = 0.08,
    far = 160;
  const projection = new Float32Array([
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) / (near - far),
    -1,
    0,
    0,
    (2 * far * near) / (near - far),
    0,
  ]);
  return { view, projection };
}

// A screen ray must pass through the corridor's far opening to request a return.
export function passageReturnHit(state, dimensions, aspect, u, v) {
  const f = 1 / Math.tan((65 * Math.PI) / 360);
  const x = ((u * 2 - 1) * aspect) / f,
    y = (1 - v * 2) / f;
  const c = Math.cos(state.pitch),
    s = Math.sin(state.pitch);
  const cy = Math.cos(state.yaw ?? 0),
    sy = Math.sin(state.yaw ?? 0);
  const depth = s * y + c;
  const dx = cy * x + sy * depth,
    dz = -sy * x + cy * depth;
  if (dz >= -0.0001) return false;
  const t = -state.distance / dz;
  const worldY = state.eyeY + (-c * y + s) * t;
  return (
    t > 0 &&
    Math.abs(dx * t) <= dimensions.half &&
    worldY >= dimensions.top &&
    worldY <= dimensions.floor
  );
}
// Project the actual closed door plane into normalized screen coordinates.
export function passageDoorRegion(state, dimensions, aspect) {
  const { view, projection } = passageCamera(state, aspect);
  const transform = (matrix, vector) =>
    Array.from({ length: 4 }, (_, row) =>
      vector.reduce((sum, value, column) => sum + matrix[column * 4 + row] * value, 0)
    );
  const { doorHalf, doorTop, floor, end } = dimensions;
  const points = [
    [-doorHalf, doorTop],
    [doorHalf, doorTop],
    [doorHalf, floor],
    [-doorHalf, floor],
  ].map(([x, y]) => {
    const point = transform(projection, transform(view, [x, y, end - 0.025, 1]));
    return [(point[0] / point[3] + 1) / 2, (1 - point[1] / point[3]) / 2];
  });
  return points;
}
