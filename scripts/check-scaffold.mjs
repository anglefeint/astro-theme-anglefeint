import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const themeEntry = require.resolve('@anglefeint/astro-theme');
const themeRoot = path.resolve(path.dirname(themeEntry), '..');
const cliNewPage = path.join(themeRoot, 'src/cli-new-page.mjs');
const cliNewPost = path.join(themeRoot, 'src/cli-new-post.mjs');

async function runNode(scriptPath, args, cwd) {
	await execFileAsync('node', [scriptPath, ...args], { cwd });
}

async function main() {
	const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'anglefeint-scaffold-'));
	try {
		const pagesRoot = path.join(tempRoot, 'src/pages/[lang]');
		const coversRoot = path.join(tempRoot, 'src/assets/blog/default-covers');
		await mkdir(pagesRoot, { recursive: true });
		await mkdir(coversRoot, { recursive: true });
		await writeFile(path.join(coversRoot, 'ai-01.webp'), 'cover', 'utf8');

		await runNode(cliNewPage, ['scaffold-check', '--theme', 'ai'], tempRoot);
		await runNode(cliNewPost, ['scaffold-check-post'], tempRoot);

		const pageFile = path.join(pagesRoot, 'scaffold-check.astro');
		const pageText = await readFile(pageFile, 'utf8');
		assert.match(pageText, /import AiPageLayout from '@anglefeint\/astro-theme\/layouts\/AiPageLayout\.astro';/);
		assert.match(pageText, /import \{ SUPPORTED_LOCALES, type Locale \} from '@anglefeint\/site-i18n\/config';/);
		assert.doesNotMatch(pageText, /@anglefeint\/astro-theme\/i18n\/config/);

		const postFile = path.join(tempRoot, 'src/content/blog/en/scaffold-check-post.md');
		const postText = await readFile(postFile, 'utf8');
		assert.match(postText, /title: 'Scaffold Check Post'/);
		assert.match(postText, /heroImage: '\.\.\/\.\.\/\.\.\/assets\/blog\/default-covers\/ai-01\.webp'/);

		console.log('Scaffold checks passed.');
	} finally {
		await rm(tempRoot, { recursive: true, force: true });
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
