---
doc_id: upgrading
doc_role: ops-guide
doc_scope: [upgrade, release, package]
update_triggers: [release-change, package-change, command-change]
source_of_truth: true
depends_on: [docs/PACKAGING_WORKFLOW.md, docs/PACKAGE_RELEASE.md]
---

# Upgrading Anglefeint

This guide explains how to upgrade projects built from this template.

## Two Upgrade Paths

### 0) Package Update (If your project depends on the theme package)

If your project already uses `@anglefeint/astro-theme`, upgrade with:

1. `npm update @anglefeint/astro-theme`
2. `npm run build`
3. `npm run check`

Use this path when your project is package-driven and keeps most theme internals in `node_modules`.

### 1) Template Refresh (Recommended)

Use this if your project was created from `Use this template` or `npm create astro -- --template ...`.

1. Create a backup branch in your current project.
2. Generate a fresh project from the latest template.
3. Move your content/config into the fresh project.
4. Re-apply custom component/style changes as needed.
5. Run validation checks.

### 2) Fork Sync (For Advanced Users)

Use this if your project is a fork with an `upstream` remote.

1. `git fetch upstream`
2. `git merge upstream/main` (or rebase)
3. Resolve conflicts
4. Run validation checks

## Keep These Files First

When merging/upgrading, prioritize your own data in:

- `src/content/blog/**`
- `src/config/site.ts`
- `src/config/theme.ts`
- `src/config/about.ts`
- `src/config/social.ts`
- `.env` (local only, never commit)

Keep post slugs aligned across locales. Use `npm run new-post -- <slug>` to scaffold the same slug in all language folders.

## Validation Checklist

After every upgrade:

1. `npm install`
2. `npm run build`
3. Check routes:
- `/`
- `/en/`
- `/:lang/blog`
- `/:lang/blog/[slug]`
- `/robots.txt`
- `/sitemap-index.xml`

## Notes

- Review `CHANGELOG.md` before upgrading.
- Major versions may include breaking changes.
