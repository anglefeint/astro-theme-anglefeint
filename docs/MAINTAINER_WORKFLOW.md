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
  - docs/VALIDATION_POLICY.md
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

Production demo delivery is a separate concern from npm publication and starter distribution. Follow [Validation policy](VALIDATION_POLICY.md): demo regression belongs to the user and is not a package gate. Do not inspect hosting or production by default.

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
  4. Sync and push `starter`, complete selected technical acceptance, then create and read back the source tag and GitHub Release

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
  2. Run `npm run check:docs` for docs-only starter changes, or select related independent technical checks when runtime/config changes
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

## Available tools and execution contracts

### Serial execution and reporting

For an authorized stable release, prefer the [source handoff and announcement flows](RELEASE_TOOLS.md#source-handoff-and-announcement-execution). Finish version/docs/check-plan preparation and stage reviewed source first. One source invocation runs the selected checks and canonical npm prerequisites, normal commit hooks, structured starter preflight, main push and npm upload/verification. Do not repeat those selected checks around the invocation. After existing starter delivery, prepare/review closeout notes once; the announcement invocation handles exact-source tag, Release and readback. Both entries plan by default; `--execute` selects effects and never grants authorization. Existing manual commands remain available. Maintainer-only changes do not call for npm publication.

Registry verification persists sanitized verificationFailures in session summary.json and records each failed attempt's stage, code, bounded/redacted reason and retry/stop/exhausted action. Publication and recovery use one metadata/downloaded-hash contract; only named transient errors retry, while identity, authentication and unknown errors stop. The retry count/interval/fetch timeout remain unchanged. Follow [registry recovery](PACKAGE_RELEASE.md#registry-availability-and-recovery) before resuming an accepted upload; never republish it.

Run main push, npm release, starter sync/push, documentation closeout push and tag push sequentially; await each result before starting the next. Never parallelize operations that share the checkout, dependencies or build directory. The npm tool runner and starter sync entry share `scripts/maintainer-session.mjs`'s checkout-local lock. No pre-push validation hook remains; operators must still await the whole push. Direct `npm run check` and other standalone commands do not acquire this lock.

Each protected entry prints stage start/end, elapsed seconds, a running notice every 30 seconds for asynchronous work, and local log paths. Non-interactive child stdout/stderr is saved in full under ignored `acceptance-results/maintainer-*/`; failures show a bounded tail and remain blocking. `summary.json` records completed stage statuses, durations and command exit codes. npm publish retains inherited terminal input/output for authentication; its stage records duration/status, not interactive output or input. Synchronous registry/audit calls report start/end but cannot emit a heartbeat while blocking Node.

`scripts/maintainer-evidence.mjs` adds before/after observational fingerprints to each stage: Git HEAD/tree and working/index/untracked hashes, selected package/lockfiles (including installed lock metadata), root dotenv hashes, Node/tool versions and selected environment-value hashes. Only environment names and hashes are recorded, never dotenv contents or environment values; npm authentication variables such as `NPM_TOKEN` are excluded. Build-producing `session.run` npm commands also record the resulting `dist` tree hash. Symlinks are hashed without following their targets. `commandSeconds` measures child execution, `evidenceSeconds` measures fingerprint collection, and stage `seconds` includes both. Missing/unavailable evidence is explicit and does not replace the command's outcome.

These records have `observationalOnly: true`: they are diagnostic context, not reusable validation receipts. Selected inputs are not a complete snapshot of ignored files, dependency bytes or external services. No command reads an earlier summary to skip checks; identical inputs still execute all gates. Keep existing validation and audit requirements unchanged.

New summaries record session/stage timestamps, operation time, child-command time, measured explicit verifier backoff, evidence collection, between-stage time and separate lock wait. Session wall coverage uses the union of stage intervals; overlaps are flagged. Command and backoff are subsets of operation time, not extra wall time to add. `commandSeconds` measures only `session.run` children; filesystem/capture work remains in operation time. Child execution includes network waiting, so it is not CPU time or pure registry propagation. Report agent/tool gaps outside the process separately; never attribute an entire handoff interval to Git execution. Older summaries without these fields show `not recorded`, not estimated zero. See the [timing contract](RELEASE_TOOLS.md#avoid-repeated-administrative-work).

Starter sync runs the generated `npm run check` once after installation/audit. That script invokes package-owned `astro-theme doctor`, which runs Astro check, `npm run build` and the enabled About runtime assertions; a second immediately adjacent standalone build is unnecessary. A failed doctor/build still blocks commit/push and preserves its isolated starter worktree for inspection. Independent consumer acceptance continues to execute the separate public `build` script as part of all eleven scripts.

The 0.36.0 persisted-image feature introduced preparation before local doctor checks. Version 0.36.2 also prepares in normal build and CI doctor; this change is not in 0.36.1. Explicit prepare-covers --check and config sync remain read-only. Starter's own onboarding covers generate its own manifest/variants; main's demo manifest is never copied wholesale. `STARTER_COVER_ROOT`/`starterCoverFiles()` enumerate only generated manifest-owned paths for staging after a successful doctor. The empty originals placeholder is manifest-managed; real originals/derivatives remain personal content and are not upgrade-overwritten. Independent installed checks explicitly prepare before their build assertions. Ordinary builds reuse valid derivatives and repair missing/stale/corrupt derivatives before copying; missing/invalid originals and unsafe paths still fail. See [cover assets](BLOG_COVER_ASSETS.md).

After an accepted npm upload whose registry verification timed out, use the standalone read-only `npm run release:verify -- --version <exact-version>` entry; see [registry recovery](PACKAGE_RELEASE.md#registry-availability-and-recovery). It shares reporting/serialization but never reruns publication or starter synchronization.

The lock is released on normal success/failure. After a forcibly interrupted process, inspect `acceptance-results/.maintainer-lock/owner.json` and confirm that its process and children have stopped before removing a stale lock; never delete an active session's lock. Reporting remains observational; current tool selection follows the validation policy. Logs can contain sensitive tool output: keep them ignored and review/redact before sharing. These tools remain maintainer-only and need no npm release.

Keep scratch Astro projects and historical source clones outside the checkout, or remove/archive their source files after verification. Reports may stay in ignored `acceptance-results/`, but project copies there can still enter TypeScript or formatting discovery. Generated starter worktrees therefore live outside the checkout. Ensure local evidence stays ignored across branch switches; never commit it or weaken starter source checks to hide a scratch project.

Demo identity and translated introductions belong in main's `src/site.config.ts`. Starter sync and drift checks resolve that destination through `starterSourcePath()` to `scripts/starter-templates/site.config.ts.template`; keep this template generic. The independent installed-starter check uses the same mapping. Do not copy the demo config into starter or add the source template to its distributed files. Consumer configuration remains `src/site.config.ts`.

For repeatable public-starter command/configuration acceptance, local headless browser checks and the manual Linux Actions workflow, see [Template acceptance](TEMPLATE_ACCEPTANCE.md). These maintainer tools remain outside the generated starter.

### Technical selection

Use [Release tools](RELEASE_TOOLS.md) and the [Validation policy](VALIDATION_POLICY.md). Metadata, lint, types, focused units, workspace/fonts/integration/scaffold/packed-CLI checks, build and assertions on existing About output are independent tools. source-check is an optional legacy aggregate requiring user consent, not the default main gate.

Choose installed-check (install/audit/CLI), installed-build (one default build), or installed-matrix (fourteen configurations; confirmation required). Do not select multiple levels. Full browser/remote-template/upgrade pipelines are optional because they contain browser stages; ask with reasons and cost before executing them.

Starter generation retains its installed dependency audit and one package doctor/build. Consumer doctor and upgrades retain their public behavior. Publication uses registry/audit/pack/auth/upload/download mechanics, plus agent-selected technical checks. No default hosting or demo verification is performed.

## Release Sequence (Canonical)

### Capability selection and completion

The agent composes independent tools from actual changes. Preparation, technical validation, npm mechanics, starter delivery and public source/Release consistency are separate capabilities, not a cumulative full-suite checklist.

- Prepare code and responsible docs before publication; commit/push authorized clean main after selected technical checks.
- Select technical checks explicitly. npm-delivery does not implicitly run full check, installed matrix or browsers. Preview the plan; all selected validation runs before upload.
- Verify registry tag and exact download before starter delivery. Recover accepted uploads read-only.
- Select relevant installation/upgrade evidence; full browser-containing consumer pipelines require confirmation and are not compulsory after every starter push.
- Record source/npm/starter/tag/Release identities. Create and read back the GitHub Release. Package delivery completes independently of user demo acceptance.
- Keep checkout mutations serial. No pre-push full check or cross-invocation validation cache exists.
- Do not use routine release wording as consent for browsers, Cloudflare or live inventories. Obtain specific user approval after explaining the operation and its reason, scope and expected duration.

Reduce administrative gaps by preparing release prose/check selection before source freeze and using the [batched stable-release closeout](RELEASE_TOOLS.md#batched-stable-release-closeout) after verified npm/starter delivery. Its prepare/verify modes collect fresh identities, generate announcement notes and read back the exact Release in two bounded invocations. Technical checks, download verification, installed starter audit/doctor, shared locking and pre-commit hooks remain intact. Choose installed-check versus installed-build from actual packaging/runtime risk; the tool does not automatically downgrade that choice.

Keep changing source/starter refs and timings in the announcement/local receipts. Avoid a tracked closeout commit solely to repeat the previous commit's deployment; if a meaningful correction is necessary, batch it once before final announcement preparation. Re-sync starter only for changed managed inputs. Do not alternate repeated metadata checks, commits, pushes and receipt edits for unchanged inputs; hooks still run normally at every commit. Summary files remain observational and never replace freshly selected checks.

Starter synchronization uses `npm update --prefer-online` within the source dependency ranges before its blocking audit. This refreshes indirect dependencies retained by older lockfiles; it does not bypass version constraints or vulnerability findings.

Preserve latest template/package and frozen schema-1 baseline contracts. Choose technical evidence when affected; the browser-containing full upgrade fixture is optional and requires consent. Preserve same-schema upgrade compatibility, including skipped versions. Pre-0.27 copied skeletons intentionally require a fresh-starter migration; a future schema break must stop automatic updates and include deliberate migration instructions. Automatic in-place upgrades across arbitrary historical/custom skeletons are not guaranteed.

## Production Demo Deployment

The official demo should serve main content; starter contains only distribution onboarding content. Demo regression is user-owned and separate from npm/starter delivery.

**Do not perform Cloudflare login/account/settings/build/deployment polling, public article inventories, live tutorial comparisons or real Giscus checks by default.** If the user requests agent investigation, or the agent finds a specific reason to propose it, state the exact operations, reason, scope and expected time and wait for explicit confirmation. Missing hosting access is not an npm release failure.

Keep existing hosting configuration and deployment support. Main pushes may still trigger external deployment, so do appropriate source checks before authorized pushes; removing local pre-push tests does not cancel that external trigger. Do not modify provider settings without task authorization.

Record any user-reported demo acceptance without repeating it. If no user result is supplied, label demo acceptance user-owned/unperformed by the agent and complete technically verified package delivery without a routine confirmation round.

When a specifically authorized investigation finds starter content on production, diagnose branch/deploy configuration instead of rewriting main articles or republishing npm. Never infer the active production revision or account settings solely from a successful build or matching page content.

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

Starter-only changes that require existing users to act still need a public announcement. Prepare an Unreleased changelog entry and a concrete `UPGRADING.md` migration before delivery. After validated main/starter delivery and selected technical acceptance, publish a GitHub Release with a distinct starter tag (for example `starter-seo-YYYY-MM-DD`) at the committed main source revision. Do not label it as a new npm version or move an existing package tag. Include the delivered main/starter revisions, migration link, affected hosts, checks and the fact that `npm update` does not merge project files. Read back the announcement and refs; until then keep its status explicitly pending. This supplements Class B delivery without requiring an empty npm publication.

Users can opt into repository release notifications; a push, changelog edit or unchanged npm package version alone is not an automatic upgrade notification. Do not promise that every existing user will be notified. Package-release closeout continues to use the exact npm source tag and the existing package runbook.

Maintainer entry commands (run on `main`):

```bash
npm run maintainer:sync-starter:check
npm run release:starter
# optional sync + auto-push:
npm run release:starter:push
```

`maintainer:sync-starter:check` returns exit status 1 when drift is found, but still closes its maintainer session and releases the shared lock. Expected drift must not leave an interrupted-session lock for the next operation.

Select workspace-link and scaffold assertions when those inputs change. Discover independent capabilities through the tool catalog; do not expand a full aggregate and then repeat its children.

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
- After selected technical acceptance, record actual results, tag the published npm source commit, and create/read back the GitHub Release using `docs/PACKAGE_RELEASE.md`. npm publication alone does not complete a release.
- `npm run release:starter` stages starter changes from `scripts/starter-manifest.mjs` plus starter dependency files; it must not rely on `git add -A`.

If `npm run release:starter` fails, fix the sync contract or package-side issue on `main`; the current main checkout and dependencies have not been changed. Do not patch starter runtime logic manually.

## Failure Recovery

If `npm run release:starter` fails mid-run:

1. Read the retained worktree path in the error/session log. It is a generated `anglefeint-starter-worktree-*` directory under the OS temporary directory, not the main checkout.
2. Inspect `git -C <exact-worktree-path> status` and its diff/logs; save any evidence or changes you need. Audit/build/hook/source-drift failures block commit or push as appropriate. A failed push may leave a valid local starter commit.
3. Fix maintainer/runtime issues on main. Do not patch starter runtime as the source of truth, stop dev servers, switch main branches, or reinstall main dependencies for this recovery.
4. Before retrying, resolve the retained generated worktree. Git refuses a second checkout of its active branch. After reviewing/saving its contents, explicitly clear only its generated changes if necessary, then remove that exact registered worktree with `git worktree remove <exact-worktree-path>`. Dirty removal is refused; the tool never forces deletion or resets main. Do not delete an arbitrary computed path or run a global worktree prune as a substitute.
5. Rerun the normal starter command. Installation, audit and doctor/build run freshly; an old receipt does not bypass them.

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
- `npm run release:starter` uses a dedicated OS-temporary worktree and node_modules for starter. It never checks out starter in main or reinstalls main dependencies; running development servers remain untouched.
- `main` provides `npm run check:workspace-link`; select it when dependency restoration or workspace wiring needs validation.
- `main` keeps pre-commit staged lint/format and document metadata checks; the unconditional pre-push check is removed.
- `starter` must stay hook-free (no `prepare`, no `lint-staged`, no `.husky`) to avoid user template friction.
- `starter` must stay maintainer-tooling-free (no `maintainer:*` or `release:starter*` scripts in starter `package.json`).
- If hooks still misbehave after reinstall, treat it as a local environment issue and recover locally before proceeding.
- A failed `release:starter` retains its isolated worktree for inspection; the original checkout remains on its branch. Successful clean worktrees are removed without force.
