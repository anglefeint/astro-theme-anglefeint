import { randomUnit, selectVisualVariant } from '../utils/visual-variant.js';
import { applyNeonVariant } from './effects/neon-palette.js';

export function initCyberPagination(root = document, random = randomUnit) {
  root.querySelectorAll('[data-pagination-component="cyber"]').forEach((wrap) => {
    if (!(wrap instanceof HTMLElement)) return;
    const toInt = (value, fallback) => {
      const parsed = Number.parseInt(value ?? '', 10);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const styleEnabled = wrap.dataset.styleEnabled === 'true';
    const styleMode = wrap.dataset.styleMode || 'random';
    const variants = clamp(toInt(wrap.dataset.styleVariants, 9), 1, 12);
    const fixedVariant = clamp(toInt(wrap.dataset.styleFixedVariant, 1), 1, variants);

    if (wrap.hasAttribute('data-pagination-ready')) return;
    wrap.setAttribute('data-pagination-ready', '');
    const items = wrap.querySelectorAll('.pagination .pg-item');
    const setItem = (item, variant) => {
      item.className = item.className.replace(/\bpg-var-(?:\d+|random)\b/g, '').trim();
      item.classList.add(`pg-var-${variant}`);
      applyNeonVariant(item, variant);
    };
    if (!styleEnabled || styleMode === 'random' || styleMode === 'fixed') {
      const select = () =>
        selectVisualVariant({
          count: variants,
          mode: styleEnabled ? styleMode : 'fixed',
          fixed: styleEnabled ? fixedVariant : 1,
          random,
        });
      const variant = select();
      wrap.className = wrap.className.replace(/\bcyber-pg-v\d+\b/g, '').trim();
      wrap.classList.add(`cyber-pg-v${variant}`);
      applyNeonVariant(wrap, variant);
      items.forEach((item) => setItem(item, select()));
    }

    const form = wrap.querySelector('.pagination-jump');
    if (!(form instanceof HTMLFormElement)) return;

    const blogRoot = form.getAttribute('data-blog-root') || '/blog/';
    const totalPages = Math.max(1, parseInt(form.getAttribute('data-total-pages') || '1', 10));
    const enterToGo = form.getAttribute('data-enter-to-go') !== 'false';
    const input = form.querySelector('.pagination-jump-input');
    if (!(input instanceof HTMLInputElement)) return;

    const normalizeRoot = (root) => {
      if (!root) return '/blog/';
      return root.endsWith('/') ? root : `${root}/`;
    };

    const toHref = (pageNum) => {
      const root = normalizeRoot(blogRoot);
      return pageNum === 1 ? root : `${root}${pageNum}/`;
    };

    const runJump = () => {
      const normalized = (input.value || '').replace(/[^\d]/g, '');
      const value = Number.parseInt(normalized || '1', 10);
      if (!Number.isFinite(value)) return;
      const target = Math.max(1, Math.min(totalPages, Math.round(value)));
      window.location.assign(toHref(target));
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      runJump();
    });

    if (!enterToGo) {
      input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
      });
    }
  });
}
