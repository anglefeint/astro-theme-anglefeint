---
doc_id: agents_repo_guide
doc_role: internal-guide
doc_purpose: Repository-specific guardrails and safe-edit guidance for coding agents.
doc_scope: [agent-guidance, commands, risk-areas, validation]
update_triggers: [workflow-change, script-change, architecture-change, command-change]
source_of_truth: true
depends_on: [README.md, docs/ARCHITECTURE.md, docs/VISUAL_SYSTEMS.md]
---

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
- `src/site.config.ts` (single customization entry)

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run check
npm run check:docs
npm run lint
```

Lint and doc metadata checks are configured.

## Safe Edit Areas

- Theme behavior: `src/site.config.ts` -> `theme`
- About content/modals: `src/site.config.ts` -> `about`
- Social links: `src/site.config.ts` -> `social.links`
- Site identity: `src/site.config.ts` -> `site`
- Content: `src/content/blog/<locale>/`

## High-Risk Areas

- `packages/theme/src/components/BaseHead.astro` (canonical/hreflang/JSON-LD)
- i18n path logic in `src/i18n/config.ts`
- performance-heavy scripts in `packages/theme/src/scripts/blogpost-effects.js` and `packages/theme/src/scripts/about-effects.js`

## Change Checklist

- Build succeeds (`npm run build`)
- Route behavior remains correct (`/`, `/en/`, localized pages)
- About page toggle still works (`ENABLE_ABOUT_PAGE`)
- No accidental hard-coding of author/site metadata
- README stays user-facing (avoid moving internal implementation details back into README)
