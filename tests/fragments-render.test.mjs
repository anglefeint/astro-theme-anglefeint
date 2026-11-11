import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, readFile, mkdir, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { fragmentFixture, fragmentLocales } from './fragments-fixture.mjs';

test(
  'built fragments HTML covers nine locales, pagination, opt-in and independent comment mapping',
  { timeout: 240000 },
  async () => {
    const fixture = await fragmentFixture();
    try {
      const invalid = path.join(fixture.root, 'src/content/fragments/en/invalid.md');
      await writeFile(
        invalid,
        '---\nid: invalid/id\npubDate: invalid\n---\nUnrelated disabled content'
      );
      await fixture.build({ enabled: false });
      await rm(invalid);
      await assert.rejects(fixture.read('en/fragments/index.html'), { code: 'ENOENT' });
      assert.doesNotMatch(await fixture.read('en/index.html'), /href="\/en\/fragments\//);
      await fixture.build({ comments: false });
      let doc = parse(await fixture.read('en/fragments/index.html'));
      assert.equal(doc.querySelectorAll('[data-fragment-comments]').length, 0);
      assert.equal(doc.querySelector('[data-fragment-dialog]'), null);
      assert.equal(doc.querySelectorAll('[data-fragment-id]').length, 2);
      await rename(
        path.join(fixture.root, 'src/content/fragments/en/Third003.md'),
        path.join(fixture.root, 'src/content/fragments/en/renamed.md')
      );
      await fixture.build();
      for (const locale of fragmentLocales) {
        doc = parse(await fixture.read(`${locale}/fragments/index.html`));
        const og = doc.querySelector('meta[property="og:image"]').getAttribute('content');
        assert.match(og, /anglefeint-og/);
        assert.equal(
          doc.querySelector('meta[property="og:image:width"]').getAttribute('content'),
          '1200'
        );
        assert.equal(
          doc.querySelector('meta[property="og:image:height"]').getAttribute('content'),
          '630'
        );
        assert.equal(doc.querySelector('meta[name="twitter:image"]').getAttribute('content'), og);
        assert.deepEqual(
          doc
            .querySelectorAll('[data-fragment-id]')
            .map((node) => node.getAttribute('data-fragment-id')),
          ['Third003', 'Second02']
        );
        assert.deepEqual(
          doc
            .querySelectorAll('[data-fragment-comments]')
            .map((node) => node.getAttribute('data-fragment-term')),
          ['fragment/Third003', 'fragment/Second02']
        );
        assert.match(doc.querySelector('.fragment-body').textContent, /Third003 body/);
        assert.equal(doc.querySelectorAll('[data-fragment-dialog]').length, 1);
        assert.ok(
          doc.querySelector('[data-giscus-template] script[src="https://giscus.app/client.js"]')
        );
        doc.querySelector('[data-giscus-template]').remove();
        assert.equal(
          doc.querySelector('script[src="https://giscus.app/client.js"]'),
          null,
          'no eager external script'
        );
        const config = JSON.parse(doc.querySelector('[data-fragment-config]').textContent);
        assert.equal(
          config.lang,
          { zh: 'zh-CN', 'zh-hant': 'zh-TW', 'pt-br': 'pt' }[locale] ?? locale
        );
        assert.equal(config.repo, 'fixture/comments');
        assert.ok(doc.querySelector('.anglefeint-math .katex'));
        assert.ok(doc.querySelector('link[href*="math."]'));
        const links = doc
          .querySelectorAll('.frontier-dropdown a')
          .map((node) => node.getAttribute('href'));
        assert.ok(
          links.indexOf(`/${locale}/fragments/`) === links.indexOf(`/${locale}/decoder/`) + 1
        );
        const secondPage = parse(await fixture.read(`${locale}/fragments/2/index.html`));
        const pagination = secondPage.querySelector('[data-pagination-component="cyber"]');
        assert.ok(pagination, `${locale} uses the shared Cyber pagination`);
        assert.equal(
          pagination.querySelector('[aria-current="page"]').getAttribute('href'),
          `/${locale}/fragments/2/`
        );
        assert.equal(
          pagination.querySelector('.pg-nav').getAttribute('href'),
          `/${locale}/fragments/`
        );
        assert.equal(secondPage.querySelector('.fragment-pagination'), null);
        const indexHref = doc
          .querySelector('[data-fragment-index]')
          .getAttribute('data-fragment-index');
        assert.match(indexHref, new RegExp(`^/${locale}/fragments/index/[a-f0-9]{16}\\.json$`));
        assert.equal(
          secondPage.querySelector('[data-fragment-index]').getAttribute('data-fragment-index'),
          indexHref
        );
        assert.deepEqual(JSON.parse(await fixture.read(indexHref.slice(1))), {
          version: 1,
          totalPages: 2,
          pages: { Third003: 1, Second02: 1, First001: 2 },
        });
        assert.equal(
          secondPage.querySelector('[data-fragment-link]').getAttribute('href'),
          `/${locale}/fragments/#fragment-First001`
        );
        assert.equal(
          secondPage.querySelector('[data-fragment-copy]').getAttribute('aria-label'),
          JSON.parse(
            secondPage
              .querySelector('[data-fragment-link-labels]')
              .getAttribute('data-fragment-link-labels')
          ).copy
        );
        assert.equal(
          secondPage.querySelector('[data-fragment-id]').getAttribute('data-fragment-id'),
          'First001'
        );
        assert.equal(secondPage.querySelector('link[hreflang]'), null);
      }
      const previousIndex = parse(await fixture.read('en/fragments/index.html'))
        .querySelector('[data-fragment-index]')
        .getAttribute('data-fragment-index');
      assert(!(await fixture.read('sitemap-0.xml')).includes('/fragments/index/'));
      await fixture.build({
        site: { ogImage: 'https://images.example/default.jpg' },
        extra: { fragments: { enabled: true, pageSize: 1, comments: { enabled: false } } },
      });
      let repaged = parse(await fixture.read('en/fragments/3/index.html'));
      assert.equal(
        repaged.querySelector('meta[property="og:image"]').getAttribute('content'),
        'https://images.example/default.jpg'
      );
      assert.equal(
        parse(await fixture.read('en/fragments/index.html'))
          .querySelector('meta[property="og:image"]')
          .getAttribute('content'),
        'https://images.example/default.jpg'
      );
      assert.equal(
        repaged.querySelector('[data-fragment-link]').getAttribute('href'),
        '/en/fragments/#fragment-First001'
      );
      const smallerIndex = repaged
        .querySelector('[data-fragment-index]')
        .getAttribute('data-fragment-index');
      assert.notEqual(smallerIndex, previousIndex);
      assert.deepEqual(JSON.parse(await fixture.read(smallerIndex.slice(1))).pages, {
        Third003: 1,
        Second02: 2,
        First001: 3,
      });
      await mkdir(path.join(fixture.root, 'public'), { recursive: true });
      await writeFile(
        path.join(fixture.root, 'public/site-share.jpg'),
        await readFile('packages/theme/src/assets/theme/social/anglefeint-og.jpg')
      );
      await fixture.build({
        site: { ogImage: '/site-share.jpg' },
        extra: { fragments: { enabled: true, pageSize: 20, comments: { enabled: false } } },
      });
      repaged = parse(await fixture.read('en/fragments/index.html'));
      assert.match(
        repaged.querySelector('meta[property="og:image"]').getAttribute('content'),
        /\/site-share\.jpg\?v=[a-f0-9]{12}$/
      );
      assert.equal(repaged.querySelector('[data-pagination-component="cyber"]'), null);
      assert.equal(
        repaged
          .querySelector('[data-fragment-id="First001"] [data-fragment-link]')
          .getAttribute('href'),
        '/en/fragments/#fragment-First001'
      );
      await assert.rejects(fixture.read('en/fragments/2/index.html'), { code: 'ENOENT' });
      await writeFile(
        path.join(fixture.root, 'src/content/fragments/en/duplicate.md'),
        '---\nid: Third003\npubDate: 2026-01-01\n---\nDuplicate'
      );
      await assert.rejects(fixture.build(), /duplicate fragment id/);
      await rm(path.join(fixture.root, 'src/content/fragments'), { recursive: true, force: true });
      await fixture.build({ comments: false });
      assert.equal(
        parse(await fixture.read('en/fragments/index.html')).querySelectorAll('[data-fragment-id]')
          .length,
        0
      );
      await assert.rejects(
        fixture.build({ extra: { comments: { enabled: false } } }),
        /Fragments comments require theme.comments.repo/
      );
      await assert.rejects(
        fixture.build({ site: { ogImage: '/missing-site-share.jpg' }, comments: false }),
        /Image not found/
      );
    } finally {
      await fixture.close();
    }
  }
);
