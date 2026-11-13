import { satteri } from '@astrojs/markdown-satteri';
export default function markdown(options?: {
  enabled?: boolean;
  fragmentImages?: unknown;
}): ReturnType<typeof satteri>;
