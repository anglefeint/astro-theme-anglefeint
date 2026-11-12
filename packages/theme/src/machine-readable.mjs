import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { generateMachineReadable } from './machine/generate.mjs';

/** Build-only export of public articles, Fragments and About; no production server. */
export default function machineReadable({ title, description, aiReadableContent, locales } = {}) {
  let config;
  return {
    name: 'anglefeint-machine-readable',
    hooks: {
      'astro:config:done': ({ config: resolved }) => {
        config = resolved;
      },
      'astro:build:done': async ({ dir, logger }) => {
        const started = performance.now();
        const result = await generateMachineReadable({
          dir: fileURLToPath(dir),
          site: config.site,
          base: config.base,
          title,
          description,
          aiReadableContent,
          locales,
          manifestPath: path.join(fileURLToPath(config.cacheDir), 'machine-readable.json'),
        });
        logger.info(
          `Exported ${result.articles} articles, ${result.fragments} Fragments and ${result.about} About pages in ${result.locales} languages (${Math.round(performance.now() - started)}ms).`
        );
      },
    },
  };
}
