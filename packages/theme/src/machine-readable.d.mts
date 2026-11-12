import type { AstroIntegration } from 'astro';
export interface MachineReadableSupplement {
  notes?: string;
  links?: { label: string; href: string }[];
}
/** Build-only public article, Fragments and About exports with optional site context. */
export default function machineReadable(options?: {
  title?: string;
  description?: string;
  aiReadableContent?: MachineReadableSupplement;
  locales?: Record<string, { aiReadableContent?: MachineReadableSupplement }>;
}): AstroIntegration;
