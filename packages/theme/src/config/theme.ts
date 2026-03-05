/**
 * Theme behavior config.
 */
export const THEME = {
  /** Posts per page on blog list */
  BLOG_PAGE_SIZE: 9,
  /** Number of latest posts shown on home page */
  HOME_LATEST_COUNT: 3,
  /** Whether to enable the About page (disable to hide from nav/routes if needed) */
  ENABLE_ABOUT_PAGE: true,
  /** Pagination behavior and style strategy for blog list */
  PAGINATION: {
    WINDOW_SIZE: 7,
    SHOW_JUMP_THRESHOLD: 12,
    JUMP: {
      ENABLED: true,
      ENTER_TO_GO: true,
    },
    STYLE: {
      ENABLED: true,
      MODE: 'random',
      VARIANTS: 9,
      FIXED_VARIANT: 1,
    },
  },
  /** Optional visual effects switches */
  EFFECTS: {
    ENABLE_RED_QUEEN: true,
  },
  /** Optional comments integration (Giscus) */
  COMMENTS: {
    ENABLED: false,
    REPO: '',
    REPO_ID: '',
    CATEGORY: '',
    CATEGORY_ID: '',
    MAPPING: 'pathname',
    STRICT: '0',
    REACTIONS_ENABLED: '1',
    EMIT_METADATA: '0',
    INPUT_POSITION: 'bottom',
    THEME: 'dark',
    LANG: 'en',
    LOADING: 'lazy',
    CROSSORIGIN: 'anonymous',
  },
} as const;
