---
doc_id: maintainer_workflow
doc_role: runbook
doc_purpose: Defines maintainer-only release and starter synchronization rules.
doc_scope: [workflow, release, starter-sync, validation]
update_triggers: [workflow-change, release-change, command-change]
source_of_truth: true
audience:
  - maintainer
  - agent
depends_on:
  - README.md
  - AGENTS.md
  - docs/AI_WORKFLOW.md
machine_summary: Maintainer-only runbook for release preparation, npm publishing, starter synchronization, failure recovery, and branch hygiene.
---

# Maintainer Workflow

This document defines the release and synchronization rules for maintainers.

## Source of Truth

- `main` is the only source-of-truth branch for theme logic and architecture.
- `starter` is a generated/distribution branch for template users.
- Do not manually patch managed starter files unless explicitly required by this workflow.

## Change Classes

Class A: Theme Runtime Changes

- Scope:
  - `packages/theme/src/**`
  - Shared contracts consumed by installed users
- Examples:
  - Layout/script/style behavior updates
  - Runtime bugfixes
  - CLI behavior shipped in npm package
- Required flow:
  1. Implement on `main`
  2. Run quality checks
  3. Publish npm package (if runtime/package behavior changed)
  4. Sync `starter`

Class B: Starter Distribution Changes

- Scope:
  - Starter docs and template defaults distributed to end users
  - Starter demo content/examples
  - Non-runtime template guidance
- Examples:
  - README wording
  - Example posts
  - Starter package defaults
- Required flow:
  1. Implement on `main`
  2. Run `npm run check:docs` for docs-only starter changes, or `npm run check` if starter runtime/config behavior also changed
  3. Run `npm run release:starter`
  4. Push `starter`

Class C: Cross-layer Contract Changes

- Scope:
  - `src/site.config.ts` schema
  - adapter mappings under `src/config/*` and `src/i18n/*`
  - scaffolding expectations
- Examples:
  - Add/remove config fields
  - Adapter contract changes
  - Data contract between starter and package
- Required flow:
  1. Define/update contract on `main`
  2. Validate package side
  3. Sync `starter`
  4. Validate starter side

## Mandatory Commands

Main branch quality gate:

```bash
npm install
npm run check
npm run check:workspace-link
node scripts/check-scaffold.mjs
```

Starter branch quality gate:

```bash
npm run check
node scripts/check-scaffold.mjs
```

## Release Sequence (Canonical)

Use this sequence unless explicitly skipped for a documented reason.

1. Finish implementation on `main`.
2. If Class A/C affects shipped package behavior:
   - bump package version
   - update `CHANGELOG.md`
   - add or update `docs/releases/<version>.md`
   - commit the release-prep changes on `main`
3. Run `npm run maintainer:sync-starter:check` on `main` to confirm the expected starter drift before mutating branches.
4. If Class A/C affects shipped package behavior, publish npm with `npm run release:npm`.
5. Run `npm run release:starter` on `main` to sync files, update starter theme dependency, validate `starter`, and restore `main` dependencies.
6. Push `main`.
7. Push `starter`.

## Release Decision Gate

Before running `npm run release:npm`, verify whether `packages/theme/**` changed in this delivery.

- If changed:
  - publish npm package
  - then run `npm run release:starter` so starter package range and lockfile move together
- If not changed:
  - do **not** publish npm
  - do **not** update starter dependency only for release cadence

Maintainer entry commands (run on `main`):

```bash
npm run maintainer:sync-starter:check
npm run release:starter
# optional sync + auto-push:
npm run release:starter:push
```

Main release checks also rely on:

```bash
npm run check:workspace-link
node scripts/check-scaffold.mjs
```

## Starter Sync Policy

- Managed files should be synced from `main` using maintainer tooling.
- Shared starter/adapters file ownership lives in `scripts/starter-manifest.mjs`.
- User-facing docs must not tell end users to run maintainer sync scripts.
- End users should upgrade via package updates and normal checks.
- When introducing starter-managed runtime/config files, update `scripts/starter-manifest.mjs` in the same change.
- When introducing starter-consumed runtime/config/script/template files, update `scripts/starter-manifest.mjs` in the same change.
- `starter` is generated/distribution only. Do not maintain runtime logic or starter package versions there manually.
- Starter validation must pass in a real installed-package environment, not only in the workspace-link environment on `main`.
- `npm run release:npm` removes the generated package tarball after publish/dry-run completion.
- `npm run release:starter` stages starter changes from `scripts/starter-manifest.mjs` plus starter dependency files; it must not rely on `git add -A`.

If `npm run release:starter` fails, return to `main` and fix the sync contract or package-side issue there. Do not patch starter runtime logic manually.

## Failure Recovery

If `npm run release:starter` fails mid-run:

1. check which branch you are on
2. if you are left on `starter` with synced-but-uncommitted changes:
   - inspect the failure
   - generated release tarballs should already be cleaned automatically, but still remove any remaining stray artifacts (for example `test-results/`, temporary `tests/`)
   - if you need to return to `main` before finishing, stash with untracked files:
     - `git stash -u`
3. return to `main`
4. run `npm install` to restore maintainer dependencies and hooks before retrying commits or checks
5. fix the contract or maintainer-tooling issue on `main`
6. rerun `npm run release:starter`

Do not patch starter runtime logic manually as a recovery path.

## End-user Upgrade Guidance (for docs)

Keep user docs limited to:

```bash
npm update @anglefeint/astro-theme
npm install
npm run doctor
npm run check
npm run build
```

Do not include maintainer-only sync commands in user README.

## AI Execution Protocol

When delegating to AI/coding agents, require this sequence:

1. Classify requested changes as A/B/C.
2. State branch target before editing.
3. Run mandatory commands and report outputs.
4. If syncing starter, report file sync plus starter dependency version/lockfile result.
5. Confirm whether npm release is required and why.

## Guardrails

- Never treat `starter` as source-of-truth.
- Never bypass checks silently.
- If unexpected branch drift appears, stop and request maintainer confirmation.

## Branch Switching Hygiene

- After switching branches, run `npm install` before commit/push operations.
- `npm run release:starter` installs dependencies on `starter` and restores dependencies after switching back to the original branch.
- `main` check chain includes `npm run check:workspace-link` and must pass before merge/release.
- `main` keeps maintainer hooks (`husky` + `lint-staged`) for engineering gates.
- `starter` must stay hook-free (no `prepare`, no `lint-staged`, no `.husky`) to avoid user template friction.
- `starter` must stay maintainer-tooling-free (no `maintainer:*` or `release:starter*` scripts in starter `package.json`).
- If hooks still misbehave after reinstall, treat it as a local environment issue and recover locally before proceeding.
- `release:starter` is expected to leave the repo on `starter` when starter validation fails; treat that as the deliberate recovery state, not as a bug in the workflow.
