import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h') || args[0] === 'help') {
  console.log('Usage: npm run new-post -- <slug> [--locales en,ja,...]');
  console.log('Slug: lowercase letters, numbers, hyphens.');
  console.log('Locales override: --locales en,ja or ANGLEFEINT_LOCALES=en,ja');
  process.exit(0);
}

const require = createRequire(import.meta.url);
const themeEntry = require.resolve('@anglefeint/astro-theme');
const themeRoot = path.resolve(path.dirname(themeEntry), '..');
const entry = path.join(themeRoot, 'src/cli-new-post.mjs');

await import(pathToFileURL(entry).href);
