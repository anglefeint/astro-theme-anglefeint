import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

/** Build-only integration: the deployed site needs no Node process. */
export default function search({ enabled = true } = {}) {
  return {
    name: 'anglefeint-search',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (!enabled) return;
        const pagefind = await import('pagefind');
        const check = (result) => {
          if (result.errors?.length) throw new Error(result.errors.join('\n'));
          return result;
        };
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
          check(await index.writeFiles({ outputPath }));
          // A zero-article site must stay empty, never index unrelated page chrome.
          // addDirectory.page_count counts scanned files, including excluded pages.
          const entry = JSON.parse(
            await readFile(path.join(outputPath, 'pagefind-entry.json'), 'utf8')
          );
          const languages = Object.keys(entry.languages);
          const count = Object.values(entry.languages).reduce(
            (total, language) => total + language.page_count,
            0
          );
          await writeFile(
            path.join(outputPath, 'anglefeint.json'),
            JSON.stringify({
              languages,
            })
          );
          logger.info(`Indexed ${count} articles for search.`);
        } finally {
          if (index) await index.deleteIndex();
          await pagefind.close();
        }
      },
    },
  };
}
