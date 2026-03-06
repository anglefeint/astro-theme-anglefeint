import test from 'node:test';
import assert from 'node:assert/strict';

const { countWords, extractText } = await import('../src/utils/metrics.ts');

test('countWords counts whitespace-delimited English words', () => {
  assert.equal(countWords('hello world from anglefeint'), 4);
});

test('countWords counts CJK characters when no spaces are present', () => {
  assert.equal(countWords('你好世界'), 4);
  assert.equal(countWords('こんにちは'), 5);
  assert.equal(countWords('안녕하세요'), 5);
});

test('countWords counts mixed English and CJK content', () => {
  assert.equal(countWords('Hello 世界 builder'), 4);
  assert.equal(countWords('AI 重构 humanity 的 future'), 6);
});

test('extractText strips markdown formatting before counting', () => {
  const text = extractText(
    '# Title\n\nVisit [Anglefeint](https://example.com) and `code`.\n\n```js\nconst x = 1;\n```'
  );
  assert.equal(text, 'Title Visit and .');
  assert.equal(countWords('# 标题\n\n欢迎来到 [Anglefeint](https://example.com)'), 6);
});
