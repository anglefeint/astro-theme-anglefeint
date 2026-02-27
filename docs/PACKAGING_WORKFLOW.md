---
doc_id: packaging_workflow
doc_role: ops-reference
doc_purpose: Packaging strategy and template/package boundary operations guide.
doc_scope: [packaging, release, upgrade]
update_triggers: [package-change, release-change]
source_of_truth: true
---

# Theme Packaging Workflow

## Goal

- Publish a reusable theme package: `@anglefeint/astro-theme`.
- Keep current repository with dual roles:
  - `main` for monorepo theme development
  - `starter` branch for end-user template initialization
- Enable user upgrades via `npm update @anglefeint/astro-theme`.

## Phase 1: Baseline and Scaffolding

1. Freeze baseline (tag + branch).
Review: baseline can be restored by tag checkout.

2. Create package scaffold (`packages/theme`).
Review: package contains `package.json`, `src/index.ts`, and export map.

3. Copy core theme implementation into package.
Review: copied folders include `components`, `layouts`, `i18n`, `styles`, `assets`, and script/style runtime assets.

## Phase 2: Starter Consumption

4. Replace starter imports from local `src/*` to `@anglefeint/astro-theme/*`.
Review: app builds without unresolved local imports.

5. Move starter-only files to clear boundaries.
Review: starter keeps only user-facing content/config/routes and no duplicated core layout/component logic.

6. Normalize script/style asset loading strategy.
Review: post/about/home visual scripts still run after package consumption.

## Phase 3: Release Readiness

7. Add package release notes and migration notes.
Review: each release contains upgrade command + breaking-change section.

8. Run full route and SEO regression checks.
Review: `/`, `/:lang/`, `/:lang/blog`, `/:lang/blog/[slug]`, `/:lang/about`, `rss`, `sitemap`, `robots` all pass.

9. Publish pre-release (`alpha`/`beta`) and test with fresh install.
Review: new consumer project can install/update package and run successfully.

10. Publish stable release.
Review: README and UPGRADING show package-based upgrade flow.

## Current State

- Theme package is published and upgradeable from npm.
- `starter` branch is wired to registry dependency (`@anglefeint/astro-theme`) for user projects.
- `main` remains monorepo for core development and release workflows.
