import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const themeEntry = require.resolve('@anglefeint/astro-theme');
const themeRoot = path.resolve(path.dirname(themeEntry), '..');
const entry = path.join(themeRoot, 'src/cli-new-post.mjs');

await import(pathToFileURL(entry).href);
