import { initCodeCopy } from './blogpost/code-copy.js';
import { initSectionLinks } from './blogpost/section-links.js';
import { initImagePreview } from './blogpost/image-preview.js';
import { initReadProgress } from './blogpost/read-progress.js';
import { initArticleMotion } from './blogpost/motion.js';

import { createEffectScope, mountOptionalEffect } from './effects/lifecycle.js';

let disposePost;
export function initBlogpostEffects() {
  disposePost?.();
  const scope = createEffectScope('article');
  const mount = (label, init) => mountOptionalEffect(scope, label, init);
  mount('code copy', initCodeCopy);
  mount('section links', initSectionLinks);
  mount('image preview', initImagePreview);
  mount('reading progress', initReadProgress);
  mount('motion', initArticleMotion);
  const dispose = () => {
    scope.dispose();
    if (disposePost === dispose) disposePost = undefined;
  };
  disposePost = dispose;
  // Keep a cached document alive; its modules already pause on visibility changes.
  scope.listen(window, 'pagehide', (event) => {
    if (!event.persisted) dispose();
  });
  scope.listen(document, 'astro:before-swap', dispose);
  return dispose;
}
