import mdx from '@astrojs/mdx';
import path from 'node:path';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import search from './search.mjs';
import socialImage from './social-image.mjs';
import machineReadable from './machine-readable.mjs';
import sitemap from './sitemap.mjs';
import blogCovers from './covers/integration.mjs';
import { resolveSiteUrl } from './project/site-url.mjs';
import { loadEnv } from 'vite';

const source = (relative) => fileURLToPath(new URL(relative, import.meta.url));
export const STANDARD_ROUTES = [
  ['/', 'index.astro'],
  ['/robots.txt', 'robots.txt.ts'],
  ['/[lang]/', '[lang]/index.astro'],
  ['/[lang]/about', '[lang]/about.astro'],
  ['/[lang]/decoder', '[lang]/decoder.astro'],
  ['/[lang]/blog/[...page]', '[lang]/blog/[...page].astro'],
  ['/[lang]/blog/[...slug]', '[lang]/blog/[...slug].astro'],
  ['/[lang]/tags', '[lang]/tags/index.astro'],
  ['/[lang]/tags/[tag]/[...page]', '[lang]/tags/[tag]/[...page].astro'],
  ['/[lang]/rss.xml', '[lang]/rss.xml.ts'],
  ['/[lang]/terminal/[id].json', '[lang]/terminal/[id].json.ts'],
];

export const TERMINAL_HEADER_RULE = '/:locale/terminal/*\n  X-Robots-Tag: noindex';

// Match route URLs, not just one copied .astro filename. Markdown pages, index
// aliases and concrete locale folders must receive the same preservation guard.
export async function assertNoReservedRoutes(srcDir, locales = [], routes = STANDARD_ROUTES) {
  const pages = fileURLToPath(new URL('pages/', srcDir));
  let entries;
  try {
    entries = await readdir(pages, { recursive: true, withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  const patterns = routes.map(([route]) => {
    const segments = route.split('/').filter(Boolean);
    return new RegExp(
      '^' +
        segments
          .map((segment) =>
            segment === '[lang]'
              ? '/(?:\\[[^/]+\\]' +
                locales
                  .map((locale) => '|' + locale.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                  .join('') +
                ')'
              : /^\[\.\.\..+\]$/.test(segment)
                ? '(?:/.*)?'
                : '/' +
                  segment
                    .split(/(\[[^\]]+\])/)
                    .map((part) =>
                      /^\[.+\]$/.test(part) ? '[^/]+' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                    )
                    .join('')
          )
          .join('') +
        '/?$'
    );
  });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filename = path.join(entry.parentPath, entry.name);
    const relative = path.relative(pages, filename).replaceAll('\\', '/');
    if (relative.split('/').some((segment) => /^[_.]/.test(segment))) continue;
    if (!/\.(?:astro|md|mdx|html|js|ts)$/.test(relative)) continue;
    const route =
      '/' + relative.replace(/\.(?:astro|md|mdx|html|js|ts)$/, '').replace(/(?:^|\/)index$/, '');
    if (patterns.some((pattern) => pattern.test(route)))
      throw new Error(
        `[anglefeint] Reserved standard route exists: ${filename}. Create the new starter and migrate content/configuration, or move your custom page to another URL; do not combine copied routes with injected routes.`
      );
  }
}

// Host metadata belongs to build output. Never rewrite the user's public/_headers.
export async function writeTerminalHeaders(directory) {
  const filename = path.join(directory, '_headers');
  let existing = '';
  try {
    existing = await readFile(filename, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (!existing.replaceAll('\r\n', '\n').includes(TERMINAL_HEADER_RULE)) {
    await writeFile(filename, `${existing.trimEnd()}\n\n${TERMINAL_HEADER_RULE}\n`);
  }
}

/**
 * The stable starter boundary: content/configuration stay in the project;
 * standard pages, defaults, adapters and build features ship together.
 * @param {import('./project/schema.ts').ThemeConfig} themeConfig
 * @returns {import('astro').AstroIntegration[]}
 */
export default function anglefeint(themeConfig) {
  if (!themeConfig?.site || !themeConfig?.i18n) {
    throw new Error('[anglefeint] Pass THEME_CONFIG from src/site.config.ts to anglefeint().');
  }
  const defaultLocale = themeConfig.i18n.defaultLocale;
  const prefixMode = themeConfig.i18n.routing.defaultLocalePrefix;
  const routes = themeConfig.theme.fragments?.enabled
    ? [
        ...STANDARD_ROUTES,
        ['/[lang]/fragments/[...page]', '[lang]/fragments/[...page].astro'],
        ['/[lang]/fragments/index/[revision].json', '[lang]/fragments/index/[revision].json.ts'],
      ]
    : STANDARD_ROUTES;
  let siteContext = { title: themeConfig.site.title, description: themeConfig.site.description };
  let machine;
  return [
    {
      name: 'anglefeint-project',
      hooks: {
        'astro:config:setup': async ({ config, updateConfig, injectRoute }) => {
          const configFile = fileURLToPath(new URL('site.config.ts', config.srcDir));
          const modeArg = process.argv.find((arg) => arg.startsWith('--mode='))?.slice(7);
          const modeIndex = process.argv.indexOf('--mode');
          const mode =
            modeArg ??
            (modeIndex >= 0 ? process.argv[modeIndex + 1] : undefined) ??
            (process.argv.includes('dev') ? 'development' : 'production');
          const env = loadEnv(mode, fileURLToPath(config.root), 'PUBLIC_');
          siteContext = {
            title: env.PUBLIC_SITE_TITLE ?? themeConfig.site.title,
            description: env.PUBLIC_SITE_DESCRIPTION ?? themeConfig.site.description,
          };
          // Fail clearly on the old copied skeleton; never hide custom pages.
          await assertNoReservedRoutes(
            config.srcDir,
            Object.entries(themeConfig.i18n.locales)
              .filter(([locale, value]) => locale === defaultLocale || value.meta.enabled !== false)
              .map(([locale]) => locale),
            routes
          );
          updateConfig({
            compressHTML: true,
            site: resolveSiteUrl(themeConfig.site.url, fileURLToPath(config.root)),
            vite: {
              resolve: {
                alias: {
                  '@anglefeint/user-config': configFile,
                  '@anglefeint/site-config': source('./project/config'),
                  '@anglefeint/site-i18n': source('./project/i18n'),
                  '@anglefeint/theme-default-i18n': source('./i18n/messages.ts'),
                },
              },
            },
          });
          for (const [pattern, relative] of routes) {
            injectRoute({ pattern, entrypoint: source(`./routes/${relative}`), prerender: true });
          }
        },
        'astro:config:done': ({ injectTypes }) => {
          injectTypes({
            filename: 'env.d.ts',
            content: '/// <reference types="@anglefeint/astro-theme/env" />',
          });
        },
        'astro:build:done': async ({ dir }) => writeTerminalHeaders(fileURLToPath(dir)),
      },
    },
    mdx(),
    blogCovers({ mathEnabled: themeConfig.theme.math.enabled }),
    socialImage(),
    {
      name: 'anglefeint-content-exports',
      hooks: {
        'astro:config:done': (context) => {
          machine = machineReadable({
            ...siteContext,
            aiReadableContent: themeConfig.aiReadableContent,
            locales: themeConfig.i18n.locales,
          });
          machine.hooks['astro:config:done'](context);
        },
        'astro:build:done': (context) => machine.hooks['astro:build:done'](context),
      },
    },
    search({ enabled: themeConfig.theme.search.enabled }),
    sitemap({
      filter(page) {
        const pathname = new URL(page).pathname;
        if (/\/fragments\/index\/[a-f0-9]{16}\.json$/.test(pathname)) return false;
        return prefixMode === 'always'
          ? pathname !== '/'
          : pathname !== `/${defaultLocale}/` && pathname !== `/${defaultLocale}`;
      },
    }),
  ];
}
