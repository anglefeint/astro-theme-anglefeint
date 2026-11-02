import type { AstroIntegration } from 'astro';
/** Generate Markdown companions and language indexes from public article HTML. */
export default function machineReadable(options?: { title?: string; description?: string }): AstroIntegration;
