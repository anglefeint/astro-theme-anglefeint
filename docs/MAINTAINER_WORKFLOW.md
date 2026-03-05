---
doc_id: maintainer_workflow
doc_role: internal-guide
doc_purpose: Defines maintainer-only release and starter synchronization rules.
doc_scope: [release-flow, starter-sync, change-classification, guardrails]
update_triggers: [release-process-change, starter-sync-change, command-change]
source_of_truth: true
depends_on: [README.md]
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

Class B: Starter-only Changes

- Scope:
  - Starter docs
  - Starter demo content/examples
  - Non-runtime template guidance
- Examples:
  - README wording
  - Example posts
- Required flow:
  1. Implement on `starter`
  2. Run starter checks
  3. Push `starter`

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
node scripts/check-scaffold.mjs
```

Starter branch quality gate:

```bash
npm run check
node scripts/check-scaffold.mjs
```

## Release Sequence (Canonical)

Use this sequence unless explicitly skipped for a documented reason.

1. Update `main` and push.
2. If Class A/C affects shipped package behavior, publish npm package.
3. Run `npm run release:starter` on `main` to sync and validate `starter`.
4. Validate `starter`.
5. Push `starter`.

## Release Decision Gate

Before running `npm run release:npm`, verify whether `packages/theme/**` changed in this delivery.

- If changed:
  - publish npm package
  - then update starter lockfile (`npm update @anglefeint/astro-theme`)
- If not changed:
  - do **not** publish npm
  - do **not** run starter dependency update only for release cadence

Maintainer entry commands (run on `main`):

```bash
npm run release:starter
# optional check-only mode:
npm run maintainer:sync-starter:check
# optional sync + auto-push:
npm run release:starter:push
```

## Starter Sync Policy

- Managed files should be synced from `main` using maintainer tooling.
- User-facing docs must not tell end users to run maintainer sync scripts.
- End users should upgrade via package updates and normal checks.
- When introducing new starter-managed runtime/config files, update `tools/maintainer/sync-starter.mjs` `MANAGED_FILES` in the same change.
- `starter` is generated/distribution only. Do not maintain runtime logic there manually.

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
4. If syncing starter, list synced files explicitly.
5. Confirm whether npm release is required and why.

## Guardrails

- Never treat `starter` as source-of-truth.
- Never bypass checks silently.
- If unexpected branch drift appears, stop and request maintainer confirmation.

## Branch Switching Hygiene

- After switching branches, run `npm install` before commit/push operations.
- `main` check chain includes `npm run check:workspace-link` and must pass before merge/release.
- `main` keeps maintainer hooks (`husky` + `lint-staged`) for engineering gates.
- `starter` must stay hook-free (no `prepare`, no `lint-staged`, no `.husky`) to avoid user template friction.
- `starter` must stay maintainer-tooling-free (no `maintainer:*` or `release:starter*` scripts in starter `package.json`).
- If hooks still misbehave after reinstall, treat it as a local environment issue and recover locally before proceeding.
