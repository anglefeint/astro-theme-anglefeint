import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { URL } from 'node:url';
import { fromMarkdown } from 'mdast-util-from-markdown';
import ts from 'typescript';
import { STARTER_CONTENT_LOCALES } from '../scripts/starter-manifest.mjs';

const read = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');
function blocks(markdown) {
  const output = [];
  function visit(node) {
    if (node.type === 'code') output.push(node);
    for (const child of node.children ?? []) visit(child);
  }
  visit(fromMarkdown(markdown));
  return output;
}
const readmes = {
  en: 'README.md',
  zh: 'README.zh-CN.md',
  'zh-hant': 'README.zh-Hant.md',
  'pt-br': 'README.pt-BR.md',
};

test('README and installation tutorials use one default wizard installation, with no duplicate install', async () => {
  for (const locale of STARTER_CONTENT_LOCALES) {
    for (const file of [
      readmes[locale] ?? `README.${locale}.md`,
      `src/content/blog/${locale}/starter-guide-1-configure-your-site.md`,
    ]) {
      const code = blocks(await read(file)).find((block) =>
        block.value.includes('npm create astro@latest')
      )?.value;
      assert(code, file);
      assert(!code.includes('--no-install'), file);
      assert(!/^npm install\s*$/m.test(code), file);
      assert.match(
        code,
        /npm create astro@latest -- my-blog --template anglefeint\/astro-theme-anglefeint#starter --no-ai/,
        file
      );
      assert.match(code, /cd my-blog\n(?:\s*\n)?npm run dev/, file);
    }
  }
});

test('generic introductory examples are localized without imposing a ban on intentional Chinese examples', async () => {
  for (const locale of STARTER_CONTENT_LOCALES.filter((locale) => locale !== 'zh')) {
    const base = `src/content/blog/${locale}/`;
    const configure = blocks(await read(base + 'starter-guide-1-configure-your-site.md')).find(
      (block) => /^site:\s*\{/m.test(block.value)
    );
    assert(configure, locale);
    assert.doesNotMatch(
      configure.value,
      /小林的博客|记录开发、阅读和生活。|保持好奇，持续记录。/,
      locale
    );
    const writing = blocks(await read(base + 'starter-guide-2-languages-and-routing.md')).find(
      (block) => /^---\r?\n/.test(block.value)
    );
    assert(writing, locale);
    assert.doesNotMatch(
      writing.value,
      /记录我用 Anglefeint 搭建博客的过程。|这是我的第一篇文章。我准备在这里记录学习过程和遇到的问题。/,
      locale
    );
    // Generic UI examples are localized too, even when the old source used zh.
    // Defaults tables and the language tutorial are deliberately not scanned.
    for (const file of [
      'config-home.md',
      'config-terminal.md',
      'config-music.md',
      'starter-guide-3-comments-about-and-theme-toggles.md',
    ]) {
      for (const block of blocks(await read(base + file))) {
        assert.doesNotMatch(
          block.value,
          /我的数字花园|输入 help 查看命令。|我是小林，喜欢开发与写作。|正在加载歌曲/,
          locale + '/' + file
        );
      }
    }
    if (locale !== 'zh-hant') {
      for (const file of ['config-article.md', 'config-site-chrome.md', 'config-languages.md']) {
        assert.doesNotMatch(
          await read(base + file),
          /我的笔记|作者填写的模型名|小林|我的博客/,
          `${locale}/${file}: untranslated custom example in prose or a table`
        );
      }
    }
    const languageGuide = await read(base + 'starter-guide-languages.md');
    assert.match(
      languageGuide,
      /zh:/,
      'explicit Chinese configuration remains part of the language tutorial'
    );
    // Actual Chinese built-in defaults and deliberately demonstrated locales.zh
    // content are valid. Regression guards target generic untranslated examples.
  }
});

test('reference placeholders and localized TypeScript examples remain usable', async () => {
  for (const locale of STARTER_CONTENT_LOCALES) {
    const base = `src/content/blog/${locale}/`;
    for (const name of (await readdir(new URL('../' + base, import.meta.url))).filter((name) =>
      /^(starter-guide|config-).*\.md$/.test(name)
    )) {
      const text = await read(base + name);
      if (locale !== 'zh')
        assert.doesNotMatch(text, /<(?:语言|语言代码|代码)>/, `${locale}/${name}`);
      for (const block of blocks(text).filter((block) => block.lang === 'ts')) {
        // Tutorials contain both complete programs and fields to merge into
        // defineThemeConfig. Accept either form, without executing examples.
        const parsed = [block.value, `const config = {\n${block.value}\n};`].map((value) =>
          ts.createSourceFile('example.ts', value, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
        );
        assert.ok(
          parsed.some((file) => file.parseDiagnostics.length === 0),
          `${locale}/${name}:${block.position.start.line}: localized text broke syntax`
        );
      }
    }
  }
});
