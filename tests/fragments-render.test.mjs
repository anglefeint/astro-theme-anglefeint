import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, rename, rm } from 'node:fs/promises';
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
        path.join(fixture.root, 'src/content/fragments/en/third.md'),
        path.join(fixture.root, 'src/content/fragments/en/renamed.md')
      );
      await fixture.build();
      for (const locale of fragmentLocales) {
        doc = parse(await fixture.read(`${locale}/fragments/index.html`));
        assert.deepEqual(
          doc
            .querySelectorAll('[data-fragment-id]')
            .map((node) => node.getAttribute('data-fragment-id')),
          ['third', 'second']
        );
        assert.deepEqual(
          doc
            .querySelectorAll('[data-fragment-comments]')
            .map((node) => node.getAttribute('data-fragment-term')),
          ['fragment/third', 'fragment/second']
        );
        assert.match(doc.querySelector('.fragment-body').textContent, /third body/);
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
        assert.equal(
          secondPage.querySelector('[data-fragment-id]').getAttribute('data-fragment-id'),
          'first'
        );
        assert.equal(secondPage.querySelector('link[hreflang]'), null);
      }
      await writeFile(
        path.join(fixture.root, 'src/content/fragments/en/duplicate.md'),
        '---\nid: third\npubDate: 2026-01-01\n---\nDuplicate'
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
    } finally {
      await fixture.close();
    }
  }
);
