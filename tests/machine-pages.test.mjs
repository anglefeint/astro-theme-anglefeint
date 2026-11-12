import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, access } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { extractPage } from '../packages/theme/src/machine/content.mjs';
import { generateMachineReadable } from '../packages/theme/src/machine/generate.mjs';

const locales = ['en', 'zh', 'zh-hant', 'ja', 'ko', 'es', 'pt-br', 'de', 'ru'];
function html(locale, route, body, { robots = 'index', extra = '' } = {}) {
  return `<html lang="${locale}"><head><meta name="robots" content="${robots}"><meta name="description" content="Public description"><link rel="canonical" href="https://example.com/project/${locale}/${route}/"></head><body><nav>CHROME</nav>${body}${extra}</body></html>`;
}
function about(locale, options) {
  return html(
    locale,
    'about',
    `<article data-machine-page="about" data-machine-locale="${locale}"><h1>About ${locale}</h1><div data-machine-body><h2>Who</h2><p>Public bio ${locale}</p><a href="../contact/">Contact</a><span aria-hidden="true">CURSOR</span></div><button>Regenerate</button></article><button data-modal="ai">AI</button>`,
    {
      ...options,
      extra: `<script id="hacker-runtime-config" type="application/json">${JSON.stringify({ modalContent: { ai: { title: 'Public AI', body: '<pre>Public popup text</pre>' }, help: { body: 'TOOL PANEL' } }, terminal: { entries: ['INTERNAL PATH'] }, effects: { secret: 'PRIVATE CONFIG' } })}</script>`,
    }
  );
}
function fragment(locale, id, date, content = 'Note') {
  return `<article data-fragment-id="${id}"><a href="/project/${locale}/fragments/#${id}"><time datetime="${date}">LOCAL DATE</time></a><div class="fragment-body"><p>${locale} ${content}</p><a href="/source/">Source</a></div><button>Comments</button></article>`;
}
function feed(locale, number, entries, options) {
  return html(
    locale,
    `fragments${number === 1 ? '' : `/${number}`}`,
    `<section data-machine-page="fragments" data-machine-locale="${locale}" data-fragment-root="/project/${locale}/fragments/"><h1 aria-label="Fragments ${locale}"><span>Frag</span><span>ments</span></h1>${entries}<nav>Pagination</nav><dialog>PRIVATE COMMENT</dialog></section>`,
    options
  );
}

test('About exports public bio/contact and the reachable text popup, without runtime/tool config', () => {
  const result = extractPage(about('zh'), 'https://example.com');
  assert.equal(result.kind, 'about');
  for (const value of [
    'Public bio zh',
    'Public popup text',
    'Public AI',
    'https://example.com/project/zh/contact/',
  ])
    assert(result.markdown.includes(value));
  for (const value of [
    'INTERNAL PATH',
    'PRIVATE CONFIG',
    'TOOL PANEL',
    'CHROME',
    'CURSOR',
    'Regenerate',
  ])
    assert(!result.markdown.includes(value));
  const unreachable = about('en').replace('data-modal="ai"', 'data-tool="ai"');
  assert(!extractPage(unreachable, 'https://example.com').markdown.includes('Public popup text'));
  assert.equal(extractPage(about('en', { robots: 'noindex' }), 'https://example.com'), null);
  assert.equal(
    extractPage(
      about('en').replace('https://example.com/project', 'https://other.example/project'),
      'https://example.com'
    ),
    null
  );
});

test('nine languages merge paginated Fragments once, link to stable IDs and share export cleanup', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-pages-'));
  const dir = path.join(root, 'dist');
  const options = {
    dir,
    manifestPath: path.join(root, 'manifest.json'),
    site: 'https://example.com',
    base: '/project/',
    title: 'Site',
    aiReadableContent: { notes: 'Public site notes' },
  };
  const put = async (file, text) => {
    await mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await writeFile(path.join(dir, file), text);
  };
  const read = (file) => readFile(path.join(dir, file), 'utf8');
  try {
    for (const locale of locales) {
      await put(`${locale}/about/index.html`, about(locale));
      await put(
        `${locale}/fragments/index.html`,
        feed(locale, 1, fragment(locale, 'Second02', '2026-11-12T00:00:00Z'))
      );
      await put(
        `${locale}/fragments/2/index.html`,
        feed(locale, 2, fragment(locale, 'First001', '2026-11-11T00:00:00Z'))
      );
    }
    const result = await generateMachineReadable(options);
    assert.deepEqual(result, { articles: 0, fragments: 18, about: 9, locales: 9, files: 37 });
    for (const locale of locales) {
      const md = await read(`${locale}/fragments/index.md`);
      assert(md.indexOf('## Second02') < md.indexOf('## First001'));
      assert(md.includes(`https://example.com/project/${locale}/fragments/#First001`));
      assert(md.includes('Published: 2026-11-11T00:00:00Z'));
      assert(md.includes('https://example.com/source/'));
      for (const excluded of ['Comments', 'Pagination', 'PRIVATE COMMENT', 'LOCAL DATE'])
        assert(!md.includes(excluded));
      const index = await read(`${locale}/llms.txt`);
      assert(index.includes('## Fragments') && index.includes('## About'));
      assert(index.includes(`/project/${locale}/about/index.md`));
      assert(!index.includes('## Articles'));
      const full = await read(`${locale}/llms-full.txt`);
      assert.equal(full.match(/Public site notes/g).length, 1);
      assert(full.includes('Public bio') && full.includes('## First001'));
      for (const suffix of ['', '/2'])
        assert(
          (await read(`${locale}/fragments${suffix}/index.html`)).includes(
            `href="https://example.com/project/${locale}/fragments/index.md"`
          )
        );
      assert.equal(
        (await read(`${locale}/about/index.html`)).match(/data-anglefeint-machine=/g).length,
        2
      );
    }
    // Repartitioning leaves the aggregate URL and ID links unchanged.
    await put(
      'en/fragments/index.html',
      feed(
        'en',
        1,
        fragment('en', 'Second02', '2026-11-12T00:00:00Z') +
          fragment('en', 'First001', '2026-11-11T00:00:00Z')
      )
    );
    await rm(path.join(dir, 'en/fragments/2'), { recursive: true });
    await generateMachineReadable(options);
    assert.equal((await read('en/fragments/index.md')).match(/## First001/g).length, 1);
    // Deleted note disappears after rebuild; noindex pages lose owned companions/links.
    await put(
      'en/fragments/index.html',
      feed('en', 1, fragment('en', 'Second02', '2026-11-12T00:00:00Z'))
    );
    await put('en/about/index.html', about('en', { robots: 'noindex' }));
    for (const locale of locales.slice(1)) await rm(path.join(dir, locale), { recursive: true });
    await generateMachineReadable(options);
    assert(!(await read('en/fragments/index.md')).includes('First001'));
    assert(!(await read('en/about/index.html')).includes('data-anglefeint-machine='));
    await assert.rejects(access(path.join(dir, 'en/about/index.md')));
    await assert.rejects(access(path.join(dir, 'zh/llms.txt')));
    assert(!(await read('llms.txt')).includes('/zh/'));
    await rm(path.join(dir, 'en/fragments'), { recursive: true });
    assert.deepEqual(await generateMachineReadable(options), {
      articles: 0,
      fragments: 0,
      about: 0,
      locales: 0,
      files: 1,
    });
    await assert.rejects(access(path.join(dir, 'en/llms-full.txt')));
    assert((await read('llms.txt')).includes('No public content'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('pagination cannot export a missing/noindex root, duplicate IDs fail, and custom files survive', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-page-policy-'));
  const dir = path.join(root, 'dist');
  const options = {
    dir,
    site: 'https://example.com',
    manifestPath: path.join(root, 'manifest.json'),
  };
  const put = async (file, text) => {
    await mkdir(path.dirname(path.join(dir, file)), { recursive: true });
    await writeFile(path.join(dir, file), text);
  };
  try {
    await put(
      'en/fragments/index.html',
      feed('en', 1, fragment('en', 'First001', '2026-11-11'), { robots: 'noindex' })
    );
    await put('en/fragments/2/index.html', feed('en', 2, fragment('en', 'Second02', '2026-11-12')));
    assert.equal((await generateMachineReadable(options)).fragments, 0);
    await put('en/fragments/index.html', feed('en', 1, fragment('en', 'Second02', '2026-11-12')));
    await assert.rejects(generateMachineReadable(options), /Duplicate/);
    await rm(path.join(dir, 'en/fragments'), { recursive: true });
    await put('en/about/index.html', about('en'));
    await put('en/about/index.md', 'USER FILE');
    await assert.rejects(generateMachineReadable(options), /conflicts/);
    assert.equal(await readFile(path.join(dir, 'en/about/index.md'), 'utf8'), 'USER FILE');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
