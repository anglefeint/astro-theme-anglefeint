import type { AstroIntegration } from 'astro';
import type { ThemeConfig } from './project/schema';
export const STANDARD_ROUTES: string[][];
export const TERMINAL_HEADER_RULE: string;
export function assertNoReservedRoutes(srcDir: URL, locales?: readonly string[]): Promise<void>;
export function writeTerminalHeaders(directory: string): Promise<void>;
export default function anglefeint(config: ThemeConfig): AstroIntegration[];
