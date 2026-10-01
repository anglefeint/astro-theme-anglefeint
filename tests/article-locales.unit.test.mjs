import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, {
  alias: { '@anglefeint/site-i18n/config': path.resolve('src/i18n/config.ts') },
});
const { resolveArticleLocaleHrefs } = await jiti.import(
  '../packages/theme/src/utils/article-locales.ts'
);
const resolve = (pathname, ids, extra = {}) =>
  resolveArticleLocaleHrefs({
    pathname,
    locale: 'zh',
    loadPosts: async () => ids.map((id) => ({ id })),
    ...extra,
  });

test('standard articles automatically include only existing enabled translations', async () => {
  assert.deepEqual(
    await resolve('/zh/blog/example/', [
      'zh/example',
      'ja/example',
      'en/other',
      'disabled/example',
    ]),
    {
      zh: '/zh/blog/example/',
      ja: '/ja/blog/example/',
    }
  );
});

test('explicit maps and empty maps bypass automatic discovery', async () => {
  for (const seoLocaleHrefs of [{}, { en: '/custom/article/' }]) {
    assert.deepEqual(
      await resolve('/zh/blog/example/', [], {
        seoLocaleHrefs,
        loadPosts: () => {
          throw new Error('must not load');
        },
      }),
      seoLocaleHrefs
    );
  }
});

test('unknown/custom routes and absent current articles never fabricate alternates', async () => {
  assert.deepEqual(await resolve('/zh/notes/example/', ['zh/example']), {});
  assert.deepEqual(await resolve('/zh/blog/missing/', ['en/missing']), {});
  assert.deepEqual(await resolve('/zh/blog/', ['zh/example']), {});
});

test('nested Unicode slugs and paths without trailing slash resolve', async () => {
  assert.deepEqual(
    await resolve('/zh/blog/folder/%E4%BD%A0%E5%A5%BD', ['zh/folder/你好', 'en/folder/你好']),
    {
      en: '/en/blog/folder/你好/',
      zh: '/zh/blog/folder/你好/',
    }
  );
});
