import test from 'node:test';
import assert from 'node:assert/strict';
import { fragmentPreview } from '../packages/theme/src/utils/fragment-preview.ts';

const base = 'https://example.com/project/en/fragments/';

test('image-only previews retain the image even without alt text and resolve relative URLs', () => {
  const preview = fragmentPreview(
    '<p><img src="media/photo.png" alt="" width="640" height="400"></p>',
    base
  );
  assert.equal(preview.text, '');
  assert.deepEqual(preview.image, {
    src: '/project/en/fragments/media/photo.png',
    alt: '',
    width: 640,
    height: 400,
  });
});

test('only safe image fields are extracted, with first valid image and external URLs preserved', () => {
  const preview = fragmentPreview(
    '<img src="javascript:alert(1)"><img src="data:image/svg+xml,bad"><img src="https://cdn.example/photo.jpg" alt="A &amp; B" onerror="alert(1)"><img src="/second.jpg">',
    base
  );
  assert.equal(preview.image.src, 'https://cdn.example/photo.jpg');
  assert.equal(preview.image.alt, 'A & B');
  assert.equal('onerror' in preview.image, false);
});

test('highlighted and raw HTML code keep indentation/newlines and decode entities as inert text', () => {
  const preview = fragmentPreview(
    '<pre><code><span>const a = 1;</span>\n  &lt;script&gt;alert(1)&lt;/script&gt;</code></pre>',
    base
  );
  assert.equal(preview.text, '');
  assert.equal(preview.code, 'const a = 1;\n  <script>alert(1)</script>');
  assert.equal(fragmentPreview('<pre>first\n  second</pre>', base).code, 'first\n  second');
});

test('mixed previews separate ordinary text, image and code without copying links or scripts', () => {
  const preview = fragmentPreview(
    '<p>Read <a href="/x">this</a> and <code>npm run dev</code>.</p><img src="/image.png" alt="Photo"><pre><code>let x = 2;</code></pre><script>secret()</script><p>Next paragraph.</p>',
    base
  );
  assert.equal(preview.text, 'Read this and npm run dev. Next paragraph.');
  assert.equal(preview.image.src, '/image.png');
  assert.equal(preview.code, 'let x = 2;');
});

test('text and code excerpts are bounded without splitting supplementary Unicode characters', () => {
  const text = fragmentPreview(`<p>${'😀'.repeat(181)}</p>`, base);
  assert.equal(text.text, '😀'.repeat(180) + '…');
  const code = fragmentPreview(
    `<pre>${Array.from({ length: 12 }, (_, i) => `line ${i}`).join('\n')}</pre>`,
    base
  );
  assert.equal(code.code, Array.from({ length: 8 }, (_, i) => `line ${i}`).join('\n') + '\n…');
  assert.equal(fragmentPreview(`<pre>${'x'.repeat(1000)}</pre>`, base).code.length, 802);
});

test('empty content has no fabricated Fragment label', () => {
  assert.deepEqual(fragmentPreview('<script>bad()</script>', base), { text: '' });
});
