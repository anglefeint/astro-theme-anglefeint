import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const REQUIRED_FILES = [
	'src/site.config.ts',
	'src/config/site.ts',
	'src/config/theme.ts',
	'src/config/social.ts',
	'src/config/about.ts',
	'src/config/index.ts',
	'src/i18n/config.ts',
	'src/i18n/messages.ts',
	'src/i18n/posts.ts',
	'src/types/theme-scripts.d.ts',
];

const REQUIRED_VITE_ALIASES = ['@anglefeint/site-config', '@anglefeint/site-i18n', '@anglefeint/theme-default-i18n'];
const REQUIRED_TSCONFIG_PATHS = [
	'@anglefeint/site-config',
	'@anglefeint/site-config/*',
	'@anglefeint/site-i18n',
	'@anglefeint/site-i18n/*',
	'@anglefeint/theme-default-i18n',
];

async function fileExists(filePath) {
	try {
		await access(filePath, constants.F_OK);
		return true;
	} catch {
		return false;
	}
}

async function main() {
	const issues = [];
	const cwd = process.cwd();
	const assertContains = (text, pattern, message) => {
		if (!text.includes(pattern)) issues.push(message);
	};

	for (const rel of REQUIRED_FILES) {
		const exists = await fileExists(path.join(cwd, rel));
		if (!exists) issues.push(`Missing required adapter file: ${rel}`);
	}

	const astroConfig = await readFile(path.join(cwd, 'astro.config.mjs'), 'utf8');
	for (const alias of REQUIRED_VITE_ALIASES) {
		if (!astroConfig.includes(`'${alias}'`) && !astroConfig.includes(`"${alias}"`)) {
			issues.push(`astro.config.mjs is missing vite alias: ${alias}`);
		}
	}

	const tsconfigText = await readFile(path.join(cwd, 'tsconfig.json'), 'utf8');
	const tsconfig = JSON.parse(tsconfigText);
	const paths = tsconfig?.compilerOptions?.paths ?? {};
	for (const key of REQUIRED_TSCONFIG_PATHS) {
		if (!(key in paths)) issues.push(`tsconfig.json is missing compilerOptions.paths entry: ${key}`);
	}

	const siteAdapter = await readFile(path.join(cwd, 'src/config/site.ts'), 'utf8');
	assertContains(siteAdapter, "from '../site.config'", 'src/config/site.ts must read from src/site.config.ts');
	assertContains(siteAdapter, 'THEME_CONFIG.site.title', 'src/config/site.ts must map site title from THEME_CONFIG.site.title');
	assertContains(
		siteAdapter,
		'THEME_CONFIG.site.description',
		'src/config/site.ts must map site description from THEME_CONFIG.site.description'
	);
	assertContains(siteAdapter, 'THEME_CONFIG.site.url', 'src/config/site.ts must map site url from THEME_CONFIG.site.url');
	assertContains(siteAdapter, 'THEME_CONFIG.site.author', 'src/config/site.ts must map site author from THEME_CONFIG.site.author');
	assertContains(
		siteAdapter,
		'THEME_CONFIG.site.tagline',
		'src/config/site.ts must map site tagline from THEME_CONFIG.site.tagline'
	);
	assertContains(
		siteAdapter,
		'THEME_CONFIG.site.heroByLocale',
		'src/config/site.ts must map site hero copy from THEME_CONFIG.site.heroByLocale'
	);

	const i18nAdapter = await readFile(path.join(cwd, 'src/i18n/config.ts'), 'utf8');
	assertContains(i18nAdapter, "from '../site.config'", 'src/i18n/config.ts must read locales from src/site.config.ts');
	assertContains(
		i18nAdapter,
		'THEME_CONFIG.i18n.supportedLocales',
		'src/i18n/config.ts must map locales from THEME_CONFIG.i18n.supportedLocales'
	);
	assertContains(
		i18nAdapter,
		'THEME_CONFIG.i18n.defaultLocale',
		'src/i18n/config.ts must map default locale from THEME_CONFIG.i18n.defaultLocale'
	);
	assertContains(
		i18nAdapter,
		'THEME_CONFIG.i18n.localeLabels',
		'src/i18n/config.ts must map labels from THEME_CONFIG.i18n.localeLabels'
	);

	const themeAdapter = await readFile(path.join(cwd, 'src/config/theme.ts'), 'utf8');
	assertContains(themeAdapter, "from '../site.config'", 'src/config/theme.ts must read from src/site.config.ts');
	assertContains(
		themeAdapter,
		'THEME_CONFIG.theme.blogPageSize',
		'src/config/theme.ts must map blog page size from THEME_CONFIG.theme.blogPageSize'
	);
	assertContains(
		themeAdapter,
		'THEME_CONFIG.theme.homeLatestCount',
		'src/config/theme.ts must map home latest count from THEME_CONFIG.theme.homeLatestCount'
	);
	assertContains(
		themeAdapter,
		'THEME_CONFIG.theme.enableAboutPage',
		'src/config/theme.ts must map about toggle from THEME_CONFIG.theme.enableAboutPage'
	);
	assertContains(
		themeAdapter,
		'THEME_CONFIG.theme.pagination',
		'src/config/theme.ts must map pagination settings from THEME_CONFIG.theme.pagination'
	);
	assertContains(
		themeAdapter,
		'THEME_CONFIG.theme.effects.enableRedQueen',
		'src/config/theme.ts must map red queen effect from THEME_CONFIG.theme.effects.enableRedQueen'
	);

	const aboutAdapter = await readFile(path.join(cwd, 'src/config/about.ts'), 'utf8');
	assertContains(aboutAdapter, "from '../site.config'", 'src/config/about.ts must read from src/site.config.ts');
	assertContains(
		aboutAdapter,
		'ABOUT_CONFIG = THEME_CONFIG.about',
		'src/config/about.ts must expose THEME_CONFIG.about as ABOUT_CONFIG'
	);

	const socialAdapter = await readFile(path.join(cwd, 'src/config/social.ts'), 'utf8');
	assertContains(socialAdapter, "from '../site.config'", 'src/config/social.ts must read from src/site.config.ts');
	assertContains(
		socialAdapter,
		'SOCIAL_LINKS: SocialLink[] = THEME_CONFIG.social.links',
		'src/config/social.ts must map social links from THEME_CONFIG.social.links'
	);

	if (issues.length > 0) {
		console.error('Adapter contract check failed:');
		for (const issue of issues) console.error(`- ${issue}`);
		process.exit(1);
	}

	console.log('Adapter contract check passed.');
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
