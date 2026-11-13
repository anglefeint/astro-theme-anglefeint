import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareCovers, coverData, coverFiles } from './prepare.mjs';
import markdown from '../markdown.mjs';
import { fragmentImagePlugin } from './fragment-markdown.mjs';

const virtualId = 'virtual:anglefeint-blog-covers';

export default function blogCovers({ mathEnabled = true } = {}) {
  let state, config, data;
  return {
    name: 'anglefeint-blog-covers',
    hooks: {
      'astro:config:setup': async ({ config: current, command, updateConfig, logger }) => {
        config = current;
        state = await prepareCovers({
          root: fileURLToPath(config.root),
          srcDir: fileURLToPath(config.srcDir),
          publicDir: config.publicDir ? fileURLToPath(config.publicDir) : undefined,
          base: config.base,
          check: command !== 'dev',
        });
        data = coverData(state, config.base);
        if (state.encoded)
          logger.info(
            `Prepared ${state.encoded} persistent cover variants; commit src/assets/blog/covers/.`
          );
        updateConfig({
          markdown: {
            processor: markdown({
              enabled: mathEnabled,
              fragmentImages: fragmentImagePlugin(() => data),
            }),
          },
          vite: {
            plugins: [
              {
                name: 'anglefeint-cover-manifest',
                resolveId(id) {
                  if (id === virtualId) return '\0' + id;
                },
                load(id) {
                  if (id === '\0' + virtualId) return `export default ${JSON.stringify(data)};`;
                },
              },
            ],
          },
        });
      },
      'astro:server:setup': ({ server, logger }) => {
        let timer,
          disposed = false,
          queue = Promise.resolve();
        const prefix = `${config.base.replace(/\/$/, '')}/_blog-covers/`;
        server.middlewares.use((req, res, next) => {
          const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
          if (!pathname.startsWith(prefix) || !['GET', 'HEAD'].includes(req.method)) return next();
          const name = pathname.slice(prefix.length);
          if (!coverFiles(state).some((item) => item.file === name)) return next();
          readFile(path.join(state.generated, name))
            .then((bytes) => {
              res.setHeader('Content-Type', 'image/webp');
              res.setHeader('Cache-Control', 'no-cache');
              res.setHeader('Content-Length', bytes.length);
              res.end(req.method === 'HEAD' ? undefined : bytes);
            })
            .catch(next);
        });
        const changed = (event, file) => {
          if (disposed || !['add', 'change', 'unlink'].includes(event)) return;
          const relative = path.relative(state.srcDir, file).replaceAll('\\', '/');
          const known = Object.keys(state.manifest.sources).some(
            (key) => path.resolve(state.root, key) === path.resolve(file)
          );
          if (
            !known &&
            !/^content\/(?:blog|fragments)\/.*\.mdx?$/.test(relative) &&
            !/^assets\/blog\/(?:default-covers\/|covers\/originals\/|covers\/generated\/|covers\/manifest\.json$)/.test(
              relative
            )
          )
            return;
          clearTimeout(timer);
          timer = setTimeout(() => {
            queue = queue
              .then(async () => {
                if (disposed) return;
                const updated = await prepareCovers({
                  root: state.root,
                  srcDir: state.srcDir,
                  publicDir: state.publicDir,
                  base: config.base,
                });
                const updatedData = coverData(updated, config.base);
                const differs =
                  updated.encoded > 0 || JSON.stringify(updatedData) !== JSON.stringify(data);
                state = updated;
                data = updatedData;
                if (!disposed && differs) {
                  const module = server.moduleGraph.getModuleById('\0' + virtualId);
                  if (module) server.moduleGraph.invalidateModule(module);
                  server.ws.send({ type: 'full-reload' });
                }
              })
              .catch((error) => logger.error(error.message));
          }, 100);
        };
        server.watcher.add([state.srcDir, state.publicDir]);
        server.watcher.on('all', changed);
        server.httpServer?.once('close', () => {
          disposed = true;
          clearTimeout(timer);
          server.watcher.off('all', changed);
        });
      },
      'astro:build:done': async ({ dir }) => {
        const directory = path.join(fileURLToPath(dir), '_blog-covers'),
          files = coverFiles(state);
        if (files.length) await mkdir(directory, { recursive: true });
        if (files.length) {
          const outputRoot = await realpath(fileURLToPath(dir));
          const relative = path.relative(outputRoot, await realpath(directory));
          if (
            !relative ||
            relative === '..' ||
            relative.startsWith('..' + path.sep) ||
            path.isAbsolute(relative)
          )
            throw new Error('[covers] Output directory escapes the build destination.');
        }
        for (const variant of files) {
          const bytes = await readFile(path.join(state.generated, variant.file));
          if (createHash('sha256').update(bytes).digest('hex') !== variant.sha256)
            throw new Error('[covers] A variant changed during build; prepare covers again.');
          const target = path.join(directory, variant.file);
          try {
            await writeFile(target, bytes, { flag: 'wx' });
          } catch (error) {
            if (error.code !== 'EEXIST' || !(await readFile(target)).equals(bytes))
              throw new Error(`[covers] Refusing to overwrite output: ${target}`, { cause: error });
          }
        }
      },
    },
  };
}
