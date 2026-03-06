---
doc_id: package_release
doc_role: release-runbook
doc_purpose: npm publish runbook for stable and prerelease releases.
doc_scope: [package-release, npm-publish, rollback]
update_triggers: [release-change, package-change]
source_of_truth: true
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

## Notes

- Starter config is injected via alias `@anglefeint/site-config/*` in `astro.config.mjs` and `tsconfig.json`.
- Starter i18n is injected via alias `@anglefeint/site-i18n/*` in `astro.config.mjs` and `tsconfig.json`.
- Keep release notes explicit about breaking changes and required manual migrations.
- After a successful publish, sync starter so the dependency range and lockfile move together.
