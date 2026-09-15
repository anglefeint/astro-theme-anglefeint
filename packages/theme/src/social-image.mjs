import { fileURLToPath } from 'node:url';

/** Prerendered image endpoints; no production image server is required. */
export default function socialImage() {
  return {
    name: 'anglefeint-social-image',
    hooks: {
      'astro:config:setup': ({ config, injectRoute, updateConfig }) => {
        injectRoute({
          pattern: '/_social/[key].png',
          entrypoint: fileURLToPath(new URL('./social/endpoint.ts', import.meta.url)),
          prerender: true,
        });
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'anglefeint-social-config',
                resolveId(id) {
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
