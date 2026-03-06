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
- Current prerelease tag: `alpha` (optional track)

## 1) Pre-release checks

```bash
npm run release:npm -- --dry-run
```

Before a real publish, bump the workspace package version first. `npm run release:npm` does not auto-increment the package version.

Before publishing, prepare release note state:

- create `docs/releases/<version>.md` for new versions
- if backfilling older release history, update the grouped files under `docs/releases/`
- update `CHANGELOG.md` so the published version is represented in the summary layer

Stable patch example:

```bash
npm version patch --workspace @anglefeint/astro-theme --no-git-tag-version
git add packages/theme/package.json package-lock.json
git commit -m "chore(release): bump @anglefeint/astro-theme to <version>"
```

## 2) Publish alpha/beta

```bash
npm run release:npm -- --tag alpha
```

## 3) Consume in starter/blog project

```bash
npm install @anglefeint/astro-theme@alpha
npm run build
npm run check
```

## 4) Upgrade flow for users

```bash
npm update @anglefeint/astro-theme
```

## 5) Rollback flow

```bash
npm install @anglefeint/astro-theme@<previous-version>
npm run build
npm run check
```

## 6) Stable release

After alpha verification:

```bash
npm version patch --workspace @anglefeint/astro-theme --no-git-tag-version
git add packages/theme/package.json package-lock.json
git commit -m "chore(release): bump @anglefeint/astro-theme to <version>"
npm run release:npm
npm run release:starter
```

## 7) Release Notes Contract

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
