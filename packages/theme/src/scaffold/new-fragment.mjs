import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadProjectLocales } from './project-config.mjs';
import { resolveLocales } from './shared.mjs';

export async function newFragment(args, root = process.cwd()) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log(
      'Usage: astro-theme new-fragment [--locales en,zh]\nLocales: --locales > ANGLEFEINT_LOCALES > all enabled project languages.\nCreates skeletons sharing one ID and timestamp; does not translate content.'
    );
    return [];
  }
  if (args.length && (args.length !== 2 || args[0] !== '--locales' || !args[1]))
    throw new Error('Usage: astro-theme new-fragment [--locales en,zh]');
  const cliLocales = args[1] ?? '';
  const envLocales = process.env.ANGLEFEINT_LOCALES ?? '';
  const locales = resolveLocales({
    cliLocales,
    envLocales,
    defaultLocales: cliLocales || envLocales ? [] : await loadProjectLocales(root),
  });
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
