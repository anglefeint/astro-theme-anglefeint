import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import {
  loadProjectLocales,
  loadProjectModule,
} from '../packages/theme/src/scaffold/project-config.mjs';
import { inspectProject } from '../scripts/doctor.mjs';

test('real config merge and adapters retain locale, comments and metadata semantics', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-config-'));
  try {
    await mkdir(path.join(root, 'src'));
    for (const file of [
      'site.config.ts',
      'site.config.defaults.ts',
      'site.config.runtime.ts',
      'site.config.schema.ts',
    ]) {
      await cp(path.resolve('src', file), path.join(root, 'src', file));
    }
    await cp(path.resolve('src/config'), path.join(root, 'src/config'), { recursive: true });
    await cp(path.resolve('src/i18n'), path.join(root, 'src/i18n'), { recursive: true });
    await symlink(
      path.resolve('node_modules'),
      path.join(root, 'node_modules'),
      process.platform === 'win32' ? 'junction' : 'dir'
    );
    assert.deepEqual((await loadProjectLocales(root)).sort(), ['en', 'es', 'ja', 'ko', 'zh']);
    const entry = path.join(root, 'src/site.config.ts');
    const set = (value) =>
      writeFile(
        entry,
        `import { defineThemeConfig } from './site.config.defaults.ts';
export { normalizeI18nConfig } from './site.config.runtime.ts';
export { DEFAULT_ABOUT_CONFIG } from './site.config.defaults.ts';
export const THEME_CONFIG = defineThemeConfig(${JSON.stringify(value)});`
      );
    for (const [value, expected] of [
      [{}, true],
      [{ theme: { toc: { enabled: false } } }, false],
    ]) {
      await set(value);
      assert.equal(
        (await loadProjectModule(path.join(root, 'src/config/theme.ts'))).THEME.TOC.ENABLED,
        expected
      );
    }
    await set({ i18n: { defaultLocale: 'fr', locales: { en: { meta: { enabled: false } } } } });
    assert.deepEqual((await loadProjectLocales(root)).sort(), ['es', 'fr', 'ja', 'ko', 'zh']);
    for (const comments of [
      { enabled: true, mapping: 'specific', term: '' },
      { enabled: true, mapping: 'number', number: '0' },
      { enabled: true, mapping: 'number', number: '1.2' },
    ]) {
      await set({ theme: { comments } });
      await assert.rejects(loadProjectModule(path.join(root, 'src/config/theme.ts')), /requires/);
    }
    await set({ theme: { comments: { enabled: false, mapping: 'specific', term: '' } } });
    assert.equal(
      (await loadProjectModule(path.join(root, 'src/config/theme.ts'))).THEME.COMMENTS.ENABLED,
      false
    );
    await set({ theme: { comments: { enabled: true, mapping: 'number', number: '42' } } });
    assert.equal(
      (await loadProjectModule(path.join(root, 'src/config/theme.ts'))).THEME.COMMENTS.NUMBER,
      '42'
    );

    await writeFile(
      path.join(root, 'src/languages.ts'),
      'export const locales = { fr: { meta: { enabled: true } } };'
    );
    await writeFile(
      entry,
      "import { locales } from './languages.ts'; export const THEME_CONFIG = { i18n: { defaultLocale: 'fr', locales } };"
    );
    assert.deepEqual(await loadProjectLocales(root), ['fr']);
    await writeFile(
      entry,
      "export const THEME_CONFIG = { i18n: { locales: { '../outside': { meta: {} } } } };"
    );
    await assert.rejects(loadProjectLocales(root), /Invalid locale/);
    await writeFile(entry, 'invalid TypeScript {');
    await assert.rejects(loadProjectLocales(root), /Cannot load locales/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('doctor reports known migration patterns without rewriting user files', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-doctor-'));
  try {
    const files = {
      'package.json': JSON.stringify({ scripts: { 'new-post': 'node ./scripts/new-post.mjs' } }),
      'astro.config.mjs': "const filter = (path) => { return path !== '/en/' && path !== '/en'; };",
      'src/pages/index.astro':
        'const locale = DEFAULT_LOCALE;\n<HomePage locale={locale} latestPosts={latestPosts} />',
      'src/content/blog/en/custom.md': 'User content must survive.',
    };
    for (const [file, content] of Object.entries(files)) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), content);
    }
    assert.equal((await inspectProject(root)).length, 3);
    for (const [file, content] of Object.entries(files)) {
      assert.equal(await readFile(path.join(root, file), 'utf8'), content);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
