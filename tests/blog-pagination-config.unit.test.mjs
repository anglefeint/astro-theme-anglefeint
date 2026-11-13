import test from 'node:test';
import assert from 'node:assert/strict';
import { defineThemeConfig } from '../packages/theme/src/project/defaults.ts';
import { validateBlogPageSize } from '../packages/theme/src/utils/blog-pagination.ts';

test('blog pagination retains defaults and accepts positive safe integers without a new upper limit', () => {
  assert.equal(defineThemeConfig({}).theme.blogPageSize, 10);
  for (const size of [1, 8, 1000, Number.MAX_SAFE_INTEGER]) {
    assert.equal(defineThemeConfig({ theme: { blogPageSize: size } }).theme.blogPageSize, size);
    assert.equal(validateBlogPageSize(size), size);
  }
});

test('invalid pagination fails at config resolution before route slicing or path allocation', () => {
  for (const size of [
    0,
    -2,
    -10,
    1.5,
    NaN,
    Infinity,
    -Infinity,
    Number.MAX_SAFE_INTEGER + 1,
    '10',
    null,
  ]) {
    assert.throws(
      () => defineThemeConfig({ theme: { blogPageSize: size } }),
      /theme\.blogPageSize.*positive safe integer/
    );
  }
});
