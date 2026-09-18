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
- The public demo deploys from this branch and should retain its complete article library.

## `starter` Branch

- Purpose: user-facing template branch.
- Contains only the onboarding article whitelist from `scripts/starter-manifest.mjs`. It must not replace the production demo deployment. See the [demo deployment checks](MAINTAINER_WORKFLOW.md#production-demo-deployment) for Cloudflare branch isolation and post-push validation.
- Must not contain the monorepo workspace folder (`packages/`).
- Must depend on registry package version:
  - `@anglefeint/astro-theme` (for example: `^0.1.0`).
- Install command examples in READMEs must use:
  - `npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter`

## Sync Rule

After each stable package release on `main`:

1. Implement and validate changes on `main`.
2. Commit and push validated source on `main`, then publish the theme package when shipped package behavior changes.
3. Run `npm run release:starter` on `main` to generate the managed starter files, npm scripts and dependencies, then validate the installed result.
4. Push validated `starter` and verify a fresh remote-template installation following `docs/MAINTAINER_WORKFLOW.md`. Do not maintain starter runtime logic manually.

## Documentation Rule

- README family (`README*.md`) is branch-aware:
  - Installation commands must target `#starter`.
- `UPGRADING.md` distinguishes compatible package updates from fresh-template migration when the project skeleton changes. Historical in-place upgrades are not guaranteed.
- Doc validation script (`npm run check:docs`) is the minimum gate before merging documentation changes.
