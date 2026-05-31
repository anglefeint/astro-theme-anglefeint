import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('scaffold npm scripts call package-owned bins directly', async () => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'));

  assert.equal(packageJson.scripts['new-post'], 'anglefeint-new-post');
  assert.equal(packageJson.scripts['new-page'], 'anglefeint-new-page');
});
