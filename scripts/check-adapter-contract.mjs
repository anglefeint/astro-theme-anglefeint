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
	if (!siteAdapter.includes("from '../site.config'")) {
		issues.push('src/config/site.ts must read from src/site.config.ts');
	}

	const i18nAdapter = await readFile(path.join(cwd, 'src/i18n/config.ts'), 'utf8');
	if (!i18nAdapter.includes("from '../site.config'")) {
		issues.push('src/i18n/config.ts must read locales from src/site.config.ts');
	}

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
