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

### Repository text format

Text files use UTF-8/LF across platforms: `.gitattributes` controls Git text checkout, `.editorconfig` controls supporting editors, and `.prettierrc.json` explicitly requires LF. Git automatically detects text/binary files; do not normalize binary assets or dependency/generated directories. Existing dirty checkouts need a controlled text-only conversion after backing up local changes, not a reset, forced checkout or global Git configuration change. Run `npm run format:check` after temporary fixture processes finish; repository-wide formatting checks must not scan their transient output.

These root maintenance settings are not added to starter-managed files in this change; consumer installation/configuration and upgrade ownership remain unchanged. Package source formatting is mechanical, with no runtime/API change. Future publication still follows the package release rules; this local cleanup does not publish or claim a new version.

- `main` is the only source-of-truth branch for theme logic and architecture.
- `starter` is a generated/distribution branch for template users.
- Do not manually patch managed starter files unless explicitly required by this workflow.

## Change Classes

Production demo delivery is a separate concern from npm publication and starter distribution. Apply the [demo deployment checks](#production-demo-deployment) even when only documentation is pushed.

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
  - Integration/project-schema contract changes
  - Data contract between starter and package
- Required flow:
  1. Define/update contract on `main`
  2. Validate package side
  3. Sync `starter`
  4. Validate starter side

## Mandatory Commands

### Serial execution and reporting

Run main push, npm release, starter sync/push, documentation closeout push and tag push sequentially; await each result before starting the next. Never parallelize operations that share the checkout, dependencies or build directory. The pre-push hook, npm release entry and starter sync entry share `scripts/maintainer-session.mjs`'s checkout-local lock. The hook serializes its checks, not Git's subsequent network transfer; operators must still await the whole push. Direct `npm run check` and other standalone commands do not acquire this lock.

Each protected entry prints stage start/end, elapsed seconds, a running notice every 30 seconds for asynchronous work, and local log paths. Non-interactive child stdout/stderr is saved in full under ignored `acceptance-results/maintainer-*/`; failures show a bounded tail and remain blocking. `summary.json` records completed stage statuses, durations and command exit codes. npm publish retains inherited terminal input/output for authentication; its stage records duration/status, not interactive output or input. Synchronous registry/audit calls report start/end but cannot emit a heartbeat while blocking Node.

`scripts/maintainer-evidence.mjs` adds before/after observational fingerprints to each stage: Git HEAD/tree and working/index/untracked hashes, selected package/lockfiles (including installed lock metadata), root dotenv hashes, Node/tool versions and selected environment-value hashes. Only environment names and hashes are recorded, never dotenv contents or environment values; npm authentication variables such as `NPM_TOKEN` are excluded. Build-producing `session.run` npm commands also record the resulting `dist` tree hash. Symlinks are hashed without following their targets. `commandSeconds` measures child execution, `evidenceSeconds` measures fingerprint collection, and stage `seconds` includes both. Missing/unavailable evidence is explicit and does not replace the command's outcome.

These records have `observationalOnly: true`: they are diagnostic context, not reusable validation receipts. Selected inputs are not a complete snapshot of ignored files, dependency bytes or external services. No command reads an earlier summary to skip checks; identical inputs still execute all gates. Keep existing validation and audit requirements unchanged.

Starter sync runs the generated `npm run check` once after installation/audit. That script invokes package-owned `astro-theme doctor`, which runs Astro check, `npm run build` and the enabled About runtime assertions; a second immediately adjacent standalone build is unnecessary. A failed doctor/build still blocks commit/push and preserves the starter checkout for inspection. Independent consumer acceptance continues to execute the separate public `build` script as part of all eleven scripts.

After an accepted npm upload whose registry verification timed out, use the standalone read-only `npm run release:verify -- --version <exact-version>` entry; see [registry recovery](PACKAGE_RELEASE.md#registry-availability-and-recovery). It shares reporting/serialization but never reruns publication or starter synchronization.

The lock is released on normal success/failure. After a forcibly interrupted process, inspect `acceptance-results/.maintainer-lock/owner.json` and confirm that its process and children have stopped before removing a stale lock; never delete an active session's lock. This reporting change does not remove checks, alter existing skip flags, change dependency caches or reduce build matrices. Logs can contain sensitive tool output: keep them ignored and review/redact before sharing. These tools remain maintainer-only and need no npm release.

Keep scratch Astro projects and historical source clones outside the checkout, or remove/archive their source files after verification. Reports may stay in ignored `acceptance-results/`, but consumer TypeScript discovery during a local starter checkout can still inspect project copies there. Ensure local evidence stays ignored across branch switches; never commit it or weaken starter source checks to hide a scratch project.

Demo identity and translated introductions belong in main's `src/site.config.ts`. Starter sync and drift checks resolve that destination through `starterSourcePath()` to `scripts/starter-templates/site.config.ts.template`; keep this template generic. The independent installed-starter check uses the same mapping. Do not copy the demo config into starter or add the source template to its distributed files. Consumer configuration remains `src/site.config.ts`.

For repeatable public-starter command/configuration acceptance, local headless browser checks and the manual Linux Actions workflow, see [Template acceptance](TEMPLATE_ACCEPTANCE.md). These maintainer tools remain outside the generated starter.

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

This packs the working theme, overlays current managed files onto the local `starter` snapshot in a temporary directory, installs without workspace links, exercises package CLI/configuration aliases, and builds the English/Chinese/Portuguese/German/Russian/Traditional-Chinese default-locale and prefix-mode matrix. It requires the local `starter` ref and registry access for dependencies. It does not publish, commit, or change branches. Obsolete implementation copies are removed from this distribution fixture; this operation is never used to migrate a personal blog.

`release:npm` runs this gate after the main checks. `--skip-checks` omits the main checks and installed build matrix, but retains main and isolated-starter audits and installed CLI checks. Starter sync audits after installation. All audit findings or audit errors block delivery; `scripts/audit-dependencies.mjs` no longer accepts the historical static-cache exception documented in `docs/PACKAGE_RELEASE.md`. A passing workspace build alone is not sufficient.

Starter branch quality gate:

```bash
npm run doctor
```

The integration starter ships package-owned doctor/new-page/new-post/new-fragment commands rather than maintainer scaffold/adapter scripts. For architecture/upgrade changes also run `npm run check:upgrade` on main: its local fixture registry exercises a skipped-version npm exec upgrade with a new menu/button/page and byte-for-byte user-file preservation. Use `npm run check:upgrade -- --baseline 0.28.0` to start from that exact published package instead of the current working-tree pack. This only downloads a baseline and upgrades isolated fixtures; it does not publish. Acceptance also protects user fragments, verifies the new CLI without adding scripts and renders preserved fragments after explicit opt-in. Keep user data and project-schema compatibility explicit; a normal updater never invokes maintainer starter sync.

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
5. If Class A/C affects shipped package behavior, run `npm run release:npm` once with all default checks and wait for its dist-tag and exact-version tarball verification. A full `--dry-run` is optional for diagnostics, not a mandatory preceding pass; do not routinely repeat the same main checks and installed matrix. On verification timeout, confirm availability before syncing starter; never republish the accepted version.
6. Run `npm run release:starter` on `main` to sync files, update starter theme dependency, validate `starter`, and restore `main` dependencies.
7. Push `starter`.
8. Create a temporary project from the remote `#starter` template. Verify install, CLI commands, checks, build, dev and preview; stop servers and remove the temporary project after success.
9. Record delivery evidence, tag the exact npm source commit, create the GitHub Release and read it back. Only then is the release complete.

Starter synchronization uses `npm update --prefer-online` within the source dependency ranges before its blocking audit. This refreshes indirect dependencies retained by older lockfiles; it does not bypass version constraints or vulnerability findings.

The latest template/package and the frozen schema-1 integration-starter upgrade fixture are required release baselines. Preserve same-schema upgrade compatibility, including skipped versions. Pre-0.27 copied skeletons intentionally require a fresh-starter migration; a future schema break must stop automatic updates and include deliberate migration instructions. Automatic in-place upgrades across arbitrary historical/custom skeletons are not guaranteed.

## Production Demo Deployment

The public demo at `https://demo.anglefeint.com/` must deploy from `main`. `starter` is a distribution template with only the onboarding posts selected by `scripts/starter-manifest.mjs`; deploying it to the demo removes the rest of the demo article library from the served output, even though its source files remain on `main`.

Before pushing branches that trigger Cloudflare Workers Builds:

1. Inspect the Worker's **Settings → Builds** configuration. Set the production branch to `main`; for this demo, disable non-production branch builds. If previews are introduced later, ensure they cannot deploy to the production Worker.
2. Inspect the actual deploy commands and trigger branches. Cloudflare's default non-production command, `wrangler versions upload`, creates a preview version; `wrangler deploy` promotes a deployment. A successful GitHub build check alone does not identify the version currently serving the production domain.
3. Treat branch controls as Cloudflare-side build settings, not fields in `wrangler.jsonc`. The current repository file specifies the Worker name, compatibility date and static asset directory; it does not enforce Git branch isolation. Repository release/check scripts also do not validate Cloudflare account settings. If settings cannot be inspected, record that limitation instead of claiming they were verified.

See Cloudflare's [build branch controls](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/) and [build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/).

After the final push, including a starter push when applicable, wait for deployment completion and verify the live production domain against the intended `main` revision:

- Compare localized blog links across all list pages with the source article inventory, not just the updated tutorial URLs. Derive expected counts and pagination from current content and configuration rather than hard-coding a historical count.
- Check older non-starter article URLs, pagination, all enabled languages, and the new or updated tutorial pages. A successful starter installation does not verify the full demo library.
- Read the active production deployment's source revision when available; distinguish that evidence from a successful build check. Report any remaining uncertainty.

If the demo serves starter content, first correct the branch/deploy settings, then rebuild and deploy the intended `main` revision. Do not restore unchanged articles, republish npm, or modify starter's content whitelist to repair a hosting configuration problem. A substantive maintenance-document commit on `main` can trigger that deployment; it does not require a package version bump.

## Release Decision Gate

Before running `npm run release:npm`, inspect what changed under `packages/theme/**` and whether it affects shipped runtime, exports, dependencies, schema or CLI behavior.

- If shipped package behavior changed:
  - publish npm package
  - then run `npm run release:starter` so starter package range and lockfile move together
- If only documentation changed or the change is outside the shipped package:
  - do **not** publish npm
  - do **not** update starter dependency only for release cadence

Editing `packages/theme/README.md` alone does not require a feature release; the already-published tarball retains its old README until another package version is published. Starter-managed README changes can be delivered through starter sync without changing the package version. This is a maintainer decision, not a path-based rule enforced by the npm release script.

### Announcing starter-only upgrades

Starter-only changes that require existing users to act still need a public announcement. Prepare an Unreleased changelog entry and a concrete `UPGRADING.md` migration before delivery. After validated main/starter delivery and remote acceptance, publish a GitHub Release with a distinct starter tag (for example `starter-seo-YYYY-MM-DD`) at the committed main source revision. Do not label it as a new npm version or move an existing package tag. Include the delivered main/starter revisions, migration link, affected hosts, checks and the fact that `npm update` does not merge project files. Read back the announcement and refs; until then keep its status explicitly pending. This supplements Class B delivery without requiring an empty npm publication.

Users can opt into repository release notifications; a push, changelog edit or unchanged npm package version alone is not an automatic upgrade notification. Do not promise that every existing user will be notified. Package-release closeout continues to use the exact npm source tag and the existing package runbook.

Maintainer entry commands (run on `main`):

```bash
npm run maintainer:sync-starter:check
npm run release:starter
# optional sync + auto-push:
npm run release:starter:push
```

`maintainer:sync-starter:check` returns exit status 1 when drift is found, but still closes its maintainer session and releases the shared lock. Expected drift must not leave an interrupted-session lock for the next operation.

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

For supported schema-1 integration starters using npm:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

The updater checks schema/Node/Astro compatibility, backs up dependencies, installs the exact target and runs doctor (including build). Preview and deploy only after success. Unknown schema/runtime requirements stop for migration; automatic conversion from other package managers is unsupported. Pre-0.27 copied skeletons require the separate fresh-starter migration in `UPGRADING.md`; adapter-sync commands do not fetch or install upstream changes.

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
