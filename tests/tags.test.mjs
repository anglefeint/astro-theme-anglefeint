import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanTags, groupTags, tagSlug } from '../packages/theme/src/utils/tags.ts';

test('tag counts deduplicate each post, skip blanks, preserve spelling and post order', () => {
  const a = { data: { tags: [' Astro ', 'Astro', '', '中文'] } };
  const b = { data: { tags: ['Astro', 'astro'] } };
  const groups = groupTags([a, b, { data: {} }]);
  assert.deepEqual(cleanTags([' ', ' x ', 'x', 'X']), ['x', 'X']);
  assert.equal(groups[0].label, 'Astro');
  assert.deepEqual(groups[0].posts, [a, b]);
  assert.equal(groups.length, 3);
  assert.deepEqual(groupTags([]), []);
});

test('tag routes stay stable and distinct across case, punctuation, Unicode and unsafe path names', () => {
  const labels = [
    'astro',
    'Astro',
    'ASTRO',
    'C++',
    'C#',
    'C',
    '中文',
    'a/b',
    'a b',
    'a-b',
    '..',
    '%2F',
    '~41',
    'é',
    'e\u0301',
  ];
  const slugs = labels.map(tagSlug);
  assert.equal(new Set(slugs.map((s) => s.toLowerCase())).size, labels.length);
  assert.equal(tagSlug(' astro '), 'astro');
  for (const slug of slugs) assert.match(slug, /^[a-z0-9~-]+$/);
  assert.deepEqual(labels.map(tagSlug), slugs);
  assert.notEqual(tagSlug('con'), 'con');
  assert.ok(tagSlug('中文'.repeat(100)).length < 100);
  assert.notEqual(tagSlug('中文'.repeat(100)), tagSlug('中文'.repeat(101)));
});
