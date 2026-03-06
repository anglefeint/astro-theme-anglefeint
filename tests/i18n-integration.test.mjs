import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const repoRoot = process.cwd();
const syncAdapters = path.join(repoRoot, 'scripts/sync-adapters.mjs');
const cliNewPost = path.join(repoRoot, 'packages/theme/src/cli-new-post.mjs');

async function runNode(args, cwd) {
  await execFileAsync('node', args, { cwd });
}

test('single-source i18n config drives enabled locales, routing mode, and scaffold output', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-i18n-integration-'));

  try {
    await mkdir(path.join(tempRoot, 'src/content/blog'), { recursive: true });
    await mkdir(path.join(tempRoot, 'src/assets/blog/default-covers'), { recursive: true });
    await cp(path.join(repoRoot, 'scripts'), path.join(tempRoot, 'scripts'), { recursive: true });
    await symlink(path.join(repoRoot, 'node_modules'), path.join(tempRoot, 'node_modules'), 'dir');
    await writeFile(
      path.join(tempRoot, 'src/assets/blog/default-covers/ai-01.webp'),
      'cover',
      'utf8'
    );

    await writeFile(
      path.join(tempRoot, 'src/site.config.ts'),
      `import { deepMerge } from '@anglefeint/astro-theme/utils/merge';

export const DEFAULT_ABOUT_CONFIG = {
  metaLine: '$ profile booted | mode: builder',
  sections: { who: 'Who', what: 'What', ethos: ['Clarity'], now: 'Now', contactLead: 'Contact', signature: '> Signature' },
  contact: { email: 'you@example.com', githubUrl: 'https://github.com/yourname', githubLabel: 'GitHub' },
  sidebar: { dlData: 'DL Data', ai: 'AI', decryptor: 'Decryptor', help: 'Help', allScripts: 'All Scripts' },
  scriptsPath: '/root/bash/scripts',
  labels: {
    modalOutput: 'Output', modalClose: 'Close', responseOutput: 'Output', contactEmailLead: 'Reach me via',
    contactConnectLead: 'or connect on', backToTop: 'Back to top', quickAccess: 'Quick access', contactEmailLabel: 'email'
  },
  modals: {
    dlData: { title: 'Downloading...', subtitle: 'Critical Data' },
    ai: { title: 'AI', lines: ['online'] },
    decryptor: {
      title: 'Password Decryptor', header: 'Calculating Hashes', keysLabel: 'keys tested',
      currentPassphraseLabel: 'Current passphrase:', masterKeyLabel: 'Master key', transientKeyLabel: 'Transient key'
    },
    help: { title: 'Help', statsLabel: 'Stats', typedPrefix: 'You typed:', typedSuffix: 'characters' },
    allScripts: { title: '/root/bash/scripts' }
  },
  effects: { backgroundLines: ['~ $ ls'], scrollToasts: { p30: 'context parsed', p60: 'inference stable', p90: 'output finalized' } }
};
function defineThemeConfig(config) { return deepMerge({
  i18n: {
    defaultLocale: 'en',
    locales: {},
    routing: { defaultLocalePrefix: 'never' },
    validation: {}
  }
}, config); }
export function normalizeI18nConfig(config) {
  const localeEntries = { ...config.locales };
  const defaultLocale = config.defaultLocale || 'en';
  if (!localeEntries[defaultLocale]) localeEntries[defaultLocale] = { meta: { label: defaultLocale } };
  const supportedLocales = new Set(Object.keys(localeEntries));
  const normalizedLocales = {};
  for (const [code, localeConfig] of Object.entries(localeEntries)) {
    const fallbackCandidates =
      localeConfig.meta.fallback && localeConfig.meta.fallback.length > 0
        ? localeConfig.meta.fallback
        : code === defaultLocale
          ? []
          : [defaultLocale];
    const seen = new Set();
    const fallback = [];
    for (const candidate of fallbackCandidates) {
      if (!candidate || candidate === code || seen.has(candidate) || !supportedLocales.has(candidate)) continue;
      seen.add(candidate);
      fallback.push(candidate);
    }
    if (code !== defaultLocale && !seen.has(defaultLocale) && supportedLocales.has(defaultLocale)) fallback.push(defaultLocale);
    normalizedLocales[code] = {
      code,
      meta: {
        label: localeConfig.meta.label || code,
        hreflang: localeConfig.meta.hreflang || code,
        ogLocale: localeConfig.meta.ogLocale,
        dir: localeConfig.meta.dir || 'ltr',
        enabled: code === defaultLocale ? true : localeConfig.meta.enabled !== false,
        fallback
      },
      site: { hero: localeConfig.site?.hero },
      about: localeConfig.about,
      messages: localeConfig.messages
    };
  }
  return {
    defaultLocale,
    locales: normalizedLocales,
    routing: { defaultLocalePrefix: config.routing.defaultLocalePrefix || 'never' },
    validation: config.validation || {}
  };
}
export const THEME_CONFIG = defineThemeConfig({
  site: { title: 'Integration Theme', description: 'Integration test site.', url: 'https://example.com', author: 'Tester', tagline: 'Test tagline' },
  theme: {
    blogPageSize: 9, homeLatestCount: 3, enableAboutPage: true,
    pagination: {
      windowSize: 7, showJumpThreshold: 12, jump: { enabled: true, enterToGo: true },
      style: { enabled: true, mode: 'random', variants: 9, fixedVariant: 1 }
    },
    effects: { enableRedQueen: false },
    comments: {
      enabled: false, repo: '', repoId: '', category: '', categoryId: '', mapping: 'pathname',
      term: '', number: '', strict: '0', reactionsEnabled: '1', emitMetadata: '0',
      inputPosition: 'bottom', theme: 'dark', lang: 'en', loading: 'lazy', crossorigin: 'anonymous'
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        meta: { label: 'English', hreflang: 'en', ogLocale: 'en_US' },
        site: { hero: 'English hero' },
        about: DEFAULT_ABOUT_CONFIG
      },
      'pt-BR': {
        meta: { label: 'Português (Brasil)', hreflang: 'pt-BR', ogLocale: 'pt_BR', fallback: ['en'] },
        site: { hero: 'Ola mundo em portugues' },
        about: { metaLine: '$ perfil inicializado | modo: builder' },
        messages: { nav: { home: 'Inicio', blog: 'Blog', about: 'Sobre' }, langLabel: 'Idioma' }
      },
      ja: {
        meta: { label: '日本語', hreflang: 'ja', ogLocale: 'ja_JP', fallback: ['en'], enabled: false },
        site: { hero: '無効化されたロケール' },
        about: { metaLine: '$ disabled locale' }
      }
    },
    routing: { defaultLocalePrefix: 'always' },
    validation: {
      requireCompleteMessages: false, requireCompleteAbout: false,
      requireCompleteHero: false, requireOgLocale: false
    }
  },
  social: { links: [] }
});
`,
      'utf8'
    );
    await writeFile(
      path.join(tempRoot, 'src/site.config.runtime.ts'),
      `export { normalizeI18nConfig } from './site.config.ts';
`,
      'utf8'
    );
    await writeFile(
      path.join(tempRoot, 'src/site.config.defaults.ts'),
      `export { DEFAULT_ABOUT_CONFIG } from './site.config.ts';
`,
      'utf8'
    );
    await writeFile(
      path.join(tempRoot, 'src/site.config.schema.ts'),
      `export type AboutConfig = typeof import('./site.config.ts').DEFAULT_ABOUT_CONFIG;
`,
      'utf8'
    );
    await symlink(
      path.join(tempRoot, 'src/site.config.ts'),
      path.join(tempRoot, 'src/site.config')
    );
    await symlink(
      path.join(tempRoot, 'src/site.config.runtime.ts'),
      path.join(tempRoot, 'src/site.config.runtime')
    );
    await symlink(
      path.join(tempRoot, 'src/site.config.defaults.ts'),
      path.join(tempRoot, 'src/site.config.defaults')
    );
    await symlink(
      path.join(tempRoot, 'src/site.config.schema.ts'),
      path.join(tempRoot, 'src/site.config.schema')
    );

    await runNode([syncAdapters], tempRoot);
    await symlink(
      path.join(tempRoot, 'src/i18n/runtime.ts'),
      path.join(tempRoot, 'src/i18n/runtime')
    );
    await symlink(
      path.join(tempRoot, 'src/i18n/config.ts'),
      path.join(tempRoot, 'src/i18n/config')
    );
    await symlink(
      path.join(tempRoot, 'src/config/site.ts'),
      path.join(tempRoot, 'src/config/site')
    );
    await symlink(
      path.join(tempRoot, 'src/config/about.ts'),
      path.join(tempRoot, 'src/config/about')
    );
    await writeFile(
      path.join(tempRoot, 'src/i18n/messages.ts'),
      `import { deepMerge } from '@anglefeint/astro-theme/utils/merge';
import { getLocaleConfig, getLocaleFallbackChain, type Locale } from './runtime';

const DEFAULT_MESSAGES = {
  en: {
    siteTitle: 'Integration Theme',
    siteDescription: 'Integration test site.',
    langLabel: 'Language',
    nav: { home: 'Home', blog: 'Blog', about: 'About', status: 'system: online', statusAria: 'System status' },
    home: { hero: 'English hero', latest: 'Latest Posts', viewAll: 'View all posts', noPosts: 'No posts available in this language yet.' },
    about: { title: 'About', description: 'About description', who: 'Who', what: 'What', ethos: 'Ethos', now: 'Now', contact: 'Contact', regenerate: 'Regenerate' },
    blog: {
      title: 'Blog', pageTitle: 'Blog - Page', archiveDescription: 'Archive', pageDescription: 'Archive page',
      previous: 'Previous', next: 'Next', jumpTo: 'Jump to page', jumpGo: 'Go', jumpInputLabel: 'Page number',
      backToBlog: 'Back to blog', backToTop: 'Back to top', related: 'Related', comments: 'Comments',
      responseOutput: 'Output', rqBadge: 'monitor feed', rqReplayAria: 'Replay monitor feed',
      metaPublished: 'published', metaUpdated: 'updated', metaReadMinutes: 'min read',
      systemStatusAria: 'Model status', systemModelLabel: 'model', systemModeLabel: 'mode', systemStateLabel: 'state',
      promptContextLabel: 'Context', latencyLabel: 'latency est', confidenceLabel: 'confidence',
      statsWords: 'words', statsTokens: 'tokens', heroMonitor: 'neural monitor', heroSignalSync: 'signal sync active',
      heroModelOnline: 'model online', regenerate: 'Regenerate', relatedAria: 'Related posts',
      backToBlogAria: 'Back to blog', paginationAria: 'Pagination',
      toastP10: 'context parsed 10%', toastP30: 'context parsed 30%', toastP60: 'inference stable 60%', toastDone: 'output finalized'
    }
  }
};

export function getMessages(locale: Locale) {
  const fallbackChain = [...getLocaleFallbackChain(locale)].reverse();
  let resolved = deepMerge(DEFAULT_MESSAGES.en, {});

  for (const code of fallbackChain) {
    const overrideMessages = getLocaleConfig(code).messages;
    if (overrideMessages) {
      resolved = deepMerge(resolved, overrideMessages);
    }
  }

  return resolved;
}
`,
      'utf8'
    );
    await writeFile(
      path.join(tempRoot, 'src/config/site.ts'),
      `import { THEME_CONFIG } from '../site.config';
import { getLocaleConfig, getLocaleFallbackChain, SUPPORTED_LOCALES, type Locale } from '../i18n/config';

export const SITE_TITLE = THEME_CONFIG.site.title;
export const SITE_DESCRIPTION = THEME_CONFIG.site.description;
export const SITE_URL = THEME_CONFIG.site.url;
export const SITE_AUTHOR = THEME_CONFIG.site.author;
export const SITE_TAGLINE = THEME_CONFIG.site.tagline;

export function getSiteHero(locale: Locale): string | undefined {
  for (const code of getLocaleFallbackChain(locale)) {
    const hero = getLocaleConfig(code).site.hero;
    if (hero) return hero;
  }
  return undefined;
}

export const SITE_HERO_BY_LOCALE: Record<Locale, string> = Object.fromEntries(
  SUPPORTED_LOCALES.map((locale) => [locale, getSiteHero(locale) ?? ''])
) as Record<Locale, string>;
`,
      'utf8'
    );
    await runNode([cliNewPost, 'integration-post'], tempRoot);

    const runtime = await import(pathToFileURL(path.join(tempRoot, 'src/i18n/runtime.ts')).href);
    const messages = await import(pathToFileURL(path.join(tempRoot, 'src/i18n/messages.ts')).href);
    const site = await import(pathToFileURL(path.join(tempRoot, 'src/config/site.ts')).href);
    const about = await import(pathToFileURL(path.join(tempRoot, 'src/config/about.ts')).href);

    assert.deepEqual(runtime.SUPPORTED_LOCALES, ['en', 'pt-BR']);
    assert.equal(runtime.DEFAULT_LOCALE, 'en');
    assert.equal(runtime.DEFAULT_LOCALE_PREFIX_MODE, 'always');
    assert.equal(runtime.getLocaleLabel('pt-BR'), 'Português (Brasil)');
    assert.equal(runtime.getLocaleHreflang('pt-BR'), 'pt-BR');
    assert.equal(runtime.getLocaleOgLocale('pt-BR'), 'pt_BR');
    assert.equal(runtime.getDefaultLocaleHomePath(), '/en/');
    assert.equal(runtime.shouldRedirectRootToDefaultLocale(), true);
    assert.equal(runtime.shouldRedirectLocalizedDefaultLocaleHome('en'), false);
    assert.equal(runtime.shouldRedirectLocalizedDefaultLocaleHome('pt-BR'), false);
    assert.equal(runtime.alternatePathForLocale('en', '/'), '/en/');
    assert.equal(runtime.alternatePathForLocale('pt-BR', '/'), '/pt-BR/');
    assert.equal(
      runtime.localePath('pt-BR', '/blog/integration-post/'),
      '/pt-BR/blog/integration-post/'
    );

    assert.equal(messages.getMessages('pt-BR').nav.home, 'Inicio');
    assert.equal(messages.getMessages('pt-BR').langLabel, 'Idioma');
    assert.equal(site.getSiteHero('pt-BR'), 'Ola mundo em portugues');
    assert.equal(about.getAboutConfig('pt-BR').metaLine, '$ perfil inicializado | modo: builder');

    const enPost = await readFile(
      path.join(tempRoot, 'src/content/blog/en/integration-post.md'),
      'utf8'
    );
    const ptBrPost = await readFile(
      path.join(tempRoot, 'src/content/blog/pt-BR/integration-post.md'),
      'utf8'
    );
    const disabledLocalePath = path.join(tempRoot, 'src/content/blog/ja/integration-post.md');
    assert.match(enPost, /^title: '.+'/m);
    assert.match(ptBrPost, /^title: '.+'/m);
    assert.doesNotMatch(ptBrPost, /undefined/);
    await assert.rejects(() => readFile(disabledLocalePath, 'utf8'), /ENOENT/);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
