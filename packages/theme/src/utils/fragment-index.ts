import { createHash } from 'node:crypto';
import { fragmentsForLocale } from './fragments.ts';

/** Build-only: the feed and endpoint must use exactly the same ordering. */
export function buildFragmentIndex<T extends { id: string; data: { id: string; pubDate: Date } }>(
  entries: T[],
  locale: string,
  pageSize: number
) {
  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100)
    throw new Error('A valid fragment page size is required.');
  const localized = fragmentsForLocale(entries, locale);
  const totalPages = Math.max(1, Math.ceil(localized.length / pageSize));
  const body = JSON.stringify({
    version: 1,
    totalPages,
    pages: Object.fromEntries(
      localized.map((entry, index) => [entry.data.id, Math.floor(index / pageSize) + 1])
    ),
  });
  const revision = createHash('sha256').update(body).digest('hex').slice(0, 16);
  return { entries: localized, totalPages, body, revision };
}
