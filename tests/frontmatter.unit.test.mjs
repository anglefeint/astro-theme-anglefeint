import test from 'node:test';
import assert from 'node:assert/strict';
import parse from '../scripts/parse-frontmatter.mjs';

test('YAML metadata supports arrays, nesting, quoted delimiters and multiline values', () => {
  const result = parse(
    '---\ndoc_scope: [config, seo]\nsource_of_truth: true\nlabels:\n  zh: 中文\ntext: |\n  ---\n  prose\n---\n# Body\n---\n'
  );
  assert.deepEqual(result.data.doc_scope, ['config', 'seo']);
  assert.equal(result.data.source_of_truth, true);
  assert.equal(result.data.labels.zh, '中文');
  assert.equal(result.data.text, '---\nprose\n');
  assert.equal(result.content, '# Body\n---\n');
});

test('BOM, CRLF, sidecars without trailing newline and missing frontmatter', () => {
  assert.equal(parse('\uFEFF---\r\na: 1\r\n---\r\nBody').data.a, 1);
  assert.equal(parse('---\na: 1\n---').data.a, 1);
  assert.equal(parse('---\na: 1\n...\nBody').content, 'Body');
  assert.deepEqual(parse('# No metadata'), { matter: '', data: {}, content: '# No metadata' });
  assert.deepEqual(parse('---\n---').data, {});
});

test('malformed, duplicate or unclosed metadata throws instead of hiding errors', () => {
  for (const source of ['---\na: [\n---', '---\na: 1\na: 2\n---', '---\na: 1']) {
    assert.throws(() => parse(source));
  }
});
