#!/usr/bin/env node

import { existsSync } from 'node:fs';
import path from 'node:path';

const required = [
  'packages/theme/src/assets/theme/fonts/atkinson-regular.woff',
  'packages/theme/src/assets/theme/fonts/atkinson-bold.woff',
  'packages/theme/src/assets/theme/fonts/ff2a407fe06752facf8828a86955e988.woff2',
  'packages/theme/src/assets/theme/fonts/ff2a407fe06752facf8828a86955e988.ttf',
];

const missing = required.filter((rel) => !existsSync(path.join(process.cwd(), rel)));

if (missing.length > 0) {
  console.error('Missing required font assets:');
  for (const rel of missing) console.error(`- ${rel}`);
  console.error(
    '\nFix: restore the package-owned font assets; consumer public/fonts is not the theme runtime source.'
  );
  process.exit(1);
}

console.log('Font asset check passed.');
