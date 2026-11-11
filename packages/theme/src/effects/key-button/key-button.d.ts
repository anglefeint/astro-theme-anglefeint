export function mountKeyButton(
  button: Element | null,
  options?: {
    duration?: number;
    onStart?: () => boolean | void;
    onUnlock?: () => void;
    signal?: AbortSignal;
  }
): { reset(): void; dispose(): void } | undefined;
