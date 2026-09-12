import test from 'node:test';
import assert from 'node:assert/strict';
import { buildArticleToc } from '../packages/theme/src/utils/article-toc.ts';

const heading = (depth, text, slug = text) => ({ depth, text, slug });

test('article contents preserve multilingual text and distinct compiler-generated anchors', () => {
  const headings = [
    heading(2, '配置', '配置'),
    heading(3, 'Use `npm`', 'use-npm'),
    heading(2, '配置', '配置-1'),
  ];
  const original = headings.map((item) => ({ ...item }));
  const entries = buildArticleToc(headings);
  assert.deepEqual(
    entries.map((entry) => entry.slug),
    ['配置', '配置-1']
  );
  assert.deepEqual(entries[0].children, [headings[1]]);
  assert.deepEqual(headings, original);
});

test('contents tolerate orphan h3, skipped levels and new h1 sections', () => {
  const entries = buildArticleToc([
    heading(3, 'Introduction'),
    heading(2, 'Setup'),
    heading(4, 'Detail'),
    heading(3, 'Configure'),
    heading(1, 'Appendix'),
    heading(3, 'Notes'),
  ]);
  assert.deepEqual(
    entries.map((entry) => entry.text),
    ['Introduction', 'Setup', 'Notes']
  );
  assert.deepEqual(
    entries[1].children.map((entry) => entry.text),
    ['Configure']
  );
});

test('empty contents stay empty while a single useful heading is retained', () => {
  assert.deepEqual(buildArticleToc([]), []);
  assert.deepEqual(buildArticleToc([heading(1, 'Title'), heading(4, 'Detail')]), []);
  assert.equal(buildArticleToc([heading(2, 'Only section')]).length, 1);
});
