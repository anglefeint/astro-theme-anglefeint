import type { DeepPartial } from '@anglefeint/astro-theme/utils/merge';
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
}

export interface NormalizedLocaleConfig {
  code: LocaleCode;
  meta: {
    label: string;
    hreflang: string;
    ogLocale?: string;
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
}
