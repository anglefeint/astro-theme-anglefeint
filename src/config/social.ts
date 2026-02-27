/**
 * Social links shown in Header + Footer. Set to [] to hide.
 * Replace with your own links when using as a theme.
 */
export interface SocialLink {
	href: string;
	label: string;
	/** Optional: 'mastodon' | 'twitter' | 'github' for built-in icons, or omit for text-only */
	icon?: 'mastodon' | 'twitter' | 'github';
}

export const SOCIAL_LINKS: SocialLink[] = [
	// Replace with your links when using as a theme.
	// Keep empty to hide social icons by default.
];
