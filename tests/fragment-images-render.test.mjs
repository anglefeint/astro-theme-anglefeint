import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { parse } from 'node-html-parser';
import { fragmentFixture } from './fragments-fixture.mjs';
import { prepareCovers, coverFiles } from '../packages/theme/src/covers/prepare.mjs';

test(
  'real fragment feed and homepage share persistent public/local images, priorities and per-page math',
  { timeout: 120000 },
  async () => {
    const f = await fragmentFixture();
    try {
      const directory = path.join(f.root, 'src/content/fragments/en');
      const publicDir = path.join(f.root, 'public/images/fragments');
      await mkdir(publicDir, { recursive: true });
      const bytes = await sharp({
        create: { width: 3412, height: 1920, channels: 3, background: '#164f31' },
      })
        .png()
        .toBuffer();
      await writeFile(path.join(publicDir, 'carrier.png'), bytes);
      await writeFile(path.join(directory, 'local.png'), bytes);
      for (const [id, date, body] of [
        [
          'Third003',
          '2026-11-12',
          '![Carrier](/images/fragments/carrier.png)\n\n![Local][pic]\n\n[pic]: ./local.png',
        ],
        [
          'Second02',
          '2026-11-11',
          '<img src="/images/fragments/carrier.png" alt="Raw" width="320">\n\n`$not math$`',
        ],
        ['First001', '2026-11-10', '$E = mc^2$\n\n![](/images/fragments/carrier.png)'],
      ])
        await writeFile(
          path.join(directory, `${id}.md`),
          `---\nid: ${id}\npubDate: '${date}'\n---\n${body}\n`
        );
      const configFile = path.join(f.root, 'astro.config.mjs');
      await writeFile(
        configFile,
        (await readFile(configFile, 'utf8')).replace(
          'defineConfig({',
          "defineConfig({ base: '/notes/',"
        )
      );
      await assert.rejects(f.build({ comments: false }), /prepare-covers locally/);
      const prepared = await prepareCovers({ root: f.root });
      const manifestFile = path.join(f.root, 'src/assets/blog/covers/manifest.json');
      const before = await readFile(manifestFile);
      await f.build({ comments: false });
      const page1 = parse(await f.read('en/fragments/index.html'));
      const page2 = parse(await f.read('en/fragments/2/index.html'));
      const images = page1.querySelectorAll('.fragment-body img');
      assert.equal(images.length, 3);
      assert.equal(images[0].getAttribute('loading'), 'eager');
      assert.equal(images[0].getAttribute('fetchpriority'), 'high');
      for (const img of images.slice(1)) assert.equal(img.getAttribute('loading'), 'lazy');
      assert.equal(images[2].getAttribute('width'), '320');
      assert.equal(images[2].getAttribute('height'), '180');
      for (const image of images) {
        assert.match(image.getAttribute('src'), /^\/notes\/_blog-covers\//);
        assert.equal(image.getAttribute('srcset').split(', ').length, 5);
        assert.equal(image.hasAttribute('data-fragment-image'), false);
      }
      assert.equal(page1.querySelector('link[href*="math."]'), null);
      assert.ok(page2.querySelector('link[href*="math."]'));
      assert.ok(page2.querySelector('.anglefeint-math .katex'));
      assert.equal(page2.querySelector('.fragment-body img').getAttribute('loading'), 'eager');
      const home = parse(await f.read('en/index.html'));
      const preview = home.querySelector('.fragment-signal-thumbnail');
      assert.equal(preview.getAttribute('src'), images[0].getAttribute('src'));
      assert.equal(preview.getAttribute('srcset'), images[0].getAttribute('srcset'));
      assert.equal(preview.getAttribute('width'), '3412');
      assert.equal(preview.getAttribute('height'), '1920');
      assert.equal(preview.getAttribute('loading'), 'lazy');
      for (const variant of coverFiles(prepared))
        assert.deepEqual(
          await readFile(path.join(f.root, 'dist/_blog-covers', variant.file)),
          await readFile(path.join(prepared.generated, variant.file))
        );
      assert.deepEqual(await readFile(manifestFile), before);
    } finally {
      await f.close();
    }
  }
);
