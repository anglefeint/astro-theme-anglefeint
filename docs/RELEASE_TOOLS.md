---
doc_id: release_tools
doc_role: reference
doc_purpose: Maintainer release capabilities, inputs, effects and composition boundaries.
doc_scope: [release, workflow, validation, starter-sync]
update_triggers: [workflow-change, release-change, script-change, command-change]
source_of_truth: true
depends_on:
  [scripts/release-tool-plan.mjs, scripts/npm-release-tools.mjs, scripts/release-tools.mjs]
sync_targets: [docs/AI_WORKFLOW.md, docs/MAINTAINER_WORKFLOW.md, docs/PACKAGE_RELEASE.md]
---

# Release tools

Maintainer-only capabilities; do not distribute these commands to personal blogs. Code defines executable dependencies; this catalog explains their contracts. The AI workflow chooses capabilities according to the change and required evidence rather than reproducing nested script implementations.

## Discover, plan, execute

```bash
npm run release:tools -- list
npm run release:tools -- plan source-check installed-check npm-delivery
npm run release:tools -- run source-check installed-check npm-delivery
```

`list` returns machine-readable npm capabilities and existing standalone commands. `plan` is read-only and reports ordered prerequisites and whether the selection publishes. `run` executes the selected npm tools and required prerequisites, serially under the existing maintainer lock with stage logs/timings. Unknown names and invalid plans fail before any tool runs. No argument/default action publishes.

The example executes source and installed checks once each in that invocation, even though npm delivery also requires them. This is dependency-plan deduplication, not a cache: a later invocation repeats all selected prerequisites. Existing observational fingerprints are not validation receipts. No pre-push check, consumer command or browser/upgrade gate is removed. Do not split a planned npm delivery into separate `run source-check`, `run installed-check`, `run npm-delivery` calls expecting previous results to be reused.

## Composable npm tools

| Name              | Input and result                                       | Effects / requirements                                                                                                                    |
| ----------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `registry-check`  | Current package name/version vs npm latest             | Network read; requires a newer local version.                                                                                             |
| `audit-main`      | Main installed dependency tree and registry advisories | Blocking audit; errors/findings stop delivery.                                                                                            |
| `source-check`    | Current main project                                   | Full existing check chain, build and About assertions. Writes build output.                                                               |
| `installed-check` | Current local package and manifest-managed starter     | Temporary independent install, blocking audit, CLI and full installed build matrix; cleans fixture.                                       |
| `pack`            | Current package directory                              | Packaging check; preparation tarball is cleaned at invocation end.                                                                        |
| `npm-auth`        | Current npm credentials                                | Checks identity; never prints authentication tokens itself.                                                                               |
| `npm-upload`      | Current package directory                              | Requires all six tools above; uploads once. Explicitly selecting it alone omits download verification and does not complete npm delivery. |
| `npm-delivery`    | Uploaded exact version and selected tag                | Requires upload, then retries only visibility/download verification. Use this target for normal complete npm delivery.                    |

The normal tool entry has no skip flags. `npm run release:npm` remains a compatibility entry using the same operations and dependency planner with its existing tag/dry-run/diagnostic skip options. All skips still require a documented justification. Default behavior retains both dependency audits, all main checks and the installed matrix. Publishing still packs from `packages/theme`, not from the preparation tarball; no single-artifact handoff is claimed by this refactor.

`run` logs under ignored `acceptance-results/maintainer-*/`. A failed prerequisite blocks upload. A failed post-upload verification must use standalone recovery, never rerun `npm-delivery` to recover an accepted version. Temporary cache/tarball cleanup and lock release run on success or failure. Clean main, committed/pushed source, hosting trigger inspection and authorization remain workflow requirements, not new checks enforced by this runner.

## Other delivery capabilities

Use the standalone commands returned by `list`; they deliberately do not depend on npm upload.

| Capability          | Command                                               | Boundary                                                                                                                |
| ------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Starter preflight   | `npm run maintainer:sync-starter:check`               | Read-only drift check; expected drift exits 1.                                                                          |
| Starter delivery    | `npm run release:starter`                             | Generate, install, audit, doctor, commit, restore main/dependencies; push separately.                                   |
| Fresh npm consumer  | `npm run check:template`                              | Actual public starter/package, all eleven public scripts, dev/preview/browser checks.                                   |
| Fresh pnpm consumer | `npm run check:template -- --pnpm`                    | Separate package-manager environment; unsupported automatic-upgrade rejection remains covered.                          |
| Published upgrade   | `npm run check:template -- --upgrade-from=<baseline>` | Exact published npm baseline to current release; protected personal files.                                              |
| Local upgrade       | `npm run check:upgrade`                               | Working package upgrade fixture before publication.                                                                     |
| Full browsers       | `npm run e2e`                                         | Main build, fixture preparation and full functional suite.                                                              |
| Registry recovery   | `npm run release:verify -- --version <exact-version>` | Read-only exact-version/tag/download recovery; supply recorded source/hash identities as documented in PACKAGE_RELEASE. |

Starter delivery also has the existing `npm run release:starter:push` variant, which includes the starter push before restoring main. Choose either that variant or normal sync followed by a separate push; do not execute both. It retains the same install/audit/doctor contract and does not authorize omitting final main/environment or production verification. This release exercised normal sync and a separate push, including its existing main pre-push hook.

Git commit/push/tag, GitHub Release and hosting/live acceptance remain explicit agent operations with the evidence required by the runbooks. Listing a capability is not proof it ran or passed. Keep checkout mutations serial; fresh consumers may overlap only in independent projects and ports.

## Composition rules

- Classify the change first; documentation-only changes do not require npm publication.
- Select required local validation for the change, then preview the npm tool plan when a package release is needed. Source checks do not include format/lint or full browser/real-upgrade acceptance; include those independently when required.
- Never equate source, independent local package, published download, delivered starter, remote consumers or production. Their audits/builds establish different facts.
- After verified npm delivery, sync/push starter, complete remote acceptance and GitHub/live closeout. Do not mark release complete at upload.
- Do not infer cross-invocation reuse from an identical commit or observational hash. This implementation only deduplicates dependencies inside one invocation.
- Consumer `check` and `doctor` currently run the same implementation, followed by a separate public build acceptance. These known repetitions remain until their public-command coverage can be preserved by a separately reviewed change.
