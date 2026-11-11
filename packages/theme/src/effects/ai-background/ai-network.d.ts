/** Returns a disposer; article owners disable observation and retain window-driven sizing. */
export function mountAiNetwork(
  canvas: Element | null,
  options?: { reducedMotion?: boolean; observeResize?: boolean }
): () => void;
