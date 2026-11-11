// CLI only: existing Markdown IDs are the authority, not filenames or translated slugs.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { customAlphabet } from 'nanoid';
import { load } from 'js-yaml';

const generateId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  8
);

export function chooseFragmentId(existing, generate = generateId) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const id = generate();
    if (!/^[A-Za-z0-9]{8}$/.test(id)) throw new Error('Invalid generated fragment ID.');
    if (!existing.has(id)) return id;
  }
  throw new Error('Unable to generate an unused fragment ID; no files were created.');
}

export async function collectFragmentIds(root) {
  const directory = path.join(root, 'src/content/fragments');
  let entries;
  try {
    entries = await readdir(directory, { recursive: true, withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return new Set();
    throw error;
  }
  const ids = new Set();
  for (const entry of entries) {
    if (!entry.isFile() || !/\.md$/i.test(entry.name)) continue;
    const file = path.join(entry.parentPath, entry.name);
    const source = (await readFile(file, 'utf8')).replace(/^\uFEFF/, '');
    const opening = /^---[ \t]*\r?\n/.exec(source);
    if (!opening) continue;
    const rest = source.slice(opening[0].length);
    const closing = /^(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/m.exec(rest);
    if (!closing) throw new Error(`Unclosed fragment frontmatter: ${file}`);
    const data = load(rest.slice(0, closing.index));
    if (typeof data?.id !== 'string' || !/^[A-Za-z0-9]{8}$/.test(data.id))
      throw new Error(`Fragment id must contain exactly 8 ASCII letters or digits: ${file}`);
    ids.add(data.id);
  }
  return ids;
}
