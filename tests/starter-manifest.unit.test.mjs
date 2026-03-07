import test from 'node:test';
import assert from 'node:assert/strict';

import {
  STARTER_CONTENT_LOCALES,
  STARTER_CONTENT_MANAGED_FILES,
  STARTER_CONTENT_ROOT,
  STARTER_CONTENT_SLUGS,
} from '../scripts/starter-manifest.mjs';

test('starter content whitelist expands to the expected localized guide files', () => {
  assert.deepEqual(STARTER_CONTENT_LOCALES, ['en', 'es', 'ja', 'ko', 'zh']);
  assert.deepEqual(STARTER_CONTENT_SLUGS, [
    'welcome-to-anglefeint',
    'starter-guide-1-configure-your-site',
    'starter-guide-2-languages-and-routing',
    'starter-guide-3-comments-about-and-theme-toggles',
  ]);

  assert.equal(
    STARTER_CONTENT_MANAGED_FILES.length,
    STARTER_CONTENT_LOCALES.length * STARTER_CONTENT_SLUGS.length
  );

  for (const locale of STARTER_CONTENT_LOCALES) {
    for (const slug of STARTER_CONTENT_SLUGS) {
      assert.ok(
        STARTER_CONTENT_MANAGED_FILES.includes(`${STARTER_CONTENT_ROOT}/${locale}/${slug}.md`)
      );
    }
  }
});
