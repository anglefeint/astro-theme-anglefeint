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
  - docs/DOC_SYNC_WORKFLOW.md
---

# AGENTS.md

Guidance for AI IDE/CLI agents working in this repository.

## Role

This file is the neutral entrypoint for all coding agents working in this repository.

These are maintainer instructions for the theme and public demo. Personal blogs receive separate user-oriented entries from `scripts/starter-templates/` through `scripts/starter-manifest.mjs`; do not copy this maintainer workflow into consumer projects.

- Use this file as the first document to read.
- Then follow its document map to the deeper workflow and architecture sources.
- Tool-specific files such as `CLAUDE.md` or `.cursor/rules/*.mdc` should point here instead of duplicating repository rules.

## Product Identity and Design Intent

Anglefeint's core selling point is **lightweight, easy-to-use publishing with four vivid cinematic atmospheres: Matrix / Cyberpunk / Hacker / AI**. Cool, immediately recognizable visuals are central product value, not optional decoration to optimize away. Favor high visual impact with modest implementation and maintenance cost.

- **Matrix / Home:** inspired by the Matrix films; unmistakable green code rain and terminal atmosphere.
- **Cyberpunk / Blog and tags:** inspired by cyberpunk cinema, especially Blade Runner; prominent sweeping light beams, halos, rain, neon and Japanese night-market/street imagery create a rain-soaked city mood.
- **Hacker / About:** hacker culture, command-line terminals, files and interactive tools.
- **AI / Articles:** AI-product interfaces, network imagery, monitors and dynamic system feedback.

These are creative references and design intent, not a claim that every motif is implemented on every page. Code remains authoritative for current behavior. See [Visual Systems](docs/VISUAL_SYSTEMS.md#design-intent-and-change-principles) for visual-change guidance.

When asked to make the theme cooler, strengthen these identities and their cinematic presence. Do not interpret "lightweight", "polished" or "readable" as blanket permission to dim rain, narrow light beams, remove glow, slow all animation or turn the theme into a generic minimalist blog. Improve efficiency through asset budgets, suitable CSS/canvas techniques and runtime lifecycle management; evaluate readability locally while retaining the atmosphere. Preserve accessibility, reduced-motion behavior and usable mobile layouts.

Before changing signature effects, identify the intended visual gain, compare against the existing effect in motion, and explain any tradeoff that reduces its presence. Do not introduce feature/configuration complexity merely to make the theme seem more capable. Keep setup simple and defaults expressive.

## Integration architecture (0.27.0)

Standard routes and default configuration/i18n/build logic are package-owned under `packages/theme/src/routes`, `project` and `integration.mjs`. The starter is thin; do not add copied standard-page or adapter implementations to consumer projects. User articles/fragments, site-config values, music/images, custom pages and hosting settings must survive upgrades. The package's upgrade command supports npm schema-1 projects and refuses old copied skeletons; those require a fresh-starter migration. Existing root config/i18n adapters are maintainer diagnostic fixtures, not shipped runtime ownership. Actual delivery status and verification belong in docs/releases/0.27.0.md.

## Third-party dependency boundaries

Use documented public interfaces and keep our integration glue small. Do not edit dependency source (including node_modules), monkey-patch internals, or introduce modified vendor copies/forks as a workaround. Inspect upstream source read-only when diagnosing defects; prefer a correction at our boundary or a compatible upstream release. Keep dependency assumptions localized and covered by integration tests. See [the canonical boundary guidance](docs/AI_WORKFLOW.md#dependency-integration-boundaries).

Pagefind search used the public writeFiles API before 0.27.2 and uses the public getFiles API now. The fix changes our awaited file-output handoff; it does not replace or modify Pagefind's indexing/search implementation.

## Priority

For local visual iteration, make the requested code changes directly and let the user inspect the running page. Before doing your own optional screenshot/render-and-inspect or visual-measurement step, ask whether the user wants that step; do not automatically run scripts such as `article-first-preview.mjs` after every edit. This consent requirement concerns the agent's visual review only, not ordinary server management, code edits or functional tests. Follow [local visual feedback](docs/AI_WORKFLOW.md#local-visual-feedback-and-consent). Required validation and release gates remain unchanged.

Implemented behavior is defined by code. Documentation records it; when they disagree, inspect the implementation and correct the documentation without changing runtime merely to match prose. Use `docs/DOC_SYNC_WORKFLOW.md` to trace code, configuration and tests to their responsible documents, including already committed changes.

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
  - canonical metadata contract
  - metadata field semantics
  - doc validation boundaries
- `docs/ARCHITECTURE.md`
  - layouts, routing, SEO, content pipeline
- `docs/VISUAL_SYSTEMS.md`
  - page visual contracts, effects, script ownership
- `docs/REUSABLE_EFFECTS.md`
  - reusable visual APIs, component source map and page-adapter/lifecycle boundaries under `packages/theme/src/effects/`
- `docs/MAINTAINER_WORKFLOW.md`
  - maintainer release policy details
- `docs/DOC_SYNC_WORKFLOW.md`
  - metadata-driven documentation update algorithm

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run suggest:docs
npm run check
npm run check:no-build
npm run check:docs
npm run check:workspace-link
npm run check:integration
npm run lint
npm run e2e:install
npm run e2e
npm run release:verify -- --help
```

Lint and doc metadata checks are configured.

Repository text uses UTF-8/LF, enforced by `.gitattributes`, `.editorconfig` and Prettier. Preserve local changes before normalizing an existing checkout; never use reset/forced checkout or modify global Git settings for this purpose. Run repository-wide `npm run format:check` after temporary fixture tests finish. See [contribution guidance](CONTRIBUTING.md#daily-workflow).

## Safe Edit Areas

- Theme behavior: `src/site.config.ts` -> `theme`
- About content/modals: `src/site.config.ts` -> `i18n.locales.<code>.about`
- Social links: `src/site.config.ts` -> `social.links`
- Site identity: `src/site.config.ts` -> `site`
- Content: `src/content/blog/<locale>/`; optional fragments: `src/content/fragments/<locale>/` (preserve stable IDs)

## High-Risk Areas

- `packages/theme/src/components/BaseHead.astro` (canonical/hreflang/JSON-LD)
- i18n path logic in `packages/theme/src/project/i18n/runtime.ts`
- performance-heavy scripts in `packages/theme/src/scripts/blogpost-effects.js` and `packages/theme/src/scripts/about-effects.js`

## Change Checklist

- Build succeeds (`npm run build`)
- Route behavior remains correct (`/`, `/<default-locale>/`, localized pages)
- About page toggle still works (`ABOUT_PAGE_ENABLED`)
- No accidental hard-coding of author/site metadata
- README stays user-facing (avoid moving internal implementation details back into README)
- Public README-like docs may use sidecar metadata instead of visible frontmatter
- Starter/runtime changes still pass `node scripts/check-scaffold.mjs`; integration/upgrade changes also require installed-package and one-command upgrade acceptance
- If package behavior changed, follow `docs/AI_WORKFLOW.md` release rules before pushing
- If adding starter-consumed runtime/config/script/template files, update `scripts/starter-manifest.mjs` in the same change
- If `release:starter` fails, fix the issue on `main`, and make sure maintainer checks still pass in both workspace-link and installed-package starter contexts
- If markdown metadata changed, keep it aligned with `docs/DOC_METADATA_SPEC.md`
