export function mountHiddenSignals(
  elements: Iterable<Element>,
  options?: { signal?: AbortSignal }
): () => void;
export function mountHiddenSignal(
  element: Element | null,
  options?: { text?: string; signal?: AbortSignal }
): () => void;
