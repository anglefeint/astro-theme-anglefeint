// Package-owned project configuration.

import { THEME_CONFIG } from '@anglefeint/user-config';
import type { SocialLink } from '../schema';

/**
 * Social links shown in Header + Footer. Empty links show non-clickable placeholders by default.
 * Configure your links in src/site.config.ts under social.links.
 */
export type { SocialLink };

export const SOCIAL_LINKS: SocialLink[] = THEME_CONFIG.social.links;
