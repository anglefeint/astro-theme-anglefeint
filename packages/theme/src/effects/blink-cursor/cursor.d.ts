export function mountCursor(
  element: Element | null,
  options?: {
    active?: boolean;
    shape?: 'block' | 'underline';
    period?: number;
  }
): { setActive(active: boolean): void; dispose(): void } | undefined;
