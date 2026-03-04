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
- Current latest: `0.1.27`
- Current prerelease tag: `alpha` (optional track)

## 1) Pre-release checks

```bash
npm run release:npm -- --dry-run
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
npm version patch
npm run release:npm
```

## Notes

- Starter config is injected via alias `@anglefeint/site-config/*` in `astro.config.mjs` and `tsconfig.json`.
- Starter i18n is injected via alias `@anglefeint/site-i18n/*` in `astro.config.mjs` and `tsconfig.json`.
- Keep release notes explicit about breaking changes and required manual migrations.
