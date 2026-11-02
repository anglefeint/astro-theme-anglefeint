import { parse } from 'node-html-parser';
import TurndownService from 'turndown';
import gfmPlugin from 'turndown-plugin-gfm';

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
turndown.use(gfmPlugin.gfm);
turndown.addRule('code-fence', {
  filter: 'pre',
  replacement: (_, node) => {
    const code = node.querySelector('code') || node;
    const language =
      node.getAttribute('data-language') ||
      (code.className || '').match(/language-([\w+-]+)/)?.[1] ||
      '';
    const text = code.textContent || '';
    const longest = Math.max(2, ...(text.match(/`+/g) || []).map((run) => run.length));
    const fence = '`'.repeat(longest + 1);
    return `\n\n${fence}${/^[\w+-]+$/.test(language) ? language : ''}\n${text.replace(/\n$/, '')}\n${fence}\n\n`;
  },
});
turndown.addRule('math', {
  filter: (node) => node.classList?.contains('katex') || node.classList?.contains('katex-display'),
  replacement: (_, node) => {
    const tex = node.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
    if (!tex) return node.textContent || '';
    return node.classList.contains('katex-display') ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`;
  },
});

const compact = (value = '') => value.replace(/\s+/g, ' ').trim();
const meta = (doc, key) =>
  doc.querySelector(`meta[property="${key}"],meta[name="${key}"]`)?.getAttribute('content') || '';

export function markdownBody(html, canonical) {
  const body = parse(html);
  for (const node of body.querySelectorAll(
    'script,style,nav,button,svg,canvas,iframe,form,input,[aria-hidden="true"],[data-machine-ignore]'
  ))
    node.remove();
  for (const node of body.querySelectorAll('a[href],img[src]')) {
    const attribute = node.tagName === 'IMG' ? 'src' : 'href';
    try {
      const url = new URL(node.getAttribute(attribute), canonical);
      const allowed =
        attribute === 'src' ? ['http:', 'https:'] : ['http:', 'https:', 'mailto:', 'tel:'];
      if (!allowed.includes(url.protocol)) {
        node.removeAttribute(attribute);
        continue;
      }
      node.setAttribute(attribute, url.href);
    } catch {
      node.removeAttribute(attribute);
    }
  }
  return turndown.turndown(body.toString()).trim();
}

/** Read only rendered public fields, never original frontmatter or source files. */
export function extractArticle(html, site) {
  const doc = parse(html);
  if (/(?:^|[\s,])(?:noindex|none)(?:$|[\s,])/i.test(meta(doc, 'robots'))) return null;
  const article = doc.querySelector('article[data-machine-readable]');
  const body = article?.querySelector('.ai-prose-body');
  const heading = article?.querySelector('h1');
  if (!body || !heading) return null;
  const canonicalValue = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (!canonicalValue) throw new Error('Public article is missing its canonical URL.');
  const canonical = new URL(canonicalValue, site);
  if (
    !['https:', 'http:'].includes(canonical.protocol) ||
    canonical.origin !== new URL(site).origin
  )
    return null;
  const locale =
    article.getAttribute('data-machine-locale') || doc.querySelector('html')?.getAttribute('lang');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(locale || ''))
    throw new Error('Public article has an invalid language code.');
  const fields = {
    title: compact(heading.textContent),
    description: compact(meta(doc, 'description')),
    url: canonical.href,
    language: locale,
    author: compact(meta(doc, 'author')),
    published: meta(doc, 'article:published_time'),
    updated: meta(doc, 'article:modified_time'),
  };
  const yaml = Object.entries(fields)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
  const content = markdownBody(body.toString(), canonical);
  return { ...fields, markdown: `---\n${yaml}\n---\n\n# ${fields.title}\n\n${content}\n` };
}
