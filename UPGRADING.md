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

This guide explains the recommended upgrade path for projects created from the starter branch.

## Recommended Baseline

The latest starter paired with its corresponding theme package is the release baseline. In-place upgrades across all historical starters are not guaranteed. If release notes include routing, configuration, adapter or project-script changes, the recommended path is a fresh template:

1. Commit or back up your existing project.
2. Create the latest template in a **new directory**, not over the old project.
3. Migrate your articles and referenced images/assets, preserving locale folders and slugs.
4. Reapply personal settings to the new `src/site.config.ts`. Do not replace the new schema, defaults, runtime helpers or Astro config wholesale with old copies.
5. Review custom pages, integrations and deployment settings individually.
6. Run `npm run doctor`, `npm run check`, and `npm run build`; preview the result before deploying. Keep the old project until the new one is verified.

Do not copy `node_modules`, old lockfiles or maintainer synchronization scripts into the new project.

## Compatible Package Updates

Projects created from:

`npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter`

may use the following for package-only updates whose release notes do not require a new project skeleton:

1. `npm update @anglefeint/astro-theme`
2. `npm install`
3. `npm run doctor`
4. If `doctor` reports adapter drift: `npm run sync-adapters`
5. `npm run check`
6. `npm run build`

This updates the theme package, not the local project skeleton. The targeted migration notes below are optional for users choosing to retain an existing project rather than start from the latest template.

## Scaffold Command Upgrade

Projects created from older starter versions may still route scaffold commands through local wrapper files:

```txt
scripts/new-post.mjs
scripts/new-page.mjs
```

Those wrappers are no longer the recommended integration point because local project files do not update when the npm package updates. Use package-owned bins instead:

```bash
npm install @anglefeint/astro-theme@latest
npm pkg set scripts.new-post="anglefeint-new-post"
npm pkg set scripts.new-page="anglefeint-new-page"
npm install
npm run new-post -- --help
npm run new-page -- --help
```

After this migration, users can keep the same daily commands:

```bash
npm run new-post -- my-post
npm run new-page -- projects --theme matrix
```

The direct package commands also remain available:

```bash
npx anglefeint-new-post my-post
npx anglefeint-new-page projects --theme matrix
```

## Validation Checklist

After every upgrade:

1. `npm install`
2. `npm run doctor`
3. `npm run build`
4. Check routes:

- `/`
- `/<default-locale>/`
- `/:lang/blog`
- `/:lang/blog/[slug]`
- `/robots.txt`
- `/sitemap-index.xml`

## Notes

- Review `CHANGELOG.md` before upgrading.
- For Astro major-version migrations, follow the official Astro guide first:
  - https://docs.astro.build/en/guides/upgrade-to/
- `consts` has been removed. If your code imported from `src/consts` or `@anglefeint/astro-theme/consts`,
  migrate to `src/config/site.ts` fields (`SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_URL`, `SITE_AUTHOR`, `SITE_TAGLINE`) and `getSiteHero(locale)`.

## Starter Runtime Migration

Updating the npm package does not rewrite your project files. For starters with the old local CLI wrappers or English-only sitemap filter:

1. After installing the fixed theme release, set `scripts.new-post` to `anglefeint-new-post` and `scripts.new-page` to `anglefeint-new-page` in your `package.json`.
2. Compare `src/pages/index.astro` and the sitemap filter in `astro.config.mjs` with the current starter. Keep your existing `i18n.routing.defaultLocalePrefix` choice, custom content, integrations and deployment settings. Do not replace your entire Astro config.
3. Review `src/utils/metrics.ts` if you want the current CJK-aware counts. Reading-time and derived metrics may change for existing CJK posts.
4. Review updated support scripts and adapter templates together with the theme package. `sync-adapters` regenerates from your local templates; it does not download newer templates.
5. Run `npm run doctor`, `npm run check`, and `npm run build`. Verify the default home URL, canonical links and sitemap in the generated output before deploying.

The updated `scripts/doctor.mjs` detects known legacy command and route patterns without editing files. Existing projects must obtain this script and its npm entry explicitly; installing the theme package alone does not update `doctor`. Custom routing needs manual review even when no known pattern is detected.

Back up or commit your project before applying migration changes. Restore the previous project files and lockfile together if you need to roll back. Never run maintainer starter synchronization against a customized user project.

The post CLI now loads the actual TypeScript config (including imported modules and merged defaults). Invalid configuration fails with an error instead of silently generating English posts. An explicit `--locales en,fr` or `ANGLEFEINT_LOCALES` override can still be used without loading the config.
