import type { AstroIntegration } from 'astro';
/** Generate static Pagefind indexes after Astro builds the site. */
export default function search(options?: { enabled?: boolean }): AstroIntegration;
