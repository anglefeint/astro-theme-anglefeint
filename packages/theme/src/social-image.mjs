import { fileURLToPath } from 'node:url';

/** Prerendered image endpoints; no production image server is required. */
export default function socialImage() {
  const endpoint = fileURLToPath(new URL('./social/endpoint.ts', import.meta.url));
  const renderer = new URL('./social/render.mjs', import.meta.url).href;
  return {
    name: 'anglefeint-social-image',
    hooks: {
      'astro:config:setup': ({ config, injectRoute, updateConfig }) => {
        injectRoute({
          pattern: '/_social/[key].png',
          entrypoint: endpoint,
          prerender: true,
        });
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'anglefeint-social-config',
                enforce: 'pre',
                resolveId(id, importer) {
                  // This build-only module must keep Node's package-local dependency
                  // resolution. Bundling it can inline Yoga's CommonJS glue into ESM
                  // under pnpm and lose __dirname/native module context.
                  if (
                    id === './render.mjs' &&
                    importer?.split('?')[0].replaceAll('\\', '/') === endpoint.replaceAll('\\', '/')
                  )
                    return { id: renderer, external: true };
                  if (id === 'virtual:anglefeint-social') return '\0' + id;
                },
                load(id) {
                  if (id === '\0virtual:anglefeint-social') {
                    return `export const publicDir = ${JSON.stringify(fileURLToPath(config.publicDir))};`;
                  }
                },
              },
            ],
          },
        });
      },
    },
  };
}
