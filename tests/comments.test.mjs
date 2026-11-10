import test from 'node:test';
import assert from 'node:assert/strict';
import { validateComments, articleComments } from '../packages/theme/src/utils/comments.ts';
import { loadProjectModule } from '../packages/theme/src/scaffold/project-config.mjs';
import path from 'node:path';
const { defineThemeConfig } = await loadProjectModule(
  path.resolve('packages/theme/src/project/defaults.ts')
);

const defaults = defineThemeConfig({}).theme.comments;

test('shared comments are opt-in and ordinary custom mappings retain their rules', () => {
  assert.equal(defaults.shareAcrossLocales, false);
  for (const mapping of ['pathname', 'url', 'title', 'og:title', 'specific', 'number']) {
    const config = { ...defaults, enabled: true, mapping, term: 'custom term', number: '42' };
    assert.doesNotThrow(() => validateComments(config));
    const output = { ENABLED: true, MAPPING: mapping, TERM: config.term, STRICT: '0' };
    assert.equal(articleComments(output), output);
  }
  assert.throws(
    () => validateComments({ ...defaults, enabled: true, mapping: 'specific' }),
    /non-empty/
  );
  assert.throws(
    () => validateComments({ ...defaults, enabled: true, mapping: 'number' }),
    /positive integer/
  );
});

test('shared mode validates conflicting settings and requires a complete article slug', () => {
  const config = {
    ...defaults,
    enabled: true,
    shareAcrossLocales: true,
    mapping: 'specific',
    strict: '1',
  };
  assert.doesNotThrow(() => validateComments(config));
  for (const override of [
    { mapping: 'pathname' },
    { term: 'global' },
    { number: '42' },
    { strict: '0' },
  ]) {
    assert.throws(
      () => validateComments({ ...config, ...override }),
      /shareAcrossLocales requires/
    );
  }
  assert.doesNotThrow(() => validateComments({ ...config, enabled: false, term: 'unfinished' }));
  const input = {
    ENABLED: true,
    SHARE_ACROSS_LOCALES: true,
    MAPPING: 'specific',
    TERM: '',
    STRICT: '1',
  };
  for (const slug of [undefined, '', ' ', '/article', 'article/', 'a//b', '../article']) {
    assert.throws(() => articleComments(input, slug), /articleSlug/);
  }
  assert.equal(articleComments(input, 'guides/setup').TERM, 'guides/setup');
  assert.equal(articleComments(input, 'other/setup').TERM, 'other/setup');
  assert.equal(input.TERM, '');
});
