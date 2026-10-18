import { createEffectScope } from '../packages/theme/src/scripts/effects/lifecycle.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';
import vm from 'node:vm';

test('reduced motion hides the monitor without images, requests or timers', async () => {
  const shell = { style: {}, hidden: false };
  const elements = {
    '.rq-tv': shell,
    '.rq-tv-stage': { getAttribute: () => '/animated.webp' },
    '.rq-tv-toggle': {},
  };
  const source = await readFile(
    new URL('../packages/theme/src/scripts/blogpost/red-queen-tv.js', import.meta.url),
    'utf8'
  );
  const context = vm.createContext({
    createEffectScope,
    document: { querySelector: (selector) => elements[selector] },
    Image: class {
      constructor() {
        assert.fail('must not load animated images');
      }
    },
    setTimeout: () => assert.fail('must not schedule animation'),
    fetch: () => assert.fail('must not fetch playlist'),
  });
  vm.runInContext(
    source.replace(/^import .*;\r?\n/, '').replace('export function', 'function') +
      '\ninitRedQueenTv(true);',
    context
  );
  assert.equal(shell.hidden, true);
  assert.equal(shell.style.display, 'none');
});
