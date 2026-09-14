import { createHash } from 'node:crypto';

export function cleanTags(tags: readonly string[] = []): string[] {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
}

// Preserve plain lowercase URLs; avoid Windows device names and long path segments.
// Other labels use stable encoding rather than order-dependent collision suffixes.
export function tagSlug(tag: string): string {
  const label = tag.trim();
  if (new TextEncoder().encode(label).length > 80)
    return '~h' + createHash('sha256').update(label).digest('hex');
  if (
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(label) &&
    !/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(label)
  )
    return label;
  return (
    '~' +
    Array.from(new TextEncoder().encode(label), (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    )
  );
}

export function groupTags<T extends { data: { tags?: string[] } }>(posts: readonly T[]) {
  const groups = new Map<string, { label: string; slug: string; posts: T[] }>();
  for (const post of posts) {
    for (const label of cleanTags(post.data.tags)) {
      if (!groups.has(label)) groups.set(label, { label, slug: tagSlug(label), posts: [] });
      groups.get(label)!.posts.push(post);
    }
  }
  return [...groups.values()].sort(
    (a, b) =>
      b.posts.length - a.posts.length || (a.label < b.label ? -1 : a.label > b.label ? 1 : 0)
  );
}
