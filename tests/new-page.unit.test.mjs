import test from 'node:test';
import assert from 'node:assert/strict';
import {
	buildNewPageTemplate,
	isValidNewPageTheme,
	parseNewPageArgs,
	validatePageSlug,
} from '../packages/theme/src/scaffold/new-page.mjs';

test('parseNewPageArgs parses slug and theme', () => {
	const parsed = parseNewPageArgs(['node', 'cli', 'projects/labs', '--theme', 'ai']);
	assert.equal(parsed.slug, 'projects/labs');
	assert.equal(parsed.theme, 'ai');
});

test('validatePageSlug accepts nested lowercase-hyphen paths only', () => {
	assert.equal(validatePageSlug('projects/labs'), true);
	assert.equal(validatePageSlug('projects/my-labs'), true);
	assert.equal(validatePageSlug('_verify/labs'), false);
	assert.equal(validatePageSlug('Verify/labs'), false);
	assert.equal(validatePageSlug('/projects'), false);
});

test('theme whitelist is enforced', () => {
	assert.equal(isValidNewPageTheme('base'), true);
	assert.equal(isValidNewPageTheme('matrix'), true);
	assert.equal(isValidNewPageTheme('neon'), false);
});

test('buildNewPageTemplate uses site-i18n and typed locale contract', () => {
	const template = buildNewPageTemplate({ slug: 'projects', theme: 'ai' });
	assert.match(template, /import AiPageLayout from '@anglefeint\/astro-theme\/layouts\/AiPageLayout\.astro';/);
	assert.match(template, /import \{ SUPPORTED_LOCALES, type Locale \} from '@anglefeint\/site-i18n\/config';/);
	assert.match(template, /SUPPORTED_LOCALES\.map\(\(lang: Locale\)/);
	assert.match(template, /const locale = Astro\.params\.lang as Locale;/);
	assert.doesNotMatch(template, /@anglefeint\/astro-theme\/i18n\/config/);
});
