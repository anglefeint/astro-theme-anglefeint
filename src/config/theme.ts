import { THEME_CONFIG } from '../site.config';

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
} as const;
