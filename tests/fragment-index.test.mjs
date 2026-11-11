import test from 'node:test';
import assert from 'node:assert/strict';
import { buildFragmentIndex } from '../packages/theme/src/utils/fragment-index.ts';

const entries = [
  { id: 'en/old-name', data: { id: 'OldId001', pubDate: new Date('2026-01-01') } },
  { id: 'en/b', data: { id: 'NewId002', pubDate: new Date('2026-02-01') } },
  { id: 'zh/translation', data: { id: 'OldId001', pubDate: new Date('2026-01-01') } },
];
test('fragment index follows actual pagination, is locale-specific and contains no prose', () => {
  const index = buildFragmentIndex(entries, 'en', 1);
  assert.deepEqual(JSON.parse(index.body), {
    version: 1,
    totalPages: 2,
    pages: { NewId002: 1, OldId001: 2 },
  });
  assert.deepEqual(JSON.parse(buildFragmentIndex(entries, 'zh', 1).body).pages, { OldId001: 1 });
  const renamed = entries.map((entry) => ({
    ...entry,
    id: entry.id === 'en/old-name' ? 'en/renamed' : entry.id,
  }));
  assert.equal(buildFragmentIndex(renamed, 'en', 1).revision, index.revision);
  const repaged = buildFragmentIndex(entries, 'en', 20);
  assert.deepEqual(JSON.parse(repaged.body).pages, { NewId002: 1, OldId001: 1 });
  assert.notEqual(repaged.revision, index.revision);
  const removed = buildFragmentIndex(
    entries.filter((entry) => entry.data.id !== 'OldId001'),
    'en',
    1
  );
  assert.deepEqual(JSON.parse(removed.body).pages, { NewId002: 1 });
  assert(!index.body.includes('old-name'));
});
test('empty and prototype-like fragment IDs produce safe minimal indexes', () => {
  assert.deepEqual(JSON.parse(buildFragmentIndex([], 'en', 20).body), {
    version: 1,
    totalPages: 1,
    pages: {},
  });
  const index = buildFragmentIndex(
    [{ id: 'en/one', data: { id: 'toString', pubDate: new Date() } }],
    'en',
    20
  );
  assert.equal(Object.hasOwn(JSON.parse(index.body).pages, 'toString'), true);
});
