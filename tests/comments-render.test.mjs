import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parse } from 'parse5';

const run = promisify(execFile);
const locales = ['en', 'zh', 'zh-hant', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru'];
function giscus(html) {
  let attributes;
  const visit = (node) => {
    if (
      node.tagName === 'script' &&
      node.attrs?.some(
        ({ name, value }) => name === 'src' && value === 'https://giscus.app/client.js'
      )
    ) {
      assert.equal(attributes, undefined, 'one Giscus script per article');
      attributes = Object.fromEntries(node.attrs.map(({ name, value }) => [name, value]));
    }
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(parse(html));
  assert.ok(attributes, 'article emits Giscus');
  return attributes;
}

test(
  'built article HTML shares full nested slugs across nine locales and retains ordinary mappings',
  { timeout: 240000 },
  async () => {
    // Keep the fixture on the package drive: Astro injected routes use native paths on Windows.
    const root = await mkdtemp(path.resolve('.comments-fixture-'));
    try {
      await cp('tests/fixtures/integration-starter-v1', root, { recursive: true });
      await symlink(
        path.resolve('node_modules'),
        path.join(root, 'node_modules'),
        process.platform === 'win32' ? 'junction' : 'dir'
      );
      for (const locale of locales) {
        for (const slug of ['guides/setup', 'other/setup']) {
          const file = path.join(root, 'src/content/blog', locale, `${slug}.md`);
          await mkdir(path.dirname(file), { recursive: true });
          await writeFile(
            file,
            `---\ntitle: Test article\ndescription: Comments fixture\npubDate: 2026-01-01\n---\nArticle body.\n`
          );
        }
      }
      for (const mode of [
        {
          shareAcrossLocales: true,
          mapping: 'specific',
          term: '',
          number: '',
          strict: '1',
          lang: '',
        },
        {},
        { mapping: 'specific', term: 'custom discussion', strict: '1', lang: 'ja' },
        { mapping: 'number', number: '42' },
      ]) {
        const comments = {
          enabled: true,
          repo: 'fixture/comments',
          repoId: 'fixture',
          category: 'General',
          categoryId: 'fixture',
          ...mode,
        };
        await writeFile(
          path.join(root, 'src/site.config.ts'),
          `import { defineThemeConfig } from '@anglefeint/astro-theme/config';\nexport const THEME_CONFIG = defineThemeConfig(${JSON.stringify({ theme: { comments, socialImage: { enabled: false }, search: { enabled: false } } })});`
        );
        try {
          await run(process.execPath, [path.resolve('node_modules/astro/bin/astro.mjs'), 'build'], {
            cwd: root,
            maxBuffer: 8 * 1024 * 1024,
          });
        } catch (error) {
          throw new Error(`Comments fixture build failed: ${error.stdout}\n${error.stderr}`, {
            cause: error,
          });
        }
        for (const locale of locales) {
          for (const slug of ['guides/setup', 'other/setup']) {
            const attrs = giscus(
              await readFile(path.join(root, 'dist', locale, 'blog', slug, 'index.html'), 'utf8')
            );
            assert.equal(attrs['data-mapping'], mode.mapping ?? 'pathname');
            assert.equal(
              attrs['data-term'],
              mode.shareAcrossLocales ? slug : mode.term || undefined
            );
            assert.equal(attrs['data-number'], mode.number || undefined);
            assert.equal(attrs['data-strict'], mode.strict ?? '0');
            assert.equal(
              attrs['data-lang'],
              mode.lang === ''
                ? ({ zh: 'zh-CN', 'zh-hant': 'zh-TW', 'pt-br': 'pt' }[locale] ?? locale)
                : (mode.lang ?? 'en')
            );
          }
        }
      }
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }
);
