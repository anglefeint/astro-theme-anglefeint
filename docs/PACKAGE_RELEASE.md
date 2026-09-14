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

## 1) Prepare release state

Before a dry-run or real publish, bump the workspace package version first. `npm run release:npm` does not auto-increment the package version.

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

Dependency audits are blocking: `release:npm` runs `npm audit --audit-level=low --prefer-online` for main and `check:installed -- --audit` for an isolated starter. Reported vulnerabilities or audit errors stop the run, even with `--skip-checks`. Starter synchronization also audits its installation before committing. Re-run an audit on the actual remote-template installation before GitHub closeout.

`scripts/release-npm.mjs` does not verify the Git branch, worktree cleanliness, pushed source SHA or completed CI. Those are maintainer workflow requirements: inspect them before running it. It publishes from the current `packages/theme` directory, not from a Git tag or the separately generated root tarball.

Run the publish dry-run after committing the release-prep state. The release script checks that the local package version is newer than the npm registry version before packing or publishing.

Include implementation, tests, changelog and release notes in the release-prep commit, not just the two version files in the example. Validate and push `main` before publishing; check any push-triggered automation first.

```bash
npm run release:npm -- --dry-run
```

By default this runs main checks, dependency audits, the independent installed-starter build matrix, `theme:pack` and `npm publish --dry-run`. Dry-run skips `npm whoami` and post-publication verification. A real run adds those steps. `--skip-checks` skips main checks and the installed build matrix, but retains main audit and isolated-starter installation/CLI checks/audit. `--skip-pack` skips the separate `theme:pack` step (npm publish still packs the package), and `--skip-registry-check` bypasses the initial newer-than-latest check. Skips must be justified in the release record.

## 3) Publish alpha/beta

```bash
npm run release:npm -- --tag alpha
```

## 4) Consume in starter/blog project

```bash
npm install @anglefeint/astro-theme@alpha
npm run build
npm run check
```

## 5) Upgrade flow for users

The release baseline is the latest starter plus its published package. For project-skeleton changes, recommend a fresh template in a new directory and migration of content/personal settings as described in `UPGRADING.md`. The following is only for compatible package-only updates:

```bash
npm update @anglefeint/astro-theme
```

## 6) Rollback flow

```bash
npm install @anglefeint/astro-theme@<previous-version>
npm run build
npm run check
```

## 7) Stable release

After alpha verification:

```bash
npm version patch --workspace @anglefeint/astro-theme --no-git-tag-version
git add packages/theme/package.json package-lock.json
git commit -m "chore(release): bump @anglefeint/astro-theme to <version>"
git push origin main
npm run release:npm -- --dry-run
npm run release:npm
npm run release:starter
git push origin starter
```

## 8) Release Notes Contract

**Mandatory completion:** after remote starter acceptance, create and read back the GitHub Release as described below. A pushed npm package or Git tag alone is not a completed release.

### Registry availability and recovery

After a real publish succeeds, `release:npm` verifies the selected dist-tag (default `latest`) and downloads the exact version with `npm pack`. It retries verification up to 12 times, waiting 10 seconds between attempts; each registry request has a 15-second fetch timeout and no npm fetch retries. Dry-runs do not perform this post-publish check.

The verification helper checks the dist-tag version, downloaded package name/version and presence of integrity metadata. It does not compare the download's hash with the preparation tarball or prove correspondence with a Git SHA. Preserve the clean source revision and compare package hashes separately when recording source/package identity.

If verification times out, publication may already be accepted. Do not republish that version or start starter sync. Check `npm view @anglefeint/astro-theme@latest version` (or the selected tag), then run `npm pack @anglefeint/astro-theme@<version> --ignore-scripts --prefer-online` in a temporary directory. Only resume starter delivery once both match the intended version and the download succeeds. Remove the temporary tarball afterward.

### GitHub closeout

After pushing starter and verifying the remote template:

1. Record the published package source commit, delivered starter commit, actual tests and limitations in the version note. Commit/push documentation-only closeout changes on main; sync starter if managed public docs changed. This does not require another npm release.
2. Create `v<version>` at the exact source commit used to publish npm, not a later documentation-only commit. Check existing local/remote tags first; never move an existing release tag silently.
3. Push that tag and create a GitHub Release with `gh release create v<version> --verify-tag --title v<version> --notes-file <notes-file>`. Use `--prerelease` for prereleases; reserve latest status for the current stable release.
4. Use the version note body without YAML frontmatter as the Release body. Include final main/starter commits and the public `#starter` template command. GitHub source archives are main source, not the generated starter template.
5. Read back the Release and remote refs. Report the npm version, tag/Release URL, source/starter commits, verification results and remaining limitations. The npm script does not create tags or GitHub Releases automatically.

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
- Verify the published version from the registry, then test the pushed remote starter with the public create-template command in a temporary directory. Stop its servers and delete it after successful command/runtime checks.
- If npm succeeds but starter fails, keep the previous remote starter and fix/retry starter without republishing that version.
