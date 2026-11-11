export interface StartupSegment {
  text: string;
  delay?: number;
  duration?: number;
  cursorFor?: number;
  cursorDelay?: number;
  blinks?: number;
  initial?: number;
}
export interface StartupTextOptions {
  startup?: StartupSegment[];
  message?: StartupSegment[];
  fadeAt?: number;
  fadeDuration?: number;
  messageAt?: number;
}
export function buildStartupModel(options?: StartupTextOptions): {
  style: string;
  hasMessage: boolean;
  groups: { kind: string; segments: { text: string; initial: number; style: string }[] }[];
};
