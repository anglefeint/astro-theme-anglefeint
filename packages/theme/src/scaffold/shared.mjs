import path from 'node:path';

// Shared new-post/new-fragment locale normalization; callers resolve precedence
// before loading project configuration so explicit overrides need no config.
export function resolveLocales({ cliLocales, envLocales, defaultLocales }) {
  const raw = cliLocales || envLocales || '';
  if (!raw) return [...defaultLocales];
  const parsed = raw
    .split(',')
    .map((locale) => locale.trim())
    .filter(Boolean)
    .map((locale) => locale.toLowerCase());
  if (parsed.length === 0) throw new Error('Locales list is empty. Example: --locales en,fr');
  const invalid = parsed.find((locale) => !/^[a-z]{2,3}(?:-[a-z0-9]+)?$/.test(locale));
  if (invalid) throw new Error(`Invalid locale "${invalid}".`);
  return [...new Set(parsed)];
}

export function toTitleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase() + segment.slice(1))
    .join(' ');
}

export function validatePostSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function validatePageSlug(slug) {
  if (!slug) return false;
  if (slug.startsWith('/') || slug.endsWith('/')) return false;
  const parts = slug.split('/');
  return parts.every((part) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part));
}

export function hashString(input) {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  }
  return hash >>> 0;
}

export function normalizePathForFrontmatter(filePath) {
  return filePath.split(path.sep).join('/');
}
