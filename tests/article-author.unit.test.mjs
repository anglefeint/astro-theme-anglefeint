import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { URL } from 'node:url';
import ts from 'typescript';
import { resolveArticleAuthor } from '../packages/theme/src/utils/article-author.ts';
import { imageData, socialKey } from '../packages/theme/src/social/model.mjs';
import { resolveSocialImage } from '../packages/theme/src/social/resolve.mjs';

test('the real endpoint emits the same image key the article resolves for optional or padded authors', async () => {
  const source = await readFile(
    new URL('../packages/theme/src/social/endpoint.ts', import.meta.url),
    'utf8'
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const fallback = 'Site Author';
  const authors = [undefined, '', '   ', ' Alice ', 'Alice', '另一位作者'];
  const posts = authors.map((author, index) => ({
    id: `en/post-${index}`,
    data: { title: `Post ${index}`, author },
  }));
  const getStaticPaths = vm.runInNewContext(
    compiled.replace(/^import .*;\r?\n/gm, '').replace(/\bexport /g, '') + '\ngetStaticPaths;',
    {
      THEME: { SOCIAL_IMAGE: { ENABLED: true }, FOOTER: { SHOW_CREDITS: true } },
      SITE_AUTHOR: fallback,
      SITE_TITLE: 'Site',
      ENABLED_LOCALES: ['en'],
      getCollection: async () => posts,
      imageData,
      socialKey,
      resolveArticleAuthor,
    }
  );
  const paths = await getStaticPaths();
  for (const [index, author] of authors.entries()) {
    const resolved = resolveArticleAuthor(author, fallback);
    assert.equal(resolved, author?.trim() || fallback);
    const image = await resolveSocialImage({
      enabled: true,
      data: imageData(`Post ${index}`, resolved, 'Site', 'en'),
    });
    assert.equal(image.src, `/_social/${paths[index].params.key}.png`);
  }
});
