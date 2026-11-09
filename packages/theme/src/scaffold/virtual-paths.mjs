import { parse } from 'node-html-parser';

/** Inspect actual URL attributes, never inert text/JSON containing path examples. */
export function virtualPathUrls(html, terminal = {}) {
  const paths = [terminal.cwd, ...(terminal.entries ?? []).map((entry) => entry.path)]
    .filter((value) => typeof value === 'string' && value !== '/')
    .map((value) => value.replace(/\/$/, ''));
  const issues = [];
  for (const element of parse(html).querySelectorAll('[href], [src], [action]')) {
    for (const attribute of ['href', 'src', 'action']) {
      const value = element.getAttribute(attribute);
      if (value === undefined) continue;
      try {
        const pathname = decodeURIComponent(
          new URL(value, 'https://about.invalid').pathname
        ).replace(/\/$/, '');
        if (paths.some((virtual) => pathname === virtual || pathname.startsWith(`${virtual}/`)))
          issues.push(value);
      } catch {
        /* Invalid non-path URLs are outside the virtual filesystem check. */
      }
    }
  }
  return issues;
}
