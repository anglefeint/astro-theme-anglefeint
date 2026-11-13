import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, realpath, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'js-yaml';
import sharp from 'sharp';
import { fragmentImageReferences, fragmentImagePath } from './fragment-sources.mjs';

export const COVER_RECIPE = Object.freeze({
  version: 1,
  widths: [400, 640, 800, 960, 1200],
  format: 'webp',
  quality: 80,
  effort: 4,
  autoOrient: true,
  crop: false,
});
export const COVER_DIRECTORY = 'assets/blog/covers';
const imagePattern = /\.(?:png|jpe?g|webp|avif|gif|svg|tiff?)$/i;
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const slash = (value) => value.replaceAll('\\', '/');
const inside = (parent, file) => {
  const rel = path.relative(parent, file);
  return Boolean(rel) && rel !== '..' && !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel);
};

async function filesIn(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const result = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await filesIn(file)));
    else if (entry.isFile()) result.push(file);
  }
  return result;
}

function frontmatter(text, file) {
  const normalized = text.replace(/^\uFEFF/, '');
  if (!/^---[ \t]*\r?\n/.test(normalized)) return {};
  const rest = normalized.slice(normalized.indexOf('\n') + 1);
  const closing = /^(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/m.exec(rest);
  if (!closing) throw new Error(`[covers] Unclosed frontmatter: ${file}`);
  return load(rest.slice(0, closing.index)) ?? {};
}

async function localSource(root, file) {
  const actual = await realpath(file);
  if (!inside(root, actual))
    throw new Error(`[covers] Source must stay inside the project: ${file}`);
  return actual;
}

export async function collectCoverSources({
  root,
  srcDir,
  publicDir = path.join(root, 'public'),
  base = '/',
  fragmentsEnabled = true,
}) {
  const requestedRoot = path.resolve(root),
    requestedSrc = path.resolve(srcDir);
  root = await realpath(requestedRoot);
  srcDir = path.resolve(root, path.relative(requestedRoot, requestedSrc));
  try {
    srcDir = await realpath(srcDir);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (!inside(root, srcDir)) throw new Error('[covers] srcDir must stay inside the project.');
  const sources = new Map(),
    posts = {},
    fragments = {};
  for (const directory of ['assets/blog/default-covers', 'assets/blog/covers/originals']) {
    for (const file of await filesIn(path.join(srcDir, directory))) {
      if (!imagePattern.test(file)) continue;
      const actual = await localSource(root, file);
      sources.set(slash(path.relative(root, actual)), actual);
    }
  }
  for (const file of await filesIn(path.join(srcDir, 'content/blog'))) {
    if (!/\.mdx?$/i.test(file)) continue;
    const hero = frontmatter(await readFile(file, 'utf8'), file).heroImage;
    if (hero === undefined) continue;
    if (typeof hero !== 'string' || !hero.trim() || /^[a-z][a-z\d+.-]*:/i.test(hero))
      throw new Error(`[covers] heroImage must reference a local file: ${file}`);
    const actual = await localSource(root, path.resolve(path.dirname(file), hero));
    if (!imagePattern.test(actual)) throw new Error(`[covers] Unsupported cover format: ${actual}`);
    const key = slash(path.relative(root, actual));
    sources.set(key, actual);
    posts[slash(path.relative(root, file))] = key;
  }
  for (const file of fragmentsEnabled
    ? await filesIn(path.join(srcDir, 'content/fragments'))
    : []) {
    if (!/\.md$/i.test(file)) continue;
    const images = {};
    for (const src of fragmentImageReferences(await readFile(file, 'utf8')).references) {
      const resolved = fragmentImagePath({ root, publicDir, file, src, base });
      if (!resolved || !imagePattern.test(resolved)) continue;
      const actual = await localSource(root, resolved);
      const key = slash(path.relative(root, actual));
      sources.set(key, actual);
      images[src] = key;
    }
    if (Object.keys(images).length) fragments[slash(path.relative(root, file))] = images;
  }
  return {
    root,
    srcDir,
    sources: new Map([...sources].sort(([a], [b]) => a.localeCompare(b))),
    posts,
    fragments,
  };
}

function widthsFor(width) {
  return [
    ...new Set([...COVER_RECIPE.widths.filter((size) => size <= width), Math.min(width, 1200)]),
  ].sort((a, b) => a - b);
}

async function readJSON(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw new Error(`[covers] Invalid manifest: ${file}`, { cause: error });
  }
}

async function assertOutputRoot(root, directory, create) {
  if (!inside(root, directory))
    throw new Error('[covers] Generated cover directory must stay inside the project.');
  let parent = directory;
  for (;;) {
    try {
      const actual = await realpath(parent);
      if (actual !== root && !inside(root, actual))
        throw new Error('[covers] Generated cover path escapes the project.');
      break;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      parent = path.dirname(parent);
    }
  }
  if (create) await mkdir(directory, { recursive: true });
}

function variantName(key, sourceHash, recipeHash, width) {
  const slug =
    path
      .basename(key, path.extname(key))
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'cover';
  return `${slug}-${digest(key).slice(0, 8)}-${sourceHash.slice(0, 12)}-${recipeHash.slice(0, 8)}-${width}w.webp`;
}

async function writeOwned(file, bytes) {
  try {
    if ((await realpath(file)) !== file)
      throw new Error(`[covers] Refusing linked output: ${file}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, bytes, { flag: 'wx' });
  await rename(temporary, file);
}

/** check=true never writes or encodes images. Generated files are project-owned content. */
export async function prepareCovers({
  root = process.cwd(),
  srcDir = path.join(root, 'src'),
  publicDir = path.join(root, 'public'),
  base = '/',
  check = false,
  fragmentsEnabled = true,
} = {}) {
  const inventory = await collectCoverSources({ root, srcDir, publicDir, base, fragmentsEnabled });
  root = inventory.root;
  srcDir = inventory.srcDir;
  const directory = path.join(srcDir, COVER_DIRECTORY),
    generated = path.join(directory, 'generated');
  await assertOutputRoot(root, directory, false);
  await assertOutputRoot(root, generated, false);
  const manifestFile = path.join(directory, 'manifest.json');
  const old = await readJSON(manifestFile),
    recipeHash = digest(JSON.stringify(COVER_RECIPE));
  const records = {},
    failures = [];
  let encoded = 0,
    reused = 0;
  for (const [key, file] of inventory.sources) {
    const bytes = await readFile(file),
      sourceHash = digest(bytes);
    const previous =
      old?.schema === 1 && old.recipeHash === recipeHash ? old.sources?.[key] : undefined;
    let record = previous?.sourceHash === sourceHash ? previous : undefined;
    if (
      record &&
      (!Number.isInteger(record.width) ||
        record.width < 1 ||
        !Number.isInteger(record.height) ||
        record.height < 1 ||
        !Array.isArray(record.variants))
    )
      record = undefined;
    if (!record) {
      if (check) {
        failures.push(key);
        continue;
      }
      const metadata = await sharp(bytes, { animated: true }).metadata();
      const rotated = [5, 6, 7, 8].includes(metadata.orientation);
      const width = rotated ? metadata.height : metadata.width,
        height = rotated ? metadata.width : (metadata.pageHeight ?? metadata.height);
      if (!width || !height) throw new Error(`[covers] Cannot read dimensions: ${key}`);
      record = {
        sourceHash,
        width,
        height,
        passthrough: metadata.format === 'svg' || (metadata.pages ?? 1) > 1,
        variants: [],
      };
    }
    const expected = record.passthrough ? [] : widthsFor(record.width),
      variants = [];
    let invalid = false;
    for (const width of expected) {
      const filename = variantName(key, sourceHash, recipeHash, width),
        target = path.join(generated, filename);
      let variant = record.variants.find((item) => item.width === width && item.file === filename);
      try {
        if (
          !variant ||
          !Number.isInteger(variant.height) ||
          variant.height < 1 ||
          !/^[a-f0-9]{64}$/.test(variant.sha256)
        )
          throw new Error('missing variant');
        const actual = await realpath(target);
        if (!inside(generated, actual))
          throw new Error('[covers] Variant escapes generated directory.');
        if (digest(await readFile(actual)) !== variant.sha256) throw new Error('modified variant');
        reused++;
      } catch {
        if (check) {
          invalid = true;
          continue;
        }
        await assertOutputRoot(root, generated, true);
        const output = await sharp(bytes)
          .autoOrient()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: COVER_RECIPE.quality, effort: COVER_RECIPE.effort })
          .toBuffer({ resolveWithObject: true });
        variant = {
          file: filename,
          width: output.info.width,
          height: output.info.height,
          sha256: digest(output.data),
        };
        await writeOwned(target, output.data);
        encoded++;
      }
      variants.push(variant);
    }
    if (invalid || (check && expected.length !== record.variants.length)) failures.push(key);
    records[key] = { ...record, variants };
  }
  if (failures.length)
    throw new Error(
      `[covers] Missing, stale or modified image derivatives (${failures.length}):\n${failures.slice(0, 12).join('\n')}\nRun npx @anglefeint/astro-theme prepare-covers locally, or run normal dev/build/doctor to prepare them. Commit originals and src/assets/blog/covers/ to reuse prepared assets across checkouts.`
    );
  const manifest = { schema: 1, recipe: COVER_RECIPE, recipeHash, sources: records };
  if (!check && inventory.sources.size && JSON.stringify(old) !== JSON.stringify(manifest)) {
    await assertOutputRoot(root, directory, true);
    await writeOwned(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  }
  return {
    root,
    srcDir,
    publicDir,
    base,
    generated,
    manifest,
    posts: inventory.posts,
    fragments: inventory.fragments,
    encoded,
    reused,
  };
}

export function coverData(state, base = '/') {
  const sources = {};
  for (const [key, record] of Object.entries(state.manifest.sources))
    sources[key] = {
      width: record.width,
      height: record.height,
      variants: record.variants.map(({ file, width, height }) => ({
        src: `${base.replace(/\/$/, '')}/_blog-covers/${file}`,
        width,
        height,
      })),
    };
  return { root: state.root, base, posts: state.posts, fragments: state.fragments ?? {}, sources };
}

export function coverFiles(state) {
  const used = new Set([
    ...Object.values(state.posts),
    ...Object.values(state.fragments ?? {}).flatMap(Object.values),
  ]);
  return [
    ...new Map(
      [...used]
        .flatMap((key) => state.manifest.sources[key]?.variants ?? [])
        .map((variant) => [variant.file, variant])
    ).values(),
  ];
}
