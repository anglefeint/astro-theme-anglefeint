import type { MarkdownHeading } from 'astro';

export type TocEntry = MarkdownHeading & { children: MarkdownHeading[] };

/** Keep Astro's text/slugs intact; h3 without a preceding h2 stays at the root. */
export function buildArticleToc(headings: MarkdownHeading[]): TocEntry[] {
  const entries: TocEntry[] = [];
  let parent: TocEntry | undefined;
  for (const heading of headings) {
    if (heading.depth === 1) parent = undefined;
    if (heading.depth === 2) {
      parent = { ...heading, children: [] };
      entries.push(parent);
    } else if (heading.depth === 3) {
      if (parent) parent.children.push(heading);
      else entries.push({ ...heading, children: [] });
    }
  }
  return entries;
}
