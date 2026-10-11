// Motion: minimum speed, spread, upward fraction, column count.
export const RAIN_PROFILES = {
  corridor: {
    motion: [0.12, 0.1, 0.35, 73],
    light: [0.32, 1.45, 1, 1],
    local: false,
    signalCount: 16,
  },
  door: {
    motion: [0.065, 0.065, 0.2, 73],
    light: [0.6, 1.08, 0.7, 0.55],
    local: true,
    signalCount: 3,
  },
};
