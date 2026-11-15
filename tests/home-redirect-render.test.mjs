import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { parse } from 'parse5';

const run = promisify(execFile);
function head(html) {
  const metas = new Map();
  const canonicals = [];
  const visit = (node) => {
    const a = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
    if (node.tagName === 'meta') {
      const key = a.property ?? a.name ?? a['http-equiv'];
      if (key !== 'og:locale:alternate') {
        assert.ok(!metas.has(key), `no duplicate ${key} metadata`);
      }
      metas.set(key, a.content);
    }
    if (node.tagName === 'link' && a.rel === 'canonical') canonicals.push(a.href);
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(parse(html));
  return { metas, canonicals };
}

test(
  'both static home redirects retain routing and share the destination home metadata',
  { timeout: 240000 },
  async () => {
    const root = await mkdtemp(path.resolve('acceptance-results/home-redirect-'));
    try {
      await cp('tests/fixtures/integration-starter-v1', root, { recursive: true });
      const configPath = path.join(root, 'astro.config.mjs');
      await writeFile(
        configPath,
        (await readFile(configPath, 'utf8')).replace(
          'defineConfig({',
          "defineConfig({ cacheDir: './.cache/astro', vite: { cacheDir: './.cache/vite' },"
        )
      );
      await symlink(
        path.resolve('node_modules'),
        path.join(root, 'node_modules'),
        process.platform === 'win32' ? 'junction' : 'dir'
      );
      await mkdir(path.join(root, 'public'), { recursive: true });
      await writeFile(
        path.join(root, 'public/share.svg'),
        '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"/>'
      );
      for (const mode of ['always', 'never']) {
        const config = {
          site: {
            title: 'Redirect fixture',
            url: 'https://redirect.example',
            ...(mode === 'never' ? { ogImage: '/share.svg' } : {}),
          },
          i18n: { defaultLocale: 'en', routing: { defaultLocalePrefix: mode } },
          theme: { socialImage: { enabled: false }, search: { enabled: false } },
        };
        await writeFile(
          path.join(root, 'src/site.config.ts'),
          `import { defineThemeConfig } from '@anglefeint/astro-theme/config';\nexport const THEME_CONFIG = defineThemeConfig(${JSON.stringify(config)});\n`
        );
        await rm(path.join(root, 'dist'), { recursive: true, force: true });
        try {
          await run(process.execPath, [path.resolve('node_modules/astro/bin/astro.mjs'), 'build'], {
            cwd: root,
            maxBuffer: 8 * 1024 * 1024,
          });
        } catch (error) {
          throw new Error(`Redirect build failed: ${error.stdout}\n${error.stderr}`, {
            cause: error,
          });
        }
        const redirectFile = mode === 'always' ? 'index.html' : 'en/index.html';
        const homeFile = mode === 'always' ? 'en/index.html' : 'index.html';
        const destination = mode === 'always' ? '/en/' : '/';
        const redirect = head(await readFile(path.join(root, 'dist', redirectFile), 'utf8'));
        const home = head(await readFile(path.join(root, 'dist', homeFile), 'utf8'));
        assert.equal(redirect.metas.get('refresh'), `0;url=${destination}`);
        assert.equal(redirect.metas.get('robots'), 'noindex, follow');
        assert.deepEqual(redirect.canonicals, [`https://redirect.example${destination}`]);
        for (const key of [
          'og:type',
          'og:url',
          'og:title',
          'og:description',
          'og:image',
          'og:image:alt',
          'og:locale',
          'twitter:card',
          'twitter:url',
          'twitter:title',
          'twitter:description',
          'twitter:image',
          'twitter:image:alt',
        ]) {
          assert.ok(redirect.metas.get(key), `${mode}: ${key} is populated`);
          assert.equal(
            redirect.metas.get(key),
            home.metas.get(key),
            `${mode}: ${key} matches home`
          );
        }
        if (mode === 'always') {
          assert.equal(redirect.metas.get('og:image:width'), '1200');
          assert.equal(redirect.metas.get('og:image:height'), '630');
        } else {
          assert.match(
            redirect.metas.get('og:image'),
            /^https:\/\/redirect\.example\/share\.svg\?v=[a-f0-9]{12}$/
          );
        }
      }
    } finally {
      assert.ok(root.startsWith(path.resolve('acceptance-results') + path.sep));
      await rm(root, { recursive: true, force: true });
    }
  }
);
