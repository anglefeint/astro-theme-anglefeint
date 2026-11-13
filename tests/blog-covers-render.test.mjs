import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { parse } from 'node-html-parser';
import { fragmentFixture } from './fragments-fixture.mjs';
import { prepareCovers, coverFiles } from '../packages/theme/src/covers/prepare.mjs';

test(
  'real Blog/Tag/article output uses persistent covers and article math CSS follows rendered content',
  { timeout: 120000 },
  async () => {
    const fixture = await fragmentFixture();
    try {
      const directory = path.join(fixture.root, 'src/content/blog/en');
      await mkdir(directory, { recursive: true });
      await sharp({ create: { width: 1000, height: 500, channels: 3, background: '#186475' } })
        .png()
        .toFile(path.join(directory, 'cover.png'));
      for (let index = 0; index < 3; index++)
        await writeFile(
          path.join(directory, `post-${index}.${index === 2 ? 'mdx' : 'md'}`),
          `---\ntitle: Post ${index}\ndescription: Cover test\npubDate: '2026-11-${13 - index}'\nheroImage: './cover.png'\ntags: ['cover-test']\n---\nBody\n\n` +
            [
              'Cost \\$50. `$x$`\n\n```html\n<span class="katex">example</span>\n```',
              'Inline $E = mc^2$.',
              '<span data-mdx-result>{1 + 1}</span>\n\n$$\n\\frac{a}{b}\n$$',
            ][index]
        );
      await writeFile(
        path.join(directory, 'no-cover.md'),
        "---\ntitle: No cover\ndescription: No image\npubDate: '2026-11-01'\n---\nPlain text."
      );
      const configFile = path.join(fixture.root, 'astro.config.mjs');
      await writeFile(
        configFile,
        (await readFile(configFile, 'utf8')).replace(
          'defineConfig({',
          "defineConfig({ base: '/notes/',"
        )
      );
      const prepared = await prepareCovers({ root: fixture.root });
      const before = await readFile(
        path.join(fixture.root, 'src/assets/blog/covers/manifest.json')
      );
      await fixture.build({ enabled: false, comments: false });
      for (const file of ['en/blog/index.html', 'en/tags/cover-test/index.html']) {
        const html = parse(await fixture.read(file));
        const images = html.querySelectorAll('.blog-cards .img-wrapper img');
        assert.equal(images.length, 3);
        assert.equal(images.filter((image) => image.getAttribute('loading') === 'eager').length, 2);
        assert.equal(
          images.filter((image) => image.getAttribute('fetchpriority') === 'high').length,
          2
        );
        assert.equal(images[2].getAttribute('loading'), 'lazy');
        for (const image of images) {
          assert.match(image.getAttribute('src'), /^\/notes\/_blog-covers\//);
          assert.equal(image.getAttribute('srcset').split(', ').length, 5);
          assert.ok(!image.getAttribute('srcset').includes('/_astro/'));
        }
      }
      for (const file of coverFiles(prepared))
        assert.deepEqual(
          await readFile(path.join(fixture.root, 'dist/_blog-covers', file.file)),
          await readFile(path.join(prepared.generated, file.file))
        );
      for (let index = 0; index < 3; index++) {
        const article = parse(await fixture.read(`en/blog/post-${index}/index.html`));
        const hero = article.querySelector('.hero-base-image');
        assert.match(hero.getAttribute('src'), /^\/notes\/_blog-covers\//);
        assert.equal(hero.getAttribute('srcset').split(', ').length, 5);
        assert.match(hero.getAttribute('sizes'), /780px/);
        assert.equal(hero.getAttribute('width'), '1000');
        assert.equal(hero.getAttribute('height'), '500');
        assert.equal(hero.getAttribute('loading'), 'eager');
        assert.equal(hero.getAttribute('fetchpriority'), 'high');
        assert.equal(article.querySelector('.hero-canvas').hasAttribute('data-hero-src'), false);
        const mathCss = article.querySelector('link[rel="stylesheet"][href*="math."]');
        assert.equal(Boolean(mathCss), index !== 0);
        if (index !== 0) assert.ok(article.querySelector('.anglefeint-math .katex'));
        if (index === 2) assert.equal(article.querySelector('[data-mdx-result]').textContent, '2');
      }
      const plain = parse(await fixture.read('en/blog/no-cover/index.html'));
      assert.equal(plain.querySelector('.hero-base-image'), null);
      assert.equal(plain.querySelector('link[href*="math."]'), null);
      assert.deepEqual(
        await readFile(path.join(fixture.root, 'src/assets/blog/covers/manifest.json')),
        before
      );
    } finally {
      await fixture.close();
    }
  }
);
