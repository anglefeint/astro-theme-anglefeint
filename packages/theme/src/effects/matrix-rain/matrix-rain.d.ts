export interface MatrixRainController {
  start(): void;
  resume(): void;
  pause(): void;
  dispose(): void;
  subscribeFrame(callback: (time: number) => void): () => void;
}

export interface MatrixRainOptions {
  fps?: number | string;
  sizing?: 'element' | 'viewport';
  onPointerMove?: (event: MouseEvent) => void;
}

/** Mounts paused. Returns undefined for a non-canvas element or unavailable Canvas 2D. */
export function mountMatrixRain(
  canvas: Element | null,
  options?: MatrixRainOptions
): MatrixRainController | undefined;
