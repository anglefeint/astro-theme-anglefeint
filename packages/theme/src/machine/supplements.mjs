import { fromMarkdown } from 'mdast-util-from-markdown';

function webURL(href, base) {
  if (typeof href !== 'string' || !href.trim())
    throw new TypeError('aiReadableContent links require a nonempty href.');
  const url = new URL(href, base);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
    throw new TypeError('aiReadableContent links must use public HTTP(S) URLs.');
  return url.href;
}

// Patch only parsed destinations, leaving prose, code and formatting untouched.
function absoluteMarkdown(source, base) {
  const edits = [];
  function visit(node) {
    if (['link', 'image', 'definition'].includes(node.type)) {
      const url = webURL(node.url, base);
      const start = node.position.start.offset;
      const end = node.position.end.offset;
      const raw = source.slice(start, end);
      let destinationStart = 0;
      let destinationEnd = raw.length;
      if (!raw.startsWith('<')) {
        // Find the label's closing bracket, including escaped/nested image alt text.
        let close = raw.startsWith('!') ? 2 : 1;
        let depth = 1;
        for (; close < raw.length; close++) {
          if (raw[close] === '\\') {
            close++;
            continue;
          }
          if (raw[close] === '[') depth++;
          if (raw[close] === ']' && --depth === 0) break;
        }
        // Link children can contain code with brackets; their parsed end is authoritative.
        if (node.children?.length)
          close = raw.indexOf(']', node.children.at(-1).position.end.offset - start);
        destinationStart = close + 2;
        while (/\s/.test(raw[destinationStart] ?? '')) destinationStart++;
        destinationEnd = destinationStart;
        if (raw[destinationStart] === '<') destinationEnd = raw.indexOf('>', destinationStart) + 1;
        else {
          let parentheses = 0;
          while (destinationEnd < raw.length) {
            const char = raw[destinationEnd];
            if (char === '\\') {
              destinationEnd += 2;
              continue;
            }
            if (/\s/.test(char) || (char === ')' && parentheses === 0)) break;
            if (char === '(') parentheses++;
            if (char === ')') parentheses--;
            destinationEnd++;
          }
        }
      }
      edits.push({
        start: start + destinationStart,
        end: start + destinationEnd,
        replacement: `<${url}>`,
      });
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(fromMarkdown(source));
  for (const edit of edits.sort((a, b) => b.start - a.start))
    source = source.slice(0, edit.start) + edit.replacement + source.slice(edit.end);
  return source;
}

export function siteSupplement(global = {}, localized = {}, base) {
  const notes = localized.notes === undefined ? global.notes : localized.notes;
  const links = localized.links === undefined ? global.links : localized.links;
  if (notes !== undefined && typeof notes !== 'string')
    throw new TypeError('aiReadableContent.notes must be Markdown text.');
  if (links !== undefined && !Array.isArray(links))
    throw new TypeError('aiReadableContent.links must be an array.');
  const note = notes?.trim() ? absoluteMarkdown(notes, base) : '';
  const list = (links ?? []).map((link) => {
    if (!link || typeof link.label !== 'string' || !link.label.trim())
      throw new TypeError('aiReadableContent links require a nonempty label.');
    const label = link.label.replace(/[\r\n]+/g, ' ').replace(/[\\[\]]/g, '\\$&');
    return `- [${label}](<${webURL(link.href, base)}>)`;
  });
  return {
    notes: note ? `## Site notes\n\n${note}\n\n` : '',
    links: list.length ? `## Additional links\n\n${list.join('\n')}\n\n` : '',
  };
}

export function appendSupplement(markdown, supplement) {
  const text = supplement.notes + supplement.links;
  return text
    ? `${markdown.trimEnd()}\n\n---\n\n<!-- Site-provided context; not part of the article. -->\n\n${text}`
    : markdown;
}
