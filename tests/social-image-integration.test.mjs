import test from 'node:test';
import assert from 'node:assert/strict';
import { URL, pathToFileURL } from 'node:url';
import process from 'node:process';
import socialImage from '../packages/theme/src/social-image.mjs';

test('social renderer retains Node dependency context without externalizing unrelated imports', () => {
  let route;
  let update;
  socialImage().hooks['astro:config:setup']({
    config: { publicDir: pathToFileURL(process.cwd() + '/public/') },
    injectRoute: (value) => {
      route = value;
    },
    updateConfig: (value) => {
      update = value;
    },
  });
  const plugin = update.vite.plugins[0];
  const resolved = plugin.resolveId('./render.mjs', route.entrypoint);
  assert.equal(resolved.external, true);
  assert.equal(
    resolved.id,
    new URL('../packages/theme/src/social/render.mjs', import.meta.url).href
  );
  assert.equal(plugin.resolveId('./render.mjs', '/another/project/endpoint.ts'), undefined);
  assert.equal(plugin.resolveId('satori', route.entrypoint), undefined);
  assert.equal(plugin.resolveId('virtual:anglefeint-social'), '\0virtual:anglefeint-social');
});
