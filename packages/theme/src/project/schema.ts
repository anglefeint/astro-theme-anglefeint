import type { MachineReadableSupplement } from '../machine-readable.mjs';
export type { MachineReadableSupplement };
import type { DeepPartial } from '../utils/merge';
import type { Messages } from '../i18n/messages';

export type LocaleCode = string;

import type { SocialLink } from '../utils/social-icons';
export type { SocialLink };

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
  aiReadableContent?: MachineReadableSupplement;
  analytics: { googleAnalyticsId: string };
  site: {
    /** Default sharing image: public-root path or HTTPS URL; blank uses the theme artwork. */
    ogImage?: string;
    title: string;
    description: string;
    url: string;
    author: string;
    tagline: string;
  };
  theme: {
    home: { showInitialize: boolean; showFollow: boolean; showTrace: boolean };
    math: { enabled: boolean };
    footer: { showCredits: boolean; links: { label: string; href: string }[] };
    music: { enabled: boolean; tracks: { title: string; artist?: string; src: string }[] };
    blogPageSize: number;
    homeLatestCount: number;
    enableAboutPage: boolean;
    enableDecoderPage: boolean;
    fragments?: { enabled?: boolean; pageSize?: number; comments?: { enabled?: boolean } };
    tags: { enabled: boolean };
    socialImage: { enabled: boolean };
    toc: {
      enabled: boolean;
    };
    search: {
      enabled: boolean;
    };
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
      enableHomePassage: boolean;
    };
    comments: {
      /** Opt in to one discussion per locale-independent article slug. */
      shareAcrossLocales?: boolean;
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
  homeTitle?: string;
  hero?: string;
}

export interface LocaleConfig {
  aiReadableContent?: MachineReadableSupplement;
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
    homeTitle?: string;
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
