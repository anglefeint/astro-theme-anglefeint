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

### Batched stable-release closeout

Prepare user-facing changes, migration notes and the version ledger before freezing the source. After the selected checks, npm download verification and starter delivery, use the maintainer-only closeout tool instead of assembling temporary identity/announcement scripts:

```bash
npm run release:closeout -- prepare --version <version> --source <npm-gitHead> --starter <delivered-starter-sha> --session acceptance-results/<session>/summary.json
```

Replace the placeholders with recorded values; repeat `--session` only for the specific sessions you want to summarize. This stable-release tool requires clean, pushed main and the exact delivered starter SHA. It batches fresh read-only Git/npm queries, checking source ancestry/version, remote main/starter, registry source/latest/checksums and starter package/lock range, version and integrity. An existing tag must already point to the exact npm source. It writes a new ignored `acceptance-results/release-closeout-<version>-*/` directory containing `notes.md` and `receipt.json`; it does not edit tracked documents. Markdown release-note links become absolute repository links, frontmatter is omitted, delivery identities are appended, and supplied session timings retain failed stages. Raw logs, environment evidence and command arguments are not copied into the public notes.

HTML links/images in release notes must already use absolute URLs; ordinary relative Markdown destinations are normalized automatically, while code examples remain untouched. Review the generated notes. Create/push the exact-source tag and create the GitHub Release with that notes file, serially, using the [package runbook](PACKAGE_RELEASE.md#8-release-notes-contract). Then finish with:

```bash
npm run release:closeout -- verify --receipt acceptance-results/<closeout>/receipt.json
```

Verification refetches identities, requires unchanged clean/pushed main, the matching remote source tag and starter, a published non-prerelease GitHub Release, and an exact match with the prepared notes. Modified notes, branch/source/lock/checksum drift, drafts or an incorrect Release body fail. Each successful verification writes a separate observational receipt beneath the preparation directory; it never overwrites the prepared receipt. The CLI uses the shared maintainer lock. These are standalone commands listed by `release:tools list`, not extra npm-upload dependencies.

Neither mode publishes, installs, commits, pushes, creates tags/releases, runs browser/hosting checks, downloads npm tarballs or reruns technical suites. It does not replace the canonical download verifier or starter managed-file drift check. Run that drift check once when selected, rather than before and after every documentation-only step. Session summaries and receipts are observations, never validation caches or permission to skip required checks. Prereleases retain the existing manual closeout path.

### Avoid repeated administrative work

Use one explicit technical plan with one installation level. Run dependency/build-mutating operations serially; batch independent read-only inspections. Preserve staged lint/format/metadata hooks and the starter's installed audit/doctor/build. Prepare the version ledger's changes, compatibility and check plan before the source commit; put changing final refs/timings in the generated announcement and local receipts. A post-delivery documentation commit is needed only for a substantive correction or intentionally maintained ledger facts, and should be one batch. Re-sync starter only if managed inputs changed. Do not add another source commit, starter sync or build merely to record the previous closeout commit's own ref.

Tools retain the shared checkout lock, stage timing, logs and observational fingerprints under ignored acceptance-results. No old summary is used to skip checks. Failures stop subsequent upload; post-upload visibility failures use standalone read-only recovery. Clean/pushed main and authorization remain workflow requirements.

Record source, npm identity, starter and tag/Release refs plus selected technical checks. Package delivery can complete without Cloudflare or demo acceptance. Mark demo as user-owned rather than waiting for or repeating their regression. Keep checkout mutations serial; do not run repository-wide scans through transient fixture output.
