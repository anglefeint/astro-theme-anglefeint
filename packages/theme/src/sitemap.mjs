import sitemap from '@astrojs/sitemap';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Read the same rendered dates used by article SEO, never filesystem/build times.
export function articleLastmod(html) {
  const meta = new Map();
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const property = tag.match(/\bproperty=["']([^"']+)["']/i)?.[1];
    const content = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1];
    if (property && content !== undefined) meta.set(property, content);
  }
  if (meta.get('og:type') !== 'article') return undefined;
  const value = meta.get('article:modified_time') || meta.get('article:published_time');
  if (!value || !Number.isFinite(Date.parse(value))) return undefined;
  return new Date(value).toISOString();
}

/**
 * Keep Astro's URL discovery/filtering, enriching only rendered article entries.
 * @param {Parameters<typeof sitemap>[0]} options
 */
export default function articleSitemap(options = {}) {
  let directory;
  let config;
  const integration = sitemap({
    ...options,
    async serialize(item) {
      const pathname = decodeURIComponent(new URL(item.url).pathname);
      const base = config.base.replace(/\/$/, '');
      const relative = pathname.slice(base.length).replace(/^\/+|\/+$/g, '');
      const filename =
        config.build.format === 'file'
          ? relative
            ? `${relative}.html`
            : 'index.html'
          : path.join(relative, 'index.html');
      const target = path.resolve(directory, filename);
      if (path.relative(directory, target).startsWith('..')) return item;
      try {
        const lastmod = articleLastmod(await readFile(target, 'utf8'));
        return lastmod ? { ...item, lastmod } : item;
      } catch (error) {
        if (error.code === 'ENOENT') return item;
        throw error;
      }
    },
  });
  const configDone = integration.hooks['astro:config:done'];
  const buildDone = integration.hooks['astro:build:done'];
  integration.hooks['astro:config:done'] = async (context) => {
    config = context.config;
    await configDone(context);
  };
  integration.hooks['astro:build:done'] = async (context) => {
    directory = fileURLToPath(context.dir);
    await buildDone(context);
  };
  return integration;
}
