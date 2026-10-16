import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import { transform } from 'esbuild';
import { deepMerge } from '../packages/theme/src/utils/merge.ts';

test('terminal author text uses local configuration, then English configuration, then the theme default', async () => {
  const source = await readFile(
    new URL('../scripts/adapter-templates/src/i18n/messages.ts', import.meta.url),
    'utf8'
  );
  const { code } = await transform(source, { loader: 'ts', format: 'esm' });
  const executable = code
    .replace(/^import .*;\r?\n/gm, '')
    .replace(/export \{[\s\S]*?\};?\s*$/, '');
  const locales = {
    en: { messages: { home: { transmission: 'Shared author message' } } },
    zh: { messages: { home: { transmission: '本地文字' } } },
    ja: {},
    custom: {},
    de: { messages: { home: { transmission: 'Unrelated fallback text' } } },
  };
  const builtin = {
    en: { home: { transmission: 'Knock, knock.' }, nav: { home: 'Home' } },
    zh: { home: { transmission: 'Old built-in text' }, nav: { home: '首页' } },
    ja: { home: { transmission: 'Old built-in text' }, nav: { home: 'ホーム' } },
  };
  const getMessages = new Function(
    'I18N',
    'getLocaleConfig',
    'getLocaleResolutionChain',
    'DEFAULT_MESSAGES',
    'deepMerge',
    executable + '\nreturn getMessages;'
  )(
    { locales },
    (locale) => locales[locale] ?? locales.de,
    (locale) => (locale === 'en' ? ['en'] : [locale, 'de', 'en']),
    builtin,
    deepMerge
  );
  assert.equal(getMessages('zh').home.transmission, '本地文字');
  assert.equal(getMessages('ja').home.transmission, 'Shared author message');
  assert.equal(getMessages('custom').home.transmission, 'Shared author message');
  assert.equal(getMessages('en').home.transmission, 'Shared author message');
  assert.equal(
    getMessages('ja').nav.home,
    'ホーム',
    'UI translations keep their original resolution'
  );
  locales.zh.messages.home.transmission = '';
  assert.equal(getMessages('zh').home.transmission, '', 'explicit empty author text is preserved');
  locales.en.messages.home.transmission = '';
  assert.equal(getMessages('ja').home.transmission, '', 'an empty English override is also shared');
  delete locales.en.messages;
  assert.equal(getMessages('ja').home.transmission, 'Knock, knock.');
  assert.equal(getMessages('custom').home.transmission, 'Knock, knock.');
  delete locales.en;
  // A non-English default locale must not masquerade as an English override.
  assert.equal(getMessages('ja').home.transmission, 'Knock, knock.');
});
