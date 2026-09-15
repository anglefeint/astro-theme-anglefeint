import { createHash } from 'node:crypto';

export const WIDTH = 1200;
export const HEIGHT = 630;
// Bump when the template or bundled font changes to invalidate generated URLs.
const TEMPLATE_VERSION = 1;

export function socialKey({ title, author, site, locale }) {
  return createHash('sha256')
    .update(JSON.stringify([TEMPLATE_VERSION, title, author, site, locale]))
    .digest('hex')
    .slice(0, 24);
}

export function socialPath(data, base = '/') {
  return `${base.replace(/\/$/, '')}/_social/${socialKey(data)}.png`;
}

export function imageData(title, author, site, locale) {
  return { title, author, site, locale };
}
