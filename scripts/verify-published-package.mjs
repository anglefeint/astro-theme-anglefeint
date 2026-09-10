import assert from 'node:assert/strict';
import { setTimeout } from 'node:timers/promises';

// Retry visibility/download checks only. Never retry a publish operation here.
export async function verifyPublishedPackage({
  name,
  version,
  tag = 'latest',
  capture,
  destination,
  attempts = 12,
  delayMs = 10000,
  sleep = setTimeout,
  log = console.log,
}) {
  assert.ok(Number.isInteger(attempts) && attempts > 0);
  let cause;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const options = ['--json', '--prefer-online', '--fetch-retries=0', '--fetch-timeout=15000'];
      const visible = JSON.parse(await capture(['view', `${name}@${tag}`, 'version', ...options]));
      assert.equal(visible, version, `Registry tag ${tag} has not reached ${version}`);
      const packed = JSON.parse(
        await capture([
          'pack',
          `${name}@${version}`,
          '--ignore-scripts',
          '--pack-destination',
          destination,
          ...options,
        ])
      );
      assert.equal(packed.length, 1);
      assert.equal(packed[0].name, name);
      assert.equal(packed[0].version, version);
      assert.ok(packed[0].integrity, 'Downloaded package must have integrity metadata');
      log(`[release] Registry ${tag} and tarball verified: ${name}@${version}`);
      return packed[0];
    } catch (error) {
      cause = error;
      if (attempt < attempts) {
        log(`[release] Registry not ready (${attempt}/${attempts}); retrying verification...`);
        await sleep(delayMs);
      }
    }
  }
  throw new Error(
    `Publish was accepted, but registry verification failed for ${name}@${version}. ` +
      'Do not republish this version or sync starter yet. Verify the tag and download with npm view/npm pack, then resume starter delivery.',
    { cause }
  );
}
