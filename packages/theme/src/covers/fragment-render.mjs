import { parse } from 'node-html-parser';
import { responsiveImage } from './responsive.mjs';

export function rewriteFragmentImages(html, data) {
  const root = parse(html);
  for (const image of root.querySelectorAll('img')) {
    const record = data.sources[image.getAttribute('data-fragment-image')];
    image.removeAttribute('data-fragment-image');
    if (!record) continue;
    if (!record.variants.length && !image.getAttribute('src').startsWith('/')) continue;
    const width = Number(image.getAttribute('width')),
      height = Number(image.getAttribute('height'));
    if (!image.hasAttribute('width'))
      image.setAttribute(
        'width',
        String(
          height > 0
            ? Math.max(1, Math.round((record.width * height) / record.height))
            : record.width
        )
      );
    if (!image.hasAttribute('height'))
      image.setAttribute(
        'height',
        String(
          width > 0
            ? Math.max(1, Math.round((record.height * width) / record.width))
            : record.height
        )
      );
    const responsive = responsiveImage(record);
    if (responsive) {
      image.setAttribute('src', responsive.src);
      image.setAttribute('srcset', responsive.srcset);
      image.setAttribute('sizes', '(max-width: 720px) calc(100vw - 4rem), 860px');
    } else if (data.base !== '/' && !image.getAttribute('src').startsWith(data.base)) {
      image.setAttribute('src', data.base.replace(/\/$/, '') + image.getAttribute('src'));
    }
    if (!image.hasAttribute('loading')) image.setAttribute('loading', 'lazy');
    image.setAttribute('decoding', 'async');
  }
  return root.toString();
}
