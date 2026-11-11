import { buildStartupModel } from './model.js';
import './startup-text.css';
const instances = new WeakMap();

export function mountStartupText(root, options = {}) {
  if (!(root instanceof HTMLElement)) return () => {};
  if (instances.has(root)) return instances.get(root);
  const model = buildStartupModel(options);
  const original = Array.from(root.childNodes);
  const previous = ['data-startup-text', 'data-has-message', 'style'].map((name) =>
    root.getAttribute(name)
  );
  root.setAttribute('data-startup-text', '');
  root.dataset.hasMessage = String(model.hasMessage);
  root.style.cssText += `;${model.style}`;
  const groups = model.groups.map((group) => {
    const line = document.createElement('div');
    line.className = 'startup-text-line';
    line.dataset.startupGroup = group.kind;
    for (const segment of group.segments) {
      const outer = document.createElement('span');
      outer.className = 'startup-text-segment';
      outer.style.cssText = segment.style;
      if (segment.initial) outer.setAttribute('data-leading-space', '');
      const text = document.createElement('span');
      text.textContent = segment.text;
      outer.append(text);
      line.append(outer);
    }
    return line;
  });
  root.replaceChildren(...groups);
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    root.replaceChildren(...original);
    ['data-startup-text', 'data-has-message', 'style'].forEach((name, index) =>
      previous[index] === null
        ? root.removeAttribute(name)
        : root.setAttribute(name, previous[index])
    );
    instances.delete(root);
  };
  instances.set(root, dispose);
  return dispose;
}
