import { fileURLToPath } from 'node:url';
import { Buffer } from 'node:buffer';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const check = (result) => {
  if (result.errors?.length) throw new Error(result.errors.join('\n'));
  return result;
};

export async function writeSearchIndex(index, outputPath) {
  // Pagefind 1.5.2's native writeFiles can return before Tokio flushes its files.
  // Transfer the completed bytes instead, and own the awaited write boundary.
  const { files } = check(await index.getFiles());
  const entryFile = files.find((file) => file.path === 'pagefind-entry.json');
  if (!entryFile) throw new Error('Pagefind did not return pagefind-entry.json.');
  const entry = JSON.parse(Buffer.from(entryFile.content).toString('utf8'));
  // addDirectory.page_count counts scanned files, including excluded pages.
  const languages = Object.keys(entry.languages);
  const count = Object.values(entry.languages).reduce(
    (total, language) => total + language.page_count,
    0
  );
  for (const file of files) {
    const destination = path.join(outputPath, file.path);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, file.content);
  }
  await writeFile(path.join(outputPath, 'anglefeint.json'), JSON.stringify({ languages }));
  return count;
}

/** Build-only integration: the deployed site needs no Node process. */
export default function search({ enabled = true } = {}) {
  return {
    name: 'anglefeint-search',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (!enabled) return;
        const pagefind = await import('pagefind');
        let index;
        try {
          ({ index } = check(
            await pagefind.createIndex({
              rootSelector: '[data-anglefeint-search]',
            })
          ));
          if (!index) throw new Error('Pagefind did not create an index.');
          check(await index.addDirectory({ path: fileURLToPath(dir) }));
          const outputPath = path.join(fileURLToPath(dir), 'pagefind');
          const count = await writeSearchIndex(index, outputPath);
          logger.info(`Indexed ${count} articles for search.`);
        } finally {
          if (index) await index.deleteIndex();
          await pagefind.close();
        }
      },
    },
  };
}
