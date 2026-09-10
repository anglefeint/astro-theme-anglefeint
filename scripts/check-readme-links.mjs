import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { parseFragment } from 'parse5';

export function collectLinks(markdown) {
  const links = [];
  function html(node) {
    for (const attr of node.attrs ?? []) {
      if (attr.name === 'href' || attr.name === 'src') links.push(attr.value);
    }
    for (const child of node.childNodes ?? []) html(child);
  }
  function walk(node) {
    if (['link', 'image', 'definition'].includes(node.type)) links.push(node.url);
    if (node.type === 'html') html(parseFragment(node.value));
    for (const child of node.children ?? []) walk(child);
  }
  walk(fromMarkdown(markdown));
  return links;
}

export async function checkReadmeLinks(root, files) {
  for (const file of files) {
    const source = path.resolve(root, file);
    for (const href of collectLinks(await readFile(source, 'utf8'))) {
      if (!href || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) continue;
      const target = decodeURIComponent(href.split(/[?#]/)[0]);
      const resolved = target.startsWith('/')
        ? path.resolve(root, `.${target}`)
        : path.resolve(path.dirname(source), target);
      try {
        await access(resolved);
      } catch {
        throw new Error(`${file}: missing local link ${href}`);
      }
    }
  }
}
