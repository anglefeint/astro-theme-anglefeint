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

## Nine-language baseline (0.9.0)

Version 0.9.0 adds four enabled languages in starter-owned defaults, alongside package UI and CLI translations. It requires Astro `^7.3.5`; see [release status](docs/releases/0.9.0.md). Use a fresh matching starter and migrate personal content/settings for the complete experience. An npm update alone does not add local locale defaults, translated guides or README files. Existing custom article files must not be overwritten. New projects create nine article skeletons by default; disable unwanted locales explicitly with `meta.enabled: false` or select files with `--locales`.

This guide explains the recommended upgrade path for projects created from the starter branch.

## Choose an Upgrade Path First

- If the target release explicitly supports your existing starter and Astro version and changes only the package, use [Compatible Package Updates](#compatible-package-updates). You do not need to recreate the project for every update.
- If the target changes the Astro major version, local routes, configuration contracts or build integrations, use the fresh-template migration below. Create it in a new directory and migrate content and personal settings; do not overwrite your existing project.
- If compatibility is unclear, check the target release notes and package peer dependencies before installing. Do not use `@latest` as a migration shortcut. Theme 0.8.0 requires Astro `^7.3.2`; installing it alone does not migrate an Astro 6 project.

## Recommended Baseline

### 0.10.0: optional Google Analytics 4

This feature adds starter-owned configuration as well as package runtime. For the supported baseline, create the latest starter in a **new directory**, migrate your content and personal settings, then set top-level `analytics: { googleAnalyticsId: 'G-XXXXXXXXXX' }` in `src/site.config.ts`. Preserve the new configuration helpers. No article frontmatter or page-route edits are needed. Run `npm run doctor`, preview, rebuild and redeploy; confirm collection in GA4 Realtime on the deployed site. Localhost previews intentionally do not send data.

For maintainers reviewing a customized 0.9.x project, the configuration delta is limited to `src/site.config.schema.ts` (analytics type), `src/site.config.defaults.ts` (empty default), `scripts/adapter-templates/src/config/theme.ts` (ANALYTICS mapping) and its generated `src/config/theme.ts`. Merge those changes without replacing personal configuration; `npm run sync-adapters` uses local templates and does not download them. The package target is `@anglefeint/astro-theme@^0.10.0`, outside the `^0.9.x` update range. Package-only installation leaves old adapters disabled and does not make the new option available automatically. Historical customized starters are not covered by the release matrix. See [release notes](docs/releases/0.10.0.md).

### 0.9.2: cinematic article share cards

Package-only patch for matching 0.9.0/0.9.1 starters. Run `npm update @anglefeint/astro-theme`, then `npm run doctor`, preview and redeploy. No route, adapter or content migration is required. Automatically generated cards gain a bundled background and a small `Theme by Anglefeint` credit. The existing `theme.footer.showCredits: false` setting now hides both footer credits and this image credit. Custom `ogImage` remains untouched. Generated image URLs change; sharing platforms may retain cached previews until they fetch the page again. See [0.9.2 release notes](docs/releases/0.9.2.md).

### 0.8.5: automatic article translation metadata

Existing standard 0.8.3/0.8.4 starters on Astro `^7.3.2` only need the package update:

```bash
npm update @anglefeint/astro-theme
npm ls @anglefeint/astro-theme
npm run doctor
```

Confirm version 0.8.5 or later within the compatible 0.8.x range, then rebuild and deploy. No route edit, new frontmatter or configuration is required. `BlogPost` automatically finds existing same-slug translations in the blog collection for standard `/<locale>/blog/<slug>/` routes. Missing translations are omitted from SEO alternates; language-menu fallbacks remain available. An existing 0.8.4 `seoLocaleHrefs` mapping continues to work and need not be removed.

Custom article URLs outside the standard route are not guessed: supply the optional `seoLocaleHrefs` mapping when needed, otherwise automatic alternates are omitted. Canonical URLs remain unchanged. Frozen 0.8.3 and 0.8.4 starter snapshots are tested with only the package replaced and original source files preserved.

### 0.8.4: article translation metadata

Historical instructions for 0.8.4 only: prefer 0.8.5 above to avoid the manual route edit. Version 0.8.4 remains published.

The matching starter separates language-menu fallbacks from article SEO alternates. Missing translations no longer advertise a blog listing as a translated article. If the default language has no translation, `x-default` is omitted. Menu navigation and canonical URLs keep their existing behavior.

Updating npm alone does not edit `src/pages/[lang]/blog/[...slug].astro`. For an existing 0.8.x starter on Astro `^7.3.2`, upgrade the theme to `^0.8.4` and merge the matching starter's article-route change: collect enabled locales with an existing same-slug article, build `seoLocaleHrefs` from their article URLs, and pass it to `BlogPost` alongside the existing menu `localeHrefs`. Preserve custom route behavior. Routes that omit the new prop retain the old metadata behavior. If the route has diverged substantially, use the fresh-template migration below. Run `npm run doctor` and inspect a partially translated article's head and language menu.

The new starter does this automatically; authors need no new frontmatter or configuration. Translation matching continues to use the same slug across language directories.

### 0.8.3: music download and external audio requirements

This package-only update supports the matching 0.8.x starter without configuration or adapter changes. The player now downloads the complete selected track into a browser Blob before playback, so seeking does not depend on HTTP Range support. Large tracks and slow connections increase startup time and memory use.

External audio hosts must permit cross-origin fetch (CORS), even if their URLs previously played directly in the browser. Configure the audio host or move tracks into your site's `public/music/` directory. If your site sets a Content Security Policy, allow the audio source in `connect-src` and `blob:` in `media-src`. Follow [Compatible Package Updates](#compatible-package-updates) and verify your configured tracks in preview. See the [0.8.3 release notes](docs/releases/0.8.3.md) for delivery evidence and tested limitations.

### 0.8.1: music session resume

This package-only update supports the matching 0.8.0 starter and its Astro range. Run `npm update @anglefeint/astro-theme`, then `npm run doctor`; no configuration or adapter migration is needed. Verify the installed version with `npm ls @anglefeint/astro-theme`. Active music sessions attempt to resume after navigation/reload; manual pause stays paused. Browser restrictions can require clicking PLAY. Brief interruptions remain possible. Existing session records without resume intent stay paused until you play. Older starters must first satisfy the baseline requirements below.

### 0.8.0: footer credits and separate demo configuration

The footer now links to Anglefeint and Astro by default. Set `theme.footer.showCredits: false` to hide both links while keeping your site copyright and custom tagline. This requires the matching starter schema, defaults and theme adapter; npm alone does not update those files. Use the fresh-template migration below and preserve personal settings. A `^0.7.0` dependency range does not include 0.8.0.

`site.tagline` defaults to an empty string. A custom value remains independent of the credits switch; the former default `Built with Astro.` is treated as the built-in credit instead of repeated. No all-rights-reserved notice is added. The published starter keeps generic identity settings; main's demo identity and translated introduction are not copied into it.

### Starter-side site URL override fix (2026-09-19)

The corrected starter makes `PUBLIC_SITE_URL` override Astro's build-time `site`, including canonical URLs, RSS and sitemap output. It changes `astro.config.mjs`, adds `scripts/resolve-site-url.mjs` and declares Vite as a direct build dependency. Updating the theme npm package alone cannot install these starter changes. In older starters, set `site.url` directly in `src/site.config.ts` and remove conflicting `PUBLIC_SITE_URL` values, or follow the fresh-template migration below. After adopting the corrected starter, rebuild and inspect canonical, RSS, sitemap and social-image URLs with your deployment domain. The theme package remains 0.7.0; the corrected starter was delivered as `b2071b6`.

### 0.7.0: optional music player

Use the matching 0.7.0 starter when adopting music: `src/site.config.schema.ts`, `src/site.config.defaults.ts`, `scripts/adapter-templates/src/config/theme.ts` and its generated `src/config/theme.ts` supply the new `theme.music` contract. Updating the npm package alone does not install these local files. Follow the fresh-template migration below and reapply personal settings. `npm update` within `^0.6.0` will not select `0.7.0`.

Music is off by default and no audio files are bundled. Put your own audio under `public/music/`, then configure `theme.music.enabled` and `theme.music.tracks` as shown in the README. In 0.7.0/0.8.0, page navigation requires clicking Play to resume. Version 0.8.1 adds automatic session resume attempts, still without seamless playback.

### 0.6.0: cinematic effects

The visual enhancements are package-owned and compatible with the 0.5.x starter. Use `npm install @anglefeint/astro-theme@^0.6.0`, then run `npm run doctor` and preview your site. `npm update` respects the existing dependency range: `^0.5.1` does not include `0.6.0`.

The new starter also uses literal `replaceAll` calls in the About route's `escapeHtml` function to avoid a parsing error in `@astrojs/language-server@2.17.0`. If an existing starter reports syntax errors in `src/pages/[lang]/about.astro` after a fresh dependency install, replace the chained `replace(/&/g, '&amp;')`, `replace(/</g, '&lt;')`, `replace(/>/g, '&gt;')` and `replace(/"/g, '&quot;')` calls with `replaceAll('&', '&amp;')`, `replaceAll('<', '&lt;')`, `replaceAll('>', '&gt;')` and `replaceAll('"', '&quot;')`, respectively. Keep ampersand replacement first and preserve all four escapes. This keeps the rendered HTML unchanged; updating npm alone does not edit the local route.

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
6. Follow the [Validation Checklist](#validation-checklist): with the current starter, run `npm run doctor`, then `npm run preview` after it succeeds. Keep the old project until the new one is verified.

Do not copy `node_modules`, old lockfiles or maintainer synchronization scripts into the new project.

## Compatible Package Updates

Projects created from:

`npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter`

may use the following for package-only updates whose release notes do not require a new project skeleton:

1. `npm update @anglefeint/astro-theme`
2. Follow the [Validation Checklist](#validation-checklist).

`npm update` installs within the range declared in `package.json`: `^0.5.1` does not include `0.6.0`, even if that release is compatible. To cross the range, follow the relevant release notes and install an explicit compatible target version. A successful update command does not prove you reached the intended version; check `npm ls @anglefeint/astro-theme astro`. Changing the range does not migrate local starter files.

This updates the theme package, not the local project skeleton. The targeted migration notes below are optional for users choosing to retain an existing project rather than start from the latest template.

## Scaffold Command Upgrade

Projects created from older starter versions may still route scaffold commands through local wrapper files:

```txt
scripts/new-post.mjs
scripts/new-page.mjs
```

Those wrappers are no longer the recommended integration point because local project files do not update when the npm package updates. Only after confirming compatibility, installing a compatible theme version that provides both CLI bins, and completing its required starter migrations, adjust the commands below. This step changes command wiring only; it does not migrate Astro or configuration files.

```bash
npm pkg set scripts.new-post="anglefeint-new-post"
npm pkg set scripts.new-page="anglefeint-new-page"
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

For the current starter, after dependencies are installed:

1. Run `npm run doctor`. It runs migration diagnostics, adapter checks and `check`; `check` includes a build and About output verification. After success, running `check` and `build` again is unnecessary unless files changed.
2. If it specifically reports generated adapters out of sync with local templates, run `npm run sync-adapters`, then rerun `npm run doctor`. This copies **local** templates and overwrites generated adapters; it does not download upstream templates or resolve all migration errors. Handle other failures according to their messages.
3. After success, run `npm run preview` and inspect your content, images, custom pages, canonical URLs and sitemap domain before deploying. Passing diagnostics alone is not proof that all custom behavior is correct.

Older projects may lack `doctor` or have different scripts. Inspect their local `package.json` and follow the matching migration instructions; installing the theme package does not update those scripts. Run `npm install` if dependencies have not yet been installed for the migrated project.

Check routes:

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
5. Follow the [Validation Checklist](#validation-checklist), using the scripts actually present in your project. Verify the default home URL, canonical links and sitemap in the generated output before deploying.

The updated `scripts/doctor.mjs` detects known legacy command and route patterns without editing files. Existing projects must obtain this script and its npm entry explicitly; installing the theme package alone does not update `doctor`. Custom routing needs manual review even when no known pattern is detected.

Back up or commit your project before applying migration changes. Restore the previous project files and lockfile together if you need to roll back. Never run maintainer starter synchronization against a customized user project.

The post CLI now loads the actual TypeScript config (including imported modules and merged defaults). Invalid configuration fails with an error instead of silently generating English posts. An explicit `--locales en,fr` or `ANGLEFEINT_LOCALES` override can still be used without loading the config.

### Tag browsing (0.3.0)

Tag browsing requires both the package components/utilities and the new starter-owned `src/pages/[lang]/tags/` routes, plus the updated theme config adapter. Package installation alone cannot add these routes. For users, create the matching template in a separate directory or deliberately migrate those route/configuration files. The manifest-driven starter release flow is for upstream maintainers, not customized user projects. Existing articles may omit `tags`.

### Article copy and image preview (0.3.0)

The package-owned `BlogPost` layout and scripts provide both features with no new author markup or configuration switch. Custom layouts that do not use that article layout do not automatically gain them. Verify fenced code copying under HTTPS/localhost and click an unlinked body image in preview; linked images retain navigation and hero images are excluded. Preview displays the existing selected image source, not a higher-resolution original. The temporary public image demonstration article is not part of the starter.
