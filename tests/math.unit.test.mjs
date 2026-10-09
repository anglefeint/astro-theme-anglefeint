import { test } from 'node:test';
import assert from 'node:assert/strict';
import { URL } from 'node:url';
import { markdownToHtml, mdxToJs } from 'satteri';
import markdown from '../packages/theme/src/markdown.mjs';

const options = (enabled = true) => ({
  ...markdown({ enabled }).options,
  fileURL: new URL('./math-test.md', import.meta.url),
});

test('math renders inline and display expressions with accessible output', async () => {
  const { html } = await markdownToHtml(
    String.raw`Inline $C_{saved}$.

$$
\frac{a}{b}
$$`,
    options()
  );
  assert.match(html, /anglefeint-math-inline/);
  assert.match(html, /anglefeint-math-display/);
  assert.match(html, /<math/);
  assert.match(html, /<mfrac>/);
  assert.match(html, /data-pagefind-ignore/);
});

test('math leaves escaped currency and code untouched; disabled keeps dollar text', async () => {
  const source = 'Cost \\$50 and \\$100. `$x$`\n\n```text\n$$not math$$\n```';
  const { html } = await markdownToHtml(source, options());
  assert.doesNotMatch(html, /class="katex/);
  assert.match(html, /Cost \$50 and \$100/);
  assert.match(html, /<code>\$x\$<\/code>/);
  const off = await markdownToHtml('$C_{saved}$\n\n$$\n\\frac{a}{b}\n$$', options(false));
  assert.doesNotMatch(off.html, /katex|<math/);
  assert.match(off.html, /\$C_\{saved\}\$/);
});

test('MDX math compiles alongside expressions without interpreting formula braces', async () => {
  const result = await mdxToJs(
    'export const n = 2;\n\nValue {n}: $C_{saved}$\n\n$$\n\\frac{a}{b}\n$$',
    options()
  );
  assert.match(result.code, /katex/);
  assert.match(result.code, /mfrac/);
});

test('invalid math reports source file and formula error; invalid config is rejected', async () => {
  await assert.rejects(
    async () => markdownToHtml('$\\notARealCommand{x}$', options()),
    /anglefeint:math.*math-test.md.*Undefined control sequence/s
  );
  assert.throws(() => markdown({ enabled: 'false' }), /must be a boolean/);
});
