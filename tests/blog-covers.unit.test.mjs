import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  rm,
  stat,
  symlink,
  readdir,
  realpath,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { URL, pathToFileURL } from 'node:url';
import { EventEmitter } from 'node:events';
import { setTimeout } from 'node:timers';
import sharp from 'sharp';
import { prepareCovers, coverData, coverFiles } from '../packages/theme/src/covers/prepare.mjs';
import blogCovers from '../packages/theme/src/covers/integration.mjs';
import { blogCover } from '../packages/theme/src/utils/blog-cover.ts';
import { starterCoverFiles } from '../scripts/starter-manifest.mjs';

async function fixture(t, width = 1000) {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'anglefeint-covers-')));
  t.after(() => rm(root, { recursive: true, force: true }));
  const originals = path.join(root, 'src/assets/blog/covers/originals');
  const articles = path.join(root, 'src/content/blog/en');
  await mkdir(originals, { recursive: true });
  await mkdir(articles, { recursive: true });
  const original = path.join(originals, 'city.png');
  await sharp({ create: { width, height: 500, channels: 3, background: '#2b637a' } })
    .png()
    .toFile(original);
  await writeFile(
    path.join(articles, 'first.md'),
    "---\ntitle: First\ndescription: Cover\npubDate: 2026-11-13\nheroImage: '../../../assets/blog/covers/originals/city.png'\n---\nBody\n"
  );
  return { root, original, manifest: path.join(root, 'src/assets/blog/covers/manifest.json') };
}

test('persistent variants reuse bytes/mtime without Astro cache; only missing or corrupt variants regenerate', async (t) => {
  const f = await fixture(t);
  const source = await readFile(f.original);
  const first = await prepareCovers(f);
  assert.equal(first.encoded, 5);
  const files = coverFiles(first);
  assert.deepEqual(
    files.map((file) => file.width),
    [400, 640, 800, 960, 1000]
  );
  const sample = path.join(first.generated, files[0].file);
  const before = await stat(sample),
    manifestBefore = await readFile(f.manifest);
  const second = await prepareCovers(f);
  assert.equal(second.encoded, 0);
  assert.equal(second.reused, 5);
  assert.equal((await stat(sample)).mtimeMs, before.mtimeMs);
  assert.deepEqual(await readFile(f.manifest), manifestBefore);
  await prepareCovers({ ...f, check: true });
  await writeFile(sample, 'modified');
  await assert.rejects(prepareCovers({ ...f, check: true }), /prepare-covers locally/);
  assert.equal(await readFile(sample, 'utf8'), 'modified', 'check must not repair files');
  assert.equal((await prepareCovers(f)).encoded, 1);
  await rm(sample);
  await assert.rejects(prepareCovers({ ...f, check: true }), /Missing, stale or modified/);
  assert.equal((await prepareCovers(f)).encoded, 1);
  assert.deepEqual(await readFile(f.original), source);
});

test('source/recipe changes invalidate derivatives even at the same path; hashes change URLs', async (t) => {
  const f = await fixture(t);
  const first = await prepareCovers(f);
  await sharp({ create: { width: 1000, height: 500, channels: 3, background: '#ff257b' } })
    .png()
    .toFile(f.original);
  await assert.rejects(prepareCovers({ ...f, check: true }), /stale/);
  const second = await prepareCovers(f);
  assert.equal(second.encoded, 5);
  assert.notEqual(coverFiles(first)[0].file, coverFiles(second)[0].file);
  const bad = JSON.parse(await readFile(f.manifest, 'utf8'));
  bad.recipeHash = 'old-profile';
  await writeFile(f.manifest, JSON.stringify(bad));
  await assert.rejects(prepareCovers({ ...f, check: true }), /stale/);
  assert.equal((await prepareCovers(f)).encoded, 5);
});

test('small images never upscale; duplicate basenames and Unicode paths do not collide', async (t) => {
  const f = await fixture(t, 220);
  const other = path.join(f.root, 'src/assets/blog/covers/originals/其他');
  await mkdir(other);
  await writeFile(path.join(other, 'city.png'), await readFile(f.original));
  const result = await prepareCovers(f);
  const records = Object.values(result.manifest.sources);
  assert.equal(records.length, 2);
  assert.deepEqual(
    records.map((item) => item.variants[0].width),
    [220, 220]
  );
  assert.notEqual(records[0].variants[0].file, records[1].variants[0].file);
  assert.equal(
    coverFiles(result).length,
    1,
    'Unused pool images are saved locally but not deployed'
  );
  const data = coverData(result, '/notes/');
  const image = blogCover(data, path.join(f.root, 'src/content/blog/en/first.md'), {
    src: 'fallback',
    width: 220,
    height: 500,
  });
  assert.match(image.src, /^\/notes\/_blog-covers\//);
  assert.ok(image.srcset.endsWith('220w'));
});

test('SVG and animated assets stay original; EXIF orientation is applied to raster derivatives', async (t) => {
  const f = await fixture(t);
  const dir = path.dirname(f.original);
  await writeFile(
    path.join(dir, 'animated.gif'),
    await readFile(
      new URL('../packages/theme/src/assets/theme/avatars/matrix-typist.gif', import.meta.url)
    )
  );
  await writeFile(
    path.join(dir, 'vector.svg'),
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="200"><rect width="100" height="200" fill="red"/></svg>'
  );
  await sharp({ create: { width: 500, height: 800, channels: 3, background: 'red' } })
    .jpeg()
    .withMetadata({ orientation: 6 })
    .toFile(path.join(dir, 'rotated.jpg'));
  const result = await prepareCovers(f);
  const vector = Object.entries(result.manifest.sources).find(([key]) =>
    key.endsWith('vector.svg')
  )[1];
  assert.equal(vector.passthrough, true);
  assert.equal(vector.variants.length, 0);
  const animated = Object.entries(result.manifest.sources).find(([key]) =>
    key.endsWith('animated.gif')
  )[1];
  assert.equal(animated.passthrough, true);
  assert.equal(animated.variants.length, 0);
  const rotated = Object.entries(result.manifest.sources).find(([key]) =>
    key.endsWith('rotated.jpg')
  )[1];
  assert.equal(rotated.width, 800);
  assert.equal(rotated.height, 500);
  const metadata = await sharp(
    await readFile(path.join(result.generated, rotated.variants[0].file))
  ).metadata();
  assert.equal(metadata.width, 400);
  assert.equal(metadata.height, 250);
});

test('normal build prepares missing derivatives, reuses valid assets and copies exact bytes', async (t) => {
  const f = await fixture(t);
  const integration = blogCovers();
  const config = {
    root: pathToFileURL(f.root + '/'),
    srcDir: pathToFileURL(path.join(f.root, 'src') + '/'),
    base: '/notes/',
  };
  const setup = { config, command: 'build', updateConfig() {}, logger: { info() {} } };
  await integration.hooks['astro:config:setup'](setup);
  const prepared = await prepareCovers({ ...f, check: true });
  const sample = path.join(prepared.generated, coverFiles(prepared)[0].file);
  const before = (await stat(sample)).mtimeMs;
  await integration.hooks['astro:config:setup'](setup);
  assert.equal((await stat(sample)).mtimeMs, before, 'valid build assets are not re-encoded');
  const output = path.join(f.root, 'dist');
  await mkdir(output);
  await integration.hooks['astro:build:done']({ dir: pathToFileURL(output + '/') });
  for (const item of coverFiles(prepared))
    assert.deepEqual(
      await readFile(path.join(output, '_blog-covers', item.file)),
      await readFile(path.join(prepared.generated, item.file))
    );
  await writeFile(path.join(output, '_blog-covers', coverFiles(prepared)[0].file), 'user content');
  await assert.rejects(
    integration.hooks['astro:build:done']({ dir: pathToFileURL(output + '/') }),
    /Refusing to overwrite/
  );
});

test('build repairs corrupt and stale derivatives; sync validates without writing', async (t) => {
  const f = await fixture(t);
  const config = {
    root: pathToFileURL(f.root + '/'),
    srcDir: pathToFileURL(path.join(f.root, 'src') + '/'),
    base: '/',
  };
  const setup = (command) => ({ config, command, updateConfig() {}, logger: { info() {} } });
  await assert.rejects(blogCovers().hooks['astro:config:setup'](setup('sync')), /Missing, stale/);
  await assert.rejects(readFile(f.manifest), { code: 'ENOENT' });
  const build = () => blogCovers().hooks['astro:config:setup'](setup('build'));
  await build();
  const original = await readFile(f.original);
  let prepared = await prepareCovers({ ...f, check: true });
  const sample = path.join(prepared.generated, coverFiles(prepared)[0].file);
  await writeFile(sample, 'corrupt');
  await assert.rejects(blogCovers().hooks['astro:config:setup'](setup('sync')), /modified/);
  assert.equal(await readFile(sample, 'utf8'), 'corrupt');
  await build();
  await prepareCovers({ ...f, check: true });
  assert.deepEqual(await readFile(f.original), original);
  const oldUrl = coverFiles(prepared)[0].file;
  await sharp({ create: { width: 700, height: 300, channels: 3, background: '#ff257b' } })
    .png()
    .toFile(f.original);
  await build();
  prepared = await prepareCovers({ ...f, check: true });
  assert.notEqual(coverFiles(prepared)[0].file, oldUrl);
  const manifest = JSON.parse(await readFile(f.manifest, 'utf8'));
  manifest.recipeHash = 'old-profile';
  await writeFile(f.manifest, JSON.stringify(manifest));
  await build();
  await prepareCovers({ ...f, check: true });
  await rm(f.original);
  await assert.rejects(
    build(),
    /ENOENT/,
    'normal build must not conceal a missing source with old derivatives'
  );
  await writeFile(f.original, 'invalid image data');
  await assert.rejects(build(), /unsupported image format/i);
  await writeFile(f.original, original);
  await writeFile(f.manifest, '{');
  await assert.rejects(build(), /Invalid manifest/);
  assert.equal(await readFile(f.manifest, 'utf8'), '{', 'invalid manifests are not overwritten');
});

test('development watches originals, refreshes the virtual manifest and disposes its listener', async (t) => {
  const f = await fixture(t);
  const integration = blogCovers();
  let plugin;
  await integration.hooks['astro:config:setup']({
    config: {
      root: pathToFileURL(f.root + '/'),
      srcDir: pathToFileURL(path.join(f.root, 'src') + '/'),
      base: '/',
    },
    command: 'dev',
    updateConfig: (config) => {
      plugin = config.vite.plugins[0];
    },
    logger: { info() {} },
  });
  const watcher = Object.assign(new EventEmitter(), { add() {} }),
    httpServer = new EventEmitter();
  let reload;
  const reloaded = new Promise((resolve) => {
    reload = resolve;
  });
  const server = {
    watcher,
    httpServer,
    middlewares: { use() {} },
    moduleGraph: { getModuleById: () => ({}), invalidateModule() {} },
    ws: { send: reload },
  };
  integration.hooks['astro:server:setup']({
    server,
    logger: {
      error: (message) => {
        throw new Error(message);
      },
    },
  });
  t.after(() => httpServer.emit('close'));
  const before = plugin.load('\0virtual:anglefeint-blog-covers');
  await sharp({ create: { width: 1000, height: 500, channels: 3, background: 'blue' } })
    .png()
    .toFile(f.original);
  watcher.emit('all', 'change', f.original);
  await Promise.race([
    reloaded,
    new Promise((_, reject) => {
      const timer = setTimeout(() => reject(new Error('watch timeout')), 3000);
      timer.unref();
    }),
  ]);
  assert.notEqual(plugin.load('\0virtual:anglefeint-blog-covers'), before);
  httpServer.emit('close');
  assert.equal(watcher.listenerCount('all'), 0);
});

test('sources/output junctions cannot escape the project and starter staging only includes owned paths', async (t) => {
  const f = await fixture(t);
  const external = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-cover-external-'));
  t.after(() => rm(external, { recursive: true, force: true }));
  const generated = path.join(f.root, 'src/assets/blog/covers/generated');
  await symlink(external, generated, 'junction');
  await assert.rejects(prepareCovers(f), /escapes the project/);
  assert.deepEqual(await readdir(external), []);
  await rm(generated);
  const result = await prepareCovers(f);
  const staged = starterCoverFiles(result.manifest);
  assert.equal(staged.length, 6);
  assert.ok(staged.every((file) => file.startsWith('src/assets/blog/covers/')));
  const bad = JSON.parse(JSON.stringify(result.manifest));
  Object.values(bad.sources)[0].variants[0].file = '../../user.txt';
  assert.throws(() => starterCoverFiles(bad), /Unsafe/);
});
