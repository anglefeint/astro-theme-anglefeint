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

### 0.5.1: Chinese language menu label

The new starter defaults to `简体中文`. Existing 0.5.0 projects remain compatible; no route or schema migration is needed. Updating npm does not rewrite local starter defaults. To adopt the display name in an existing project, merge `i18n: { locales: { zh: { meta: { label: '简体中文' } } } }` into the existing `defineThemeConfig()` object in `src/site.config.ts`. Preserve other settings and any preferred custom label. `/zh/`, `hreflang` and `ogLocale` remain unchanged.

### 0.5.0: article share images

Version 0.5.0 adds `socialImage()` from `@anglefeint/astro-theme/social-image` to `astro.config.mjs`, and `theme.socialImage.enabled` to config defaults/schema and the generated theme adapter. These changes must travel together with the package; 0.4.0 does not include them. Existing customized starters should follow the fresh-template migration below. The default generates per-article images, changing share previews but not article heroes. Explicit `ogImage` wins; disabling automatic generation retains the previous hero/default fallback. Bundled offline fonts increase installation size and rendering adds build time.

### Published baseline

Version 0.4.0 targets Astro `^7.3.2` and Sharp `^0.35.4`, with matching MDX/RSS/sitemap integrations. The theme peer range now requires Astro `^7.3.2`; Astro 5/6 are no longer supported by version 0.4.0. Preserve `compressHTML: true` in Astro config to retain the prior whitespace behavior. Projects created from the 0.3.0 starter retain the older dependencies until explicitly migrated. Updating only the theme package or running `npm update` within the old Astro 6 range does not complete this migration. See the [Astro security advisory](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2) and [v7 migration guide](https://docs.astro.build/en/guides/upgrade-to/v7/).

The 0.3.0 search feature requires registering `@anglefeint/astro-theme/search` in `astro.config.mjs` and synchronizing the `theme.search.enabled` config adapter with the UI. Updating the package alone does not install that registration into an older starter. Use the matching starter, or explicitly migrate its integration/configuration changes. Verify full search with build + preview.

The 0.3.0 article contents feature also needs the article route to pass `headings` from `render(post)` to `BlogPost`. Updating the package alone does not update that route or add the starter's `theme.toc.enabled` configuration. Existing custom routes without `headings` keep rendering without a contents panel. See `docs/releases/0.3.0.md` for the release instructions.

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

### Tag browsing (0.3.0)

Tag browsing requires both the package components/utilities and the new starter-owned `src/pages/[lang]/tags/` routes, plus the updated theme config adapter. Package installation alone cannot add these routes. For users, create the matching template in a separate directory or deliberately migrate those route/configuration files. The manifest-driven starter release flow is for upstream maintainers, not customized user projects. Existing articles may omit `tags`.

### Article copy and image preview (0.3.0)

The package-owned `BlogPost` layout and scripts provide both features with no new author markup or configuration switch. Custom layouts that do not use that article layout do not automatically gain them. Verify fenced code copying under HTTPS/localhost and click an unlinked body image in preview; linked images retain navigation and hero images are excluded. Preview displays the existing selected image source, not a higher-resolution original. The temporary public image demonstration article is not part of the starter.
