import { RAIN_PROFILES } from './rain-profiles.js';

// Each signal occupies several glyphs and moves as a single coherent cluster.
export const WALL_SIGNAL_COUNT = 16;

function rainRandom(value) {
  const fract = (n) => n - Math.floor(n);
  const p = [0.1031, 0.103, 0.0973].map((n) => fract(value * n));
  const dot = p[0] * (p[1] + 33.33) + p[1] * (p[2] + 33.33) + p[2] * (p[0] + 33.33);
  return fract((p[0] + dot + p[1] + dot) * (p[2] + dot));
}

export function createWallSignals(random = Math.random) {
  const profile = RAIN_PROFILES.corridor;
  const motion = [],
    shapes = [];
  for (const side of [0, 1]) {
    for (let i = 0; i < profile.signalCount / 2; i++) {
      const depth = 0.4 + i * 0.72 + random() * 0.22;
      const large = i % 2 === 0;
      const direction =
        rainRandom(Math.floor(depth * 2.4) + side * 19) < profile.motion[2] ? -1 : 1;
      motion.push(
        depth / 2.4,
        0.12 + random() * 0.76,
        direction * (profile.motion[0] + random() * profile.motion[1]),
        0.9 + random() * 0.35
      );
      shapes.push(
        large ? 0.055 + random() * 0.025 : 0.022 + random() * 0.012,
        large ? 0.055 + random() * 0.025 : 0.025 + random() * 0.012,
        random(),
        side
      );
    }
  }
  return { motion: new Float32Array(motion), shapes: new Float32Array(shapes) };
}

export function createDoorSignals(random = Math.random) {
  const profile = RAIN_PROFILES.door;
  const motion = new Float32Array(WALL_SIGNAL_COUNT * 4);
  const shapes = new Float32Array(WALL_SIGNAL_COUNT * 4);
  for (let i = 0; i < profile.signalCount; i++) {
    const x = 0.18 + i * 0.23 + random() * 0.06;
    const direction = rainRandom(Math.floor(x * 10)) < profile.motion[2] ? -1 : 1;
    motion.set(
      [
        x,
        0.15 + random() * 0.7,
        direction * (profile.motion[0] + random() * profile.motion[1]),
        0.75 + random() * 0.2,
      ],
      i * 4
    );
    shapes.set([0.026 + random() * 0.015, 0.025 + random() * 0.012, random(), 0], i * 4);
  }
  return { motion, shapes };
}
