import { parse } from 'node-html-parser';

/** Inspect rendered output so currency, fenced code and MDX expressions aren't guessed as math. */
export function hasMathMarkup(html: string): boolean {
  if (!html.includes('anglefeint-math') && !html.includes('katex')) return false;
  return Boolean(parse(html).querySelector('.anglefeint-math, .katex'));
}
