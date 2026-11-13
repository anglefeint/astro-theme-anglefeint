import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, realpath, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL, URL } from 'node:url';
import sharp from 'sharp';
import { parse } from 'node-html-parser';
import { markdownToHtml } from 'satteri';
import markdown from '../packages/theme/src/markdown.mjs';
import { prepareCovers, coverData, coverFiles } from '../packages/theme/src/covers/prepare.mjs';
import {
  fragmentImageReferences,
  fragmentImagePath,
} from '../packages/theme/src/covers/fragment-sources.mjs';
import { fragmentImagePlugin } from '../packages/theme/src/covers/fragment-markdown.mjs';
import { rewriteFragmentImages } from '../packages/theme/src/covers/fragment-render.mjs';
import { fragmentFeedHtml } from '../packages/theme/src/utils/fragment-html.ts';
import { fragmentPreview } from '../packages/theme/src/utils/fragment-preview.ts';

test('fragment image inventory ignores frontmatter/code and resolves reference-style images', () => {
  const source =
    '---\ntitle: "![not content](/ignored.png)"\n---\n![a][pic]\n\n[pic]: /photo.png\n\n<img src="/raw.png">\n\n`![](/code.png)`\n\n```html\n<img src="/fenced.png">\n```';
  assert.deepEqual(fragmentImageReferences(source).references, ['/photo.png', '/raw.png']);
  const root = path.resolve('test-root'),
    publicDir = path.join(root, 'public'),
    file = path.join(root, 'src/content/fragments/en/a.md');
  assert.equal(
    fragmentImagePath({ root, publicDir, file, src: 'https://example.com/a.png' }),
    undefined
  );
  assert.equal(
    fragmentImagePath({ root, publicDir, file, src: 'data:image/png;base64,a' }),
    undefined
  );
  assert.equal(
    fragmentImagePath({
      root,
      publicDir,
      file,
      src: '/notes/images/a%20b.png?x=1#part',
      base: '/notes/',
    }),
    path.join(publicDir, 'images/a b.png')
  );
  assert.throws(
    () => fragmentImagePath({ root, publicDir, file, src: '/../../outside.png' }),
    /escapes/
  );
});

test('fragment images persist, rewrite Markdown/reference/HTML and refresh from current data without recompilation', async (t) => {
  const root = await realpath(await mkdtemp(path.join(os.tmpdir(), 'anglefeint-fragment-images-')));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dir = path.join(root, 'src/content/fragments/en'),
    publicDir = path.join(root, 'public/images/fragments');
  await mkdir(dir, { recursive: true });
  await mkdir(publicDir, { recursive: true });
  const imageFile = path.join(publicDir, 'photo space.png');
  const create = async (background) =>
    writeFile(
      imageFile,
      await sharp({ create: { width: 1600, height: 900, channels: 3, background } })
        .png()
        .toBuffer()
    );
  await create('#176a4c');
  await writeFile(path.join(dir, 'local.png'), await readFile(imageFile));
  await writeFile(
    path.join(publicDir, 'vector.svg'),
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60"/>'
  );
  await writeFile(
    path.join(publicDir, 'animated.gif'),
    await readFile(
      new URL('../packages/theme/src/assets/theme/avatars/matrix-typist.gif', import.meta.url)
    )
  );
  const source =
    '![quoted " alt](/images/fragments/photo%20space.png)\n\n![ref][pic]\n\n[pic]: ./local.png\n\n<div><img src="/images/fragments/photo%20space.png" alt="raw"></div>\n\n![](/images/fragments/vector.svg)\n\n![](/images/fragments/animated.gif)\n\n![Remote](https://example.com/remote.png)';
  const file = path.join(dir, 'note.md');
  await writeFile(file, source);
  const first = await prepareCovers({ root });
  assert.equal(first.encoded, 10);
  assert.equal(coverFiles(first).length, 10);
  const again = await prepareCovers({ root, check: true });
  assert.equal(again.encoded, 0);
  const data = coverData(first, '/notes/');
  const compiled = markdownToHtml(source, {
    ...markdown({ fragmentImages: fragmentImagePlugin(() => data) }).options,
    fileURL: pathToFileURL(file),
  });
  const html = rewriteFragmentImages(compiled.html, data),
    doc = parse(html),
    images = doc.querySelectorAll('img');
  assert.equal(images.length, 6);
  for (const img of images.slice(0, 3)) {
    assert.match(img.getAttribute('src'), /^\/notes\/_blog-covers\//);
    assert.equal(img.getAttribute('srcset').split(', ').length, 5);
    assert.equal(img.getAttribute('width'), '1600');
    assert.equal(img.getAttribute('height'), '900');
    assert.equal(img.hasAttribute('data-fragment-image'), false);
  }
  assert.equal(images[0].getAttribute('alt'), 'quoted " alt');
  assert.equal(images[3].getAttribute('src'), '/notes/images/fragments/vector.svg');
  assert.equal(images[3].getAttribute('width'), '80');
  assert.equal(images[4].getAttribute('src'), '/notes/images/fragments/animated.gif');
  assert.equal(images[4].getAttribute('height'), '128');
  assert.equal(images[5].getAttribute('src'), 'https://example.com/remote.png');
  const feed = parse(fragmentFeedHtml(html, true).html);
  assert.equal(feed.querySelector('img').getAttribute('fetchpriority'), 'high');
  assert.equal(
    feed.querySelectorAll('img').filter((n) => n.getAttribute('loading') === 'eager').length,
    1
  );
  const preview = fragmentPreview(html, 'https://example.com/notes/en/fragments/');
  assert.equal(preview.image.srcset, images[0].getAttribute('srcset'));
  await create('#aa1144');
  await assert.rejects(prepareCovers({ root, check: true }), /Missing, stale/);
  const updated = await prepareCovers({ root });
  assert.equal(updated.encoded, 5);
  const refreshed = parse(rewriteFragmentImages(compiled.html, coverData(updated, '/notes/')));
  assert.notEqual(
    refreshed.querySelector('img').getAttribute('src'),
    images[0].getAttribute('src')
  );
});
