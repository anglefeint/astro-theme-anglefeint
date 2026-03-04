import { THEME_CONFIG, type SocialLink } from '../site.config';

/**
 * Social links shown in Header + Footer. Set to [] to hide.
 * Replace with your own links when using as a theme.
 */
export type { SocialLink };

export const SOCIAL_LINKS: SocialLink[] = THEME_CONFIG.social.links;
