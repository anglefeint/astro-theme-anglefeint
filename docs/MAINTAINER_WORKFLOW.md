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
3. Sync `starter` from `main` managed files.
4. Validate `starter`.
5. Push `starter`.

Maintainer entry commands:

```bash
npm run maintainer:sync-starter
# check-only mode:
npm run maintainer:sync-starter:check
```

## Starter Sync Policy

- Managed files should be synced from `main` using maintainer tooling.
- User-facing docs must not tell end users to run maintainer sync scripts.
- End users should upgrade via package updates and normal checks.

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
