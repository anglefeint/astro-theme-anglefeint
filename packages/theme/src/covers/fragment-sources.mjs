import path from 'node:path';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { parse } from 'node-html-parser';

/** Read image nodes, reference definitions and raw HTML, excluding fenced/inline code. */
export function fragmentImageReferences(source) {
  source = source.replace(/^\uFEFF?---[ \t]*\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/, '');
  const root = fromMarkdown(source),
    definitions = new Map(),
    references = [];
  function walk(node, visit) {
    visit(node);
    node.children?.forEach((child) => walk(child, visit));
  }
  walk(root, (node) => {
    if (node.type === 'definition') definitions.set(node.identifier, node.url);
  });
  walk(root, (node) => {
    if (node.type === 'image') references.push(node.url);
    if (node.type === 'imageReference' && definitions.has(node.identifier))
      references.push(definitions.get(node.identifier));
    if (node.type === 'html')
      for (const image of parse(node.value).querySelectorAll('img')) {
        const src = image.getAttribute('src');
        if (src) references.push(src);
      }
  });
  return { references: [...new Set(references)], definitions };
}

export function fragmentImagePath({ root, publicDir, file, src, base = '/' }) {
  if (!src || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(src)) return;
  let name;
  try {
    name = decodeURIComponent(src.split(/[?#]/)[0]);
  } catch {
    return;
  }
  if (name.includes('\\') || name.includes('\0')) return;
  if (name.startsWith('/')) {
    if (base !== '/' && name.startsWith(base.replace(/\/$/, '') + '/'))
      name = name.slice(base.replace(/\/$/, '').length);
    const result = path.resolve(publicDir, '.' + name);
    const relative = path.relative(publicDir, result);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative))
      throw new Error('[covers] Fragment image escapes public directory.');
    return result;
  }
  const result = path.resolve(path.dirname(file), name),
    relative = path.relative(root, result);
  if (
    !relative ||
    relative === '..' ||
    relative.startsWith('..' + path.sep) ||
    path.isAbsolute(relative)
  )
    throw new Error('[covers] Fragment image escapes project.');
  return result;
}
