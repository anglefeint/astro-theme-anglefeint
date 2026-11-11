export function mountCyberEnvironment(
  root: Element | null,
  options?: { sizing?: 'container' | 'viewport' }
):
  | {
      start(): void;
      pause(): void;
      resume(): void;
      dispose(): void;
    }
  | undefined;
