---
doc_id: ai_workflow
doc_role: internal-guide
doc_purpose: Canonical AI agent workflow.
doc_scope:
  - agent-workflow
  - release-flow
  - starter-sync
  - doc-sync
  - validation
update_triggers:
  - workflow-change
  - release-change
  - doc-process-change
  - command-change
source_of_truth: true
audience:
  - agent
  - maintainer
depends_on:
  - AGENTS.md
  - docs/DOC_METADATA_SPEC.md
  - docs/MAINTAINER_WORKFLOW.md
  - docs/PACKAGE_RELEASE.md
  - .cursor/workflows/doc-sync-workflow.md
sync_targets:
  - CLAUDE.md
  - .cursor/rules/00-repo.mdc
machine_summary: Canonical AI execution order for implementation, validation, release preparation, npm publishing, starter sync, and doc-sync in this repository.
---

# AI Workflow

This document is the canonical workflow guide for AI coding agents in this repository.

Use it together with:

- `AGENTS.md` for repository entry rules and document routing
- `docs/DOC_METADATA_SPEC.md` for markdown metadata rules and validator boundaries
- `docs/ARCHITECTURE.md` for system structure and routing
- `docs/VISUAL_SYSTEMS.md` for route-specific visual/runtime contracts
- `docs/MAINTAINER_WORKFLOW.md` for maintainer release policy details
- `.cursor/workflows/doc-sync-workflow.md` for metadata-driven documentation updates

## Branch Model

- `main` is the only source-of-truth branch for runtime logic, architecture, and release work.
- `starter` is a generated/distribution branch for template consumers.
- Do not manually patch runtime logic in `starter`.
- Any change that should reach `starter` must land in `main` first, then be propagated through the maintainer sync flow.

## Required Read Order

Before editing code, read in this order:

1. `AGENTS.md`
2. `docs/AI_WORKFLOW.md`
3. `README.md`
4. Task-relevant source docs:
   - `docs/DOC_METADATA_SPEC.md` for markdown metadata protocol and validation boundaries
   - `docs/ARCHITECTURE.md` for layouts, routing, shell, SEO, content pipeline
   - `docs/VISUAL_SYSTEMS.md` for route-specific visual/effects behavior
   - `src/site.config.ts` for site/theme/about/social customization surface
5. Workflow-specific docs when relevant:
   - `docs/MAINTAINER_WORKFLOW.md`
   - `.cursor/workflows/doc-sync-workflow.md`

## Safe Engineering Workflow

### 1. Analyze First

- Confirm the actual source files involved.
- Check whether the requested behavior is package-owned (`packages/theme/src/**`) or starter/app-owned (`src/**`).
- Prefer config-driven changes over hard-coded behavior.
- Avoid changing SEO/i18n/high-risk files unless the task truly requires it.

### 2. Implement on `main`

- All real feature work, bugfixes, schema changes, runtime script changes, and workflow changes must be implemented on `main`.
- Treat `starter` as generated output, not as a development branch.

### 3. Validate Locally

Minimum validation depends on change type:

- Docs only:
  - `npm run check:docs`
- Package/runtime/config/script changes:
  - `npm run test`
  - `npm run lint`
  - `npm run check:no-build`
  - `npm run build`
- High-risk page/config/runtime changes:
  - `npm run check`

Prefer the smallest sufficient validation set, but do not skip build checks when layout/runtime/config behavior changed.

### 4. Release Decision

Publish npm when the change affects installed users through the package, for example:

- `packages/theme/src/**`
- package exports
- content schema
- package CLI behavior
- package-consumed runtime behavior

If npm release is required:

1. ensure `main` is clean
2. bump the package version
3. update `CHANGELOG.md` and create or update the matching release note entry under `docs/releases/`
4. commit the release-prep changes on `main`
5. run `npm run maintainer:sync-starter:check`
6. publish with `npm run release:npm`
7. then sync starter with `npm run release:starter`
8. push `main`
9. push `starter`

If npm release is not required but starter should still change:

- run `npm run maintainer:sync-starter:check`
- run `npm run release:starter`
- push `main`
- push `starter`

## Starter Synchronization Contract

- `npm run release:starter` is the only supported maintainer path for updating `starter`.
- It is responsible for:
  - syncing managed files from `main`
  - updating starter dependency range for `@anglefeint/astro-theme`
  - reinstalling starter dependencies
  - validating starter via `check` and `build`
  - returning to the original branch
  - restoring `main` dependencies after switching back
- Starter validation must work in both:
  - workspace-link development installs on `main`
  - installed-package starter environments where `@anglefeint/astro-theme` resolves from `node_modules`

Use `npm run maintainer:sync-starter:check` to detect drift without mutating branches.

## Documentation Workflow Contract

When code/config/theme behavior changes, document sync is not automatic by filename. Follow `.cursor/workflows/doc-sync-workflow.md`.

Core rules:

- discover markdown files
- validate metadata against `docs/DOC_METADATA_SPEC.md`
- inspect frontmatter responsibilities
- update only documents whose `doc_scope` / `update_triggers` were actually hit
- propagate changes only through declared `depends_on` / `sync_targets`
- avoid user-facing README churn unless the user-facing truth changed

## Tool-Specific Adapters

This repository uses one neutral entry plus thin tool adapters:

- `AGENTS.md` is the neutral entrypoint for all agents
- `CLAUDE.md` is a thin Claude-oriented adapter that points back to `AGENTS.md`
- `.cursor/rules/00-repo.mdc` is a thin Cursor adapter that points back to `AGENTS.md`

Do not maintain separate, conflicting workflow copies in those adapter files.

## Prohibitions

- Do not fix runtime bugs directly on `starter`.
- Do not move maintainer-only implementation details back into user-facing README unless they affect end-user setup or upgrade.
- Do not treat stale docs as harmless; update or explicitly skip with a reason.
- Do not publish npm without a version bump.
- Do not leave release tarballs or generated artifacts tracked in `starter`.
- Do not run `release:starter` with generated artifacts still present in the working tree (for example package tarballs, Playwright output, or test result folders).

## End-to-End Release Sequence

For package-affecting changes:

1. implement on `main`
2. run validation
3. bump package version and update `CHANGELOG.md` plus the matching `docs/releases/` entry
4. commit the release-prep changes on `main`
5. `npm run maintainer:sync-starter:check`
6. `npm run release:npm`
7. `npm run release:starter`
8. push `main`
9. push `starter`

For docs-only changes:

1. update docs per frontmatter/workflow contract
2. `npm run check:docs`
3. run broader validation only if the updated docs describe changed behavior/commands that were also modified
