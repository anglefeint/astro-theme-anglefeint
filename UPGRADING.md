---
doc_id: upgrading
doc_role: ops-guide
doc_purpose: Upgrade procedures for starter users and template-based projects.
doc_scope: [upgrade, release, package]
update_triggers: [release-change, package-change, command-change]
source_of_truth: true
depends_on: [docs/PACKAGING_WORKFLOW.md, docs/PACKAGE_RELEASE.md]
---

# Upgrading Anglefeint

This guide explains how to upgrade projects built from this template.

## Recommended Path (Starter Users)

Projects created from:

`npm create astro@latest -- --template voidtem/astro-theme-anglefeint#starter`

should upgrade with:

1. `npm update @anglefeint/astro-theme`
2. `npm install`
3. `npm run check`
4. `npm run build`

This keeps theme core upgrades package-driven through npm.

## Other Upgrade Paths

### 1) Template Refresh

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
