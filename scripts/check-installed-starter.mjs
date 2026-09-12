import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { buildStarterPackage } from './starter-package.mjs';
import { STARTER_MANAGED_FILES, STARTER_OBSOLETE_FILES } from './starter-manifest.mjs';
import { inspectProject } from './doctor.mjs';
import { checkReadmeLinks } from './check-readme-links.mjs';

const exec = promisify(execFile);
const root = process.cwd();
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run via npm run check:installed.');
const temp = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-installed-'));
assert.equal(path.dirname(temp), os.tmpdir());
assert.ok(path.basename(temp).startsWith('anglefeint-installed-'));
const project = path.join(temp, 'user project');
const run = (cmd, args, cwd = project) =>
  exec(cmd, args, {
    cwd,
    maxBuffer: 30 * 1024 * 1024,
    env: { ...process.env, ANGLEFEINT_LOCALES: '', NODE_PATH: '', NODE_OPTIONS: '' },
  });
const npm = (args, cwd = project) => run(process.execPath, [npmCli, ...args], cwd);
const read = (file) => readFile(path.join(project, file), 'utf8');
const config = (overrides) => `import { defineThemeConfig } from './site.config.defaults.ts';
export { normalizeI18nConfig } from './site.config.runtime.ts';
export { DEFAULT_ABOUT_CONFIG } from './site.config.defaults.ts';
export const THEME_CONFIG = defineThemeConfig(${JSON.stringify(overrides)});`;
const setConfig = (overrides) =>
  writeFile(path.join(project, 'src/site.config.ts'), config(overrides));

try {
  await mkdir(project);
  const archive = path.join(temp, 'starter.tar');
  await run('git', ['archive', '--format=tar', `--output=${archive}`, 'starter'], root);
  await run('tar', ['-xf', archive, '-C', project]);
  const oldConfig = await read('src/site.config.ts');
  console.log(`Baseline starter migration diagnostics: ${(await inspectProject(project)).length}`);
  assert.equal(await read('src/site.config.ts'), oldConfig, 'doctor must not modify configuration');

  for (const file of STARTER_MANAGED_FILES) {
    await mkdir(path.dirname(path.join(project, file)), { recursive: true });
    await cp(path.join(root, file), path.join(project, file));
  }
  for (const file of STARTER_OBSOLETE_FILES) await rm(path.join(project, file), { force: true });
  await checkReadmeLinks(
    project,
    STARTER_MANAGED_FILES.filter((name) => /^README.*\.md$/.test(name))
  );
  const source = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  const packed = JSON.parse(
    (
      await npm(
        ['pack', '--workspace', '@anglefeint/astro-theme', '--json', '--pack-destination', temp],
        root
      )
    ).stdout
  );
  const tarball = path.join(temp, packed[0].filename);
  const pkg = buildStarterPackage(
    source,
    JSON.parse(await read('package.json')),
    `file:${tarball.replaceAll('\\', '/')}`
  );
  await writeFile(path.join(project, 'package.json'), JSON.stringify(pkg, null, 2));
  await rm(path.join(project, 'package-lock.json'), { force: true });
  console.log('Installing packed theme into an independent starter (no workspace links)...');
  await npm(['install', '--ignore-scripts', '--no-audit', '--no-fund', '--prefer-offline']);
  assert.equal(
    (await lstat(path.join(project, 'node_modules/@anglefeint/astro-theme'))).isSymbolicLink(),
    false
  );
  assert.deepEqual(await inspectProject(project), []);
  await npm(['run', 'new-post', '--', '--help']);
  await npm(['run', 'new-page', '--', '--help']);
  await npm(['run', 'new-post', '--', 'installed-default']);
  for (const locale of ['en', 'es', 'ja', 'ko', 'zh']) {
    assert.match(await read(`src/content/blog/${locale}/installed-default.md`), /pubDate:/);
  }
  const before = await read('src/content/blog/en/installed-default.md');
  await npm(['run', 'new-post', '--', 'installed-default']);
  assert.equal(await read('src/content/blog/en/installed-default.md'), before);
  await npm(['run', 'new-page', '--', 'installed-page', '--theme', 'ai']);
  const pageBefore = await read('src/pages/[lang]/installed-page.astro');
  await assert.rejects(npm(['run', 'new-page', '--', 'installed-page', '--theme', 'ai']));
  assert.equal(await read('src/pages/[lang]/installed-page.astro'), pageBefore);
  await npm(['run', 'check:no-build']);

  await setConfig({
    i18n: {
      defaultLocale: 'fr',
      locales: {
        en: { meta: { enabled: false } },
        es: { meta: { enabled: false } },
        ja: { meta: { enabled: false } },
        ko: { meta: { enabled: false } },
        zh: { meta: { enabled: false } },
        fr: { meta: { label: 'French', enabled: false } },
      },
    },
  });
  await npm(['run', 'new-post', '--', 'installed-french']);
  assert.match(await read('src/content/blog/fr/installed-french.md'), /pubDate:/);
  await assert.rejects(read('src/content/blog/en/installed-french.md'), { code: 'ENOENT' });

  await writeFile(
    path.join(project, 'src/site.config.ts'),
    'export const THEME_CONFIG = { broken syntax'
  );
  await assert.rejects(npm(['run', 'new-post', '--', 'invalid-config']), (error) => {
    assert.match(error.stderr, /Cannot load locales/);
    return true;
  });
  for (const locale of await readdir(path.join(project, 'src/content/blog'))) {
    await assert.rejects(read(`src/content/blog/${locale}/invalid-config.md`), { code: 'ENOENT' });
  }
  await npm(['run', 'new-post', '--', 'explicit-locale', '--locales', 'en,fr']);
  assert.match(await read('src/content/blog/fr/explicit-locale.md'), /pubDate:/);
  await assert.rejects(npm(['run', 'new-post', '--', 'unsafe-locale', '--locales', '../outside']));
  await writeFile(path.join(project, 'src/site.config.ts'), oldConfig);
  await npm(['run', 'new-post', '--', 'partial-translation', '--locales', 'zh']);
  await writeFile(
    path.join(project, 'src/content/blog/en/search-excluded.md'),
    '---\ntitle: Search exclusion test\ndescription: Excluded article\npubDate: 2026-01-01\nsearch: false\n---\nThis must not be indexed.\n'
  );

  if (process.argv.includes('--build')) {
    for (const locale of ['en', 'zh']) {
      for (const mode of ['always', 'never']) {
        await setConfig({
          site: { description: 'SITE_DESCRIPTION_SENTINEL' },
          i18n: {
            defaultLocale: locale,
            routing: { defaultLocalePrefix: mode },
            locales: { zh: { messages: { siteDescription: 'CUSTOM_ZH_DESCRIPTION' } } },
          },
          theme: { enableAboutPage: mode === 'always' },
        });
        console.log(`Building installed starter: default=${locale}, prefix=${mode}`);
        await rm(path.join(project, 'dist'), { recursive: true, force: true });
        await npm(['run', 'build']);
        const searchManifest = JSON.parse(await read('dist/pagefind/anglefeint.json'));
        assert.ok(searchManifest.languages.includes(locale));
        assert.match(await read('dist/pagefind/pagefind.js'), /search/);
        assert.doesNotMatch(
          await read('dist/en/blog/search-excluded/index.html'),
          /data-anglefeint-search/
        );
        const homePath = mode === 'always' ? `${locale}/index.html` : 'index.html';
        const redirectPath = mode === 'always' ? 'index.html' : `${locale}/index.html`;
        const home = await read(`dist/${homePath}`);
        const redirect = await read(`dist/${redirectPath}`);
        assert.doesNotMatch(home, /name="robots" content="noindex/);
        assert.ok(!home.includes('content="SITE_DESCRIPTION_SENTINEL"'));
        if (locale === 'zh') assert.ok(home.includes('content="CUSTOM_ZH_DESCRIPTION"'));
        assert.match(redirect, /noindex, follow/);
        assert.match(redirect, /http-equiv="refresh"/);
        const canonical = home.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
        assert.ok(canonical);
        assert.equal(new URL(canonical).pathname, mode === 'always' ? `/${locale}/` : '/');
        assert.ok(home.includes(`hreflang="x-default" href="${canonical}"`));
        assert.ok(redirect.includes(`rel="canonical" href="${canonical}"`));
        const sitemap = await read('dist/sitemap-0.xml');
        assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
        const excluded = new URL(mode === 'always' ? '/' : `/${locale}/`, canonical).href;
        assert.ok(!sitemap.includes(`<loc>${excluded}</loc>`));
        assert.match(await read(`dist/${locale}/rss.xml`), /<rss/);
        const partial = await read('dist/zh/blog/partial-translation/index.html');
        assert.match(partial, /hreflang="en" href="[^"]+\/en\/blog\/"/);
        if (mode === 'never')
          await assert.rejects(read(`dist/${locale}/about/index.html`), { code: 'ENOENT' });
      }
    }
    await setConfig({ theme: { search: { enabled: false } } });
    console.log('Building installed starter with search disabled...');
    await npm(['run', 'build']);
    await assert.rejects(read('dist/pagefind/anglefeint.json'), { code: 'ENOENT' });
    assert.doesNotMatch(await read('dist/en/blog/index.html'), /data-search-open/);
    assert.doesNotMatch(
      await read('dist/en/blog/installed-default/index.html'),
      /data-anglefeint-search/
    );
  }
  console.log('Installed starter CLI, migration, adapter and requested build checks passed.');
} catch (error) {
  console.error(error.stdout || '');
  console.error(error.stderr || '');
  throw error;
} finally {
  // Only remove the exact temporary directory created above.
  await rm(temp, { recursive: true, force: true });
}
