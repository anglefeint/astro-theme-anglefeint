import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadProjectModule, loadProjectLocales } from './project-config.mjs';

export async function newFragment(args, root = process.cwd()) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log('Usage: astro-theme new-fragment [--locales en,zh]');
    return [];
  }
  if (args.length && (args.length !== 2 || args[0] !== '--locales' || !args[1]))
    throw new Error('Usage: astro-theme new-fragment [--locales en,zh]');
  const enabled = await loadProjectLocales(root);
  const { THEME_CONFIG } = await loadProjectModule(path.join(root, 'src/site.config.ts'));
  const locales = args.length
    ? [...new Set(args[1].split(','))]
    : [THEME_CONFIG.i18n.defaultLocale];
  if (locales.some((locale) => !enabled.includes(locale)))
    throw new Error('Use enabled locale codes from src/site.config.ts.');
  const id = randomUUID();
  const now = new Date().toISOString();
  const files = [];
  for (const locale of locales) {
    const file = path.join(root, 'src/content/fragments', locale, `${now.slice(0, 10)}-${id}.md`);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, `---\nid: ${id}\npubDate: ${now}\n---\n\n…\n`, { flag: 'wx' });
    files.push(file);
    console.log(`Created ${file}`);
  }
  return files;
}
