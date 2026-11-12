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

/** Explicit page adapters read only public rendered fields, never arbitrary config. */
export function extractPage(html, site) {
  const doc = parse(html);
  if (/(?:^|[\s,])(?:noindex|none)(?:$|[\s,])/i.test(meta(doc, 'robots'))) return null;
  const article = doc.querySelector('article[data-machine-readable], [data-machine-page]');
  const kind = article?.getAttribute('data-machine-page') || 'article';
  if (!article || !['article', 'about', 'fragments'].includes(kind)) return null;
  const heading = article.querySelector('h1');
  const body = article.querySelector(kind === 'article' ? '.ai-prose-body' : '[data-machine-body]');
  if (!heading || (kind !== 'fragments' && !body)) return null;
  const canonicalValue = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (!canonicalValue) throw new Error('Public content is missing its canonical URL.');
  const canonical = new URL(canonicalValue, site);
  if (
    !['https:', 'http:'].includes(canonical.protocol) ||
    canonical.origin !== new URL(site).origin
  )
    return null;
  const locale =
    article.getAttribute('data-machine-locale') || doc.querySelector('html')?.getAttribute('lang');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(locale || ''))
    throw new Error('Public content has an invalid language code.');
  const fields = {
    title: compact(heading.getAttribute('aria-label') || heading.textContent),
    description: compact(meta(doc, 'description')),
    url: canonical.href,
    language: locale,
    author: compact(meta(doc, 'author')),
    published: kind === 'article' ? meta(doc, 'article:published_time') : '',
    updated: kind === 'article' ? meta(doc, 'article:modified_time') : '',
  };
  if (kind === 'fragments') {
    const feedURL = new URL(article.getAttribute('data-fragment-root'), canonical);
    if (feedURL.origin !== canonical.origin || feedURL.search || feedURL.hash) return null;
    const entries = article.querySelectorAll('[data-fragment-id]').map((card) => {
      const id = card.getAttribute('data-fragment-id');
      const published = card.querySelector('time[datetime]')?.getAttribute('datetime');
      const content = card.querySelector('.fragment-body');
      if (
        !/^[A-Za-z0-9]{8}$/.test(id || '') ||
        !published ||
        !Number.isFinite(Date.parse(published)) ||
        !content
      )
        throw new Error('Invalid public Fragment export');
      const url = new URL(`#${id}`, feedURL).href;
      return {
        id,
        published,
        url,
        markdown: `## ${id}\n\nPublished: ${published}\n\n[Original](${url})\n\n${markdownBody(content.toString(), canonical)}`,
      };
    });
    return { ...fields, kind, feedURL: feedURL.href, entries };
  }
  let content = markdownBody(body.toString(), canonical);
  if (kind === 'about' && doc.querySelector('[data-modal="ai"]')) {
    // This public popup is already rendered by About's runtime. Never export the
    // enclosing runtime config, terminal entries, effects or other tool panels.
    const config = doc.querySelector('script#hacker-runtime-config[type="application/json"]');
    if (config) {
      const modal = JSON.parse(config.textContent).modalContent?.ai;
      if (typeof modal?.title === 'string' && typeof modal.body === 'string')
        content += `\n\n${markdownBody(`<h2>${escapeText(modal.title)}</h2>${modal.body}`, canonical)}`;
    }
  }
  return { ...fields, kind, markdown: documentMarkdown(fields, content) };
}

const escapeText = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function documentMarkdown(fields, content) {
  const yaml = Object.entries(fields)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
  return `---\n${yaml}\n---\n\n# ${fields.title}\n\n${content}\n`;
}

// Keep the article-only adapter for existing internal callers and focused tests.
export function extractArticle(html, site) {
  const page = extractPage(html, site);
  return page?.kind === 'article' ? page : null;
}
