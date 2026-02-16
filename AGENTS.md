# AGENTS.md

Guidance for AI IDE/CLI agents working in this repository.

## Priority

1. Preserve the public theme UX.
2. Keep changes config-driven.
3. Avoid regressions in i18n routes and SEO tags.

## First Read

- `README.md` (theme user-facing setup)
- `docs/ARCHITECTURE.md` (system overview)
- `docs/VISUAL_SYSTEMS.md` (route-specific style behavior)
- `src/config/*.ts` (customization surface)

## Commands

```bash
npm run dev
npm run build
npm run preview
```

No dedicated lint/test scripts are currently configured.

## Safe Edit Areas

- Theme behavior: `src/config/theme.ts`
- About content/modals: `src/config/about.ts`
- Social links: `src/config/social.ts`
- Site identity: `src/config/site.ts`
- Content: `src/content/blog/<locale>/`

## High-Risk Areas

- `src/components/BaseHead.astro` (canonical/hreflang/JSON-LD)
- i18n path logic in `src/i18n/config.ts`
- performance-heavy scripts in `public/scripts/blogpost-effects.js` and `public/scripts/about-effects.js`

## Change Checklist

- Build succeeds (`npm run build`)
- Route behavior remains correct (`/`, `/en/`, localized pages)
- About page toggle still works (`ENABLE_ABOUT_PAGE`)
- No accidental hard-coding of author/site metadata
- README stays user-facing (avoid moving internal implementation details back into README)
