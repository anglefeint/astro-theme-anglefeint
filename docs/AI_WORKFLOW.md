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
  - docs/VALIDATION_POLICY.md
  - AGENTS.md
  - docs/DOC_METADATA_SPEC.md
  - docs/MAINTAINER_WORKFLOW.md
  - docs/PACKAGE_RELEASE.md
  - docs/DOC_SYNC_WORKFLOW.md
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
- `docs/DOC_SYNC_WORKFLOW.md` for metadata-driven documentation updates

## Branch Model

- `main` is the only source-of-truth branch for runtime logic, architecture, and release work.
- `starter` is a generated/distribution branch for template consumers.
- Do not manually patch runtime logic in `starter`.
- Any change that should reach `starter` must land in `main` first, then be propagated through the maintainer sync flow.
- The production demo uses main content; starter is a distribution skeleton. Hosting checks and demo regression are user-owned, separate from package delivery; see [Validation policy](VALIDATION_POLICY.md).

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
   - `docs/DOC_SYNC_WORKFLOW.md`

## Safe Engineering Workflow

### 1. Analyze First

- Confirm the actual source files involved.
- Check whether the requested behavior is package-owned (`packages/theme/src/**`) or starter/app-owned (`src/**`).
- Prefer config-driven changes over hard-coded behavior.
- For the 0.27 integration architecture, standard routes/config defaults/i18n/build behavior live in the package. Keep the consumer skeleton thin; do not solve package upgrades by overwriting user source/config/media. Pre-0.27 projects intentionally migrate once into a fresh starter.
- Avoid changing SEO/i18n/high-risk files unless the task truly requires it.

#### Dependency integration boundaries

Prefer the dependency's documented public APIs. Keep configuration mapping, filesystem completion and lifecycle ownership in a small theme-owned integration layer. Do not edit dependency source (including installed files), monkey-patch private behavior, or introduce a modified fork/vendor copy as an integration workaround. Do not make user setup depend on private dependency details. When a public interface cannot satisfy a requirement, record that limitation and evaluate supported upstream releases or alternatives.

Read upstream implementation for diagnosis without changing it. Distinguish a library contract, an observed version-specific defect and our own caller behavior. Verify the before/after APIs against the supported dependency version; do not describe an old public API as private merely because the replacement is public. Keep necessary assumptions about public APIs and generated artifacts local, with regression coverage, rather than claiming there is no dependency coupling.

For Pagefind, both index.writeFiles and index.getFiles are public APIs. Before 0.27.2 the theme awaited writeFiles and immediately read entry metadata. The 0.27.2 integration gets complete buffers with getFiles, awaits Node writes and then publishes its own language manifest. Pagefind still generates the index and browser search engine; our code owns the file-output handoff. No dependency-source modification is involved. See [the architecture](ARCHITECTURE.md#build-integrations-and-seo) and [the release evidence](releases/0.27.2.md).

### 2. Implement on `main`

- All real feature work, bugfixes, schema changes, runtime script changes, and workflow changes must be implemented on `main`.
- Treat `starter` as generated output, not as a development branch.

### 3. Validate Locally

#### Local visual feedback and consent

Follow [Validation policy](VALIDATION_POLICY.md#explicit-stop-rules). Do not execute browser regression (full or targeted), screenshots/visual measurements, Cloudflare login/settings/build polling, demo article/tutorial inventories or real Giscus acceptance by default. The user performs demo regression. If the agent believes an exception is necessary, explain the exact command/operation, reason, scope and expected duration, then wait for explicit approval. Generic testing or release authorization does not approve those activities. Never self-authorize with --confirmed.

Make requested local edits and manage the server as needed for user feedback. Relevant non-browser technical checks remain selectable; do not ask routine permission for those. Respect specific consent already given for an identified check in the current task; do not treat previous releases as blanket approval.

Serialize all release/push operations that share the checkout; wait for each command to finish before starting another. Follow [serial execution and reporting](MAINTAINER_WORKFLOW.md#serial-execution-and-reporting) for stage durations, ignored logs and lock recovery. Reporting does not replace or reduce any validation gate.

Select independent checks from [Release tools](RELEASE_TOOLS.md) according to actual changes. State the purpose of each selected check and report its result.

- Documentation: metadata, changed formatting and relevant links/examples.
- Maintainer scripts: focused unit files, lint and relevant technical mode smoke tests.
- Runtime/config: relevant tests/static assertions, types and one build as needed.
- Package: packed contents/CLI and independent install/build at the appropriate level; choose one installation level.
- Upgrader/project contracts: relevant compatibility and preservation evidence. check:upgrade currently contains a browser stage; get consent before that mixed tool or use focused non-browser units.

Do not default to source-check, check/doctor aggregates, all unit tests, the fourteen-case matrix, full browser suites or remote template browser pipelines. Exceptional full aggregates and browser/demo operations require the confirmation procedure in the validation policy. Global changes do not automatically authorize browsers.

No pre-push full hook or historical-result cache remains. Avoid duplicate invocation by choosing independent tools once. For existing output assertions, establish that the output comes from the intended inputs; do not claim old fingerprints prove freshness.

Symlinked build fixtures must set project-local Astro `cacheDir` and Vite `cacheDir`; sharing node_modules must not share writable content/build caches. `e2e:prepare` builds the fragments fixture before the parallel browser suite, so fixture compilation does not contend with WebGL/animation acceptance. Keep original functional deadlines and concurrency; fix isolation and content-dependent measurement assumptions at the test boundary.

### 4. Release Decision

Report the selected technical plan and delivery results using [Release tools](RELEASE_TOOLS.md) and the [maintainer capability constraints](MAINTAINER_WORKFLOW.md#capability-selection-and-completion). The agent chooses independent checks; only npm mechanics are implicit. No historical result cache is enabled.

Publish npm when the change affects installed users through the package, for example:

- `packages/theme/src/**`
- package exports
- content schema
- package CLI behavior
- package-consumed runtime behavior

If npm release is required, compose an explicit plan from the [tool catalog](RELEASE_TOOLS.md). Preserve these constraints:

- Prepare the version, changelog and release ledger; keep main clean and commit/push the technically validated source after applicable starter drift preflight.
- Prefer the [source handoff](RELEASE_TOOLS.md#source-handoff-and-announcement-execution): finish/stage reviewed version and check-plan prose first, select necessary checks inside one planned `release:flow source` invocation, then execute it for an authorized release. It retains normal commit hooks, structured starter preflight, main push and canonical npm mechanics under one lock. Do not duplicate the same checks outside and inside the flow or hand-edit tracked result prose after checks merely to record their completion.
- Select `npm-delivery` for complete npm delivery. Preview with `npm run release:tools -- plan npm-delivery`, then execute with `npm run release:tools -- run npm-delivery`. The planner includes npm mechanics only. Explicitly select the relevant technical tools; all selected checks run before upload. It never consumes earlier check results. Existing `release:npm` remains a compatible entry.
- Do not routinely prepend a full dry-run. Upload once, and recover accepted uploads through read-only registry verification.
- Only after exact download/tag verification, deliver and push starter, complete the selected technical acceptance and exact-source tag/GitHub Release. Demo regression is user-owned and does not block package completion.
- Record actual results and limitations. npm upload alone is not completion. See the catalog for tool effects and runbooks for delivery/evidence policy; do not duplicate their internal commands here.
- After verified npm and starter delivery, prepare/review closeout notes once and use `release:flow announce` to compose exact-source tag/Release/readback. Existing prepare/verify remain read-only; the separate execution flow owns mutations and stops on mismatches. Its `--execute` flag never substitutes for user authorization.

If npm release is not required but starter should still change:

- run `npm run maintainer:sync-starter:check`
- push `main`
- run `npm run release:starter`
- push `starter`
- for starter changes requiring user action, finish selected technical acceptance and the [starter-only upgrade announcement](MAINTAINER_WORKFLOW.md#announcing-starter-only-upgrades); prepare its migration/changelog before delivery and do not claim npm update installs project files

## Starter Synchronization Contract

- `npm run release:starter` is the only supported maintainer path for updating `starter`.
- It is responsible for:
  - syncing managed files from `main`
  - syncing only manifest-owned starter blog content (not the full `main` article library)
  - updating starter dependency range for `@anglefeint/astro-theme`
  - reinstalling starter dependencies
  - validating starter via `check` and `build`
  - staging only manifest-owned starter files plus starter dependency files
  - returning to the original branch only after a successful starter sync
  - restoring `main` dependencies after switching back
- Starter validation must work in both:
  - workspace-link development installs on `main`
  - installed-package starter environments where `@anglefeint/astro-theme` resolves from `node_modules`
- `npm run release:npm` cleans up the generated `anglefeint-astro-theme-<version>.tgz` tarball after publish or dry-run completion.
- `npm run release:npm` verifies that the local package version is newer than the npm registry version before packing or publishing.
- After a real publish, it retries dist-tag/download verification, never publication. If verification fails, confirm registry availability before syncing starter; do not republish the accepted version.
  Use `npm run release:verify -- --version <exact-version>` for standalone read-only recovery, supplying recorded `--source`, `--integrity` and/or `--shasum` when available. It verifies the selected tag and exact download without publication, installation, branch changes or starter sync; all other release gates remain required. See [the recovery contract](PACKAGE_RELEASE.md#registry-availability-and-recovery).

Use `npm run maintainer:sync-starter:check` to detect drift without mutating branches.

Select technical evidence for the latest starter/package and supported schema-1 upgrade contract when affected; browser-containing full fixtures require prior consent. Pre-0.27 copied skeletons are outside this automatic-upgrade contract. For a deliberate project-schema break, provide a migration guide and stop incompatible automatic upgrades; never overwrite a customized project with maintainer tooling.

After starter delivery, choose additional independent technical installation checks when needed. Existing check:template variants contain browsers and are not mandatory release steps; ask before invoking them. Remove owned temporary projects after checks and server shutdown. Retry failed starter delivery without republishing an accepted npm version.

## Documentation Workflow Contract

When code/config/theme behavior changes, document sync is not automatic by filename. Follow `docs/DOC_SYNC_WORKFLOW.md`.

Core rules:

- code is authoritative for implemented behavior; read actual defaults, routes, package/starter wiring and tests before correcting prose
- document ownership metadata does not override implementation; do not modify runtime merely to satisfy stale descriptions
- start with `npm run suggest:docs` to infer the likely direct-hit and propagated docs from current file changes
- for committed work, pass paths from a reviewed commit range; the helper otherwise sees only the working tree
- discover markdown files
- validate metadata against `docs/DOC_METADATA_SPEC.md`
- inspect metadata responsibilities
- update only documents whose `doc_scope` / `update_triggers` were actually hit
- propagate changes only through declared `depends_on` / `sync_targets`
- avoid user-facing README churn unless the user-facing truth changed
- use sidecar metadata only for approved public-facing markdown files
- verify code-to-document correspondence manually; helper suggestions and metadata validation are not semantic correctness checks

## Tool-Specific Adapters

This repository uses one neutral entry plus thin tool adapters:

- `AGENTS.md` is the neutral entrypoint for all agents
- `CLAUDE.md` is a thin Claude-oriented adapter that points back to `AGENTS.md`
- `.cursor/rules/00-repo.mdc` is a thin Cursor adapter that points back to `AGENTS.md`

Do not maintain separate, conflicting workflow copies in those adapter files.

Consumer projects receive separate user-oriented `AGENTS.md`, `CLAUDE.md` and `.cursor/rules/00-repo.mdc` sources from `scripts/starter-templates/` through the starter manifest's source overrides. Do not distribute this checkout's maintainer entries to personal blogs. Consumer README metadata also uses template sources whose document relationships resolve inside the delivered project. Independent installed and remote-template acceptance run `checkStarterGuidance` to verify those entries, commands and links; this is structural acceptance, not a live test of Cursor, Codex or Claude Code sessions.

## Prohibitions

- Do not fix runtime bugs directly on `starter`.
- Do not move maintainer-only implementation details back into user-facing README unless they affect end-user setup or upgrade.
- Do not treat stale docs as harmless; update or explicitly skip with a reason.
- Do not publish npm without a version bump.
- Do not leave release tarballs or generated artifacts tracked in `starter`.
- Do not bypass manifest-driven starter staging with full-worktree git adds.

## Release completion

A package release completes after selected technical checks, npm exact-download verification, applicable starter delivery and source/tag/GitHub Release identity read-back. Report checks actually performed and any user-owned demo status. Do not run browser/Cloudflare/live acceptance or wait for user demo confirmation as a package completion gate.

Main audit is intrinsic to npm mechanics; isolated audits run when that installation tool is selected, and starter sync audits its installed tree. All findings and registry errors remain blocking for the relevant operation. No historical audit exemption is restored.

Prepare responsible docs/version/notes, select an explicit technical plan, then perform authorized publication/distribution actions under the tool and maintainer contracts. Do not expand them into a second cumulative command checklist. Docs-only work does not require npm publication or a runtime build. Browser-containing consumer/upgrade pipelines remain optional with prior user consent.

For stable-release administration, finish substantive source/docs edits before final closeout, then prefer `release:closeout prepare` and `verify` through npm as documented in [Release tools](RELEASE_TOOLS.md#batched-stable-release-closeout). These batch fresh read-only identity checks, generated notes and final Release read-back without publishing or rerunning suites. Keep final refs/timings in the announcement/local receipt; make at most one necessary documentation correction batch rather than repeatedly committing a deployment report about its own ref. Preserve all commit hooks, selected technical checks, registry download verification and starter installed audit/doctor. Receipts/summaries never authorize test reuse; do not auto-reduce installation/build coverage merely to save time.
