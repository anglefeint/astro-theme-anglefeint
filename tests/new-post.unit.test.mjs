import test from 'node:test';
import assert from 'node:assert/strict';
import {
	buildNewPostTemplate,
	parseNewPostArgs,
	pickDefaultCoverBySlug,
	resolveLocales,
	validatePostSlug,
} from '../packages/theme/src/scaffold/new-post.mjs';

test('parseNewPostArgs parses slug and locales override', () => {
	const parsed = parseNewPostArgs(['node', 'cli', 'my-post', '--locales', 'en,ja']);
	assert.equal(parsed.slug, 'my-post');
	assert.equal(parsed.locales, 'en,ja');
});

test('validatePostSlug accepts lowercase-hyphen slugs', () => {
	assert.equal(validatePostSlug('hello-world'), true);
	assert.equal(validatePostSlug('hello_world'), false);
	assert.equal(validatePostSlug('Hello-world'), false);
});

test('pickDefaultCoverBySlug is deterministic for same slug', () => {
	const covers = ['/tmp/covers/ai-01.webp', '/tmp/covers/cyber-01.webp', '/tmp/covers/matrix-01.webp'];
	const localeDir = '/tmp/project/src/content/blog/en';
	const first = pickDefaultCoverBySlug('hello-world', localeDir, covers);
	const second = pickDefaultCoverBySlug('hello-world', localeDir, covers);
	assert.equal(first, second);
	assert.match(first, /^(\.\.\/)+.+\.(webp|png|jpg|jpeg)$/);
});

test('buildNewPostTemplate emits expected locale strings', () => {
	const template = buildNewPostTemplate('es', 'hola-mundo', '2026-03-03', '../../../assets/blog/default-covers/ai-01.webp');
	assert.match(template, /title: 'Título del nuevo artículo'/);
	assert.match(template, /Plantilla breve en español/);
	assert.match(template, /heroImage: '\.\.\/\.\.\/\.\.\/assets\/blog\/default-covers\/ai-01\.webp'/);
});

test('resolveLocales uses defaults when no override is provided', () => {
	const locales = resolveLocales({
		cliLocales: '',
		envLocales: '',
		defaultLocales: ['en', 'ja', 'ko'],
	});
	assert.deepEqual(locales, ['en', 'ja', 'ko']);
});

test('resolveLocales prefers cli override and deduplicates values', () => {
	const locales = resolveLocales({
		cliLocales: 'en,ja,en,es',
		envLocales: 'ko,zh',
		defaultLocales: ['en'],
	});
	assert.deepEqual(locales, ['en', 'ja', 'es']);
});

test('resolveLocales rejects invalid locale tokens', () => {
	assert.throws(
		() =>
			resolveLocales({
				cliLocales: 'en,@@',
				envLocales: '',
				defaultLocales: ['en'],
			}),
		/Invalid locale/,
	);
});
