import { parse } from 'node-html-parser';

export type FragmentPreview = {
  text: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  code?: string;
};

/** Extract bounded data from rendered Markdown, never arbitrary HTML or nested links. */
export function fragmentPreview(html: string, baseURL: string | URL, limit = 180): FragmentPreview {
  const root = parse(html, { blockTextElements: { script: true, style: true } });
  root.querySelectorAll('script, style, template, iframe, object').forEach((node) => node.remove());
  const result: FragmentPreview = { text: '' };
  for (const image of root.querySelectorAll('img')) {
    const src = image.getAttribute('src')?.trim();
    if (!src) continue;
    try {
      const base = new URL(baseURL);
      const url = new URL(src, base);
      if (!['http:', 'https:'].includes(url.protocol)) continue;
      const dimension = (value?: string) =>
        value && /^[1-9]\d{0,4}$/.test(value) ? Number(value) : undefined;
      result.image = {
        src: url.origin === base.origin ? `${url.pathname}${url.search}${url.hash}` : url.href,
        alt: image.getAttribute('alt') ?? '',
        width: dimension(image.getAttribute('width')),
        height: dimension(image.getAttribute('height')),
      };
      break;
    } catch {
      // Skip unusable image URLs; do not turn a bad thumbnail into a build failure.
    }
  }
  const code = root.querySelector('pre code') ?? root.querySelector('pre');
  if (code) {
    const lines = code.textContent.replace(/\r\n?/g, '\n').split('\n');
    const excerpt = Array.from(lines.slice(0, 8).join('\n')).slice(0, 800).join('');
    result.code =
      excerpt + (lines.length > 8 || Array.from(code.textContent).length > 800 ? '\n…' : '');
  }
  root.querySelectorAll('pre, img').forEach((node) => node.remove());
  root
    .querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote, br')
    .forEach((node) => node.insertAdjacentHTML('afterend', ' '));
  const characters = Array.from(root.textContent.replace(/\s+/gu, ' ').trim());
  result.text = characters.slice(0, limit).join('') + (characters.length > limit ? '…' : '');
  return result;
}
