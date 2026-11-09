import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import anglefeint, {
  writeTerminalHeaders,
  STANDARD_ROUTES,
  assertNoReservedRoutes,
} from '../packages/theme/src/integration.mjs';
import { upgradeProject } from '../packages/theme/src/scaffold/upgrade.mjs';
import { loadProjectModule } from '../packages/theme/src/scaffold/project-config.mjs';
import { virtualPathUrls } from '../packages/theme/src/scaffold/virtual-paths.mjs';

const { defineThemeConfig } = await loadProjectModule(
  path.resolve('packages/theme/src/project/defaults.ts')
);
const metadata = {
  name: '@anglefeint/astro-theme',
  version: '0.29.0',
  anglefeint: { projectSchema: 1 },
  engines: { node: '>=22.12' },
  peerDependencies: { astro: '^7.3.5' },
};

test('virtual path checking distinguishes inert script/text from actual and encoded links', () => {
  const terminal = {
    cwd: '/root/bash/scripts',
    entries: [{ path: '/root/bash/scripts/about.md' }],
  };
  const inert = `<script type="application/json">{"example":"<a href='/root/bash/scripts/about.md'>text</a>"}</script><p>/root/bash/scripts/about.md</p><a href="/en/about/">About</a>`;
  assert.deepEqual(virtualPathUrls(inert, terminal), []);
  assert.deepEqual(
    virtualPathUrls(inert + '<a href="/%72oot/bash/scripts/about.md">bad</a>', terminal),
    ['/%72oot/bash/scripts/about.md']
  );
  assert.deepEqual(virtualPathUrls('<a href="/en/">Home</a>', { cwd: '/' }), []);
});
async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'anglefeint-upgrader-'));
  const files = {
    'package.json': JSON.stringify({
      anglefeint: { projectSchema: 1 },
      dependencies: { '@anglefeint/astro-theme': '0.27.0' },
      scripts: { doctor: 'astro-theme doctor' },
    }),
    'package-lock.json': '{"old":"lock"}',
    'astro.config.mjs': "import anglefeint from '@anglefeint/astro-theme/integration';",
    'node_modules/astro/package.json': '{"version":"7.4.5"}',
    'node_modules/@anglefeint/astro-theme/package.json': '{"version":"0.27.0"}',
    'src/site.config.ts': '// My settings and playlist: do not overwrite\n',
    'src/content/blog/en/personal.md': 'My article',
    'public/music/my-song.mp3': 'audio bytes',
    'src/assets/photo.png': 'picture bytes',
    'public/_headers': '/custom\n  X-Custom: retained\n',
    'src/pages/projects.astro': '<h1>My custom page</h1>',
  };
  for (const [name, value] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true });
    await writeFile(path.join(root, name), value);
  }
  return { root, files };
}

test('integration registers the existing standard routes and rejects copied route collisions', async () => {
  const { root } = await fixture();
  try {
    const config = {
      root: pathToFileURL(root + path.sep),
      srcDir: pathToFileURL(path.join(root, 'src') + path.sep),
    };
    const injected = [];
    const integration = anglefeint(defineThemeConfig({}))[0];
    await integration.hooks['astro:config:setup']({
      config,
      injectRoute: (route) => injected.push(route),
      updateConfig() {},
    });
    assert.deepEqual(
      injected.map((route) => route.pattern),
      STANDARD_ROUTES.map(([pattern]) => pattern)
    );
    for (const route of injected) assert((await readFile(route.entrypoint)).length);
    await writeFile(path.join(root, 'src/pages/index.astro'), '<p>custom home</p>');
    await assert.rejects(
      integration.hooks['astro:config:setup']({ config, injectRoute() {}, updateConfig() {} }),
      /Reserved standard route/
    );
    assert.equal(
      await readFile(path.join(root, 'src/pages/index.astro'), 'utf8'),
      '<p>custom home</p>'
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('build-time terminal headers preserve custom rules and remain idempotent', async () => {
  const { root } = await fixture();
  try {
    const dir = path.join(root, 'public');
    const original = await readFile(path.join(dir, '_headers'), 'utf8');
    await writeTerminalHeaders(dir);
    const first = await readFile(path.join(dir, '_headers'), 'utf8');
    assert(first.startsWith(original.trimEnd()));
    assert.match(first, /\/:locale\/terminal\/\*\n {2}X-Robots-Tag: noindex/);
    await writeTerminalHeaders(dir);
    assert.equal(await readFile(path.join(dir, '_headers'), 'utf8'), first);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reserved routes also reject concrete locales, Markdown, index aliases and renamed parameters without overwriting them', async () => {
  const { root } = await fixture();
  const srcDir = pathToFileURL(path.join(root, 'src') + path.sep);
  try {
    await assertNoReservedRoutes(srcDir); // The user's projects page is allowed.
    for (const relative of [
      'index.md',
      'en/decoder/index.mdx',
      '[language]/about.md',
      'en/blog/custom.astro',
      'en/terminal/private.json.ts',
      'robots.txt.js',
    ]) {
      const file = path.join(root, 'src/pages', relative);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, 'User-owned content');
      await assert.rejects(
        assertNoReservedRoutes(srcDir, ['en']),
        /Reserved standard route exists/
      );
      assert.equal(await readFile(file, 'utf8'), 'User-owned content');
      await rm(file);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('upgrader skips intermediate versions, preserves user files and runs doctor', async () => {
  const { root, files } = await fixture();
  const calls = [];
  try {
    const run = async (args) => {
      calls.push(args);
      if (args[0] === 'view') return JSON.stringify(metadata);
      if (args[0] === 'install') {
        const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
        pkg.dependencies['@anglefeint/astro-theme'] = metadata.version;
        await writeFile(path.join(root, 'package.json'), JSON.stringify(pkg));
      }
      return '';
    };
    const result = await upgradeProject({ root, run, log() {} });
    assert.equal(result.version, '0.29.0');
    assert.deepEqual(calls.at(-1), ['run', 'doctor']);
    assert(calls.some((args) => args[1] === '@anglefeint/astro-theme@0.29.0'));
    for (const [name, value] of Object.entries(files)) {
      if (name === 'package.json') continue;
      assert.equal(await readFile(path.join(root, name), 'utf8'), value, name);
    }
    assert.equal(
      await readFile(path.join(result.backup, 'package.json'), 'utf8'),
      files['package.json']
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('failed doctor restores dependency files and reinstalls previous dependencies', async () => {
  const { root, files } = await fixture();
  const calls = [];
  try {
    await assert.rejects(
      upgradeProject({
        root,
        log() {},
        run: async (args) => {
          calls.push(args);
          if (args[0] === 'view') return JSON.stringify(metadata);
          if (args[0] === 'install')
            await writeFile(path.join(root, 'package-lock.json'), 'new lock');
          if (args[0] === 'run') throw new Error('build failure');
          return '';
        },
      }),
      /previous dependencies restored[\s\S]*Do not deploy dist/
    );
    assert.deepEqual(calls.at(-1), ['ci', '--ignore-scripts']);
    for (const [name, value] of Object.entries(files))
      assert.equal(await readFile(path.join(root, name), 'utf8'), value, name);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('dry run is read-only and unsupported target/schema/host requirements stop before writes', async () => {
  const { root, files } = await fixture();
  try {
    const run = async () => JSON.stringify(metadata);
    await upgradeProject({ root, check: true, run, log() {} });
    await assert.rejects(readdir(path.join(root, '.anglefeint')), { code: 'ENOENT' });
    for (const targetMetadata of [
      { ...metadata, anglefeint: { projectSchema: 2 } },
      { ...metadata, peerDependencies: { astro: '^99.0.0' } },
      { ...metadata, engines: { node: '>=99' } },
      { ...metadata, version: '0.26.0' },
    ])
      await assert.rejects(
        upgradeProject({ root, run: async () => JSON.stringify(targetMetadata), log() {} })
      );
    await assert.rejects(upgradeProject({ root, target: 'latest && echo bad', run }));
    await writeFile(path.join(root, 'pnpm-lock.yaml'), 'owned');
    await assert.rejects(upgradeProject({ root, run }), /npm projects only/);
    await rm(path.join(root, 'pnpm-lock.yaml'));
    await rm(path.join(root, 'package-lock.json'));
    await assert.rejects(upgradeProject({ root, run }), /package-lock.json is required/);
    await writeFile(path.join(root, 'package-lock.json'), files['package-lock.json']);
    await writeFile(path.join(root, 'package.json'), '{"dependencies":{}}');
    await assert.rejects(upgradeProject({ root, run }), /fresh starter/);
    assert.equal(
      await readFile(path.join(root, 'src/site.config.ts'), 'utf8'),
      files['src/site.config.ts']
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
