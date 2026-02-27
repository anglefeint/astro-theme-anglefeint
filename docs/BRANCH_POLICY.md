---
doc_id: branch_policy
doc_role: release-policy
doc_purpose: Branch responsibilities and release sync policy between main and starter.
doc_scope: [branching, starter, packaging, docs]
update_triggers: [branch-change, package-release, command-change, docs-workflow-change]
source_of_truth: true
depends_on: [docs/PACKAGING_WORKFLOW.md]
sync_targets: [README.md, README.zh-CN.md, README.ja.md, README.es.md, README.ko.md, UPGRADING.md]
---

# Branch Policy

This repository uses two long-lived branches with different responsibilities.

## `main` Branch

- Purpose: development source of truth.
- Contains the monorepo workspace (`packages/theme` + starter app code).
- All theme implementation work should happen here first.
- Package releases are published from `packages/theme` on this branch.

## `starter` Branch

- Purpose: user-facing template branch.
- Must not contain the monorepo workspace folder (`packages/`).
- Must depend on registry package version:
  - `@anglefeint/astro-theme` (for example: `^0.1.0`).
- Install command examples in READMEs must use:
  - `npm create astro@latest -- --template voidtem/astro-theme-anglefeint#starter`

## Sync Rule

After each stable package release on `main`:

1. Switch to `starter`.
2. Update `@anglefeint/astro-theme` dependency to the new version.
3. Run `npm install`, `npm run check`, `npm run build`.
4. Update docs if commands or behavior changed.
5. Push `starter`.

## Documentation Rule

- README family (`README*.md`) is branch-aware:
  - Installation commands must target `#starter`.
- `UPGRADING.md` should describe package upgrades for starter users first.
- Doc validation script (`npm run check:docs`) is the minimum gate before merging documentation changes.
