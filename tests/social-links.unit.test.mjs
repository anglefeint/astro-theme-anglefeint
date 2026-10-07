import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { resolveSocialLinks } from '../packages/theme/src/utils/social-links.ts';
import { SOCIAL_ICON_PATHS } from '../packages/theme/src/utils/social-icons.ts';

test('social rel is opt-in, normalized and cannot remove new-window protections', () => {
  const resolve = (rel, icon = 'mastodon') =>
    resolveSocialLinks(
      [{ href: 'https://example.com/profile', label: 'Profile', icon, rel }],
      pathToFileURL('/unused')
    )[0].rel;
  assert.equal(resolve(undefined), 'noopener noreferrer');
  assert.equal(resolve(''), 'noopener noreferrer');
  assert.equal(resolve(' \t\n'), 'noopener noreferrer');
  assert.equal(resolve('me'), 'me noopener noreferrer');
  assert.equal(
    resolve(' ME\tme\nNOFOLLOW noreferrer NOOPENER opener '),
    'me nofollow noreferrer noopener'
  );
  assert.equal(resolve('me', 'github'), 'me noopener noreferrer');
  for (const rel of [true, null, [], {}]) {
    assert.throws(() => resolve(rel), /social.links\[0\].*rel must be/);
  }
});

test('social icons cover exactly the approved platforms and preserve text/empty configurations', () => {
  const names = [
    'mastodon',
    'twitter',
    'github',
    'youtube',
    'bluesky',
    'linkedin',
    'discord',
    'telegram',
    'instagram',
    'facebook',
    'whatsapp',
    'line',
  ];
  assert.deepEqual(Object.keys(SOCIAL_ICON_PATHS), names);
  const links = names.map((icon) => ({ href: 'https://example.com', label: icon, icon }));
  links.push({ href: '/contact', label: 'Contact' });
  const result = resolveSocialLinks(links, pathToFileURL('/not-needed'));
  assert.equal(result.length, 13);
  assert.deepEqual(
    result.map((l) => l.label),
    links.map((l) => l.label)
  );
  assert.deepEqual(resolveSocialLinks([], pathToFileURL('/not-needed')), []);
  assert.throws(
    () => resolveSocialLinks([{ label: 'Typo', icon: 'youtub' }], pathToFileURL('/unused')),
    /social.links\[0\].*Unknown icon/
  );
});

test('custom social images use publicDir and base, override built-ins, and reject broken paths', () => {
  const dir = mkdtempSync(join(tmpdir(), 'anglefeint-social-'));
  try {
    mkdirSync(join(dir, 'icons'));
    for (const file of ['community.svg', 'image.png', 'image.webp', '空 格.svg'])
      writeFileSync(join(dir, 'icons', file), 'fixture');
    const resolve = (iconSrc, base = '/') =>
      resolveSocialLinks(
        [{ label: 'Community', href: 'https://example.com', icon: 'github', iconSrc }],
        pathToFileURL(dir),
        base
      )[0];
    assert.equal(resolve('/icons/community.svg', '/blog/').iconSrc, '/blog/icons/community.svg');
    assert.equal(resolve('/icons/image.png').iconSrc, '/icons/image.png');
    assert.equal(resolve('/icons/image.webp').iconSrc, '/icons/image.webp');
    assert.equal(resolve('/icons/空 格.svg').iconSrc, '/icons/%E7%A9%BA%20%E6%A0%BC.svg');
    assert.equal(resolve('  ').iconSrc, undefined);
    for (const value of [
      null,
      123,
      '//evil.test/a.svg',
      'https://example.com/a.svg',
      '/icons/../x.svg',
      '/icons/%2e%2e/x.svg',
      '/icons/a.svg?x=1',
      '/icons/a.svg#x',
      '/icons/a.jpg',
      '/icons\\a.svg',
      'icons/a.svg',
      '/icons/missing.svg',
    ]) {
      assert.throws(() => resolve(value), /social.links\[0\].*iconSrc/);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
