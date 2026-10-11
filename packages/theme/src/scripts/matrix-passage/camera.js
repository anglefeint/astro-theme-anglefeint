// Standard perspective camera: world Y points down, world Z points forward.
export function passageCamera({ distance, eyeY, pitch }, aspect) {
  const c = Math.cos(pitch),
    s = Math.sin(pitch);
  const view = new Float32Array([
    1,
    0,
    0,
    0,
    0,
    -c,
    -s,
    0,
    0,
    s,
    -c,
    0,
    0,
    c * eyeY - s * distance,
    s * eyeY + c * distance,
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
