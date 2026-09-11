/**
 * Social links shown in Header + Footer. Empty links show non-clickable placeholders by default.
 * Configure your links in src/site.config.ts under social.links.
 */
export interface SocialLink {
  href: string;
  label: string;
  /** Optional: 'mastodon' | 'twitter' | 'github' for built-in icons, or omit for text-only */
  icon?: 'mastodon' | 'twitter' | 'github';
}

export const SOCIAL_LINKS: SocialLink[] = [
  // Replace with your links when using as a theme.
  // Empty links show non-clickable placeholders by default.
];
