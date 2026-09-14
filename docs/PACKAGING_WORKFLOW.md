---
doc_id: packaging_workflow
doc_role: ops-reference
doc_purpose: Packaging strategy and template/package boundary operations guide.
doc_scope: [packaging, release, upgrade]
update_triggers: [package-change, release-change]
source_of_truth: true
---

# Theme Packaging Workflow

For an explicit security validation of the generated local starter, run `npm run check:installed -- --audit` (combine with `--build` for the build matrix). This optional mode audits the isolated installation against registry advisories, fails on any reported vulnerability or audit error, and reports the result. It does not audit or modify the already published remote starter.

## Goal

- Publish a reusable theme package: `@anglefeint/astro-theme`.
- Keep current repository with dual roles:
  - `main` for monorepo theme development
  - `starter` branch for end-user template initialization
- Prioritize the latest starter paired with its published theme package. Compatible package-only updates may use `npm update @anglefeint/astro-theme`; skeleton changes may require a fresh template and content/configuration migration.

## Phase 1: Baseline and Scaffolding

The phase outline below records the package extraction approach already implemented. It is not a list of outstanding feature work; use `docs/PACKAGE_RELEASE.md` for the current release sequence.

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
   Review: `/`, `/:lang/`, `/:lang/blog`, `/:lang/blog/[slug]`, `/:lang/about`, `/:lang/rss.xml`, `/sitemap-index.xml`, and `/robots.txt` all pass.

9. Publish pre-release (`alpha`/`beta`) and test with fresh install.
   Review: new consumer project can install/update package and run successfully.

10. Publish stable release.
    Review: README and UPGRADING distinguish compatible package updates from fresh-template migration. Historical in-place compatibility is not a release requirement.

## Current State

- Theme package is published and upgradeable from npm.
- `starter` branch is wired to registry dependency (`@anglefeint/astro-theme`) for user projects.
- `main` remains monorepo for core development and release workflows.

## Adapter Sync Contract

- Adapter templates are source-of-truth: `scripts/adapter-templates/*`.
- Generated files in `src/config/*`, `src/i18n/*`, and `src/types/theme-scripts.d.ts` must be treated as synced artifacts.
- If template logic changes:
  1. update template files first
  2. run `npm run sync-adapters`
  3. run `npm run check:adapters`
- Do not hand-edit generated adapter outputs without back-porting changes to templates.

## Reading and Discovery Ownership

| Capability                | npm package owns                                                                                                             | Starter owns                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Article contents          | TOC component/utility, BlogPost support, styles, labels, content schema                                                      | Article route passes `render(post).headings`; site default and theme adapter                                     |
| Search                    | Pagefind dependency, `./search` export and type declaration, build integration, article index markers, dialog/client runtime | `astro.config.mjs` registers the integration with the same site switch used by UI; site config and adapter       |
| Tags                      | Normalization/slug/group utilities, `./utils/tags` export, TagLinks/BlogCards, labels/schema and head opt-out prop           | Tag directory/pagination routes, blog entry and configuration; route files are in `scripts/starter-manifest.mjs` |
| Code copy / image preview | BlogPost data attributes, initialization, scripts, styles and labels                                                         | Ordinary Markdown/MDX content consumed through BlogPost; no extra support script                                 |

The search hook writes assets into the built site's `pagefind/` directory; these are generated output, not files copied from main into the starter branch. Package installation cannot rewrite starter route/config files. The matching-template migration boundary is documented in `UPGRADING.md`; implementation/test entry points are in `docs/ARCHITECTURE.md`.
