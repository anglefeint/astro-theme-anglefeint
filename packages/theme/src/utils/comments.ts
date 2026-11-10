import type { ThemeConfig } from '../project/schema';

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
