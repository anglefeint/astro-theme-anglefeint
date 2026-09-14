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
  4. Sync and push `starter`, verify the remote template, then create and read back the source tag and GitHub Release

Class B: Starter Distribution Changes

- Scope:
  - Starter docs and template defaults distributed to end users
  - Starter onboarding content/examples
  - Non-runtime template guidance
- Examples:
  - README wording
  - Starter guide posts
  - Starter package defaults
- Required flow:
  1. Implement on `main`
  2. Run `npm run check:docs` for docs-only starter changes, or `npm run check` if starter runtime/config behavior also changed
  3. Commit and push the validated main changes; sync reads committed main files and requires a clean worktree
  4. Run `npm run release:starter`
  5. Push `starter`

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

Installed distribution gate before publishing package/starter changes:

```bash
npm run check:installed -- --build --audit
```

This packs the working theme, overlays current managed files onto the local `starter` snapshot in a temporary directory, installs without workspace links, exercises npm CLI commands and adapters, and builds the English/Chinese default-locale and prefix-mode matrix. It requires the local `starter` ref and registry access for dependencies. It does not publish, commit, or change branches. The legacy snapshot is also checked with the read-only migration diagnostic before the overlay.

`release:npm` runs this gate after the main checks. `--skip-checks` omits the main checks and installed build matrix, but retains main and isolated-starter audits and installed CLI checks. Starter sync audits after installation. Audit findings or audit errors block delivery; a passing workspace build alone is not sufficient.

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
4. Push the validated release-prep commit on `main` after checking push-triggered automation.
5. If Class A/C affects shipped package behavior, publish npm with `npm run release:npm` and wait for its dist-tag and exact-version tarball verification. On verification timeout, confirm availability before syncing starter; never republish the accepted version.
6. Run `npm run release:starter` on `main` to sync files, update starter theme dependency, validate `starter`, and restore `main` dependencies.
7. Push `starter`.
8. Create a temporary project from the remote `#starter` template. Verify install, CLI commands, checks, build, dev and preview; stop servers and remove the temporary project after success.
9. Record delivery evidence, tag the exact npm source commit, create the GitHub Release and read it back. Only then is the release complete.

Starter synchronization uses `npm update --prefer-online` within the source dependency ranges before its blocking audit. This refreshes indirect dependencies retained by older lockfiles; it does not bypass version constraints or vulnerability findings.

The latest template and its corresponding npm package are the supported release baseline. Do not add historical compatibility layers at the expense of the new-template experience. When project skeletons change, existing users may create a fresh template and migrate content and configuration into it; automatic in-place upgrades across all historical starters are not guaranteed.

## Release Decision Gate

Before running `npm run release:npm`, inspect what changed under `packages/theme/**` and whether it affects shipped runtime, exports, dependencies, schema or CLI behavior.

- If shipped package behavior changed:
  - publish npm package
  - then run `npm run release:starter` so starter package range and lockfile move together
- If only documentation changed or the change is outside the shipped package:
  - do **not** publish npm
  - do **not** update starter dependency only for release cadence

Editing `packages/theme/README.md` alone does not require a feature release; the already-published tarball retains its old README until another package version is published. Starter-managed README changes can be delivered through starter sync without changing the package version. This is a maintainer decision, not a path-based rule enforced by the npm release script.

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
- Starter blog content is whitelist-driven. `main` may keep additional demo/editorial posts, but `starter` only receives the localized onboarding post set declared in `scripts/starter-manifest.mjs`.
- User-facing docs must not tell end users to run maintainer sync scripts.
- Package-only compatible updates may use npm updates and normal checks. For starter contract changes, recommend a fresh template and deliberate content/configuration migration.
- When introducing starter-managed runtime/config files, update `scripts/starter-manifest.mjs` in the same change.
- When introducing starter-consumed runtime/config/script/template files, update `scripts/starter-manifest.mjs` in the same change.
- `starter` is generated/distribution only. Do not maintain runtime logic or starter package versions there manually.
- Starter validation must pass in a real installed-package environment, not only in the workspace-link environment on `main`.
- `npm run release:npm` removes the generated package tarball after publish/dry-run completion.
- `npm run release:npm` checks the npm registry and fails early if the workspace package version is not newer than the published latest version.
- After remote template acceptance, record actual results, tag the published npm source commit, and create/read back the GitHub Release using `docs/PACKAGE_RELEASE.md`. npm publication alone does not complete a release.
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

If npm was already published successfully, do not publish that version again. Retry only starter generation/validation/push. `release:starter:push` pushes even when no new sync commit is needed, so an earlier unpushed commit can be delivered after recovery. Source and target branches must differ, and `main` cannot be a sync target.

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
