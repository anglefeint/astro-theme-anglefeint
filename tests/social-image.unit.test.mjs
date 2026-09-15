import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { imageData, socialKey, socialPath } from '../packages/theme/src/social/model.mjs';
import { resolveSocialImage } from '../packages/theme/src/social/resolve.mjs';
import { renderSocialImage } from '../packages/theme/src/social/render.mjs';

const data = imageData('A title', 'Author', 'My site', 'en');
test('share image URLs change with visible metadata and respect base paths', () => {
  assert.equal(socialKey(data), socialKey({ ...data }));
  for (const key of ['title', 'author', 'site', 'locale']) {
    assert.notEqual(socialKey(data), socialKey({ ...data, [key]: 'changed' }));
  }
  assert.equal(socialPath(data, '/blog/'), `/blog/_social/${socialKey(data)}.png`);
});

test('custom images take priority, disabled mode keeps the hero, missing files fail clearly', async () => {
  const publicDir = await mkdtemp(path.join(tmpdir(), 'anglefeint-social-'));
  try {
    const fallback = { src: '/hero.webp', width: 600, height: 400 };
    const options = { data, publicDir, fallback, enabled: false };
    assert.equal(await resolveSocialImage(options), fallback);
    const custom = { src: '/custom.png', width: 1200, height: 630 };
    assert.equal(await resolveSocialImage({ ...options, override: custom }), custom);
    assert.deepEqual(
      await resolveSocialImage({ ...options, override: 'https://example.com/share.png' }),
      { src: 'https://example.com/share.png' }
    );
    assert.match((await resolveSocialImage({ ...options, enabled: true })).src, /^\/_social\//);
    await writeFile(path.join(publicDir, 'cover.png'), 'first');
    const first = await resolveSocialImage({ ...options, override: '/cover.png', base: '/sub/' });
    assert.match(first.src, /^\/sub\/cover.png\?v=/);
    await writeFile(path.join(publicDir, 'cover.png'), 'second');
    assert.notEqual(
      first.src,
      (await resolveSocialImage({ ...options, override: '/cover.png', base: '/sub/' })).src
    );
    await assert.rejects(
      resolveSocialImage({ ...options, override: '/missing.png' }),
      /A title.*missing.png/
    );
    await assert.rejects(
      resolveSocialImage({ ...options, override: '/%2e%2e/private.png' }),
      /escapes/
    );
  } finally {
    await rm(publicDir, { recursive: true, force: true });
  }
});

test('offline rendering produces distinct 1200x630 PNGs for all starter languages and long titles', async () => {
  const titles = [
    'Build a personal site with Astro',
    '用 Astro 构建自己的技术博客',
    'Astroで自分のブログを作る',
    'Astro로 나만의 블로그 만들기',
    'Cómo crear tu blog: programación y diseño',
    '非常长的文章标题'.repeat(40),
  ];
  const signatures = new Set();
  for (const title of titles) {
    const png = await renderSocialImage({ ...data, title });
    const meta = await sharp(png).metadata();
    assert.equal(meta.format, 'png');
    assert.equal(meta.width, 1200);
    assert.equal(meta.height, 630);
    signatures.add(png.toString('base64'));
  }
  assert.equal(signatures.size, titles.length);
});
