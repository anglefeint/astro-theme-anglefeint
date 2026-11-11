import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateComments,
  articleComments,
  giscusConfig,
} from '../packages/theme/src/utils/comments.ts';
import { loadProjectModule } from '../packages/theme/src/scaffold/project-config.mjs';
import path from 'node:path';
const { defineThemeConfig } = await loadProjectModule(
  path.resolve('packages/theme/src/project/defaults.ts')
);

const defaults = defineThemeConfig({}).theme.comments;

test('article and deferred embeds share configuration without changing article mapping', () => {
  const source = {
    REPO: 'test/comments',
    REPO_ID: 'repo',
    CATEGORY: 'General',
    CATEGORY_ID: 'category',
    MAPPING: 'number',
    TERM: ' custom ',
    NUMBER: ' 42 ',
    STRICT: '0',
    REACTIONS_ENABLED: '1',
    EMIT_METADATA: '0',
    INPUT_POSITION: 'bottom',
    THEME: 'dark',
    LANG: 'ja',
    LOADING: 'lazy',
    CROSSORIGIN: 'anonymous',
  };
  const saved = { ...source };
  const article = giscusConfig(source, 'zh');
  const deferred = giscusConfig(source, 'zh', true);
  assert.equal(article.mapping, 'number');
  assert.equal(article.number, '42');
  assert.equal(article.term, undefined);
  assert.equal(article.lang, 'ja');
  assert.equal(article.strict, '0');
  assert.equal(article.loading, 'lazy');
  assert.equal(deferred.mapping, 'specific');
  assert.equal(deferred.number, undefined);
  assert.equal(deferred.term, '');
  assert.equal(deferred.lang, 'zh-CN');
  assert.equal(deferred.strict, '1');
  assert.equal(deferred.loading, 'eager');
  for (const key of [
    'repo',
    'repoId',
    'category',
    'categoryId',
    'theme',
    'reactionsEnabled',
    'inputPosition',
  ])
    assert.equal(article[key], deferred[key]);
  assert.deepEqual(source, saved);
  assert.throws(() => giscusConfig({ ...source, REPO: '' }, 'en', true), /theme.comments.repo/);
});

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
