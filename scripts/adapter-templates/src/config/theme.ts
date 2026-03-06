import { THEME_CONFIG } from '../site.config.ts';

const commentsConfig = THEME_CONFIG.theme.comments;
const normalizedCommentTerm = commentsConfig.term.trim();
const normalizedCommentNumber = commentsConfig.number.trim();
const hasValidCommentNumber =
  /^[1-9]\d*$/.test(normalizedCommentNumber) &&
  Number.isSafeInteger(Number(normalizedCommentNumber));

if (commentsConfig.enabled) {
  if (commentsConfig.mapping === 'specific' && !normalizedCommentTerm) {
    throw new Error(
      '[theme.comments] mapping="specific" requires a non-empty theme.comments.term.'
    );
  }
  if (commentsConfig.mapping === 'number' && !hasValidCommentNumber) {
    throw new Error(
      '[theme.comments] mapping="number" requires theme.comments.number to be a positive integer string (e.g. "1").'
    );
  }
}

/**
 * Theme behavior config.
 */
export const THEME = {
  /** Posts per page on blog list */
  BLOG_PAGE_SIZE: THEME_CONFIG.theme.blogPageSize,
  /** Number of latest posts shown on home page */
  HOME_LATEST_COUNT: THEME_CONFIG.theme.homeLatestCount,
  /** Whether to enable the About page (disable to hide from nav/routes if needed) */
  ENABLE_ABOUT_PAGE: THEME_CONFIG.theme.enableAboutPage,
  /** Pagination behavior and style strategy for blog list */
  PAGINATION: {
    WINDOW_SIZE: THEME_CONFIG.theme.pagination.windowSize,
    SHOW_JUMP_THRESHOLD: THEME_CONFIG.theme.pagination.showJumpThreshold,
    JUMP: {
      ENABLED: THEME_CONFIG.theme.pagination.jump.enabled,
      ENTER_TO_GO: THEME_CONFIG.theme.pagination.jump.enterToGo,
    },
    STYLE: {
      ENABLED: THEME_CONFIG.theme.pagination.style.enabled,
      MODE: THEME_CONFIG.theme.pagination.style.mode,
      VARIANTS: THEME_CONFIG.theme.pagination.style.variants,
      FIXED_VARIANT: THEME_CONFIG.theme.pagination.style.fixedVariant,
    },
  },
  /** Optional visual effects switches */
  EFFECTS: {
    ENABLE_RED_QUEEN: THEME_CONFIG.theme.effects.enableRedQueen,
  },
  /** Optional comments integration (Giscus) */
  COMMENTS: {
    ENABLED: THEME_CONFIG.theme.comments.enabled,
    REPO: THEME_CONFIG.theme.comments.repo,
    REPO_ID: THEME_CONFIG.theme.comments.repoId,
    CATEGORY: THEME_CONFIG.theme.comments.category,
    CATEGORY_ID: THEME_CONFIG.theme.comments.categoryId,
    MAPPING: THEME_CONFIG.theme.comments.mapping,
    TERM: normalizedCommentTerm,
    NUMBER: normalizedCommentNumber,
    STRICT: THEME_CONFIG.theme.comments.strict,
    REACTIONS_ENABLED: THEME_CONFIG.theme.comments.reactionsEnabled,
    EMIT_METADATA: THEME_CONFIG.theme.comments.emitMetadata,
    INPUT_POSITION: THEME_CONFIG.theme.comments.inputPosition,
    THEME: THEME_CONFIG.theme.comments.theme,
    LANG: THEME_CONFIG.theme.comments.lang,
    LOADING: THEME_CONFIG.theme.comments.loading,
    CROSSORIGIN: THEME_CONFIG.theme.comments.crossorigin,
  },
} as const;
