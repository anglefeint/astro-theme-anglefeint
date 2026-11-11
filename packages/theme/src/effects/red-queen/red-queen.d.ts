/** Returns a disposer. Sources/labels come from RedQueen's supplied root. */
export function mountRedQueen(
  root: Element | null,
  options?: { reducedMotion?: boolean; autoPlay?: boolean }
): () => void;
