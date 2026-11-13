import path from 'node:path';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { defineMdastPlugin } from 'satteri';
import { fragmentImageReferences } from './fragment-sources.mjs';

const slash = (value) => value.replaceAll('\\', '/');

export function fragmentImagePlugin(getData) {
  return ({ fileURL, source }) => {
    if (!fileURL) return;
    const data = getData();
    if (!data) return;
    let file;
    try {
      file = slash(path.relative(data.root, realpathSync(fileURLToPath(fileURL))));
    } catch {
      return;
    }
    const images = data.fragments?.[file];
    if (!images) return;
    const { definitions } = fragmentImageReferences(source);
    const rewrite = (html) => {
      const root = parse(html);
      for (const image of root.querySelectorAll('img')) {
        const key = images[image.getAttribute('src')];
        const record = data.sources[key];
        if (record && (record.variants.length || image.getAttribute('src').startsWith('/')))
          image.setAttribute('data-fragment-image', key);
      }
      return root.toString();
    };
    const replaceImage = (node, context, src) => {
      if (!images[src]) return;
      if (!data.sources[images[src]].variants.length && !src.startsWith('/')) return;
      const root = parse('<img>'),
        image = root.querySelector('img');
      image.setAttribute('src', src);
      image.setAttribute('alt', node.alt ?? '');
      if (node.title) image.setAttribute('title', node.title);
      context.replaceNode(node, { raw: rewrite(root.toString()), mdxExpressions: false });
    };
    return defineMdastPlugin({
      name: 'anglefeint-fragment-images',
      image(node, context) {
        replaceImage(node, context, node.url);
      },
      imageReference(node, context) {
        replaceImage(node, context, definitions.get(node.identifier));
      },
      html(node, context) {
        if (!/<img\b/i.test(node.value)) return;
        const html = rewrite(node.value);
        if (html !== node.value) context.replaceNode(node, { raw: html, mdxExpressions: false });
      },
    });
  };
}
