import { parse } from 'node-html-parser';

/** Feed owns priority; only its first image is an eager candidate. */
export function fragmentFeedHtml(html: string, firstImage: boolean) {
  const root = parse(html);
  const images = root.querySelectorAll('img');
  images.forEach((image, index) => {
    const eager = firstImage && index === 0;
    image.setAttribute('loading', eager ? 'eager' : 'lazy');
    image.setAttribute('fetchpriority', eager ? 'high' : 'auto');
    image.setAttribute('decoding', 'async');
  });
  return { html: root.toString(), hasImage: images.length > 0 };
}
