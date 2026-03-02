import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNewPostTemplate, pickDefaultCoverBySlug, validatePostSlug } from '../packages/theme/src/scaffold/new-post.mjs';

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
