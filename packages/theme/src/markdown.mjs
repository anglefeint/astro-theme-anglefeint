import { satteri } from '@astrojs/markdown-satteri';
import { defineMdastPlugin } from 'satteri';
import katex from 'katex';
import { fileURLToPath } from 'node:url';

/** Build-time only: never import this module into a browser script. */
function mathPlugin() {
  const render = (node, context) => {
    let html;
    try {
      html = katex.renderToString(node.value, {
        displayMode: node.type === 'math',
        output: 'htmlAndMathml',
        throwOnError: true,
        trust: false,
      });
    } catch (cause) {
      const file = context.fileURL ? fileURLToPath(context.fileURL) : 'Markdown document';
      const start = node.position?.start;
      const location = start ? `:${start.line}:${start.column}` : '';
      throw new Error(`[anglefeint:math] ${file}${location}: ${cause.message}`, { cause });
    }
    // Keep both accessible and visual output, but exclude duplicate formula text
    // from Pagefind. Surrounding article prose remains searchable.
    const tag = node.type === 'math' ? 'div' : 'span';
    const kind = node.type === 'math' ? 'display' : 'inline';
    context.replaceNode(node, {
      raw: `<${tag} class="anglefeint-math anglefeint-math-${kind}" data-pagefind-ignore>${html}</${tag}>`,
      mdxExpressions: false,
    });
  };
  return defineMdastPlugin({ name: 'anglefeint-math', math: render, inlineMath: render });
}

/** Shared by Astro Markdown and MDX. Math is enabled unless explicitly disabled. */
export default function markdown({ enabled = true } = {}) {
  if (typeof enabled !== 'boolean') throw new TypeError('theme.math.enabled must be a boolean.');
  return satteri({ features: { math: enabled }, mdastPlugins: enabled ? [mathPlugin()] : [] });
}
