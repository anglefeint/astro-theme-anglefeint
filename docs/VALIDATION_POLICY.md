---
doc_id: validation_policy
doc_role: internal-guide
doc_purpose: Agent-selected technical checks, explicit consent boundaries and user-owned demo acceptance.
doc_scope: [agent-workflow, validation, release-flow, starter-sync]
update_triggers: [workflow-change, script-change, command-change, release-change]
source_of_truth: true
depends_on: [scripts/release-tool-plan.mjs, scripts/npm-release-tools.mjs]
sync_targets:
  [
    AGENTS.md,
    docs/AI_WORKFLOW.md,
    docs/MAINTAINER_WORKFLOW.md,
    docs/PACKAGE_RELEASE.md,
    docs/RELEASE_TOOLS.md,
    docs/TEMPLATE_ACCEPTANCE.md,
    CONTRIBUTING.md,
  ]
---

# Validation policy

This is the current maintainer/agent execution policy. Historical release ledgers record what happened at that time; they do not require repeating that workflow today. Implemented behavior remains defined by code.

## Explicit stop rules

**默认不执行浏览器回归（含局部用例）、截图／视觉测量、Cloudflare 登录与后台／部署状态检查、demo 文章遍历／教程比对、真实 Giscus 在线验收。demo 的页面、视觉和交互回归由用户负责。若 agent 认为确有必要，必须先说明具体命令或操作、原因、范围和预计耗时，等待用户明确确认后再执行。不能自行添加确认参数当作用户授权。**

- Do not run full or targeted browser suites, Playwright exploratory scripts, screenshots, layout measurements, live-demo inventories, live tutorial comparisons, real Giscus checks or Cloudflare account/build/deployment polling by default. This applies to local and remote browser acceptance and scripts that hide browser actions behind an installation/upgrade name.
- Do not run legacy full `check` / `doctor` maintenance aggregates, the entire unit suite or the fourteen-case installed matrix by default. Select independent checks. If a broad aggregate is genuinely needed, explain why narrower checks are insufficient, its scope and expected cost, then obtain explicit confirmation.
- A generic request to test, perform necessary technical checks or release safely is not consent to those exceptional activities. A specific request to run an identified browser/full suite already supplies consent for that task; do not ask again. Previous releases' approvals do not authorize a new task.
- Approval is limited to the stated operations and scope. `--confirmed` only acknowledges approval already received; the agent must not self-authorize. Direct commands have the same consent requirement as catalog tools.
- Dispatching the manual GitHub template-acceptance workflow also needs that consent: it contains browser suites. Moving the operation to CI does not change its approval requirement.
- User demo acceptance is authoritative for that task. Record it as user acceptance; do not repeat it automatically. Missing user acceptance is recorded as pending/user-owned, without blocking a technically verified npm/starter release or asking for a routine final permission round.

## Select technical checks from actual changes

State a short validation plan with the reason for each selected tool. Do not invoke `check`, `doctor`, `check:no-build` and `build` cumulatively. The maintained tool catalog exposes metadata, lint, formatting, types, focused unit tests, workspace/fonts/integration/scaffold/packed-CLI checks, build and assertions over existing About output independently.

| Change                           | Appropriate technical evidence                                                                                                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation only               | Metadata, changed-file formatting and affected links/examples. No npm version bump, full build or browser regression solely for prose.                                                                                        |
| Maintainer scripts               | Focused tests of changed orchestration/failure paths, lint and relevant documentation. Exercise a changed installation/build mode once when necessary.                                                                        |
| Runtime/config                   | Relevant unit/static-render checks, types and one build as needed. User performs demo/interaction regression; global changes do not automatically authorize a browser suite.                                                  |
| Package delivery                 | Inspect packed contents/CLI and independently install/build the candidate at the necessary level. Select one of installed-check, installed-build or installed-matrix; the full matrix requires consent.                       |
| Upgrader/schema/project contract | Technical compatibility and file-preservation evidence. Existing `check:upgrade` also launches a browser and therefore requires confirmation; identify focused non-browser unit tests or obtain approval for that mixed tool. |

If impact is unclear, investigate implementation and select additional technical checks with stated reasons. Do not silently escalate to a prohibited browser/demo/full-suite activity.

`unit-tests` requires explicit literal test files. `build` builds once; `about-output-check` reads existing output without building. When both are needed, request build first. No result cache or freshness receipt is introduced: never claim a build/test passed based on an old observational fingerprint. Re-execute affected work after input changes, and report checks actually performed.

## Publication and distribution

- No pre-push hook runs full validation. Pre-commit retains staged-file formatting/lint and document metadata checks. The agent selects and completes the necessary technical checks before pushing/publishing; removing the hook is not evidence that checks passed.
- `npm-delivery` implicitly includes only registry version, blocking main dependency audit, pack, authentication, upload and exact-version/tag download verification. Select technical validation explicitly; the runner executes all selected checks before upload, even if npm-delivery is listed first.
- Keep install/audit/doctor checks inside starter generation and the consumer's one-command upgrade behavior. Those non-browser technical contracts are separate from maintainer full-suite selection. Main/starter environments and npm/pnpm installations are not interchangeable.
- Keep exact npm download identity, source/tag/starter/Release consistency, dependency audit failures, manifest ownership and user-file protection. A failed upload verification resumes read-only; never upload the accepted version again.
- npm/starter delivery and demo deployment are separate outcomes. Package release does not require a Cloudflare account, successful demo build or live inventory. Do not modify hosting settings or poll production as routine release work. Main may still trigger external deployment on push; keep appropriate source checks before authorized pushes, and let the user inspect demo outcomes.
- Prepare source documentation before publication. Put final source refs and technical results in the GitHub Release and local evidence rather than repeatedly committing a report of its own deployment. Do not wait for demo confirmation to announce technically complete package delivery; report its user-owned status accurately.
- Batch independent read-only identity/announcement work through the stable-release closeout helper; it does not replace technical validation, the canonical npm download verifier or starter audit/doctor. Its session timings and identity receipts are observational only. Preserve commit hooks and choose installation/build coverage from risk; avoid redundant unchanged-input checks and post-delivery documentation commits that only repeat refs. A substantive documentation correction is validated and committed once, with starter re-sync only if managed inputs changed.
- Maintainer `release:flow source` connects explicitly selected fresh checks and the existing npm prerequisites to normal commit hooks, structured starter preflight, main push and one canonical upload/verification. `release:flow announce` uses reviewed closeout notes for tag/Release/readback. Both plan by default; `--execute` is an action selector, not authorization. Do not run lock-taking child CLIs under an owning session; supplied sessions/structured adapters keep the same lock. No new implicit browser, full-suite or historical-pass gate is added.
- Report stage wall time separately from measured command time, explicit retry sleep and coordination. Command/network time is not CPU time or pure propagation wait. Record known waits directly, preserve unknown legacy metrics as unknown, and label whole-request intervals outside sessions rather than attributing them to Git/check execution.

## Optional tools and verification claims

`npm run e2e`, `check:template` (npm/pnpm/published upgrade), `check:upgrade` and music-browser scripts contain browser operations. They remain available for explicitly approved diagnostics. Listing a tool, a successful build or skipped browser activity does not establish visual correctness. Public demo and third-party availability are not package correctness gates.

Do not delete regression tests or change public consumer doctor/upgrade semantics merely to shorten a maintainer run. Record selected technical results, user-reported demo findings and unperformed optional checks separately, without claiming omitted checks passed.
