---
doc_id: package_release
doc_role: release-runbook
doc_scope: [package-release, npm-publish, rollback]
update_triggers: [release-change, package-change]
source_of_truth: true
---

# Package Release Runbook

## Package

- Name: `@anglefeint/astro-theme`
- Current prerelease: `0.1.0-alpha.0`

## 1) Pre-release checks

```bash
npm run build
npm run check
npm_config_cache=/tmp/npm-cache-anglefeint npm run theme:pack
```

## 2) Publish alpha/beta

```bash
cd packages/theme
npm publish --access public --tag alpha
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
cd packages/theme
npm version patch
npm publish --access public
```

## Notes

- Starter config is injected via alias `@anglefeint/site-config/*` in `astro.config.mjs` and `tsconfig.json`.
- Keep release notes explicit about breaking changes and required manual migrations.
