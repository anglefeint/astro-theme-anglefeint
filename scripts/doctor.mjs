import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export async function inspectProject(root) {
  const issues = [];
  const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  for (const [name, bin] of [
    ['new-post', 'anglefeint-new-post'],
    ['new-page', 'anglefeint-new-page'],
  ]) {
    const command = pkg.scripts?.[name];
    if (command?.includes(`scripts/${name}.mjs`)) {
      issues.push(
        `package.json: legacy ${name} wrapper; set scripts.${name} to "${bin}" after updating the theme package.`
      );
    }
  }
  const config = await readFile(path.join(root, 'astro.config.mjs'), 'utf8');
  if (/return\s+path\s*!==\s*['"]\/en\/['"]\s*&&\s*path\s*!==\s*['"]\/en['"]/.test(config)) {
    issues.push(
      'astro.config.mjs: legacy English-only sitemap filter. Review the current starter filter and preserve your chosen routing mode and other integrations.'
    );
  }
  const index = await readFile(path.join(root, 'src/pages/index.astro'), 'utf8');
  if (
    index.includes('const locale = DEFAULT_LOCALE;') &&
    index.includes('<HomePage locale={locale} latestPosts={latestPosts} />') &&
    !index.includes('shouldRedirectRootToDefaultLocale')
  ) {
    issues.push(
      'src/pages/index.astro: legacy unconditional home rendering. Review the current starter root redirect before migrating; preserve custom page content.'
    );
  }
  return issues;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const issues = await inspectProject(process.cwd());
    if (issues.length) {
      console.error(`Known starter migration issues (no files changed):\n- ${issues.join('\n- ')}`);
      process.exitCode = 1;
    } else {
      console.log(
        'No known legacy starter patterns found. Custom routing still requires build/SEO verification.'
      );
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
