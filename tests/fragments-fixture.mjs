import { cp, mkdir, mkdtemp, symlink, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
export const fragmentLocales = ['en', 'zh', 'zh-hant', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru'];
export async function fragmentFixture() {
  const root = await mkdtemp(path.resolve('.fragments-fixture-'));
  await cp('tests/fixtures/integration-starter-v1', root, { recursive: true });
  // Each build owns its Astro/Vite caches even though node_modules is shared.
  const astroConfig = path.join(root, 'astro.config.mjs');
  await writeFile(
    astroConfig,
    (await readFile(astroConfig, 'utf8')).replace(
      'defineConfig({',
      "defineConfig({ cacheDir: './.cache/astro', vite: { cacheDir: './.cache/vite' },"
    )
  );
  await symlink(
    path.resolve('node_modules'),
    path.join(root, 'node_modules'),
    process.platform === 'win32' ? 'junction' : 'dir'
  );
  for (const locale of fragmentLocales) {
    for (const [id, date] of [
      ['first', '2026-11-10'],
      ['second', '2026-11-11'],
      ['third', '2026-11-12'],
    ]) {
      const file = path.join(root, 'src/content/fragments', locale, `${id}.md`);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(
        file,
        `---\nid: ${id}\npubDate: ${date}T10:00:00Z\n---\n\n${locale} ${id} **body**.\n\n$E = mc^2$\n`
      );
    }
  }
  async function build({ enabled = true, comments = true, extra = {} } = {}) {
    const config = {
      theme: {
        fragments: { enabled, pageSize: 2, comments: { enabled: comments } },
        search: { enabled: false },
        socialImage: { enabled: false },
        // Article mappings and UI language deliberately differ; fragment comments ignore them.
        comments: {
          enabled: false,
          repo: 'fixture/comments',
          repoId: 'fixture-id',
          category: 'General',
          categoryId: 'fixture-category',
          mapping: 'number',
          number: '42',
          lang: 'ja',
        },
        ...extra,
      },
    };
    await writeFile(
      path.join(root, 'src/site.config.ts'),
      `import { defineThemeConfig } from '@anglefeint/astro-theme/config';\nexport const THEME_CONFIG = defineThemeConfig(${JSON.stringify(config)});`
    );
    await rm(path.join(root, 'dist'), { force: true, recursive: true });
    try {
      await run(process.execPath, [path.resolve('node_modules/astro/bin/astro.mjs'), 'build'], {
        cwd: root,
        maxBuffer: 8 * 1024 * 1024,
      });
    } catch (error) {
      throw new Error(`${error.stdout}\n${error.stderr}`, { cause: error });
    }
  }
  return {
    root,
    build,
    read: (file) => readFile(path.join(root, 'dist', file), 'utf8'),
    close: () => rm(root, { recursive: true, force: true }),
  };
}
