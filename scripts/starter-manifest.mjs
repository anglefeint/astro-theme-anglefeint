// Distribution destinations may use a neutral source instead of demo configuration.
export const STARTER_SOURCE_OVERRIDES = {
  'src/site.config.ts': 'scripts/starter-templates/site.config.ts.template',
  'AGENTS.md': 'scripts/starter-templates/AGENTS.md.template',
  'CLAUDE.md': 'scripts/starter-templates/CLAUDE.md.template',
  '.cursor/rules/00-repo.mdc': 'scripts/starter-templates/cursor-repo.mdc.template',
  ...Object.fromEntries(
    [
      'README',
      'README.zh-CN',
      'README.ja',
      'README.ko',
      'README.es',
      'README.pt-BR',
      'README.de',
      'README.ru',
      'README.zh-Hant',
    ].map((name) => [`${name}.meta.yaml`, `scripts/starter-templates/${name}.meta.yaml.template`])
  ),
};

export const starterSourcePath = (destination) =>
  STARTER_SOURCE_OVERRIDES[destination] ?? destination;

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

// Reusable visuals under packages/theme/src/effects are package-owned (package.json
// files/exports), not copied into STARTER_MANAGED_FILES or personal projects.

export const STARTER_CONTENT_LOCALES = [
  'en',
  'es',
  'ja',
  'ko',
  'zh',
  'pt-br',
  'de',
  'ru',
  'zh-hant',
];

export const STARTER_CONTENT_SLUGS = [
  'welcome-to-anglefeint',
  'starter-guide-1-configure-your-site',
  'starter-guide-2-languages-and-routing',
  'starter-guide-3-comments-about-and-theme-toggles',
  'starter-guide-4-giscus-comments',
  'starter-guide-5-fragments',
];

export const STARTER_CONTENT_MANAGED_FILES = STARTER_CONTENT_LOCALES.flatMap((locale) =>
  STARTER_CONTENT_SLUGS.map((slug) => `${STARTER_CONTENT_ROOT}/${locale}/${slug}.md`)
);

// Tutorial overrides feed distribution; keep maintainer-authored demo guides current too.
Object.assign(
  STARTER_SOURCE_OVERRIDES,
  Object.fromEntries(
    STARTER_CONTENT_MANAGED_FILES.filter((file) => !file.endsWith('/welcome-to-anglefeint.md')).map(
      (file) => [
        file,
        file.replace('src/content/blog/', 'scripts/starter-templates/content/') + '.template',
      ]
    )
  )
);

export const STARTER_OBSOLETE_FILES = [
  'src/pages/index.astro',
  'src/pages/robots.txt.ts',
  'src/pages/[lang]/tags/index.astro',
  'src/pages/[lang]/tags/[tag]/[...page].astro',
  'src/utils/metrics.ts',
  'src/pages/[lang]/about.astro',
  'src/pages/[lang]/decoder.astro',
  'src/pages/[lang]/terminal/[id].json.ts',
  'src/pages/[lang]/blog/[...page].astro',
  'src/pages/[lang]/blog/[...slug].astro',
  'src/pages/[lang]/index.astro',
  'src/pages/[lang]/rss.xml.ts',
  'src/scripts/cyber-rain-dust.js',
  'src/components/CyberAtmosphere.astro',
  'src/site.config.defaults.ts',
  'src/site.config.runtime.ts',
  'src/site.config.schema.ts',
  'src/templates/new-page-template.astro',
  'scripts/adapter-templates/src/config/about.ts',
  'scripts/adapter-templates/src/config/index.ts',
  'scripts/adapter-templates/src/config/site.ts',
  'scripts/adapter-templates/src/config/social.ts',
  'scripts/adapter-templates/src/config/theme.ts',
  'scripts/adapter-templates/src/i18n/config.ts',
  'scripts/adapter-templates/src/i18n/messages.ts',
  'scripts/adapter-templates/src/i18n/posts.ts',
  'scripts/adapter-templates/src/i18n/runtime.ts',
  'scripts/adapter-templates/src/types/theme-scripts.d.ts',
  'src/config/about.ts',
  'src/config/index.ts',
  'src/config/site.ts',
  'src/config/social.ts',
  'src/config/theme.ts',
  'src/i18n/config.ts',
  'src/i18n/messages.ts',
  'src/i18n/posts.ts',
  'src/i18n/runtime.ts',
  'src/types/theme-scripts.d.ts',
  'scripts/article-sitemap.mjs',
  'scripts/check-scaffold.mjs',
  'scripts/check-workspace-link.mjs',
  'scripts/doctor.mjs',
  'scripts/starter-package.mjs',
  'scripts/check-about-runtime-config.mjs',
  'scripts/check-adapter-contract.mjs',
  'scripts/resolve-theme-default-i18n-entry.mjs',
  'scripts/resolve-site-url.mjs',
  'scripts/starter-manifest.mjs',
  'scripts/sync-adapters.mjs',

  'public/images/theme-previews/preview-home.png',
  'public/images/theme-previews/preview-blog-list.png',
  'public/images/theme-previews/preview-blog-list-pagination.png',
  'public/images/theme-previews/preview-blog-post-open.png',
  'public/images/theme-previews/preview-blog-post-collapsed.png',
  'public/images/theme-previews/preview-about.png',
  'public/images/theme-previews/preview-decoder.png',
  'public/llms.txt',
  'scripts/regenerate-starter.mjs',
  'scripts/new-page.mjs',
  'scripts/new-post.mjs',
  'tools/maintainer/sync-starter.mjs',
  'docs/MAINTAINER_WORKFLOW.md',
  'src/components/pagination/CyberPagination.astro',
  'src/utils/pagination-style.ts',
  'src/utils/pagination.ts',
];

export const STARTER_SUPPORT_SCRIPTS = [];

export const STARTER_STATIC_MANAGED_FILES = [
  'AGENTS.md',
  'CLAUDE.md',
  '.cursor/rules/00-repo.mdc',
  'astro.config.mjs',
  'tsconfig.json',
  '.gitignore',
  'src/content.config.ts',
  'README.pt-BR.md',
  'README.pt-BR.meta.yaml',
  'README.de.md',
  'README.de.meta.yaml',
  'README.ru.md',
  'README.ru.meta.yaml',
  'README.zh-Hant.md',
  'README.zh-Hant.meta.yaml',
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
  'public/images/theme-previews/README.md',
  'public/images/theme-previews/anglefeint-brand.webp',
  'public/images/theme-previews/promo-overview.jpg',
  'public/images/theme-previews/promo-cyberpunk.jpg',
  'public/images/theme-previews/promo-hacker.jpg',
  'public/images/theme-previews/promo-ai.jpg',
  'public/images/theme-previews/preview-about.jpg',
  'public/images/theme-previews/preview-decoder.jpg',
  'public/images/theme-previews/preview-blog-list.jpg',
  'public/images/theme-previews/preview-blog-list-mode.jpg',
  'public/images/theme-previews/preview-decoder-resources.jpg',
  'public/images/theme-previews/preview-blog-list-pagination.jpg',
  'public/images/theme-previews/preview-blog-post-related.jpg',
  'public/images/theme-previews/preview-blog-post.jpg',
  'public/images/theme-previews/preview-home.jpg',
  'src/site.config.ts',
];

export const REQUIRED_STARTER_MANAGED_FILES = [
  ...STARTER_CONTENT_MANAGED_FILES,
  ...STARTER_SUPPORT_SCRIPTS,
];

export const STARTER_MANAGED_FILES = [
  'src/assets/blog/default-covers/ai-01.webp',
  'src/assets/blog/default-covers/ai-02.webp',
  'src/assets/blog/default-covers/ai-03.webp',
  'src/assets/blog/default-covers/architecture-01.webp',
  'src/assets/blog/default-covers/cinematic-01.webp',
  'src/assets/blog/default-covers/cyber-01.webp',
  'src/assets/blog/default-covers/cyber-02.webp',
  'src/assets/blog/default-covers/cyber-03.webp',
  'src/assets/blog/default-covers/cyber-04.webp',
  'src/assets/blog/default-covers/hacker-01.webp',
  'src/assets/blog/default-covers/hacker-02.webp',
  'src/assets/blog/default-covers/horizon-01.webp',
  'src/assets/blog/default-covers/matrix-01.webp',
  'src/assets/blog/default-covers/matrix-02.webp',
  'src/assets/blog/default-covers/matrix-03.webp',
  'src/assets/blog/default-covers/study-01.webp',
  'public/fonts/atkinson-bold.woff',
  'public/fonts/atkinson-regular.woff',
  'public/fonts/ff2a407fe06752facf8828a86955e988.eot',
  'public/fonts/ff2a407fe06752facf8828a86955e988.ttf',
  'public/fonts/ff2a407fe06752facf8828a86955e988.woff2',
  'public/favicon.ico',
  'public/favicon.svg',
  ...STARTER_CONTENT_MANAGED_FILES,
  ...STARTER_STATIC_MANAGED_FILES,
  ...STARTER_SUPPORT_SCRIPTS,
];

export const REQUIRED_ADAPTER_TARGET_FILES = ['src/site.config.ts', ...ADAPTER_TARGET_FILES];
