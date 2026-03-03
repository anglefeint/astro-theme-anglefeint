#!/usr/bin/env node

import { existsSync } from 'node:fs';
import path from 'node:path';

const required = [
	'public/fonts/atkinson-regular.woff',
	'public/fonts/atkinson-bold.woff',
];

const missing = required.filter((rel) => !existsSync(path.join(process.cwd(), rel)));

if (missing.length > 0) {
	console.error('Missing required font assets:');
	for (const rel of missing) console.error(`- ${rel}`);
	console.error('\nFix: copy these files from the starter template into public/fonts/.');
	process.exit(1);
}

console.log('Font asset check passed.');
