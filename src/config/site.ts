/**
 * Site identity config. Override via environment variables:
 *   PUBLIC_SITE_URL, PUBLIC_SITE_TITLE, PUBLIC_SITE_AUTHOR, PUBLIC_SITE_DESCRIPTION
 */
const env = import.meta.env;

export const SITE_TITLE = (env.PUBLIC_SITE_TITLE as string | undefined) ?? 'Angle Feint';
export const SITE_DESCRIPTION =
	(env.PUBLIC_SITE_DESCRIPTION as string | undefined) ??
	'Cinematic web interfaces, AI-era engineering notes, and system architecture essays.';
export const SITE_URL = (env.PUBLIC_SITE_URL as string | undefined) ?? (env.SITE as string | undefined) ?? 'https://anglefeint.com';
export const SITE_AUTHOR = (env.PUBLIC_SITE_AUTHOR as string | undefined) ?? 'angle feint';
