export const ADAPTER_TEMPLATE_MAP = [
  ['scripts/adapter-templates/src/config/site.ts', 'src/config/site.ts'],
  ['scripts/adapter-templates/src/config/theme.ts', 'src/config/theme.ts'],
  ['scripts/adapter-templates/src/config/social.ts', 'src/config/social.ts'],
  ['scripts/adapter-templates/src/config/about.ts', 'src/config/about.ts'],
  ['scripts/adapter-templates/src/config/index.ts', 'src/config/index.ts'],
  ['scripts/adapter-templates/src/i18n/config.ts', 'src/i18n/config.ts'],
  ['scripts/adapter-templates/src/i18n/runtime.ts', 'src/i18n/runtime.ts'],
  ['scripts/adapter-templates/src/i18n/messages.ts', 'src/i18n/messages.ts'],
  ['scripts/adapter-templates/src/i18n/posts.ts', 'src/i18n/posts.ts'],
  ['scripts/adapter-templates/src/types/theme-scripts.d.ts', 'src/types/theme-scripts.d.ts'],
];

export const ADAPTER_TARGET_FILES = ADAPTER_TEMPLATE_MAP.map(([, targetRel]) => targetRel);

export const STARTER_CONTENT_ROOT = 'src/content/blog';

export const STARTER_CONTENT_LOCALES = ['en', 'es', 'ja', 'ko', 'zh'];

export const STARTER_CONTENT_SLUGS = [
  'welcome-to-anglefeint',
  'starter-guide-1-configure-your-site',
  'starter-guide-2-languages-and-routing',
  'starter-guide-3-comments-about-and-theme-toggles',
];

export const STARTER_CONTENT_MANAGED_FILES = STARTER_CONTENT_LOCALES.flatMap((locale) =>
  STARTER_CONTENT_SLUGS.map((slug) => `${STARTER_CONTENT_ROOT}/${locale}/${slug}.md`)
);

export const STARTER_OBSOLETE_FILES = [
  'scripts/regenerate-starter.mjs',
  'tools/maintainer/sync-starter.mjs',
  'docs/MAINTAINER_WORKFLOW.md',
  'src/components/pagination/CyberPagination.astro',
  'src/utils/pagination-style.ts',
  'src/utils/pagination.ts',
];

export const STARTER_SUPPORT_SCRIPTS = [
  'scripts/check-about-runtime-config.mjs',
  'scripts/check-adapter-contract.mjs',
  'scripts/new-page.mjs',
  'scripts/new-post.mjs',
  'scripts/starter-manifest.mjs',
  'scripts/sync-adapters.mjs',
];

export const STARTER_STATIC_MANAGED_FILES = [
  'README.md',
  'README.meta.yaml',
  'README.zh-CN.md',
  'README.zh-CN.meta.yaml',
  'README.ja.md',
  'README.ja.meta.yaml',
  'README.es.md',
  'README.es.meta.yaml',
  'README.ko.md',
  'README.ko.meta.yaml',
  'src/pages/[lang]/about.astro',
  'src/pages/[lang]/blog/[...page].astro',
  'src/pages/[lang]/blog/[...slug].astro',
  'src/pages/[lang]/index.astro',
  'src/pages/[lang]/rss.xml.ts',
  'src/scripts/cyber-rain-dust.js',
  'src/site.config.ts',
  'src/site.config.defaults.ts',
  'src/site.config.runtime.ts',
  'src/site.config.schema.ts',
  'src/templates/new-page-template.astro',
];

export const REQUIRED_STARTER_MANAGED_FILES = [
  ...STARTER_CONTENT_MANAGED_FILES,
  ...STARTER_SUPPORT_SCRIPTS,
  ...ADAPTER_TEMPLATE_MAP.map(([sourceRel]) => sourceRel),
  ...ADAPTER_TARGET_FILES,
];

export const STARTER_MANAGED_FILES = [
  ...STARTER_CONTENT_MANAGED_FILES,
  ...STARTER_STATIC_MANAGED_FILES,
  ...STARTER_SUPPORT_SCRIPTS,
  ...ADAPTER_TEMPLATE_MAP.map(([sourceRel]) => sourceRel),
  ...ADAPTER_TARGET_FILES,
];

export const REQUIRED_ADAPTER_TARGET_FILES = ['src/site.config.ts', ...ADAPTER_TARGET_FILES];
