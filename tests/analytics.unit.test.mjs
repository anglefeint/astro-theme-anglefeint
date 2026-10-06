import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { URL } from 'node:url';
import { normalizeGoogleAnalyticsId } from '../packages/theme/src/utils/analytics.ts';

const source = readFileSync(
  new URL('../packages/theme/src/scripts/google-analytics.js', import.meta.url),
  'utf8'
);
const fixture = (hostname, id = 'G-TEST123456') => {
  const scripts = [];
  const context = vm.createContext({
    window: { location: { hostname } },
    document: {
      currentScript: { dataset: { gaId: id } },
      createElement: () => ({}),
      head: { appendChild: (script) => scripts.push(script) },
    },
  });
  return { context, scripts, run: () => vm.runInContext(source, context) };
};

test('GA4 accepts only a measurement ID or an empty/omitted setting', () => {
  for (const value of ['', '  ', undefined]) assert.equal(normalizeGoogleAnalyticsId(value), '');
  assert.equal(normalizeGoogleAnalyticsId(' G-ABC123 '), 'G-ABC123');
  for (const value of [null, 123, false, '123456', 'GTM-123', 'UA-123', 'G-', 'G-ABC<script>']) {
    assert.throws(() => normalizeGoogleAnalyticsId(value), /analytics.googleAnalyticsId/);
  }
});

test('local previews and missing IDs never load Google or initialize a queue', () => {
  for (const host of [
    'localhost',
    'LOCALHOST',
    'blog.localhost',
    '127.0.0.1',
    '127.1.2.3',
    '[::1]',
    '::1',
    '0.0.0.0',
  ]) {
    const f = fixture(host);
    f.run();
    assert.equal(f.scripts.length, 0);
    assert.equal(f.context.window.dataLayer, undefined);
  }
  const f = fixture('blog.example', '');
  f.run();
  assert.equal(f.scripts.length, 0);
});

test('production initializes once and queues only the automatic pageview configuration', () => {
  const f = fixture('blog.example');
  f.run();
  f.run();
  assert.equal(f.scripts.length, 1);
  assert.equal(f.scripts[0].async, true);
  assert.equal(f.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST123456');
  const commands = Array.from(f.context.window.dataLayer, (args) => Array.from(args));
  assert.equal(commands.length, 2);
  assert.equal(commands[0][0], 'js');
  assert.deepEqual(commands[1], ['config', 'G-TEST123456']);
  // A blocked external script leaves a harmless queue; no callback is required.
});

test('existing dataLayer and consent commands are preserved', () => {
  const f = fixture('blog.example');
  const queue = [['consent', 'default', { analytics_storage: 'denied' }]];
  f.context.window.dataLayer = queue;
  f.run();
  assert.equal(f.context.window.dataLayer, queue);
  assert.equal(queue[0][0], 'consent');
  assert.equal(queue.length, 3);
});
