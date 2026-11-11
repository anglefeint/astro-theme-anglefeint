import type { ThemeConfig } from '../project/schema';

/** Shared input contract for the existing article embed and deferred dialogs. */
export type GiscusComments = {
  REPO: string;
  REPO_ID: string;
  CATEGORY: string;
  CATEGORY_ID: string;
  MAPPING: string;
  TERM: string;
  NUMBER: string;
  STRICT: string;
  REACTIONS_ENABLED: string;
  EMIT_METADATA: string;
  INPUT_POSITION: string;
  THEME: string;
  LANG: string;
  LOADING: string;
  CROSSORIGIN: string;
};

export function giscusConfig(comments: GiscusComments, locale: string, deferred = false) {
  if (deferred) {
    for (const [field, key] of [
      ['repo', 'REPO'],
      ['repoId', 'REPO_ID'],
      ['category', 'CATEGORY'],
      ['categoryId', 'CATEGORY_ID'],
    ] as const) {
      if (!comments[key].trim())
        throw new Error(
          `Fragments comments require theme.comments.${field}. Configure Giscus or disable theme.fragments.comments.enabled.`
        );
    }
  }
  const mapping = deferred ? 'specific' : comments.MAPPING;
  const language =
    ({ zh: 'zh-CN', 'zh-hant': 'zh-TW', 'pt-br': 'pt' } as Record<string, string>)[locale] ??
    locale;
  return {
    repo: comments.REPO,
    repoId: comments.REPO_ID,
    category: comments.CATEGORY,
    categoryId: comments.CATEGORY_ID,
    mapping,
    term: mapping === 'specific' ? (deferred ? '' : comments.TERM.trim()) : undefined,
    number: mapping === 'number' ? comments.NUMBER.trim() : undefined,
    strict: deferred ? '1' : comments.STRICT,
    reactionsEnabled: comments.REACTIONS_ENABLED,
    emitMetadata: deferred ? '1' : comments.EMIT_METADATA,
    inputPosition: comments.INPUT_POSITION,
    theme: comments.THEME,
    lang: (!deferred && comments.LANG) || language,
    loading: deferred ? 'eager' : comments.LOADING,
    crossorigin: comments.CROSSORIGIN,
  };
}

export function validateComments(config: ThemeConfig['theme']['comments']) {
  if (!config.enabled) return;
  if (config.shareAcrossLocales) {
    if (
      config.mapping !== 'specific' ||
      config.term.trim() ||
      config.number.trim() ||
      config.strict !== '1'
    ) {
      throw new Error(
        '[theme.comments] shareAcrossLocales requires mapping="specific", term="", number="", strict="1". Disable shareAcrossLocales to retain a custom mapping.'
      );
    }
    return;
  }
  if (config.mapping === 'specific' && !config.term.trim()) {
    throw new Error(
      '[theme.comments] mapping="specific" requires a non-empty theme.comments.term.'
    );
  }
  const number = config.number.trim();
  if (
    config.mapping === 'number' &&
    (!/^[1-9]\d*$/.test(number) || !Number.isSafeInteger(Number(number)))
  ) {
    throw new Error(
      '[theme.comments] mapping="number" requires theme.comments.number to be a positive integer string (e.g. "1").'
    );
  }
}

/** Resolve article-local parameters without changing the shared configuration. */
export function articleComments<
  T extends {
    ENABLED: boolean;
    SHARE_ACROSS_LOCALES?: boolean;
    MAPPING: string;
    TERM: string;
    STRICT: string;
  },
>(comments: T, slug?: string): T {
  if (!comments.ENABLED || !comments.SHARE_ACROSS_LOCALES) return comments;
  if (
    !slug?.trim() ||
    slug !== slug.trim() ||
    slug.split('/').some((segment) => !segment || segment === '.' || segment === '..')
  ) {
    throw new Error(
      '[theme.comments] shareAcrossLocales requires a non-empty articleSlug without a locale prefix. Pass the complete article slug, including any directories, to BlogPost.'
    );
  }
  return { ...comments, MAPPING: 'specific', TERM: slug, STRICT: '1' };
}
