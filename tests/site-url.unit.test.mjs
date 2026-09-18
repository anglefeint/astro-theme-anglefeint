import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import test from 'node:test';
import { resolveSiteUrl } from '../scripts/resolve-site-url.mjs';

test('site origin follows dotenv mode and process override without mutating the environment', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'anglefeint-site-url-'));
  const previous = process.env.PUBLIC_SITE_URL;
  delete process.env.PUBLIC_SITE_URL;
  try {
    assert.equal(resolveSiteUrl('https://config.example', directory), 'https://config.example');
    await writeFile(path.join(directory, '.env'), 'PUBLIC_SITE_URL=https://dotenv.example\n');
    assert.equal(resolveSiteUrl('https://config.example', directory), 'https://dotenv.example');
    await writeFile(path.join(directory, '.env.local'), 'PUBLIC_SITE_URL=https://local.example\n');
    await writeFile(
      path.join(directory, '.env.production'),
      'PUBLIC_SITE_URL=https://production.example\n'
    );
    await writeFile(
      path.join(directory, '.env.development'),
      'PUBLIC_SITE_URL=https://dev.example\n'
    );
    await writeFile(
      path.join(directory, '.env.staging'),
      'PUBLIC_SITE_URL=https://staging.example\n'
    );
    assert.equal(
      resolveSiteUrl('https://config.example', directory, ['build']),
      'https://production.example'
    );
    assert.equal(
      resolveSiteUrl('https://config.example', directory, ['dev']),
      'https://dev.example'
    );
    assert.equal(
      resolveSiteUrl('https://config.example', directory, ['build', '--mode', 'staging']),
      'https://staging.example'
    );
    assert.equal(
      resolveSiteUrl('https://config.example', directory, ['build', '--mode=staging']),
      'https://staging.example'
    );
    assert.equal(process.env.PUBLIC_SITE_URL, undefined);
    process.env.PUBLIC_SITE_URL = 'https://hosting.example';
    assert.equal(
      resolveSiteUrl('https://config.example', directory, ['build']),
      'https://hosting.example'
    );
  } finally {
    if (previous === undefined) delete process.env.PUBLIC_SITE_URL;
    else process.env.PUBLIC_SITE_URL = previous;
    await rm(directory, { recursive: true, force: true });
  }
});
