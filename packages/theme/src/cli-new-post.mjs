import { mkdir, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFile as execFileCallback } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import {
  buildNewPostTemplate,
  loadDefaultCovers,
  parseNewPostArgs,
  pickDefaultCoverBySlug,
  resolveLocales,
  usageNewPost,
  validatePostSlug,
} from './scaffold/new-post.mjs';

const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content/blog');
const DEFAULT_COVERS_ROOT = path.resolve(process.cwd(), 'src/assets/blog/default-covers');
const SITE_CONFIG_PATH = path.resolve(process.cwd(), 'src/site.config.ts');
const FALLBACK_LOCALES = ['en'];
const execFile = promisify(execFileCallback);

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function extractObjectLiteral(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return '';

  const start = source.indexOf('{', markerIndex);
  return extractObjectLiteralFromIndex(source, start);
}

function extractObjectLiteralFromIndex(source, start) {
  if (start === -1) return '';

  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if (char === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      quote = char;
      continue;
    }

    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  return '';
}

function extractThemeConfigObject(configSource) {
  const themeConfigMarkers = ['export const THEME_CONFIG', 'const THEME_CONFIG'];

  for (const marker of themeConfigMarkers) {
    const markerIndex = configSource.indexOf(marker);
    if (markerIndex === -1) continue;

    const assignmentIndex = configSource.indexOf('=', markerIndex);
    if (assignmentIndex === -1) continue;

    const objectStart = configSource.indexOf('{', assignmentIndex);
    if (objectStart === -1) continue;

    let depth = 0;
    let inString = false;
    let quote = '';
    let escaped = false;

    for (let index = objectStart; index < configSource.length; index += 1) {
      const char = configSource[index];

      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === '\\') {
          escaped = true;
          continue;
        }
        if (char === quote) {
          inString = false;
          quote = '';
        }
        continue;
      }

      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        quote = char;
        continue;
      }

      if (char === '{') depth += 1;
      if (char === '}') {
        depth -= 1;
        if (depth === 0) return configSource.slice(objectStart, index + 1);
      }
    }
  }

  return '';
}

function localeKeyFromToken(key) {
  return /^[a-z]{2,3}(?:-[a-z0-9]+)?$/i.test(key) ? key.toLowerCase() : '';
}

function localeObjectIsEnabled(localeObjectSource) {
  const metaObject = extractObjectLiteral(localeObjectSource, 'meta');
  if (!metaObject) return true;

  return !/\benabled\s*:\s*false\b/.test(metaObject);
}

function parseLocaleRegistryKeys(configSource) {
  const themeConfigObject = extractThemeConfigObject(configSource);
  if (!themeConfigObject) return [];

  const i18nObject = extractObjectLiteral(themeConfigObject, 'i18n');
  if (!i18nObject) return [];

  const localesObject = extractObjectLiteral(i18nObject, 'locales');
  if (!localesObject) return [];

  const keys = [];
  let depth = 0;

  for (let index = 0; index < localesObject.length; index += 1) {
    const char = localesObject[index];

    if (char === '{') {
      depth += 1;
      if (depth === 1) continue;
    }
    if (char === '}') {
      depth -= 1;
      continue;
    }

    if (depth !== 1) continue;

    if (char === '"' || char === "'" || char === '`') {
      let key = '';
      let escaped = false;
      const quote = char;
      let cursor = index + 1;

      for (; cursor < localesObject.length; cursor += 1) {
        const next = localesObject[cursor];
        if (escaped) {
          key += next;
          escaped = false;
          continue;
        }
        if (next === '\\') {
          escaped = true;
          continue;
        }
        if (next === quote) break;
        key += next;
      }

      let colonIndex = cursor + 1;
      while (colonIndex < localesObject.length && /\s/.test(localesObject[colonIndex])) {
        colonIndex += 1;
      }

      const normalizedKey = localeKeyFromToken(key);
      if (localesObject[colonIndex] === ':' && normalizedKey) {
        const localeObject = extractObjectLiteralFromIndex(
          localesObject,
          localesObject.indexOf('{', colonIndex)
        );
        if (!localeObject || localeObjectIsEnabled(localeObject)) {
          keys.push(normalizedKey);
        }
      }

      index = cursor;
      continue;
    }

    if (/[A-Za-z_$]/.test(char)) {
      let cursor = index + 1;
      while (cursor < localesObject.length && /[A-Za-z0-9_$-]/.test(localesObject[cursor])) {
        cursor += 1;
      }
      const key = localesObject.slice(index, cursor).trim();

      let colonIndex = cursor;
      while (colonIndex < localesObject.length && /\s/.test(localesObject[colonIndex])) {
        colonIndex += 1;
      }

      const normalizedKey = localeKeyFromToken(key);
      if (localesObject[colonIndex] === ':' && normalizedKey) {
        const localeObject = extractObjectLiteralFromIndex(
          localesObject,
          localesObject.indexOf('{', colonIndex)
        );
        if (!localeObject || localeObjectIsEnabled(localeObject)) {
          keys.push(normalizedKey);
        }
      }

      index = cursor - 1;
    }
  }

  return Array.from(new Set(keys));
}

async function loadNormalizedProjectI18n() {
  const loaderSource = `
    import { pathToFileURL } from 'node:url';

    const mod = await import(pathToFileURL(process.argv[1]).href);
    const config = mod.THEME_CONFIG?.i18n;

    if (!config) process.exit(2);

    const normalized =
      typeof mod.normalizeI18nConfig === 'function' ? mod.normalizeI18nConfig(config) : config;

    process.stdout.write(JSON.stringify(normalized));
  `;

  const { stdout } = await execFile(
    process.execPath,
    ['--experimental-strip-types', '--input-type=module', '--eval', loaderSource, SITE_CONFIG_PATH],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
    }
  );

  return JSON.parse(stdout);
}

async function resolveProjectLocales() {
  try {
    const normalized = await loadNormalizedProjectI18n();
    const locales = Object.values(normalized.locales ?? {})
      .filter((locale) => locale?.meta?.enabled)
      .map((locale) => locale.code)
      .filter((locale) => typeof locale === 'string');
    if (locales.length > 0) {
      return Array.from(new Set(locales));
    }
  } catch {
    // Fall through to the source parser fallback for environments without TS loading support.
  }

  try {
    const configSource = await readFile(SITE_CONFIG_PATH, 'utf8');
    const locales = parseLocaleRegistryKeys(configSource);
    if (locales.length === 0) return [];
    return Array.from(new Set(locales));
  } catch {
    return [];
  }
}

async function main() {
  const { slug, locales: cliLocales } = parseNewPostArgs(process.argv);
  if (!slug) {
    console.error(usageNewPost());
    process.exit(1);
  }

  if (!validatePostSlug(slug)) {
    console.error('Invalid slug. Use lowercase letters, numbers, and hyphens only.');
    process.exit(1);
  }

  const pubDate = new Date().toISOString().slice(0, 10);
  const defaultCovers = await loadDefaultCovers(DEFAULT_COVERS_ROOT);
  const projectLocales = await resolveProjectLocales();
  const locales = resolveLocales({
    cliLocales,
    envLocales: process.env.ANGLEFEINT_LOCALES ?? '',
    defaultLocales: projectLocales.length > 0 ? projectLocales : FALLBACK_LOCALES,
  });
  const created = [];
  const skipped = [];

  for (const locale of locales) {
    const localeDir = path.join(CONTENT_ROOT, locale);
    const filePath = path.join(localeDir, `${slug}.md`);
    await mkdir(localeDir, { recursive: true });

    if (await exists(filePath)) {
      skipped.push(filePath);
      continue;
    }

    const heroImage = pickDefaultCoverBySlug(slug, localeDir, defaultCovers);

    await writeFile(filePath, buildNewPostTemplate(locale, slug, pubDate, heroImage), 'utf8');
    created.push(filePath);
  }

  if (created.length > 0) {
    console.log('Created files:');
    for (const filePath of created) console.log(`- ${filePath}`);
  }

  if (skipped.length > 0) {
    console.log('Skipped existing files:');
    for (const filePath of skipped) console.log(`- ${filePath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
