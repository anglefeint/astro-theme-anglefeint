---
doc_id: contributing_guide
doc_role: contributor-guide
doc_purpose: Practical contribution workflow for package-owned integrations, upgrades and release-safe validation.
doc_scope: [contribution, workflow, validation, architecture, branches]
update_triggers: [workflow-change, command-change, adapter-change, branch-policy-change]
source_of_truth: true
depends_on:
  [docs/VALIDATION_POLICY.md, AGENTS.md, docs/BRANCH_POLICY.md, docs/PACKAGING_WORKFLOW.md]
---

# Contributing

## Development Setup

```bash
npm install
npm run release:tools -- list
```

## Daily Workflow

Repository text uses UTF-8 and LF on every platform. `.gitattributes` fixes text checkout to LF, `.editorconfig` guides editor saves, and `.prettierrc.json` explicitly sets `endOfLine: "lf"`. Binary files retain their bytes. Keep these repository rules instead of changing contributors' global Git settings. `npm run format:check` checks formatting without rewriting files; avoid running it concurrently with tests that generate temporary project directories.

When normalizing an existing Windows checkout, preserve all uncommitted work first and convert only line endings in the intended text files. Adding attributes alone does not rewrite existing working-tree files. Review any remaining formatting changes separately from functional edits; never use a forced checkout or reset to normalize a dirty tree.

1. For external contributions, create a branch from `main` in your fork and submit a pull request targeting `main`. Maintainer and repository-agent implementation follows `docs/AI_WORKFLOW.md` on `main`; `starter` is generated output, never a development target.
2. Make focused changes based on the actual implementation.
3. Select related independent technical tools under [Validation policy](docs/VALIDATION_POLICY.md) and [Release tools](docs/RELEASE_TOOLS.md): focused unit files, lint/types, relevant wiring checks and one build when needed. Documentation-only work uses metadata, formatting and affected-link checks. No pre-push full check runs automatically.

Do not run browser regressions (including targeted tests), screenshots/visual measurements, Cloudflare checks, demo inventories/tutorial comparisons or real Giscus acceptance by default. Explain command/reason/scope/cost and obtain explicit user confirmation before such agent activities. Demo regression is user-owned. Full source/unit aggregates and the fourteen-case matrix are exceptional and also require confirmation; direct commands obey the same rule.

4. Review documentation against the implementation using `docs/DOC_SYNC_WORKFLOW.md`. Run `npm run suggest:docs` (or pass changed paths explicitly for committed work), trace configuration/routes/scripts to their responsible guides, and run `npm run check:docs`. Metadata validation alone does not prove descriptions match code.
5. Commit with clear scope and push.

## Integration and upgrade changes

Standard pages, defaults/types, derived config/i18n and build features belong in `packages/theme/src/routes`, `project` and `integration.mjs`. The thin starter retains user configuration/content/assets/custom pages. Do not add copied standard-page or generated-adapter implementations to it. Existing root adapters/templates are legacy diagnostic fixtures, not the current consumer runtime source.

Use `npm run check:integration` for package configuration wiring. For integration/upgrader changes, select related installed-package and preservation checks. The full matrix and browser-containing check:upgrade fixture require explicit user consent; they are not automatic release steps. The latter uses a local future tarball/registry, not a published release. Preserve user site-config values, articles, music/images, custom pages and host settings. Unknown project schemas or incompatible Node/Astro requirements must stop with migration guidance instead of overwriting files.

The public package tsconfig and injected types own internal aliases. Consumer tsconfig extends the package, avoiding copies of physical node_modules paths. Pre-0.27 projects intentionally migrate once into a fresh starter. Do not treat a local successful test as proof of npm/starter delivery; follow the release workflow and user push/publication instructions.

## Branch Roles

- `main`: theme development and release source.
- `starter`: install template branch for `npm create astro -- --template ...#starter`.

Do not merge `starter` into `main`.

## Release Safety

Follow `docs/MAINTAINER_WORKFLOW.md` and `docs/PACKAGE_RELEASE.md` for release validation, package publication and starter delivery. The daily checks above do not replace independent installed-starter checks or selected post-delivery technical acceptance. Hosting/demo acceptance is separate. For package/starter ownership, see `docs/PACKAGING_WORKFLOW.md`.
