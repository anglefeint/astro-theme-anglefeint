---
doc_id: release_tools
doc_role: reference
doc_purpose: Maintainer release capabilities, inputs, effects and composition boundaries.
doc_scope: [release, workflow, validation, starter-sync]
update_triggers: [workflow-change, release-change, script-change, command-change]
source_of_truth: true
depends_on:
  [
    scripts/release-tool-plan.mjs,
    scripts/npm-release-tools.mjs,
    scripts/release-tools.mjs,
    scripts/verify-published-package.mjs,
    scripts/verify-release.mjs,
    scripts/release-closeout.mjs,
  ]
sync_targets: [docs/AI_WORKFLOW.md, docs/MAINTAINER_WORKFLOW.md, docs/PACKAGE_RELEASE.md]
---

# Release tools

Maintainer-only capabilities. Follow [Validation policy](VALIDATION_POLICY.md) for agent selection and explicit user consent. Code owns executable operations; the agent chooses checks for the actual change. These tools are not distributed to consumer projects.

## Discover, plan, execute

```bash
npm run release:tools -- list
npm run release:tools -- plan docs-check lint
npm run release:tools -- run unit-tests lint docs-check --test tests/release-tool-plan.unit.test.mjs
```

Listing/planning never publishes. Running without a publishing target cannot upload. All selected validation executes before upload, regardless of target order. Shared selections execute once per invocation; there is no historical-result cache.

## Independent technical tools

| Tool                                                | Work                                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| docs-check                                          | Document metadata only.                                                                    |
| lint / format-check                                 | Lint / formatting. Run broad formatting scans after fixture cleanup.                       |
| types-check                                         | Astro diagnostics, no build.                                                               |
| unit-tests                                          | Only literal --test tests/name.test.mjs files; no implicit full suite.                     |
| workspace-check / fonts-check                       | Workspace dependency link / bundled assets.                                                |
| integration-check / scaffold-check / pack-cli-check | Wiring / manifest skeleton / packed CLI.                                                   |
| build                                               | One main build.                                                                            |
| about-output-check                                  | Existing dist About assertions, no rebuild. Select build first when a new build is needed. |
| installed-check                                     | Temporary independent package install, audit and CLI assertions; no build.                 |
| installed-build                                     | Same isolated validation plus one default configuration build.                             |
| installed-matrix                                    | Fourteen configuration builds; exceptional, confirmation required.                         |
| source-check                                        | Legacy complete main aggregate; exceptional, confirmation required.                        |

Choose exactly one installed validation level; combining levels is rejected before execution to prevent duplicate installations. Focused unit paths must exist. No pre-push full check remains. Pre-commit staged lint/format and metadata checks remain. Root check/doctor aliases remain explicit convenience commands subject to the confirmation policy; publication never invokes them implicitly.

## npm mechanics

| Tool           | Contract                                                                        |
| -------------- | ------------------------------------------------------------------------------- |
| registry-check | Local package version must be newer than registry latest.                       |
| audit-main     | Blocking dependency audit, no exemption.                                        |
| pack           | Packaging check; generated preparation tarball is cleaned.                      |
| npm-auth       | Publishing identity.                                                            |
| npm-upload     | Requires registry-check, audit-main, pack and npm-auth. Uploads once.           |
| npm-delivery   | Upload plus exact-version/tag download verification; retries verification only. |

Before an authorized release, choose necessary technical validation and preview the combined plan. For example, installed-build and npm-delivery in one invocation perform one independent install/build before uploading. This is not a mandatory recipe for every change. npm-delivery alone only performs mechanics and does not prove source/install/upgrade validation. The agent must report which checks were selected.

The compatibility release:npm entry uses the same mechanics, retaining tag/dry-run/skip-pack/skip-registry-check diagnostics; --skip-checks is deprecated because no full check runs implicitly. Diagnostic omissions still require explanation. Publishing continues from packages/theme, not the preparation tarball. No single-artifact handoff is claimed.

Publication and recovery share tag/exact-version metadata/downloaded-hash validation. Normal upload records HEAD before publication and verifies registry gitHead. Recovery accepts recorded optional expected identities rather than assuming the current checkout is the published source. Each failure is saved in session summary.json as verificationFailures and reports stage/code/reason and retry/stop/exhausted; only recognized propagation/network/rate-limit/server failures retry. Identity/authentication/integrity/malformed/unknown errors stop immediately. Attempts (12), interval (10 seconds) and per-fetch timeout (15 seconds) remain unchanged. See [registry recovery](PACKAGE_RELEASE.md#registry-availability-and-recovery) for the full contract.

## Consent and other capabilities

The JSON catalog marks requiresUserConfirmation. source-check and installed-matrix cannot execute through the runner without --confirmed. First explain the exact check, why it is needed, its scope and expected cost, and receive explicit approval. That flag records approval; passing it is never a substitute for asking. plan remains read-only and shows confirmationRequired.

- Starter preflight: maintainer:sync-starter:check (expected drift exits 1).
- Starter delivery: release:starter; optional release:starter:push includes the push. Choose one delivery path. Install, audit, doctor/build and main dependency restoration remain intact.
- Registry recovery: release:verify -- --version <exact-version>, preferably with recorded source/hash identities. Read-only; never reuploads or switches branches.
- check:template, its pnpm/upgrade variants, check:upgrade, e2e and music-browser scripts contain browser actions. They are not default release steps and require user confirmation with reasons before the agent calls them.
- Cloudflare account/settings/build polling, public-demo inventories/tutorial comparisons and real Giscus checks are not default tools. Demo regression belongs to the user. Optional agent investigation requires specific consent as described in the validation policy.

Starter generation and user upgrades retain their non-browser doctor contract. Their public scripts are not rewritten by this maintainer refactor. Local tests are not evidence of npm download availability; use the dedicated npm verifier after upload.

## Evidence and completion

### Source handoff and announcement execution

`release:flow` is maintainer-only and plans by default. Prepare the version, changelog, migration/check-plan prose and a commit-message file first; review and stage the intended changes together. Technical outcomes/identities/timings go into session evidence and the announcement, rather than another tracked-document edit between checks and commit.

```bash
npm run release:flow -- source --version 0.37.0 --message-file acceptance-results/commit-message.txt --check unit-tests --test tests/example.unit.test.mjs --check types-check --check build --check installed-build
```

Replace the example version and test with the actual candidate and existing literal test path. Inspect the plan, then add `--execute` only for an authorized release. The flag selects execution; it does not grant authorization or exceptional browser/full-suite consent. Select checks once, either in this flow or through the manual path; do not prepend the same independent checks and then repeat them inside it. One installation level and the existing tool-selection rules remain enforced. Exceptional source/matrix checks stay on their separately consented manual path.

The flow holds one checkout session/lock and delegates to the canonical npm tool runner. Selected checks, registry-version gate, blocking main audit, packing and npm authentication complete first. Immediately before upload, it checks the staged tree/version again, commits through normal hooks using `--file`, checks the resulting clean tree, runs the structured starter drift preflight, pushes main and confirms the remote source. Then the existing single upload and exact-source/tag/download verifier run. Managed starter drift is data; unexpected preflight errors stop. Unstaged/untracked source, `HUSKY=0`, check/hook errors, hook-modified source or push/source drift stop before upload. It never stages unrelated files, changes versions or edits documentation itself.

If hooks change the tested tree, the local commit remains for review/revalidation; the flow does not push it automatically. If an upload is accepted but verification fails, do not rerun source handoff: use the existing read-only `release:verify` recovery. The next step after verified npm delivery remains the existing starter delivery, including its install/audit/doctor/build and main restoration.

After starter delivery, prepare and review the normal closeout `notes.md`/`receipt.json`. Then:

```bash
npm run release:flow -- announce --receipt acceptance-results/<closeout>/receipt.json
npm run release:flow -- announce --receipt acceptance-results/<closeout>/receipt.json --execute
```

Announcement execution revalidates the reviewed note hash and fresh source/npm/starter identities before effects, refuses conflicting local/remote tags, creates/pushes a missing exact-source tag, creates a missing Release using the reviewed file, and runs the original complete readback verifier. It reuses an already correct tag/Release rather than forcing tags or editing announcement bodies. An existing wrong body/draft, unknown lookup/authentication error or changed receipt/source stops. A partial tag/Release failure can be retried against the same unchanged reviewed receipt; npm is never involved. Only the known `gh release view` missing-release response is treated as absence. Manual commands remain available for diagnostics/prereleases.

The source flow supplies its owning session to the npm runner and calls the structured preflight directly. It does not invoke another lock-taking CLI while holding the lock. This preserves serialization without nested-lock deadlocks. Both flows retain detailed failure logs and accurate session timing; no historical receipt skips technical validation.

### Batched stable-release closeout

Prepare user-facing changes, migration notes and the version ledger before freezing the source. After the selected checks, npm download verification and starter delivery, use the maintainer-only closeout tool instead of assembling temporary identity/announcement scripts:

```bash
npm run release:closeout -- prepare --version <version> --source <npm-gitHead> --starter <delivered-starter-sha> --session acceptance-results/<session>/summary.json
```

Replace the placeholders with recorded values; repeat `--session` only for the specific sessions you want to summarize. This stable-release tool requires clean, pushed main and the exact delivered starter SHA. It batches fresh read-only Git/npm queries, checking source ancestry/version, remote main/starter, registry source/latest/checksums and starter package/lock range, version and integrity. An existing tag must already point to the exact npm source. It writes a new ignored `acceptance-results/release-closeout-<version>-*/` directory containing `notes.md` and `receipt.json`; it does not edit tracked documents. Markdown release-note links become absolute repository links, frontmatter is omitted, delivery identities are appended, and supplied session timings retain failed stages. Raw logs, environment evidence and command arguments are not copied into the public notes.

HTML links/images in release notes must already use absolute URLs; ordinary relative Markdown destinations are normalized automatically, while code examples remain untouched. Review the generated notes. Prefer the announcement flow above to create/push the exact-source tag, create the Release and run readback in one sequence. The manual [package runbook](PACKAGE_RELEASE.md#8-release-notes-contract) remains available; its final read-only check is:

```bash
npm run release:closeout -- verify --receipt acceptance-results/<closeout>/receipt.json
```

Verification refetches identities, requires unchanged clean/pushed main, the matching remote source tag and starter, a published non-prerelease GitHub Release, and an exact match with the prepared notes. Modified notes, branch/source/lock/checksum drift, drafts or an incorrect Release body fail. Each successful verification writes a separate observational receipt beneath the preparation directory; it never overwrites the prepared receipt. The CLI uses the shared maintainer lock. These are standalone commands listed by `release:tools list`, not extra npm-upload dependencies.

Neither mode publishes, installs, commits, pushes, creates tags/releases, runs browser/hosting checks, downloads npm tarballs or reruns technical suites. It does not replace the canonical download verifier or starter managed-file drift check. Run that drift check once when selected, rather than before and after every documentation-only step. Session summaries and receipts are observations, never validation caches or permission to skip required checks. Prereleases retain the existing manual closeout path.

### Avoid repeated administrative work

Use one explicit technical plan with one installation level. Run dependency/build-mutating operations serially; batch independent read-only inspections. Preserve staged lint/format/metadata hooks and the starter's installed audit/doctor/build. Prepare the version ledger's changes, compatibility and check plan before the source commit; put changing final refs/timings in the generated announcement and local receipts. A post-delivery documentation commit is needed only for a substantive correction or intentionally maintained ledger facts, and should be one batch. Re-sync starter only if managed inputs changed. Do not add another source commit, starter sync or build merely to record the previous closeout commit's own ref.

Tools retain the shared checkout lock, stage timing, logs and observational fingerprints under ignored acceptance-results. No old summary is used to skip checks. Failures stop subsequent upload; post-upload visibility failures use standalone read-only recovery. Clean/pushed main and authorization remain workflow requirements.

New summaries include session/stage timestamps and `timing`: wall coverage, operation time, measured child-command time, explicit verifier backoff, evidence collection and between-stage coordination. Command time and explicit wait are subsets of operation time, not independent values to add to wall time. Command time covers `session.run` children; capture/filesystem work remains in operation time. Network waiting inside a child command cannot automatically be called registry propagation. Stage wall coverage uses interval union, with overlapping stages marked. Lock acquisition wait is separate. A session cannot account for agent/tool round trips outside that process; a whole-request report must label those intervals separately. Legacy missing metrics render as `not recorded`, never inferred as zero or pure waiting.

Record source, npm identity, starter and tag/Release refs plus selected technical checks. Package delivery can complete without Cloudflare or demo acceptance. Mark demo as user-owned rather than waiting for or repeating their regression. Keep checkout mutations serial; do not run repository-wide scans through transient fixture output.
