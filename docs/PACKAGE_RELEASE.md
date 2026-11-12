---
doc_id: package_release
doc_role: runbook
doc_purpose: npm publish runbook for stable and prerelease releases.
doc_scope: [release, starter-sync, package-upgrade]
update_triggers: [release-change, command-change]
source_of_truth: true
depends_on:
  - CHANGELOG.md
  - docs/releases/README.md
---

# Package Release Runbook

## Package

- Name: `@anglefeint/astro-theme`
- Latest version: check npm registry before release (`npm view @anglefeint/astro-theme version`)
- Optional prerelease tag example: `alpha`; query npm dist-tags to inspect actual registry state

See [Validation policy](VALIDATION_POLICY.md) for independent technical selection and explicit user consent. Package publication does not require Cloudflare or demo acceptance.

## 1) Prepare release state

Before publishing, bump the workspace package version first. `npm run release:npm` does not auto-increment the package version.

Prepare release note state in the same release-prep change:

- create `docs/releases/<version>.md` for new versions
- if backfilling older release history, update the grouped files under `docs/releases/`
- update `CHANGELOG.md` so the published version is represented in the summary layer

Stable patch example:

```bash
npm version patch --workspace @anglefeint/astro-theme --no-git-tag-version
git add packages/theme/package.json package-lock.json
git commit -m "chore(release): bump @anglefeint/astro-theme to <version>"
git push origin main
```

## 2) Pre-release checks

Use [Release tools](RELEASE_TOOLS.md) to choose independent checks for the actual change. Preview their combination with npm-delivery, then execute the selected technical tools and publication mechanics. The planner does not pull in full source checks or an installed matrix automatically.

On 2026-10-22, the blocking audit stopped 0.20.1 before upload because Vite 8.3.2 was newly flagged. Main/starter now use `^8.3.5` and a refreshed lock; no audit exemption or forced dependency downgrade was introduced. See [0.20.1](releases/0.20.1.md) for the actual execution and patched-version references.

The npm release entry uses the shared maintainer session for serial execution, stage timing and log summaries; see [reporting and recovery](MAINTAINER_WORKFLOW.md#serial-execution-and-reporting). The runner retains serial execution, blocking audit, fresh npm cache and publish/download verification; full source checks and installation levels are explicitly selected. All npm publish output stays on the terminal to preserve authentication behavior. Do not run release, starter sync or push checks concurrently.

The maintainer root declares Wrangler `^4.151.1`; the current lock resolves Wrangler `4.156.2`, Miniflare `5.20261102.0-beta` and patched `sharp@0.35.5`. The earlier scoped override was removed on 2026-10-18 after Cloudflare's clean install rejected missing Sharp 0.35.4 optional entries, despite local npm 11.11.0 accepting the previous lockfile. Fresh `npm ci`, the real Miniflare Images binding and dependency audit passed after this update. The previous override protected against [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w); do not restore vulnerable Sharp to satisfy an old lockfile or use `npm audit fix --force` to downgrade Wrangler. This is maintainer tooling only; starter does not include Wrangler.

Dependency audits are blocking for each environment actually validated: main at npm delivery, isolated starter when selected, and delivered starter during sync. All findings/registry errors block that operation. The historical audit exception remains retired. Independent install/build evidence is selected for actual package changes rather than implicitly repeating a full matrix.

The npm tool implementation in `scripts/npm-release-tools.mjs` does not verify the Git branch, worktree cleanliness, pushed source SHA or selected technical evidence. Inspect these workflow requirements before running it; CI/hosting/browser checks are not default requirements. It publishes from the current `packages/theme` directory, not from a Git tag or the separately generated root tarball.

Prepare implementation, responsible docs and release notes before freezing the source. Execute selected technical checks once and npm mechanics once. Routine full dry-runs, full source aggregates and the installed matrix are not prerequisites; see the consent policy for exceptional broad checks.

Include implementation, tests, changelog and release notes in the release-prep commit, not just the two version files in the example. Validate and push `main` before publishing; account for known push side effects without performing provider login/settings/deployment polling as routine work.

Demo regression belongs to the user. Do not inspect Cloudflare accounts, wait for builds, enumerate public articles/tutorials or exercise real Giscus by default. Any proposed agent exception needs reasons, exact scope and expected cost, followed by explicit confirmation. A technically verified package can complete independently of demo acceptance.

```bash
npm run release:npm
```

This invocation runs npm registry/version, main audit, pack, authentication, upload and post-publication verification only. The agent selects relevant technical tools separately or in the same composed plan. --dry-run simulates publication and omits authentication/download verification; it is diagnostic, not a routine prerequisite. --skip-checks is deprecated and does not select or skip independent validation. --skip-pack and --skip-registry-check retain their diagnostic behavior and require explanation.

### Temporary static-cache advisory review (2026-10-03)

The maintainer authorized impact-based release after reviewing [GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp). `http-cache-semantics@4.2.0` remains affected upstream; no patched release was available during this review. This is risk acceptance for the current static template, not a vulnerability fix or a blanket exemption for Astro consumers.

At the time of that review, Astro 7.3.5 was the only installed consumer. Its `dist/assets/build/remote.js` constructs requests for build-time remote images and calls `storable()` / `timeToLive()`. It does not call the vulnerable `satisfiesWithoutRevalidation()` method or forward visitor `max-stale` headers. The reviewed Astro config generates static output without a server adapter; the Cloudflare config serves `dist` assets. We found no shared personalized-response cache path in this template.

This was a historical, narrowly scoped exception for Astro 7.3.5 / cache library 4.2.0, guarded by source/config fingerprints and an expiry. It is no longer accepted by the audit helper.

On 2026-10-04, main was updated to cache library 4.3.0 and raw npm audit reported zero vulnerabilities. The [maintainer disputes the original report](https://github.com/kornelski/http-cache-semantics/issues/56#issuecomment-5975759591); the advisory still listed no patched version when reviewed. Version 4.3.0 includes a [separate Vary-matching fix for CVE-2026-93750](https://github.com/kornelski/http-cache-semantics/commit/9fb520be70eff3ff502fe965d9c3265ca2c64e26). Audit clearance is not evidence that the disputed advisory was fixed. No theme package version bump is required for this main lockfile/maintainer-gate update; the 0.9.1 starter already uses 4.3.0.

## 3) Publish alpha/beta

```bash
npm run release:npm -- --tag alpha
```

## 4) Consume in starter/blog project

```bash
npm install @anglefeint/astro-theme@alpha
npm run doctor
```

Doctor includes build/runtime assertions for schema-1 integration starters. This smoke check is separate from release acceptance of all eleven public scripts.

## 5) Upgrade flow for users

The 0.27.0 integration starter provides `npx @anglefeint/astro-theme@latest upgrade` for npm projects with supported projectSchema/Node/Astro versions. It updates dependencies, backs up dependency files and runs doctor while retaining user source/config/media. `--check` is a project preflight and `--to` selects a version. Automatic pnpm/yarn/bun conversion and cross-schema migrations are not implemented. See `UPGRADING.md` for recovery limits and the deliberate fresh-starter migration from pre-0.27 skeletons.

Do not treat npm update alone as an old-skeleton migration. Do not announce the local 0.27 preparation as published. After authorized delivery, GitHub Release notes must link the one-time migration, supported automatic-upgrade boundary and actual acceptance evidence. Starter-only maintenance outside shipped runtime continues to follow [its distinct announcement policy](MAINTAINER_WORKFLOW.md#announcing-starter-only-upgrades); no empty npm publication is required for documentation alone.

## 6) Rollback flow

```bash
npm install @anglefeint/astro-theme@<previous-version>
npm run doctor
```

## 7) Stable release

After alpha verification, prepare the stable version and release notes, then select capabilities from [Release tools](RELEASE_TOOLS.md) under the [maintainer dependency/completion constraints](MAINTAINER_WORKFLOW.md#capability-selection-and-completion). Select necessary technical evidence and npm mechanics once; after download verification, deliver starter and finish the exact-source tag/GitHub Release. Additional consumer browser acceptance is opt-in with consent. Do not reconstruct nested source/installed checks as additional commands before their containing delivery tool.

## 8) Release Notes Contract

**Mandatory package completion:** after selected technical acceptance and starter delivery, create and read back the GitHub Release as described below. A pushed npm package or Git tag alone is not a completed release.

### Registry availability and recovery

After a real publish succeeds, `release:npm` verifies the selected dist-tag (default `latest`) and downloads the exact version with `npm pack`. It retries verification up to 12 times, waiting 10 seconds between attempts; each registry request has a 15-second fetch timeout and no npm fetch retries. Dry-runs do not perform this post-publish check.

Normal publication and read-only recovery share the same verifier: check the selected tag version, exact-version package metadata and downloaded package name/version; require valid registry integrity/SHA1 fields and match both downloaded hashes to them. Normal publication captures HEAD before uploading and compares it with registry gitHead. Recovery compares the same identities when recorded --source/--integrity/--shasum values are supplied; it does not infer a historical upload's source from the current checkout. Successful results include registry metadata for downstream evidence. The preparation tarball is not the publishing input, so no preparation-tarball identity or single-artifact handoff is claimed.

Every failed attempt records attempt/limit, stage (tag, metadata or download), error code, a bounded/redacted reason and action (retry, stop or exhausted). A pending tag, E404, named transient network/timeouts, HTTP 408/429 and selected 500/502/503/504 errors retry within the unchanged bounds. Authentication/authorization, integrity/source/name/version mismatches, malformed responses/JSON, filesystem and unknown errors stop immediately without another sleep or download. Retry classification uses structured npm JSON/code or npm stderr code, not arbitrary text such as "not ready". Both entrypoints persist sanitized failure records as verificationFailures in the session summary.json; the thrown error retains its original cause for programmatic diagnosis. Logs must not be shared without review.

If verification times out, publication may already be accepted. Do not republish that version or start starter sync. Use the maintainer-only recovery entry with the exact accepted version, independently of the current checkout version:

```bash
npm run release:verify -- --version 0.32.0 --tag latest --source e452e8fac382be65d264bb83150d670db86403db --shasum 1d016766e784fd3a7b54a4808fa0bdca5cbd57ab
```

Replace these example values with the accepted release's recorded version, source ref and package checksum. `--source`, `--shasum` and `--integrity <sri>` are optional expected identities; provide the recorded values when recovering a specific upload. Without them, the entry establishes consistency between the selected registry tag, exact-version metadata and downloaded package, not correspondence to a particular local source. It uses the same bounded retry policy, downloads with `--ignore-scripts` into a dedicated temporary directory under ignored `acceptance-results/`, checks downloaded integrity/SHA1 against registry metadata, and removes that download afterward. Its session summary remains available for review.

The recovery entry only allows npm `view` and `pack`; it cannot publish, install, switch branches or sync starter. It neither replaces pre-publication tests/audits nor marks the whole release complete. Only resume starter delivery after verification succeeds, then finish selected technical acceptance and tag/GitHub Release. Demo acceptance is separate and user-owned. Manual `npm view`/`npm pack` diagnosis remains possible if the recovery entry itself is unavailable.

### GitHub closeout

After pushing starter and completing selected technical acceptance:

1. Prepare changes, compatibility/migration guidance and the check plan in the version note before freezing the source. After delivery, record actual source/starter refs, tests and limitations in the GitHub Release and local receipt. The version note can link to that announcement for final identities; a documentation-only closeout commit is not mandatory merely to repeat deployment facts. If substantive corrections or ledger facts need a tracked update, batch them into one commit/push before preparing the final announcement; re-sync starter only when managed public inputs changed. No additional npm release is needed for that prose.
2. For stable releases, run `npm run release:closeout -- prepare --version <version> --source <npm-gitHead> --starter <delivered-starter-sha>`, optionally repeating `--session acceptance-results/<session>/summary.json` for selected timing evidence. It freshly checks pushed/clean main, source version/ancestry, registry metadata and delivered starter package/lock identities, and produces ignored `notes.md`/`receipt.json`. Review the notes. It does not substitute for earlier technical checks, audits, download verification or selected starter drift checks. See [batched closeout](RELEASE_TOOLS.md#batched-stable-release-closeout).
3. Create `v<version>` at the exact source commit used to publish npm, not a later documentation-only commit. Check existing local/remote tags first; never move an existing release tag silently. Push it, then create a GitHub Release with `gh release create v<version> --verify-tag --title v<version> --notes-file <closeout-directory>/notes.md`. Use `--prerelease` for prereleases, which retain the manual path; reserve latest status for the current stable release. Await each mutation before the next.
4. The generated notes use the version note body without YAML frontmatter, normalize relative Markdown links and append observed delivery identities and the public `#starter` template command when missing. Session failures stay visible. GitHub source archives are main source, not the generated starter template. Do not put raw local logs/environment evidence in the announcement.
5. Run `npm run release:closeout -- verify --receipt <closeout-directory>/receipt.json` to freshly read back remote main/starter/tag and the exact published Release body. Source, checksum, lock, draft/body or checkout drift remains blocking. This produces an observational identity receipt, not a reusable test pass or a claim of demo acceptance. Report version, tag/Release URL, source/starter commits, checks actually performed and limitations. Neither closeout mode creates/pushes Git objects, publishes npm, installs or reruns suites. The existing npm entry does not create tags or Releases automatically.

Treat release notes as part of the release itself.

- `CHANGELOG.md` is the human-facing summary layer
- `docs/releases/` is the release-notes ledger
- historical gaps may be represented by grouped milestone files
- new package publishes should create one file per version under `docs/releases/`

Minimum entry content for a new release note:

- published version
- source commit or release commit
- user-visible changes
- migration notes
- whether starter sync was required
- validation summary

## Notes

- Starter config is injected via alias `@anglefeint/site-config/*` in `astro.config.mjs` and `tsconfig.json`.
- Starter i18n is injected via alias `@anglefeint/site-i18n/*` in `astro.config.mjs` and `tsconfig.json`.
- Keep release notes explicit about breaking changes and required manual migrations.
- After a successful publish, sync starter so the dependency range and lockfile move together.
- Verify the published version and delivered starter refs. Select further independent technical installation checks when necessary; browser-containing remote-template checks require prior user consent. Clean owned temporary projects after checks.
- If npm succeeds but starter fails, keep the previous remote starter and fix/retry starter without republishing that version.
