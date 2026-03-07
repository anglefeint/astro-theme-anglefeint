---
doc_id: agents_repo_guide
doc_role: internal-guide
doc_purpose: Unified entrypoint for AI coding agents.
doc_scope:
  - agent-guidance
  - commands
  - risk-areas
  - validation
  - doc-routing
update_triggers:
  - workflow-change
  - script-change
  - architecture-change
  - command-change
source_of_truth: true
depends_on:
  - README.md
  - docs/AI_WORKFLOW.md
  - docs/DOC_METADATA_SPEC.md
  - docs/ARCHITECTURE.md
  - docs/VISUAL_SYSTEMS.md
sync_targets:
  - CLAUDE.md
  - .cursor/rules/00-repo.mdc
---

# AGENTS.md

Guidance for AI IDE/CLI agents working in this repository.

## Role

This file is the neutral entrypoint for all coding agents working in this repository.

- Use this file as the first document to read.
- Then follow its document map to the deeper workflow and architecture sources.
- Tool-specific files such as `CLAUDE.md` or `.cursor/rules/*.mdc` should point here instead of duplicating repository rules.

## Priority

1. Preserve the public theme UX.
2. Keep changes config-driven.
3. Avoid regressions in i18n routes and SEO tags.

## First Read

1. `README.md` (theme user-facing setup)
2. `docs/AI_WORKFLOW.md` (canonical AI safety/release/doc-sync workflow)
3. `docs/DOC_METADATA_SPEC.md` (canonical markdown metadata contract)
4. `docs/ARCHITECTURE.md` (system overview)
5. `docs/VISUAL_SYSTEMS.md` (route-specific style behavior)
6. `src/site.config.ts` (single customization entry)

## Document Map

- `docs/AI_WORKFLOW.md`
  - Canonical AI workflow
  - Safe change sequence
  - npm release + starter sync rules
  - doc-sync entry rules
- `docs/DOC_METADATA_SPEC.md`
  - canonical frontmatter contract
  - metadata field semantics
  - doc validation boundaries
- `docs/ARCHITECTURE.md`
  - layouts, routing, SEO, content pipeline
- `docs/VISUAL_SYSTEMS.md`
  - page visual contracts, effects, script ownership
- `docs/MAINTAINER_WORKFLOW.md`
  - maintainer release policy details
- `.cursor/workflows/doc-sync-workflow.md`
  - metadata-driven documentation update algorithm

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run check
npm run check:no-build
npm run check:docs
npm run check:workspace-link
npm run lint
npm run e2e:install
npm run e2e
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
- Route behavior remains correct (`/`, `/<default-locale>/`, localized pages)
- About page toggle still works (`ABOUT_PAGE_ENABLED`)
- No accidental hard-coding of author/site metadata
- README stays user-facing (avoid moving internal implementation details back into README)
- Starter/runtime changes still pass `node scripts/check-scaffold.mjs`
- If package behavior changed, follow `docs/AI_WORKFLOW.md` release rules before pushing
- If adding starter-consumed runtime/config/script/template files, update `scripts/starter-manifest.mjs` in the same change
- If `release:starter` fails, fix the issue on `main`, and make sure maintainer checks still pass in both workspace-link and installed-package starter contexts
- If markdown metadata changed, keep it aligned with `docs/DOC_METADATA_SPEC.md`
