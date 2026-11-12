import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import sharp from 'sharp';
import { parse } from 'node-html-parser';
import { fragmentFixture } from './fragments-fixture.mjs';

test(
  'homepage build previews local/public images and code through the actual content pipeline',
  { timeout: 180000 },
  async () => {
    const fixture = await fragmentFixture();
    assert.equal(path.dirname(fixture.root), process.cwd());
    try {
      const content = path.join(fixture.root, 'src/content/fragments/en');
      const image = await sharp({
        create: { width: 32, height: 20, channels: 3, background: '#60ff80' },
      })
        .png()
        .toBuffer();
      await writeFile(path.join(content, 'preview-local.png'), image);
      await mkdir(path.join(fixture.root, 'public/images'), { recursive: true });
      await writeFile(path.join(fixture.root, 'public/images/preview-public.png'), image);
      for (const [id, date, body] of [
        ['Third003', '2026-11-12', '![](./preview-local.png)'],
        [
          'Second02',
          '2026-11-11',
          '```js\nconst x = 1;\n  console.log("<script>safe</script>");\n```',
        ],
        [
          'First001',
          '2026-11-10',
          '<img src="/images/preview-public.png" alt="Public photo">\n\n<pre><code>first\n  second</code></pre>',
        ],
      ]) {
        await writeFile(
          path.join(content, `${id}.md`),
          `---\nid: '${id}'\npubDate: '${date}'\n---\n\n${body}\n`
        );
      }
      await fixture.build({ comments: false });
      const doc = parse(await fixture.read('en/index.html'), {
        blockTextElements: { script: true, style: true },
      });
      const entries = doc.querySelectorAll('.fragment-signal-entry');
      assert.equal(entries.length, 3);
      const localImage = entries[0].querySelector('.fragment-signal-thumbnail');
      assert(localImage);
      assert.equal(localImage.getAttribute('alt'), '');
      assert.equal(localImage.getAttribute('loading'), 'lazy');
      assert(!localImage.getAttribute('src').includes('__ASTRO_IMAGE_'));
      assert(!localImage.getAttribute('src').includes('./preview-local.png'));
      const pathname = new URL(localImage.getAttribute('src'), 'https://example.com').pathname;
      await access(path.join(fixture.root, 'dist', decodeURIComponent(pathname)));
      assert.match(
        entries[1].querySelector('pre code').textContent,
        /const x = 1;\n {2}console\.log/
      );
      assert.equal(entries[1].querySelector('script'), null);
      assert.equal(
        entries[2].querySelector('img').getAttribute('src'),
        '/images/preview-public.png'
      );
      assert.equal(entries[2].querySelector('pre code').textContent, 'first\n  second');
      for (const entry of entries) assert.equal(entry.querySelector('a'), null);
    } finally {
      await fixture.close();
    }
  }
);
