import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { fragmentFixture, fragmentLocales } from './fragments-fixture.mjs';

test(
  'built nine-language About and paginated Fragments expose accurate Markdown and JSON-LD',
  { timeout: 120000 },
  async () => {
    const fixture = await fragmentFixture();
    try {
      await fixture.build({ comments: false });
      for (const locale of fragmentLocales) {
        const about = parse(await fixture.read(`${locale}/about/index.html`));
        assert(about.querySelector('link[type="text/markdown"]'));
        const schemas = about
          .querySelectorAll('script[type="application/ld+json"]')
          .map((node) => JSON.parse(node.textContent));
        assert(schemas.some((schema) => schema['@type'] === 'AboutPage' && schema.inLanguage));
        assert(schemas.some((schema) => schema['@type'] === 'WebSite' && schema.inLanguage));
        const aboutMD = await fixture.read(`${locale}/about/index.md`);
        assert(aboutMD.includes('language: "' + locale + '"'));
        assert(!aboutMD.includes('modalContent') && !aboutMD.includes('hacker-runtime-config'));
        const feed = await fixture.read(`${locale}/fragments/index.md`);
        for (const id of ['First001', 'Second02', 'Third003']) assert(feed.includes(`## ${id}`));
        assert.equal(feed.match(/## First001/g).length, 1);
        const page2 = parse(await fixture.read(`${locale}/fragments/2/index.html`));
        assert(
          page2
            .querySelector('link[type="text/markdown"]')
            .getAttribute('href')
            .endsWith(`/${locale}/fragments/index.md`)
        );
        const index = await fixture.read(`${locale}/llms.txt`);
        assert(index.includes('## Fragments') && index.includes('## About'));
      }
    } finally {
      await fixture.close();
    }
  }
);
