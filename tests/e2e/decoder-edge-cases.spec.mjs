import { test, expect } from '@playwright/test';
import { Buffer } from 'node:buffer';
import { URL } from 'node:url';

const output = '.hacker-decoder-output';
const status = '.hacker-decoder-status';
const input = '[name="decoder-input"]';
const utf8 = '你好 🐇\nA+B / café';
const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const jwt = `${encode({ alg: 'none' })}.${encode({ sub: '你好', admin: false })}.`;
const cases = [
  [
    'Base64',
    'base64',
    [
      [Buffer.from(utf8).toString('base64'), utf8],
      [' Zg==\n', 'f'],
      ['SGVsbG8', 'Hello'],
    ],
    ['A', 'Zg=', 'Zh==', '/w==', 'AA=='],
  ],
  ['Base64URL', 'base64', [[Buffer.from('ÿ?🐇').toString('base64url'), 'ÿ?🐇']], ['__8', 'a===']],
  [
    'URL',
    'url',
    [
      ['%E4%BD%A0%E5%A5%BD%20%F0%9F%90%87', '你好 🐇'],
      ['a+b%2Bc', 'a+b+c'],
      ['%253C', '%3C'],
    ],
    ['%', '%ZZ', '%E4%B8', '%00'],
  ],
  [
    'Hex',
    'hex',
    [
      ['0xE4:0xBD:0xA0 0xe5,0xa5,0xbd', '你好'],
      ['48 65 6c 6c 6f', 'Hello'],
    ],
    ['123', 'GG', 'ff', '00'],
  ],
  [
    'HTML entities',
    'html',
    [
      ['&lt;img src=x onerror=alert(1)&gt;', '<img src=x onerror=alert(1)>'],
      ['&amp;lt;', '&lt;'],
      ['&#x1F407; &quot;x&quot;', '🐇 "x"'],
    ],
    ['&zzzzUnknown;', 'plain text'],
  ],
  [
    'Unicode escapes',
    'unicode',
    [
      ['\\u4F60\\u597D \\u{1F407}', '你好 🐇'],
      ['\\uD83D\\uDC07\\n\\x41', '🐇\nA'],
      ['\\\\u0041', '\\u0041'],
    ],
    ['\\uD800', '\\uDC00', '\\u{110000}', '\\q', 'abc\\', '\\u0000'],
  ],
  [
    'JWT',
    'jwt',
    [
      [
        jwt,
        JSON.stringify(
          { header: { alg: 'none' }, payload: { sub: '你好', admin: false } },
          null,
          2
        ),
      ],
    ],
    ['a.b', 'a.b.c.d', 'e30.W10.x', 'e30.bm90LWpzb24.x'],
  ],
];
async function open(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/decoder/');
}
async function submit(page, value) {
  await page.locator(input).fill(value);
  await page.locator('.hacker-decoder-submit').click();
}
for (const [name, format, valid, invalid] of cases) {
  test(`${name}: valid text, malformed input and error recovery`, async ({ page }) => {
    await open(page);
    await page.locator('[name="decoder-format"]').selectOption(format);
    for (const [source, expected] of valid) {
      await submit(page, source);
      await expect(page.locator(output)).toHaveAttribute('data-decoder-state', 'done');
      expect(await page.locator(output).textContent()).toBe(expected);
      await expect(page.locator(status)).toHaveAttribute('data-state', 'done');
      await expect(page.locator(`${output} img, ${output} script`)).toHaveCount(0);
    }
    for (const source of invalid) {
      await submit(page, source);
      await expect(page.locator(status)).toHaveAttribute('data-state', 'error');
      await expect(page.locator(output)).toBeEmpty();
      await expect(page.locator('[data-decoder-copy]')).toBeDisabled();
      await expect(page.locator('[data-decoder-reuse]')).toBeDisabled();
    }
    await submit(page, valid[0][0]);
    await expect(page.locator(status)).toHaveAttribute('data-state', 'done');
  });
}

test('auto detection, empty input and upper-bound output stay usable', async ({ page }) => {
  await open(page);
  for (const source of ['', '   ', '64646464', 'hello world!']) {
    await submit(page, source);
    await expect(page.locator(status)).toHaveAttribute('data-state', 'error');
  }
  const text = 'x'.repeat(12288);
  await page.locator('[name="decoder-format"]').selectOption('base64');
  await submit(page, Buffer.from(text).toString('base64'));
  await expect(page.locator(status)).toHaveAttribute('data-state', 'done');
  expect((await page.locator(output).textContent()).length).toBe(text.length);
});

test('each address ecosystem and Bitcoin network has a valid matching Example', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await open(page);
  await page.locator('[data-decoder-task="address"]').click();
  for (const chain of ['evm', 'hyperevm', 'tron', 'btc']) {
    await page.locator('[name="decoder-chain"]').selectOption(chain);
    for (const network of chain === 'btc' ? ['mainnet', 'testnet', 'regtest'] : ['mainnet']) {
      if (chain === 'btc') await page.locator('[name="decoder-network"]').selectOption(network);
      await page.locator('[data-decoder-example]').click();
      await expect(page.locator(input)).not.toHaveValue('');
      await page.locator('.hacker-decoder-submit').click();
      await expect(page.locator(status)).toHaveAttribute('data-state', 'done');
      expect(JSON.parse(await page.locator(output).textContent()).checksum).toMatch(
        /verified|not-provided/
      );
    }
  }
  await submit(page, '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
  await expect(page.locator(status)).toContainText('does not match');
  await expect(page.locator(status)).toHaveAttribute('data-state', 'error');
  const bounds = await page.locator(status).boundingBox();
  const editor = await page.locator(input).boundingBox();
  expect(bounds.y).toBeLessThan(editor.y);
  await expect(page.locator('.decoder-topbar [role="status"]')).toBeVisible();
  await page.screenshot({ path: 'acceptance-results/decoder-header-error.png' });
  await page.locator('[name="decoder-chain"]').selectOption('evm');
  await submit(page, '0X0000000000000000000000000000000000000001');
  await expect(page.locator(status)).toHaveAttribute('data-state', 'done');
  for (const source of ['0x123', '0x5aaeb6053F3E94C9b9A09f33669435E7Ef1BeAed']) {
    await submit(page, source);
    await expect(page.locator(status)).toHaveAttribute('data-state', 'error');
  }
  await page.locator('[name="decoder-chain"]').selectOption('tron');
  await submit(page, '0X410000000000000000000000000000000000000001');
  await expect(page.locator(status)).toHaveAttribute('data-state', 'done');
  expect(errors).toEqual([]);
});

test('call examples, unsupported selectors and precision error recovery', async ({ page }) => {
  await open(page);
  await page.locator('[data-decoder-task="call"]').click();
  for (const chain of ['evm', 'hyperevm', 'tron']) {
    await page.locator('[name="decoder-chain"]').selectOption(chain);
    await page.locator('[data-decoder-example]').click();
    await page.locator('[name="decoder-decimals"]').fill('6');
    await page.locator('.hacker-decoder-submit').click();
    await expect(page.locator(status)).toHaveAttribute('data-state', 'done');
    expect(JSON.parse(await page.locator(output).textContent()).amount).toBe('1');
    await page.locator('[name="decoder-decimals"]').fill('256');
    await expect(page.locator(status)).toHaveAttribute('data-state', 'error');
    await page.locator('[name="decoder-decimals"]').fill('0');
    await expect(page.locator(status)).toHaveAttribute('data-state', 'done');
    expect(JSON.parse(await page.locator(output).textContent()).amount).toBe('1000000');
  }
  const valid = await page.locator(input).inputValue();
  for (const source of [valid + '00', valid.replace('a9059cbb', 'deadbeef'), '0x123']) {
    await submit(page, source);
    await expect(page.locator(status)).toHaveAttribute('data-state', 'error');
  }
});

test('module loading failure is distinct from invalid input and recovers after refresh', async ({
  page,
}) => {
  for (const locale of ['en', 'zh']) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/*', (route) => {
      const url = new URL(route.request().url());
      return route.request().resourceType() === 'script' && /\/crypto[./]/.test(url.pathname)
        ? route.abort('failed')
        : route.continue();
    });
    await page.goto(`/${locale}/decoder/`);
    await page.locator('[data-decoder-task="address"]').click();
    await page.locator('[data-decoder-example]').click();
    await expect(page.locator(input)).toHaveValue('0x0000000000000000000000000000000000000001');
    await page.locator('.hacker-decoder-submit').click();
    await expect(page.locator(status)).toHaveAttribute('data-state', 'error');
    await expect(page.locator(status)).toContainText(
      locale === 'en' ? 'module could not load' : '模块加载失败'
    );
    await expect(page.locator(output)).toBeEmpty();
    await page.unroute('**/*');
    await page.reload();
    await page.locator('[data-decoder-task="address"]').click();
    await page.locator('[data-decoder-example]').click();
    await page.locator('.hacker-decoder-submit').click();
    await expect(page.locator(status)).toHaveAttribute('data-state', 'done');
    await submit(page, '0x123');
    await expect(page.locator(status)).toContainText(locale === 'en' ? 'Invalid encoding' : '编码');
  }
});
