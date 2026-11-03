import type { AstroIntegration } from 'astro';
export interface MachineReadableSupplement {
  notes?: string;
  links?: { label: string; href: string }[];
}
/** Build-only public article exports with optional site-provided context. */
export default function machineReadable(options?: {
  title?: string;
  description?: string;
  aiReadableContent?: MachineReadableSupplement;
  locales?: Record<string, { aiReadableContent?: MachineReadableSupplement }>;
}): AstroIntegration;
