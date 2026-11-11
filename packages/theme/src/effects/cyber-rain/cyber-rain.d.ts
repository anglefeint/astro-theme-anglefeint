export interface CyberRainController {
  start(): void;
  resume(): void;
  pause(): void;
  dispose(): void;
}

/** Creates 48 CSS-animated drops. The optional random source must return values in [0, 1). */
export function mountCyberRain(
  root: Element | null,
  options?: { random?: () => number }
): CyberRainController | undefined;
