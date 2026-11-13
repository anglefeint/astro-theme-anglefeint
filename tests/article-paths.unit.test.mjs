import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import { buildArticlePaths } from '../packages/theme/src/utils/article-paths.ts';

const options = {
  locales: ['en', 'zh', 'ja'],
  slugOf: (id) => id.split('/').slice(1).join('/'),
  menuPath: (locale, path) => `/${locale}${path}`,
  seoPath: (locale, path) => `/${locale}${path}`,
};
const post = (id, day = 1) => ({
  id,
  data: { pubDate: new Date(`2026-11-${String(day).padStart(2, '0')}`) },
});

test('indexed paths preserve previous ordering, ties, related posts and menu/SEO distinctions', () => {
  const posts = [
    post('zh/older'),
    post('en/older'),
    post('en/newest', 4),
    post('zh/newest', 4),
    post('en/tie-a', 3),
    post('en/tie-b', 3),
    post('en/fifth', 2),
    post('off/newest', 5),
  ];
  const order = posts.map((p) => p.id);
  const actual = buildArticlePaths(posts, options);
  const expected = options.locales.flatMap((locale) => {
    const local = posts
      .filter((p) => p.id.startsWith(locale + '/'))
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
    return local.map((p) => ({
      id: p.id,
      related: local
        .filter((candidate) => candidate.id !== p.id)
        .slice(0, 3)
        .map((candidate) => candidate.id),
    }));
  });
  assert.deepEqual(
    actual.map(({ props }) => ({ id: props.post.id, related: props.related.map((p) => p.id) })),
    expected
  );
  assert.deepEqual(
    posts.map((p) => p.id),
    order,
    'sorting must not mutate the content array'
  );
  const { props } = actual.find((p) => p.props.post.id === 'en/newest');
  assert.deepEqual(props.localeHrefs, {
    en: '/en/blog/newest/',
    zh: '/zh/blog/newest/',
    ja: '/ja/blog/',
  });
  assert.deepEqual(props.seoLocaleHrefs, { en: '/en/blog/newest/', zh: '/zh/blog/newest/' });
  assert.deepEqual(buildArticlePaths([], options), []);
});

test('nested Unicode slugs, missing default translations and content edits keep truthful alternates', () => {
  const posts = [post('zh/guides/你好'), post('ja/guides/你好')];
  const first = buildArticlePaths(posts, options)[0];
  assert.equal(first.params.slug, 'guides/你好');
  assert.equal(first.props.localeHrefs.en, '/en/blog/');
  assert.equal(first.props.seoLocaleHrefs.en, undefined);
  assert.equal(first.props.seoLocaleHrefs.ja, '/ja/blog/guides/你好/');
  const edited = buildArticlePaths([posts[0]], options)[0];
  assert.equal(edited.props.localeHrefs.ja, '/ja/blog/');
  assert.equal(
    edited.props.seoLocaleHrefs.ja,
    undefined,
    'a new build must not reuse stale translations'
  );
  assert.deepEqual(edited.props.related, []);
});

test('large collections use one input pass and resolve each slug/translation map once', () => {
  const posts = Array.from({ length: 3000 }, (_, i) =>
    post(`${options.locales[i % 3]}/post-${Math.floor(i / 3)}`)
  );
  let passes = 0,
    slugs = 0,
    menuCalls = 0,
    seoCalls = 0;
  const input = {
    *[Symbol.iterator]() {
      passes++;
      yield* posts;
    },
  };
  const paths = buildArticlePaths(input, {
    ...options,
    slugOf(id) {
      slugs++;
      return options.slugOf(id);
    },
    menuPath(locale, path) {
      menuCalls++;
      return options.menuPath(locale, path);
    },
    seoPath(locale, path) {
      seoCalls++;
      return options.seoPath(locale, path);
    },
  });
  assert.equal(paths.length, 3000);
  assert.equal(passes, 1);
  assert.equal(slugs, 3000);
  assert.equal(menuCalls, 3000, 'one map per unique slug, not one full scan per article');
  assert.equal(seoCalls, 3000);
  assert.ok(paths.every((p) => p.props.related.length === 3));
});

test('menu and SEO paths retain their distinct caller policies', () => {
  const [{ props }] = buildArticlePaths([post('en/note')], {
    ...options,
    menuPath: (locale, path) => `menu:${locale}:${path}`,
    seoPath: (locale, path) => `seo:${locale}:${path}`,
  });
  assert.equal(props.localeHrefs.en, 'menu:en:/blog/note/');
  assert.equal(props.localeHrefs.zh, 'menu:zh:/blog/');
  assert.deepEqual(props.seoLocaleHrefs, { en: 'seo:en:/blog/note/' });
});

test('the actual standard route precomputes maps alongside related posts', async () => {
  const source = await readFile(
    new URL('../packages/theme/src/routes/[lang]/blog/[...slug].astro', import.meta.url),
    'utf8'
  );
  const frontmatter = source.split('---')[1].split('const { post,')[0];
  const compiled = ts.transpileModule(frontmatter, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  let loads = 0;
  const getStaticPaths = vm.runInNewContext(
    compiled.replace(/^import .*;\r?\n/gm, '').replace(/\bexport /g, '') + '\ngetStaticPaths;',
    {
      getCollection: async () => {
        loads++;
        return [post('en/note'), post('zh/note')];
      },
      ENABLED_LOCALES: options.locales,
      blogIdToSlugAnyLocale: options.slugOf,
      alternatePathForLocale: options.menuPath,
      localePath: options.seoPath,
      buildArticlePaths,
    }
  );
  const paths = await getStaticPaths();
  assert.equal(loads, 1);
  assert.equal(paths.length, 2);
  assert.deepEqual(paths[0].props.seoLocaleHrefs, { en: '/en/blog/note/', zh: '/zh/blog/note/' });
  assert.equal(paths[0].props.localeHrefs.ja, '/ja/blog/');
});
