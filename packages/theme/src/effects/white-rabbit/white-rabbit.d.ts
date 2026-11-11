export type WhiteRabbitMode = 'scatter' | 'rain' | 'rebuild' | 'scan';

export interface WhiteRabbitController {
  start(): void;
  resume(): void;
  pause(): void;
  reset(): void;
  dispose(): void;
}

/** Binds a trigger to a WhiteRabbit visual; the caller owns page lifecycle. */
export function mountWhiteRabbit(
  trigger: Element | null,
  element: Element | null,
  options?: { mode?: WhiteRabbitMode }
): WhiteRabbitController | undefined;
