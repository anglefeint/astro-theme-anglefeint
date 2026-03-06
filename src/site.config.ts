/**
 * Single user-facing config entry for Anglefeint.
 * Edit this file only. Other files under src/config/* and src/i18n/* are adapters.
 */
import { deepMerge, type DeepPartial } from '@anglefeint/astro-theme/utils/merge';
import type { Messages } from '@anglefeint/theme-default-i18n';

export type LocaleCode = string;

export interface SocialLink {
  href: string;
  label: string;
  icon?: 'mastodon' | 'twitter' | 'github';
}

export interface AboutConfig {
  metaLine: string;
  sections: {
    who: string;
    what: string;
    ethos: string[];
    now: string;
    contactLead: string;
    signature: string;
  };
  contact: {
    email: string;
    githubUrl: string;
    githubLabel: string;
  };
  sidebar: {
    dlData: string;
    ai: string;
    decryptor: string;
    help: string;
    allScripts: string;
  };
  scriptsPath: string;
  labels: {
    modalOutput: string;
    modalClose: string;
    responseOutput: string;
    contactEmailLead: string;
    contactConnectLead: string;
    backToTop: string;
    quickAccess: string;
    contactEmailLabel: string;
  };
  modals: {
    dlData: {
      title: string;
      subtitle: string;
    };
    ai: {
      title: string;
      lines: string[];
    };
    decryptor: {
      title: string;
      header: string;
      keysLabel: string;
      currentPassphraseLabel: string;
      masterKeyLabel: string;
      transientKeyLabel: string;
    };
    help: {
      title: string;
      statsLabel: string;
      typedPrefix: string;
      typedSuffix: string;
    };
    allScripts: {
      title: string;
    };
  };
  effects: {
    backgroundLines: string[];
    scrollToasts: {
      p30: string;
      p60: string;
      p90: string;
    };
  };
}

export interface ThemeConfig {
  site: {
    title: string;
    description: string;
    url: string;
    author: string;
    tagline: string;
  };
  theme: {
    blogPageSize: number;
    homeLatestCount: number;
    enableAboutPage: boolean;
    pagination: {
      windowSize: number;
      showJumpThreshold: number;
      jump: {
        enabled: boolean;
        enterToGo: boolean;
      };
      style: {
        enabled: boolean;
        mode: 'random' | 'sequential' | 'fixed';
        variants: number;
        fixedVariant: number;
      };
    };
    effects: {
      enableRedQueen: boolean;
    };
    comments: {
      enabled: boolean;
      repo: string;
      repoId: string;
      category: string;
      categoryId: string;
      mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
      term: string;
      number: string;
      strict: '0' | '1';
      reactionsEnabled: '0' | '1';
      emitMetadata: '0' | '1';
      inputPosition: 'top' | 'bottom';
      theme: string;
      lang: string;
      loading: 'lazy' | 'eager';
      crossorigin: 'anonymous' | 'use-credentials';
    };
  };
  i18n: ThemeI18nConfig;
  social: {
    links: SocialLink[];
  };
}

export interface LocaleMetaConfig {
  label: string;
  hreflang?: string;
  ogLocale?: string;
  dir?: 'ltr' | 'rtl';
  enabled?: boolean;
  fallback?: LocaleCode[];
}

export interface LocaleSiteConfig {
  hero?: string;
}

export interface LocaleConfig {
  meta: LocaleMetaConfig;
  site?: LocaleSiteConfig;
  about?: DeepPartial<AboutConfig>;
  messages?: DeepPartial<Messages>;
}

export interface ThemeI18nConfig {
  defaultLocale: LocaleCode;
  locales: Record<string, LocaleConfig>;
  routing: {
    defaultLocalePrefix: 'never' | 'always';
  };
  validation: {
    requireCompleteMessages: boolean;
    requireCompleteAbout: boolean;
    requireCompleteHero: boolean;
    requireOgLocale: boolean;
  };
}

export interface NormalizedLocaleConfig {
  code: LocaleCode;
  meta: {
    label: string;
    hreflang: string;
    ogLocale?: string;
    dir: 'ltr' | 'rtl';
    enabled: boolean;
    fallback: LocaleCode[];
  };
  site: {
    hero?: string;
  };
  about?: DeepPartial<AboutConfig>;
  messages?: DeepPartial<Messages>;
}

export interface NormalizedThemeI18nConfig {
  defaultLocale: LocaleCode;
  locales: Record<string, NormalizedLocaleConfig>;
  routing: ThemeI18nConfig['routing'];
  validation: ThemeI18nConfig['validation'];
}

export const DEFAULT_ABOUT_CONFIG: AboutConfig = {
  metaLine: '$ profile booted | mode: builder',
  sections: {
    who: 'Write a short introduction about yourself, your background, and your primary focus areas.',
    what: 'Describe what you build, your core skills, and the kinds of projects you want to be known for.',
    ethos: [
      'Prioritize clarity before complexity.',
      'Favor maintainable systems over one-off solutions.',
      'Ship in small iterations and learn from feedback.',
      'Communicate directly and document decisions.',
    ],
    now: 'Share what you are currently building, shipping, or learning.',
    contactLead:
      'Add a short collaboration note (for example: open to freelance, consulting, or full-time roles).',
    signature: '> Replace with your own signature.',
  },
  contact: {
    email: 'you@example.com',
    githubUrl: 'https://github.com/yourname',
    githubLabel: 'GitHub',
  },
  sidebar: {
    dlData: 'DL Data',
    ai: 'AI',
    decryptor: 'Decryptor',
    help: 'Help',
    allScripts: 'All Scripts',
  },
  scriptsPath: '/root/bash/scripts',
  labels: {
    modalOutput: 'Output',
    modalClose: 'Close',
    responseOutput: 'Output',
    contactEmailLead: 'Reach me via',
    contactConnectLead: 'or connect on',
    backToTop: 'Back to top',
    quickAccess: 'Quick access',
    contactEmailLabel: 'email',
  },
  modals: {
    dlData: {
      title: 'Downloading...',
      subtitle: 'Critical Data',
    },
    ai: {
      title: 'AI',
      lines: [
        '~ $ ai --status --verbose',
        '',
        'model: anglefeint-core',
        'mode: reasoning + builder',
        'context window: 128k',
        'tools: codex / cursor / claude-code',
        'latency: 120-220ms',
        'safety: guardrails enabled',
        '',
        '>> system online',
        '>> ready for execution',
      ],
    },
    decryptor: {
      title: 'Password Decryptor',
      header: 'Calculating Hashes',
      keysLabel: 'keys tested',
      currentPassphraseLabel: 'Current passphrase:',
      masterKeyLabel: 'Master key',
      transientKeyLabel: 'Transient key',
    },
    help: {
      title: 'Help',
      statsLabel: 'Stats & Achievements',
      typedPrefix: 'You typed:',
      typedSuffix: 'characters',
    },
    allScripts: {
      title: '/root/bash/scripts',
    },
  },
  effects: {
    backgroundLines: [
      '~ $ ls -la',
      'total 42',
      'drwxr-xr-x  12 user  staff   384  Jan 12  about  blog  projects',
      'drwxr-xr-x   8 user  staff   256  Jan 11  .config  .ssh  keys',
      '-rw-r--r--   1 user  staff  2048  Jan 10  README.md  .env.gpg',
      '-rwxr-xr-x   1 user  staff   512  Jan  9  deploy.sh  script',
      '~ $ cat .motd',
      '>> welcome | access granted',
    ],
    scrollToasts: {
      p30: 'context parsed',
      p60: 'inference stable',
      p90: 'output finalized',
    },
  },
};

const defaultThemeConfig: ThemeConfig = {
  site: {
    title: 'My Blog',
    description:
      'Cinematic web interfaces, AI-era engineering notes, and system architecture essays.',
    url: 'https://example.com',
    author: 'Your Name',
    tagline: 'Built with Astro.',
  },
  theme: {
    blogPageSize: 9,
    homeLatestCount: 3,
    enableAboutPage: true,
    pagination: {
      windowSize: 7,
      showJumpThreshold: 12,
      jump: {
        enabled: true,
        enterToGo: true,
      },
      style: {
        enabled: true,
        mode: 'random',
        variants: 9,
        fixedVariant: 1,
      },
    },
    effects: {
      enableRedQueen: true,
    },
    comments: {
      enabled: false,
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      term: '',
      number: '',
      strict: '0',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'dark',
      lang: 'en',
      loading: 'lazy',
      crossorigin: 'anonymous',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        meta: {
          label: 'English',
          hreflang: 'en',
          ogLocale: 'en_US',
        },
        site: {
          hero: 'Write a short introduction for your site and what readers can expect from your posts.',
        },
        about: DEFAULT_ABOUT_CONFIG,
      },
      ja: {
        meta: {
          label: '日本語',
          hreflang: 'ja',
          ogLocale: 'ja_JP',
          fallback: ['en'],
        },
        site: {
          hero: 'このサイトの紹介文と、読者がどんな記事を期待できるかを書いてください。',
        },
        about: DEFAULT_ABOUT_CONFIG,
      },
      ko: {
        meta: {
          label: '한국어',
          hreflang: 'ko',
          ogLocale: 'ko_KR',
          fallback: ['en'],
        },
        site: {
          hero: '사이트 소개와 방문자가 어떤 글을 기대할 수 있는지 간단히 작성하세요.',
        },
        about: DEFAULT_ABOUT_CONFIG,
      },
      es: {
        meta: {
          label: 'Español',
          hreflang: 'es',
          ogLocale: 'es_ES',
          fallback: ['en'],
        },
        site: {
          hero: 'Escribe una breve presentación del sitio y qué tipo de contenido encontrarán tus lectores.',
        },
        about: DEFAULT_ABOUT_CONFIG,
      },
      zh: {
        meta: {
          label: '中文',
          hreflang: 'zh-CN',
          ogLocale: 'zh_CN',
          fallback: ['en'],
        },
        site: {
          hero: '在这里写一段站点简介，并告诉读者你将发布什么类型的内容。',
        },
        about: DEFAULT_ABOUT_CONFIG,
      },
    },
    routing: {
      defaultLocalePrefix: 'never',
    },
    validation: {
      requireCompleteMessages: false,
      requireCompleteAbout: false,
      requireCompleteHero: false,
      requireOgLocale: false,
    },
  },
  social: {
    links: [],
  },
};

export function defineThemeConfig(config: DeepPartial<ThemeConfig>): ThemeConfig {
  return deepMerge(defaultThemeConfig, config);
}

function sanitizeFallbackChain(
  locale: LocaleCode,
  fallback: readonly LocaleCode[] | undefined,
  defaultLocale: LocaleCode,
  supportedLocales: ReadonlySet<LocaleCode>
): LocaleCode[] {
  const fallbackCandidates =
    fallback && fallback.length > 0 ? fallback : locale === defaultLocale ? [] : [defaultLocale];
  const seen = new Set<LocaleCode>();
  const resolved: LocaleCode[] = [];

  for (const candidate of fallbackCandidates) {
    if (
      !candidate ||
      candidate === locale ||
      seen.has(candidate) ||
      !supportedLocales.has(candidate)
    ) {
      continue;
    }
    seen.add(candidate);
    resolved.push(candidate);
  }

  if (locale !== defaultLocale && !seen.has(defaultLocale) && supportedLocales.has(defaultLocale)) {
    resolved.push(defaultLocale);
  }

  return resolved;
}

export function normalizeI18nConfig(config: ThemeI18nConfig): NormalizedThemeI18nConfig {
  const localeEntries = { ...config.locales };
  const defaultLocale = config.defaultLocale || 'en';

  if (!localeEntries[defaultLocale]) {
    localeEntries[defaultLocale] = {
      meta: {
        label: defaultLocale,
      },
    };
  }

  const supportedLocales = new Set(Object.keys(localeEntries));
  const normalizedLocales: Record<string, NormalizedLocaleConfig> = {};

  for (const [code, localeConfig] of Object.entries(localeEntries)) {
    const fallback = sanitizeFallbackChain(
      code,
      localeConfig.meta.fallback,
      defaultLocale,
      supportedLocales
    );

    normalizedLocales[code] = {
      code,
      meta: {
        label: localeConfig.meta.label || code,
        hreflang: localeConfig.meta.hreflang || code,
        ogLocale: localeConfig.meta.ogLocale,
        dir: localeConfig.meta.dir || 'ltr',
        enabled: code === defaultLocale ? true : localeConfig.meta.enabled !== false,
        fallback,
      },
      site: {
        hero: localeConfig.site?.hero,
      },
      about: localeConfig.about,
      messages: localeConfig.messages,
    };
  }

  return {
    defaultLocale,
    locales: normalizedLocales,
    routing: {
      defaultLocalePrefix: config.routing.defaultLocalePrefix || 'never',
    },
    validation: {
      requireCompleteMessages: config.validation.requireCompleteMessages,
      requireCompleteAbout: config.validation.requireCompleteAbout,
      requireCompleteHero: config.validation.requireCompleteHero,
      requireOgLocale: config.validation.requireOgLocale,
    },
  };
}

/**
 * Edit this object only.
 * Omitted fields safely fall back to theme defaults.
 */
export const THEME_CONFIG = defineThemeConfig({
  // Example:
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: {
  //     en: {
  //       meta: { label: 'English', hreflang: 'en', ogLocale: 'en_US' },
  //       site: { hero: 'Your localized hero copy.' },
  //       about: { metaLine: '$ profile booted | mode: builder' },
  //       messages: { nav: { home: 'Home' } },
  //     },
  //   },
  // },
});
