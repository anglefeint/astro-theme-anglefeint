// Seven articulated parts; per-bird seeds vary paths, actions and cadence each cycle.
export const CROW_MOTION_GLSL = `
float crowRandom(float seed) { return fract(sin(seed * 12.9898 + 7.13) * 43758.5453); }
float crowWindow(float cycle, float start, float end) {
  float edge = min(0.20, (end - start) * 0.3);
  return smoothstep(start, start + edge, cycle) * (1.0 - smoothstep(end - edge, end, cycle));
}
mat2 crowRotate(float angle) {
  return mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
}
vec2 crowTarget(float cycle, float seed) {
  float angle = crowRandom(cycle * 3.7 + seed) * 6.283185;
  float radius = 0.15 + crowRandom(cycle * 7.1 + seed + 19.0) * 0.30;
  return vec2(sin(angle), cos(angle)) * radius;
}
vec3 animateCrow(vec3 point, vec4 origin, vec4 state, float clock) {
  float seed = state.x * 17.0 + state.y * 53.0;
  float cadence = 0.85 + state.y * 0.30;
  float time = clock * cadence + state.x;
  // Three unequal-looking activity slots per block; exactly one contains travel.
  // The path advances only in that slot, so quiet slots cannot teleport the bird.
  float slotLength = 3.2 + crowRandom(seed + 4.0) * 1.0;
  float blockLength = slotLength * 3.0;
  float block = floor(time / blockLength);
  float blockTime = mod(time, blockLength);
  float slot = floor(blockTime / slotLength);
  float cycle = mod(blockTime, slotLength);
  float lap = block * 3.0 + slot;
  float travelSlot = floor(crowRandom(seed + block * 8.7 + 12.0) * 3.0);
  float travelStart = travelSlot * slotLength + 0.35;
  float travelDuration = 2.3 + crowRandom(seed + block * 3.1 + 8.0) * 0.5;
  float travel = smoothstep(travelStart, travelStart + travelDuration, blockTime);
  float moving = crowWindow(blockTime, travelStart, travelStart + travelDuration);
  vec2 previous = crowTarget(block - 1.0, seed);
  vec2 start = crowTarget(block, seed);
  vec2 end = crowTarget(block + 1.0, seed);
  vec2 offset = mix(start, end, travel);
  vec2 direction = normalize(end - start + vec2(0.0001));
  vec2 oldDirection = normalize(start - previous + vec2(0.0001));
  vec2 facing = mix(oldDirection, direction, smoothstep(travelStart - 0.3, travelStart, blockTime));
  float yaw = atan(facing.x, -facing.y);
  // Weighted events plus quiet time, rather than equally likely continuous poses.
  float actionSeed = crowRandom(seed + lap * 9.3);
  float action = actionSeed < 0.50 ? 0.0 : actionSeed < 0.67 ? 1.0 :
                 actionSeed < 0.77 ? 2.0 : actionSeed < 0.90 ? 3.0 : 4.0;
  float previousSeed = crowRandom(seed + (lap - 1.0) * 9.3);
  float previousAction = previousSeed < 0.50 ? 0.0 : previousSeed < 0.67 ? 1.0 :
                         previousSeed < 0.77 ? 2.0 : previousSeed < 0.90 ? 3.0 : 4.0;
  // Maintenance gestures cannot repeat in consecutive slots (at least one quiet gap).
  if (action > 0.5 && action < 3.5 && action == previousAction) action = 4.0;
  float resting = abs(slot - travelSlot) > 0.5 ? 1.0 : 0.0;
  float poseStart = 0.25 + crowRandom(seed + lap * 5.1) * 0.35;
  float peckCount = 1.0 + floor(crowRandom(seed + lap * 2.7 + 3.0) * 3.0);
  float peckInterval = 0.46 + state.y * 0.10;
  float feedEnd = poseStart + peckCount * peckInterval;
  float feed = resting * (action < 0.5 ? 1.0 : 0.0) * crowWindow(cycle, poseStart, feedEnd);
  float peckPhase = max(0.0, cycle - poseStart) / peckInterval;
  float peckPulse = sin(clamp(fract(peckPhase) / 0.72, 0.0, 1.0) * 3.141593);
  float peck = feed * max(0.0, peckPulse);
  float preen = resting * (action > 0.5 && action < 1.5 ? 1.0 : 0.0) *
                crowWindow(cycle, poseStart, min(slotLength - 0.25, poseStart + 2.4 + state.y * 0.6));
  float stretch = resting * (action > 1.5 && action < 2.5 ? 1.0 : 0.0) *
                  crowWindow(cycle, poseStart, poseStart + 1.0 + state.y * 0.4);
  float ruffle = resting * (action > 2.5 && action < 3.5 ? 1.0 : 0.0) *
                 crowWindow(cycle, poseStart, poseStart + 0.45 + state.y * 0.15);
  float alert = (1.0 - moving) * (1.0 - feed) * (1.0 - preen);
  float gesture = resting * crowWindow(cycle, poseStart, poseStart + 1.0);
  float side = crowRandom(seed + lap + 23.0) < 0.5 ? -1.0 : 1.0;
  float stride = sin(time * (9.0 + state.y * 4.0));
  float hopping = step(0.80, crowRandom(seed + block * 2.1 + 31.0));
  // One or two discrete hops per trip, separated by grounded pauses.
  float hopCount = 1.0 + floor(crowRandom(seed + block * 1.9 + 41.0) * 2.0);
  float hopPhase = max(0.0, blockTime - travelStart) / (travelDuration / hopCount);
  float hopPulse = sin(clamp(fract(hopPhase) / 0.65, 0.0, 1.0) * 3.141593);
  float hop = moving * hopping * max(0.0, hopPulse);
  float walk = moving * (1.0 - hopping);
  if (state.z > 3.5 && state.z < 5.5) {
    float wingSide = state.z < 4.5 ? -1.0 : 1.0;
    vec2 shoulder = vec2(wingSide * 0.085, -0.36);
    float open = stretch * (wingSide == side ? 1.15 : 0.3);
    open += ruffle * (0.18 + 0.12 * sin(time * 24.0));
    open += hop * 0.35;
    point.xy = shoulder + crowRotate(-wingSide * open) * (point.xy - shoulder);
  }
  if (state.z > 5.5) {
    vec2 tailBase = vec2(-0.29, 0.19);
    float flick = gesture * (action > 3.5 ? 1.0 : 0.0) * sin(time * 8.0) * 0.18;
    point.yz = tailBase + crowRotate(flick) * (point.yz - tailBase);
    point.x *= 1.0 + ruffle * 0.25;
  }
  if (state.z < 1.5 || state.z > 3.5) {
    bool head = state.z > 0.5 && state.z < 1.5;
    vec2 pivot = head ? vec2(-0.38, -0.14) : vec2(-0.25, 0.0);
    float tilt = head ? peck + preen * 0.25 - alert * 0.12 : peck * 0.13;
    point.yz = pivot + crowRotate(tilt) * (point.yz - pivot);
    point.y -= walk * abs(stride) * 0.012;
    if (head) {
      float scanTime = time / (1.5 + state.y);
      float scan = floor(scanTime);
      float scanBlend = smoothstep(0.0, 0.3, fract(scanTime));
      float look = (1.0 - feed) * mix(crowRandom(seed + scan * 4.3),
                   crowRandom(seed + (scan + 1.0) * 4.3), scanBlend);
      look = (look - 0.5) * (0.4 + alert * 0.5) * (1.0 - feed);
      look = mix(look, side * (2.0 + 0.12 * sin(time * 9.0)), preen);
      vec2 neck = vec2(0.0, -0.14);
      point.xz = neck + crowRotate(look) * (point.xz - neck);
      point.y -= alert * 0.025;
      vec2 headPivot = vec2(0.0, -0.41);
      point.xy = headPivot + crowRotate(gesture * side * (action > 3.5 ? 0.3 : 0.0)) * (point.xy - headPivot);
    } else {
      point.x += ruffle * sin(time * 24.0) * 0.008;
      if (state.z < 0.5) point.x *= 1.0 + ruffle * 0.08;
    }
  } else {
    float step = stride * (state.z < 2.5 ? 1.0 : -1.0);
    point.z += walk * step * 0.035;
    point.y -= walk * max(0.0, step) * 0.025;
    point.z += hop * 0.025;
  }
  point.y -= hop * 0.11;
  point *= origin.w;
  // Path offsets are world units, bounded by reserved spacing and bench clearance.
  point.xz = crowRotate(yaw) * point.xz;
  return point + vec3(origin.x + offset.x, state.w, origin.y + offset.y);
}
`;
