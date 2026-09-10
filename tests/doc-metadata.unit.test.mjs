import test from 'node:test';
import assert from 'node:assert/strict';
import { metadataStringIssues } from '../scripts/doc-metadata-fields.mjs';

test('document identity must be textual; purpose remains optional', () => {
  assert.deepEqual(metadataStringIssues({ doc_id: 'guide', doc_role: 'user-guide' }), []);
  for (const key of ['doc_id', 'doc_role', 'doc_purpose']) {
    for (const value of [123, null, true, {}, [], '', '  ']) {
      assert.equal(metadataStringIssues({ [key]: value }).length, 1);
    }
  }
});
