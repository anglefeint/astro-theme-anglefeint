export const FRAGMENT_ID = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/;

export function fragmentSettings(value?: {
  enabled?: boolean;
  pageSize?: number;
  comments?: { enabled?: boolean };
}) {
  const pageSize = value?.pageSize ?? 20;
  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100)
    throw new Error('theme.fragments.pageSize must be an integer between 1 and 100.');
  return {
    enabled: value?.enabled ?? false,
    pageSize,
    comments: { enabled: value?.comments?.enabled ?? false },
  };
}

export function fragmentsForLocale<T extends { id: string; data: { id: string; pubDate: Date } }>(
  entries: T[],
  locale: string
): T[] {
  const seen = new Set<string>();
  return entries
    .filter((entry) => entry.id.split('/')[0] === locale)
    .map((entry) => {
      if (!FRAGMENT_ID.test(entry.data.id) || seen.has(entry.data.id))
        throw new Error(`Invalid or duplicate fragment id in ${locale}: ${entry.data.id}`);
      seen.add(entry.data.id);
      return entry;
    })
    .sort(
      (a, b) =>
        b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.data.id.localeCompare(b.data.id)
    );
}

export function fragmentTerm(id: string) {
  if (!FRAGMENT_ID.test(id)) throw new Error('A valid stable fragment id is required.');
  return `fragment/${id}`;
}
