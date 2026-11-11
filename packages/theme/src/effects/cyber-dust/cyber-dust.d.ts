export interface CyberDustController {
  start(): void;
  resume(): void;
  pause(): void;
  dispose(): void;
}

/** Creates 22 CSS-animated particles. The optional random source must return values in [0, 1). */
export function mountCyberDust(
  root: Element | null,
  options?: { random?: () => number }
): CyberDustController | undefined;
