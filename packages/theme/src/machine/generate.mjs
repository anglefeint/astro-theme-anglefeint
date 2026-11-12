import { mkdir, readFile, readdir, rm, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { siteSupplement, appendSupplement } from './supplements.mjs';
import { extractPage, documentMarkdown } from './content.mjs';

const line = (text = '') => text.replace(/[\r\n]+/g, ' ').trim();
const label = (text) => line(text).replace(/[\\[\]]/g, '\\$&');
const ownedLinks = /<link\b(?=[^>]*\bdata-anglefeint-machine=)[^>]*>/gi;
const escapeAttribute = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

async function htmlFiles(dir, prefix = '') {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(path.join(dir, entry.name), rel)));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(rel);
  }
  return files.sort();
}

function outputPath(dir, relative) {
  if (
    typeof relative !== 'string' ||
    relative.includes('\\') ||
    relative.split('/').includes('..') ||
    path.isAbsolute(relative)
  )
    throw new Error('Unsafe machine-readable output path.');
  const resolved = path.resolve(dir, relative);
  if (!path.relative(dir, resolved) || path.relative(dir, resolved).startsWith('..'))
    throw new Error('Machine-readable output must stay inside the build directory.');
  return resolved;
}

export async function generateMachineReadable({
  dir,
  site,
  base = '/',
  title,
  description = '',
  manifestPath,
  aiReadableContent = {},
  locales = {},
}) {
  if (!site) throw new Error('Machine-readable exports require the existing Astro site URL.');
  const siteURL = new URL(site);
  if (!['http:', 'https:'].includes(siteURL.protocol))
    throw new Error('Astro site must use HTTP or HTTPS.');
  const prefix = `/${base.split('/').filter(Boolean).join('/')}`.replace(/\/$/, '');
  const publicURL = (relative) => new URL(`${prefix}/${relative}`, siteURL).href;
  let previous = [];
  if (manifestPath) {
    try {
      const saved = JSON.parse(await readFile(manifestPath, 'utf8'));
      if (saved.dir === path.resolve(dir)) previous = saved.files;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  if (
    !Array.isArray(previous) ||
    previous.some(
      (rel) => typeof rel !== 'string' || !/(?:\.md|(?:^|\/)llms(?:-full)?\.txt)$/.test(rel)
    )
  )
    throw new Error('Invalid machine-readable output manifest.');
  for (const rel of previous) outputPath(dir, rel);
  const documents = [];
  const feeds = new Map();
  const pages = [];
  for (const file of await htmlFiles(dir)) {
    const filename = outputPath(dir, file);
    const html = await readFile(filename, 'utf8');
    const clean = html.replace(ownedLinks, '');
    const document = extractPage(clean, siteURL);
    if (document) {
      const markdownFile =
        file.endsWith('/index.html') || file === 'index.html'
          ? file.replace(/index\.html$/, 'index.md')
          : `${file}.md`;
      const output = {
        ...document,
        markdownFile,
        markdownURL: publicURL(markdownFile),
        htmlFile: file,
        htmlFiles: [file],
      };
      if (document.kind === 'fragments') {
        if (!feeds.has(document.feedURL)) feeds.set(document.feedURL, []);
        feeds.get(document.feedURL).push(output);
      } else documents.push(output);
    }
    pages.push({ filename, html, clean, file });
  }
  for (const parts of feeds.values()) {
    // A public root is required: pagination cannot bypass a noindex/missing root.
    const root = parts.find((part) => part.url === part.feedURL);
    if (!root) continue;
    const entries = parts.flatMap((part) => part.entries);
    if (new Set(entries.map((entry) => entry.id)).size !== entries.length)
      throw new Error('Duplicate public Fragment export ID');
    entries.sort(
      (a, b) =>
        Date.parse(b.published) - Date.parse(a.published) ||
        (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
    );
    const { title, description, url, language, author } = root;
    documents.push({
      ...root,
      entries,
      htmlFiles: parts.map((part) => part.htmlFile),
      markdown: documentMarkdown(
        { title, description, url, language, author },
        entries.map((entry) => entry.markdown).join('\n\n')
      ),
    });
  }
  documents.sort((a, b) => (a.url < b.url ? -1 : a.url > b.url ? 1 : 0));
  const groups = new Map();
  for (const document of documents) {
    if (!groups.has(document.language)) groups.set(document.language, []);
    groups.get(document.language).push(document);
  }
  const siteTitle = line(title || siteURL.hostname);
  const intro = `# ${siteTitle}\n\n${description ? `> ${line(description)}\n\n` : ''}`;
  const outputs = new Map();
  const globalSupplement = siteSupplement(aiReadableContent, {}, publicURL(''));
  let rootIndex = `${intro}Canonical website: ${publicURL('')}\n\n${globalSupplement.notes}## Languages\n\n`;
  for (const [locale, posts] of [...groups].sort(([a], [b]) => a.localeCompare(b))) {
    rootIndex += `- [${label(locale)}](${publicURL(`${locale}/llms.txt`)}): ${posts.length} documents\n`;
    const supplement = siteSupplement(
      aiReadableContent,
      locales[locale]?.aiReadableContent,
      publicURL('')
    );
    let index = `${intro}Language: ${locale}\n\n${supplement.notes}`;
    for (const post of posts) {
      outputs.set(post.markdownFile, appendSupplement(post.markdown, supplement));
    }
    for (const [kind, heading] of [
      ['article', 'Articles'],
      ['fragments', 'Fragments'],
      ['about', 'About'],
    ]) {
      const section = posts.filter((post) => post.kind === kind);
      if (section.length)
        index += `## ${heading}\n\n${section.map((post) => `- [${label(post.title)}](${post.markdownURL})${post.description ? `: ${line(post.description)}` : ''}`).join('\n')}\n\n`;
    }
    index += `## Optional\n\n- [Full text](${publicURL(`${locale}/llms-full.txt`)}): All exported content in this language\n`;
    outputs.set(`${locale}/llms.txt`, index + (supplement.links ? `\n${supplement.links}` : ''));
    outputs.set(
      `${locale}/llms-full.txt`,
      `${intro}Language: ${locale}\n\n${supplement.notes}${supplement.links}${posts.map((post) => `---\n\n${post.markdown}`).join('\n')}`
    );
  }
  outputs.set(
    'llms.txt',
    groups.size
      ? rootIndex + (globalSupplement.links ? `\n${globalSupplement.links}` : '')
      : `${intro}Canonical website: ${publicURL('')}\n\n${globalSupplement.notes}No public content is currently exported.\n${globalSupplement.links ? `\n${globalSupplement.links}` : ''}`
  );
  // Refuse to overwrite user-authored files; only our prior manifest grants ownership.
  for (const relative of outputs.keys()) {
    const filename = outputPath(dir, relative);
    if (previous.includes(relative)) continue;
    try {
      await access(filename);
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    throw new Error(`Machine-readable output conflicts with an existing file: ${relative}`);
  }
  for (const [relative, text] of outputs) {
    const filename = outputPath(dir, relative);
    await mkdir(path.dirname(filename), { recursive: true });
    // Static hosts may omit charset on .txt/.md; a BOM makes UTF-8 unambiguous.
    await writeFile(filename, `\uFEFF${text}`, 'utf8');
  }
  for (const relative of previous)
    if (!outputs.has(relative)) await rm(outputPath(dir, relative), { force: true });
  const articleMap = new Map(
    documents.flatMap((document) => document.htmlFiles.map((file) => [file, document]))
  );
  for (const page of pages) {
    const article = articleMap.get(page.file);
    const links = article
      ? `<link data-anglefeint-machine="markdown" rel="alternate" type="text/markdown" href="${escapeAttribute(article.markdownURL)}"><link data-anglefeint-machine="index" rel="describedby" href="${escapeAttribute(publicURL(`${article.language}/llms.txt`))}">`
      : '';
    const html = page.clean.replace(/<\/head\s*>/i, `${links}</head>`);
    if (html !== page.html) await writeFile(page.filename, html, 'utf8');
  }
  if (manifestPath) {
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await writeFile(
      manifestPath,
      JSON.stringify({ dir: path.resolve(dir), files: [...outputs.keys()] }),
      'utf8'
    );
  }
  return {
    articles: documents.filter((document) => document.kind === 'article').length,
    fragments: documents
      .filter((document) => document.kind === 'fragments')
      .reduce((sum, document) => sum + document.entries.length, 0),
    about: documents.filter((document) => document.kind === 'about').length,
    locales: groups.size,
    files: outputs.size,
  };
}
