import { fail, hasBinaryControls } from '../common.js';
export function decodeHtml(input) {
  // Only entity tokens reach the detached textarea; input markup is never parsed.
  const element = document.createElement('textarea');
  const cache = new Map();
  const text = input.replace(/&(?:#[xX][\da-fA-F]+|#\d+|[A-Za-z][A-Za-z\d]+);/g, (entity) => {
    if (cache.has(entity)) return cache.get(entity);
    element.innerHTML = entity;
    const value = element.value;
    cache.set(entity, value);
    return value;
  });
  if (text === input) fail('invalid');
  if (hasBinaryControls(text)) fail('binary');
  return text;
}
