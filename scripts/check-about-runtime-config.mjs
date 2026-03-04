import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST_DIR = join(process.cwd(), 'dist');

if (!existsSync(DIST_DIR)) {
  console.error('[check:about-runtime] dist directory not found. Run npm run build first.');
  process.exit(1);
}

const localeDirs = readdirSync(DIST_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const aboutPages = localeDirs
  .map((locale) => join(DIST_DIR, locale, 'about', 'index.html'))
  .filter((filePath) => existsSync(filePath));

if (aboutPages.length === 0) {
  console.error('[check:about-runtime] no localized about pages found in dist.');
  process.exit(1);
}

const errors = [];

for (const filePath of aboutPages) {
  const html = readFileSync(filePath, 'utf8');

  if (html.includes('JSON.stringify(aboutRuntimeConfig)')) {
    errors.push(`${filePath}: found unevaluated runtime config template literal.`);
    continue;
  }

  const scriptMatch = html.match(
    /<script id="hacker-runtime-config" type="application\/json">([\s\S]*?)<\/script>/
  );
  if (!scriptMatch) {
    errors.push(`${filePath}: hacker runtime config script block not found.`);
    continue;
  }

  const payload = scriptMatch[1].trim();
  if (!payload) {
    errors.push(`${filePath}: hacker runtime config payload is empty.`);
    continue;
  }

  let runtimeConfig = null;
  try {
    runtimeConfig = JSON.parse(payload);
  } catch (error) {
    errors.push(`${filePath}: runtime config is not valid JSON (${error.message}).`);
    continue;
  }

  const modalContent = runtimeConfig?.modalContent;
  const requiredModalKeys = ['dl-data', 'ai', 'decryptor', 'help', 'all-scripts'];
  const missingKeys = requiredModalKeys.filter((key) => !modalContent || !modalContent[key]);
  if (missingKeys.length > 0) {
    errors.push(`${filePath}: runtime config missing modal keys: ${missingKeys.join(', ')}.`);
    continue;
  }

  const aiBody = modalContent.ai?.body;
  if (typeof aiBody !== 'string' || aiBody.trim().length === 0) {
    errors.push(`${filePath}: runtime config has empty AI modal content.`);
  }
}

if (errors.length > 0) {
  console.error('[check:about-runtime] validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`[check:about-runtime] OK (${aboutPages.length} about page(s) validated).`);
