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

<a id="0270-integration-starter-breaking-not-yet-published"></a>

## 0.27.0: Integration starter (breaking)

Version 0.27.0 introduces a breaking integration starter. Pre-0.27 projects must migrate once; schema-1 integration starters use the package upgrade command below. See the [release ledger](docs/releases/0.27.0.md) for actual delivery and validation status.

### One-time migration from pre-0.27 projects

Keep a complete backup of the old project, including its lockfile, hidden environment files and hosting settings. Create the latest public starter in a **separate directory**:

```bash
npm create astro@latest -- my-blog-new --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog-new
npm install
```

Copy your articles (including article-relative images), `src/assets/`, public music/images/icons/fonts/favicon and any other personal public files into the new project. Preserve filenames, article slugs, locale directories, resource URLs and required licenses. Copy personal `.env` values and deliberately merge deployment settings without publishing secrets. Do not replace the new package.json/tsconfig/Astro configuration with old copies.

Your site-config **values** remain supported. Preserve the old file as a backup, change its old local helper imports/re-exports to `@anglefeint/astro-theme/config`, and merge your identity, locale enablement/fallbacks, About content, social links, playlist and feature overrides into the new `defineThemeConfig({...})` object. Arrays replace earlier arrays, so keep your full playlist/link lists. Omitted fields use package defaults. Preserve explicit pagination and locale choices if you do not want new defaults. The main demo retains its existing configuration via maintainer compatibility entries; those entries are not part of the new consumer skeleton.

For example, replace `import { defineThemeConfig } from './site.config.defaults.ts'` with `import { defineThemeConfig } from '@anglefeint/astro-theme/config'`. Redirect any type exports from `./site.config.schema.ts` and helper exports from `./site.config.runtime.ts` to the same public package entry. Keep the existing `THEME_CONFIG` object and its personal values. Compare old/new locale settings, full playlists, About text and social arrays before deleting the backup. Merge personal content into the new content directories; remove sample posts only after confirming they are samples, not personal files with matching filenames.

Do not copy old standard `src/pages` routes, `src/config`, `src/i18n`, defaults/schema/runtime helpers, generated adapter types or adapter-sync scripts. The integration owns Home, Blog/articles, Tags, About, Decoder, RSS, robots and terminal JSON together. For your own pages, migrate the content and custom code deliberately, keep package layout imports and the integration's documented aliases, and use paths outside the reserved standard routes. A conflicting copied standard route causes a clear build error rather than silently replacing it.

The new Astro entry is:

```js
import { defineConfig } from 'astro/config';
import anglefeint from '@anglefeint/astro-theme/integration';
import { THEME_CONFIG } from './src/site.config';

export default defineConfig({ integrations: [anglefeint(THEME_CONFIG)] });
```

The new tsconfig extends `@anglefeint/astro-theme/tsconfig`; preserve this package-owned type/alias setup instead of copying old paths into the new project.

Do not also register the former standalone MDX/search/social-image/machine-readable/sitemap integrations: the unified integration supplies them. Retain unrelated integrations deliberately.

Run `npm run doctor`, inspect with `npm run preview`, and deploy **all** of dist/. Check old article URLs, canonical/hreflang, enabled languages, About/Decoder switches, custom pages and music/image URLs before replacing the old deployment. New defaults or an Astro change can affect content parsing; resolve build errors rather than deleting personal content.

### Future upgrades of the integration starter

For npm projects with `anglefeint.projectSchema: 1`:

```bash
npx @anglefeint/astro-theme@latest upgrade
# Read-only project preflight:
npx @anglefeint/astro-theme@latest upgrade --check
# Select a published version:
npx @anglefeint/astro-theme@latest upgrade --to 0.27.1
```

`npm run upgrade` is the same default command in the new starter. The updater validates the project marker, npm lockfile family, target package name/version/schema, Node engine and installed Astro peer range. It resolves the target before installation, supports skipping package versions within schema 1, backs up package.json/package-lock.json under `.anglefeint/backups/`, installs the exact version with lifecycle scripts disabled, and runs the project's doctor. It does not rewrite configuration, source, content, music, images, custom pages or host settings; it does not push or deploy. It preserves user dependency overrides. Review new dependencies if they require installation lifecycle scripts.

On failure, dependency files are restored and the tool attempts to reinstall the old dependencies. If reinstall fails, it reports the backup path and incomplete recovery; keep that backup. Astro/Node incompatibilities, unknown project schemas and old skeletons stop before dependency changes. There are currently no cross-schema migrations: future schema changes require a documented migration and a matching upgrader implementation. A package-lock.json is required for recoverable upgrades; run npm install first if it is absent. Automatic upgrades currently support **npm only**; pnpm/yarn/bun lockfiles are rejected rather than rewritten. These guarantees cover unmodified package-owned standard pages; deeply customized replacement components may need manual adaptation. Keep a backup/Git commit for application-specific customizations.

Dependency recovery does not restore build output: a failed build can leave `dist/` incomplete. Do not deploy it. After recovering dependencies, rerun `npm run doctor` successfully before deployment. Run only one upgrade/install/build against a project at a time. The dependency backup is not a backup of articles or media.

Doctor executes the project's configured validation/build commands. Custom scripts can have their own side effects; dependency recovery is not a general content rollback or a sandbox for those scripts. Keep a separate backup of personal content before migration or upgrading customized projects.

Ordinary package-owned menus, buttons, pages, scripts, styles, translations and additive optional defaults arrive through the package update and rebuild. Explicit user overrides stay explicit: a custom list replaces a default list, and a configured page size does not change when the package default changes. New features must supply backward-compatible defaults within schema 1. Root package overrides, Astro/Node changes, environment secrets, hosting configuration, personal assets and documentation copies are separate concerns; the updater does not rewrite them. A future package page conflicting with a user page stops the build and requires choosing a new custom URL deliberately; it never deletes the user page.

### SEO and static hosting

The package sitemap reads rendered `updatedDate ?? pubDate`, never file/build timestamps, and does not fabricate dates for archives. Terminal JSON keeps its URL/body and sets `X-Robots-Tag: noindex`; the build merges its static rule into `dist/_headers` without changing user source `_headers`. Cloudflare Pages/compatible hosts apply this output; other hosts require equivalent headers. Astro preview does not apply hosting headers. Check a deployed terminal JSON response for 200, the original body and `X-Robots-Tag: noindex`, while article HTML remains unaffected. Keep robots open so crawlers can read the directive. This does not guarantee indexing or erase historical 404 reports.

Read [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases) and [Changelog](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CHANGELOG.md) before upgrades; notifications require opt-in. Delivery and local verification are recorded separately in [0.27.0](docs/releases/0.27.0.md).

## Historical migrations for pre-0.27 starters

The sections below describe older copied skeletons and remain historical references. They are not additional steps for a new integration starter. Use the fresh-starter migration above to cross the 0.27 boundary.

## 0.26.0: About reading window

Use the matching 0.26.0 starter, or deliberately merge its `src/pages/[lang]/about.astro` changes into your customized route before installing `@anglefeint/astro-theme@0.26.0`. The package supplies the controller, controls component, styles and localized labels; it cannot rewrite a project-owned route. No new site configuration, schema or adapter keys are required.

The route imports `components/about/AboutWindowControls.astro`, sets `id="about-reading-window"` on the About article, and places the controls inside the outer `.prose` before the title, using the localized About title, modal-close label and `messages.windowControls`. Remove the old decorative dots beside OUTPUT. Add the initially hidden `data-about-open` button at the end of `.hacker-sidebar` and the initially hidden `data-about-restore` button in the body-end slot, both controlling `about-reading-window`; keep the existing contents and section IDs. These three control surfaces must be present together. Compare with the matching route and preserve your custom content rather than overwriting it.

Red closes and resets reading position, leaving a sidebar About entry. Yellow retains layout space and reading position while minimizing to the bottom-right dock. Green requests fullscreen on the About article; Escape or the green button restores the page. The terminal commands `open`, `close`, `minimize`, `maximize` and `restore` use the same state. Preferences are local to this browser/path; fullscreen is never restored automatically. Contact links reopen hidden content. Without JavaScript the content remains readable and inactive controls stay hidden.

After merging, run `npm run doctor`, inspect with `npm run preview`, then deploy the complete rebuilt output. Projects with substantially different routes/scripts should create a fresh starter in a new directory and migrate content/configuration. See [0.26.0](docs/releases/0.26.0.md) for delivery status.

## 0.25.0: Article authors and section links

From the matching 0.24.1 starter, run `npm install @anglefeint/astro-theme@0.25.0`, then `npm run doctor` and `npm run preview`, and deploy the complete output. No new schema, adapter, project route or mandatory configuration is needed. Authors use the existing article `author` field or site author fallback; only a name matching the site author links to About, and only when About is enabled. Heading links reuse existing IDs; renaming a heading can still change its generated fragment. Older projects must also complete the earlier migrations below. See [0.25.0](docs/releases/0.25.0.md) for delivery status.

## 0.24.1: Ten posts per archive page

New projects from the matching 0.24.1 starter already default to ten posts: one leading card and nine regular cards, filling three desktop rows on a full page. Final partial pages still show only the remaining posts. No manual page-size setting is needed for those new projects.

Existing 0.24.0 projects keep their own `src/site.config.defaults.ts` with a default of nine. Installing a newer package does not replace that file, even if you never configured a page size yourself. To upgrade a project already using the matching 0.24.0 routes:

1. Run `npm install @anglefeint/astro-theme@0.24.1`.
2. Merge `blogPageSize: 10` into the existing `theme` object in `src/site.config.ts`, preserving other settings:

   ```ts
   theme: {
     // Keep your other theme settings here.
     blogPageSize: 10,
   },
   ```

3. Run `npm run doctor`, which includes checks/build in the matching starter; inspect with `npm run preview`, then deploy the complete rebuilt output so blog and tag boundaries move together.

No additional schema, adapter or route changes are needed for this patch from the matching 0.24.0 starter. Older projects must also follow the [0.24.0 route migration](#0240-archive-views-and-homepage-counts), or migrate content/configuration to a fresh starter; old/customized scripts can differ. Intentional page-size overrides remain supported. See [0.24.1](docs/releases/0.24.1.md) for delivery evidence.

## 0.24.0: Archive views and homepage counts

Theme 0.24.0 and its matching starter supply these changes. See the [release record](docs/releases/0.24.0.md) for delivery status. Merge the matching project-owned route changes deliberately:

- `src/pages/[lang]/blog/[...page].astro`: carry the full localized total in static props; pass `startIndex={(page.currentPage - 1) * BLOG_PAGE_SIZE}` and `totalPosts={page.total}` to BlogCards.
- `src/pages/[lang]/tags/[tag]/[...page].astro`: pass Astro pagination's `page.start` and `page.total` to the same props.
- `src/pages/index.astro` and `src/pages/[lang]/index.astro`: compute the full locale-filtered collection before slicing and pass its length as `HomePage.totalPosts`.

Package-owned components supply view switching, styles and effects. Older callers still render, but omitted metadata defaults to the current slice (zero offset), so counts cannot describe the complete archive. No new schema keys, adapters or storage migration are required. The view preference key is `anglefeint:blog-view`; page size remains build-time configuration (ten by default from 0.24.1). These four routes are already starter-manifest-owned, and package components/scripts/styles are already included in package files. Demo essays are outside the starter content whitelist. Local validation does not replace installed-package, remote-template or release gates; see [the dated audit](docs/CODE_DOC_AUDIT.md#2026-11-04-home-and-archive-documentation-sync).

## 0.23.0: About navigation and lossless OG images

Use the matching starter, or deliberately merge its `src/pages/[lang]/about.astro` changes into your customized route. The updated package supplies AboutContents, FrontierMenu and the shared section IDs, but cannot modify an existing project-owned About page. Avoid replacing a customized route blindly. Without the route merge, the package header's Contact link can point to a missing `#contact` anchor in an older project.

About directories reuse existing translated labels and need no new settings. The directory uses the reading panel’s right gutter from 1360px upward and wraps inside the panel below that breakpoint; DL Data and other tools retain their original sidebar. `theme.enableAboutPage: false` removes About/Contact navigation independently of Decoder Lab.

OG PNGs retain their pixels and dimensions with stronger lossless encoding. Versioned image URLs change on rebuild; deploy the full rebuilt output. The large CJK font remains build-only and is not downloaded by page visitors. No font change is included in this release.

## Optional machine-readable context

Available with theme 0.22.0 and its matching starter wiring; it is not included in 0.21.0. Existing projects should import `THEME_CONFIG` from `./src/site.config` in `astro.config.mjs` and pass these additional integration options:

```js
machineReadable({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  aiReadableContent: THEME_CONFIG.aiReadableContent,
  locales: THEME_CONFIG.i18n.locales,
});
```

Merge optional values into `src/site.config.ts`:

```ts
aiReadableContent: {
  notes: 'Please cite the article title, author, date and canonical URL.',
  links: [{ label: 'About', href: 'en/about/' }],
},
i18n: {
  locales: {
    zh: {
      aiReadableContent: { notes: '引用时请注明文章标题、作者、日期和规范网址。' },
    },
  },
},
```

Both fields are optional; no configuration preserves the previous output. Each language field independently inherits the global value when omitted. An empty `notes` string or `links: []` explicitly hides that field; arrays replace, rather than append. No automatic policy translation or cross-language fallback occurs. The root index uses global context; language indexes, full-text bundles and individual article Markdown use the corresponding language context. Empty values produce no empty headings.

Notes support standard Markdown, including inline/reference links and images. Parsed destinations become absolute: `en/about/` resolves under the configured deployment base, while `/en/about/` resolves from the origin root; language prefixes are never inferred. Code examples remain unchanged. Raw HTML is retained as authored, so use absolute URLs in HTML attributes. Destinations in notes and configured links must use HTTP(S), without URL credentials. Labels must be nonempty. Invalid configuration fails the build; targets are not fetched or checked for availability. Use actual public pages, not repository/workstation paths.

Individual exports append a rule, a site-context comment and separately headed notes/links after the article; the source article and its frontmatter remain unchanged. Full-text bundles include the context once. The template supplies no content license and does not promise compliance by AI systems or crawlers. To migrate an old customized `public/llms.txt`, move its relevant guidance into these fields and remove the conflicting public file after preserving any other content.

## 0.21.0: automatic machine-readable articles

The rendering dependency moves to Satori 0.33.5. Its upstream package pins vulnerable fflate 0.7.3, so the matching starter includes root `"overrides": { "fflate": "0.7.5" }`. Existing projects installing this theme version must merge that override into their own root package.json, preserve other overrides, reinstall, audit and rebuild. Overrides inside an installed dependency do not apply to a consumer's project. The maintainer checkout separately overrides ESLint's minimatch dependencies to 11.0.4 and anchors the same Satori version at its root so npm workspace resolution honors the fflate patch; these maintainer entries are not distributed in starter.

The matching starter preconfigures `@anglefeint/astro-theme/machine-readable` in `astro.config.mjs`, passing the existing site title/description. Builds generate a root `llms.txt`, language indexes/full-text bundles and per-article `index.md` companions from rendered public article HTML. No API key, new site-config field or production server is required. Build-generated article head links discover the exports; they are available after build/preview, not injected into dev HTML.

Existing projects need the matching package **and** the integration added to their project-owned Astro config. Remove the old `public/llms.txt` placeholder; the integration refuses to overwrite pre-existing user files. If that file contains custom guidance, preserve and review it before removing it. Package updates alone do not edit the project config or delete custom files. Upload all of `dist` as usual; clean rebuilds remove deleted content, and a local cache manifest also cleans integration-owned exports during non-clean rebuilds. A page's existing `noindex` excludes it; the article's `search` setting controls site search only. No unrendered source files or internal frontmatter are exported. This is a machine-reading aid, not a promise of indexing, training or citation.

> Commit references in this record follow the cleaned Git history. Published npm metadata retains original commit IDs; historical text normalization may differ from archived npm tarballs.

## 0.20.1: sixteen reading cards and eight-column layout

The matching starter uses Vite `^8.3.5`, replacing the vulnerable 8.3.2 lock. Existing projects should also refresh Vite to a patched version in their supported version line; updating the theme package alone cannot update a project's root Vite declaration/lockfile. See the [release security record](docs/releases/0.20.1.md).

Compatible with the 0.20.0 starter contract. Update the package within the declared range, run `npm run doctor`, preview, rebuild and redeploy. No route, schema or adapter change is required. Omitted reading configuration now uses sixteen default cards; an explicit custom list remains unchanged, and `links: []` still hides cards. Four new bundled cover keys are listed in the [package configuration guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/packages/theme/README.md#decoder-reading-configuration). Widths of 1440px and above use up to eight columns; smaller screens use four, two or one.

## 0.20.0: Frontier navigation and Decoder reading cards

These changes require the matching 0.20.0 starter. Migrate personal settings deliberately. The package owns the independent Frontier dropdown in `CommonHeader`, the reading component, localized reading types, covers and styles. About remains a direct link. The existing `theme.enableDecoderPage` switch controls the independent dropdown; disabling About alone does not hide Decoder Lab. No schema field, adapter export or route alias is added.

The starter-owned `src/pages/[lang]/decoder.astro` must import `DecoderReadings` and render `<DecoderReadings locale={locale} readings={messages.decoderPage.readings} />` below the functional explanations. Its title begins with `Decoder Lab`. A package-only upgrade cannot add those route changes or the twelve default cards to an old route. The route and starter configuration template are already managed by the starter manifest; new component/media files are covered by existing package directory exports.

Customize `i18n.locales.<code>.messages.decoderPage.readings` in `src/site.config.ts`: `tribute` is plain text and `links` replaces the complete card list. Empty tribute text and `links: []` independently hide them; both empty omit the section. There is no total card-count cap. Entries accept title/link and optional author/year/cover. See the [configuration example and bundled cover names](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/packages/theme/README.md#decoder-reading-configuration). Existing message fallback rules apply. Rebuild and redeploy after changing configuration. Essays are linked externally, without bundled full text or translations; local decoder processing remains unchanged.

## 0.18.1: player initialization and hidden homepage signals

This package-only update adds no configuration fields, routes, aliases or adapter exports. Projects already matching the 0.18.0 starter can run `npm update @anglefeint/astro-theme`, then `npm run doctor`, preview, rebuild and redeploy. See the [0.18.1 release record](docs/releases/0.18.1.md) for delivery status. Older starter contracts still require their corresponding migration.

The player defaults to compact from its initial HTML. Custom `MusicDeck` callers can pass `initiallyCollapsed={false}` to start expanded on desktop or mobile, or true to start compact; `ThemeFrame` forwards `musicInitiallyCollapsed`. Explicit initialization takes precedence over viewport and stored presentation on a new page. Manual toggling and playback/session resume remain available; BFCache restoration reconciles the latest saved presentation rather than reapplying the initial setting.

When `theme.home.showTrace` is enabled, the left pirate signal and right trace now start visually hidden. Hover or select either item to reveal it independently; select-all reveals both. The trace cursor follows only the trace. Setting the existing switch to false still omits the row completely.

## 0.18.0: Decoder Lab and shared About modules

Prefer a fresh matching starter and migrate personal content/settings. The matched release adds `src/pages/[lang]/decoder.astro` and `src/pages/[lang]/terminal/[id].json.ts`, updates the About route, configuration schema/defaults, theme adapter template/generated adapter, runtime type declaration and validator. Package installation alone cannot add these project-owned files. `theme.enableDecoderPage` defaults to true and can be disabled independently of About. The terminal document route follows the About flag and publishes only already-public article source as inert JSON. No AI navigation page is included.

The About Decryptor now performs local Base64/Base64URL, URL, Hex, HTML entities, Unicode escapes and JWT header/payload decoding instead of simulating password/key output. Use the matching package and starter route/defaults together. The title defaults to Hacker Decryptor; existing custom `about.modals.decryptor.title` values are preserved. Previous hash/passphrase label fields remain accepted but are no longer displayed. New controls use `messages.decoder` and the usual locale fallback. No API or extra dependency is required.

## 0.17.0: terminal message and shared Oracle exploration

Version 0.17.0 adds the wide-screen homepage keyhole terminal, shared drag-to-look and reverse travel. See the [release record](docs/releases/0.17.0.md) for delivery status. Terminal and Oracle use one package-owned player; right-click returns to the corridor after arrival, while Escape or × closes About exploration. Text selection and scrolling do not start the terminal preview.

Prefer a fresh matching starter and migrate personal content/settings. For the terminal message fallback, merge the matching `scripts/adapter-templates/src/i18n/messages.ts`, run `npm run sync-adapters` and review `src/i18n/messages.ts` before installing `@anglefeint/astro-theme@^0.17.0`. npm updates do not replace these project-owned files, and `sync-adapters` uses local templates rather than downloading new ones. The existing `messages` configuration surface needs no schema addition. Set `i18n.locales.en.messages.home.transmission` for shared text and optionally override individual languages; otherwise `Knock, knock.` remains the default. Keep personal configuration and preview Home/About with normal and reduced motion.

## 0.16.0: localized homepage headings

Version 0.16.0 requires the matching starter and package. Prefer a fresh template and migrate personal content/settings. For a matching 0.15.0 project, merge `homeTitle?: string` into `LocaleSiteConfig` and `NormalizedLocaleConfig.site` in `src/site.config.schema.ts`, preserve it in `src/site.config.runtime.ts`, and merge `getHomeTitle(locale)` from the matching `scripts/adapter-templates/src/config/site.ts`. Run `npm run sync-adapters`, review the generated diff, then install `@anglefeint/astro-theme@^0.16.0`. The package's homepage now imports this helper; installing npm alone into an older starter is insufficient. Local `sync-adapters` does not download upstream templates.

Set `i18n.locales.<code>.site.homeTitle` for any built-in or custom language. Trimmed non-empty values follow the locale fallback chain, then `SITE_TITLE` including `PUBLIC_SITE_TITLE`. Defaults remain unset. Only the visible homepage h1 changes; browser title, navigation, footer, RSS and SEO identity remain global. Run doctor, preview the relevant language homepages and redeploy. No content, route or language-registry migration is needed.

## 0.15.0: home switches and footer links

Version 0.15.0 requires the matching starter configuration and theme package. Prefer a fresh template and migrate personal content/configuration.

`theme.home.showInitialize`, `showFollow` and `showTrace` default to `true`. `theme.footer.links` defaults to `[]`; configured `{ label, href }` entries render a separate row between copyright and credits, independent of `social.links` and `showCredits`. Labels are user text and do not automatically translate. No demo account or repository links are added to consumer defaults.

Use the matching starter or merge the additions in `src/site.config.schema.ts`, `src/site.config.defaults.ts` and `scripts/adapter-templates/src/config/theme.ts`, then run `npm run sync-adapters` and review the generated `src/config/theme.ts`. The adapter must expose `THEME.HOME` and `THEME.FOOTER.LINKS`; installing the package alone does not update these local files. `sync-adapters` uses local templates and does not download the new template. Preserve personal configuration and add only the requested options in `src/site.config.ts`. Run `npm run doctor`, then preview the homepage and footer before deployment. Use `npm install @anglefeint/astro-theme@^0.15.0` only after merging the matching starter changes.

## Nine-language baseline (0.9.0)

Version 0.9.0 adds four enabled languages in starter-owned defaults, alongside package UI and CLI translations. It requires Astro `^7.3.5`; see [release status](docs/releases/0.9.0.md). Use a fresh matching starter and migrate personal content/settings for the complete experience. An npm update alone does not add local locale defaults, translated guides or README files. Existing custom article files must not be overwritten. New projects create nine article skeletons by default; disable unwanted locales explicitly with `meta.enabled: false` or select files with `--locales`.

This guide explains the recommended upgrade path for projects created from the starter branch.

## Choose an Upgrade Path First

- If the target release explicitly supports your existing starter and Astro version and changes only the package, use [Compatible Package Updates](#compatible-package-updates). You do not need to recreate the project for every update.
- If the target changes the Astro major version, local routes, configuration contracts or build integrations, use the fresh-template migration below. Create it in a new directory and migrate content and personal settings; do not overwrite your existing project.
- If compatibility is unclear, check the target release notes and package peer dependencies before installing. Do not use `@latest` as a migration shortcut. Theme 0.8.0 requires Astro `^7.3.2`; installing it alone does not migrate an Astro 6 project.

## Recommended Baseline

### 0.14.0: Matrix homepage and Oracle

Prefer a fresh matching starter and migrate personal content/settings. For a matching 0.13.0 project, install `@anglefeint/astro-theme@^0.14.0`; add `enableHomePassage: boolean` to `ThemeConfig.theme.effects` in `src/site.config.schema.ts` and `enableHomePassage: false` to the corresponding defaults. Add `ENABLE_HOME_PASSAGE: THEME_CONFIG.theme.effects.enableHomePassage` to `THEME.EFFECTS` in `scripts/adapter-templates/src/config/theme.ts`, then run `npm run sync-adapters`. Review customized adapters before replacing them.

The About Oracle button also needs the matching `src/pages/[lang]/about.astro` route and script declarations in `src/types/theme-scripts.d.ts` (and its adapter template). Merge these files from the new starter deliberately; npm alone does not add the button. Run `npm run doctor` and preview Home/About with normal and reduced motion. The homepage passage is disabled by default and remains green when enabled; Oracle is independent and chooses a different one of four palettes at each click. Dismiss with another click or Escape. The existing music configuration is unchanged. See [0.14.0](docs/releases/0.14.0.md).

### 0.13.0: global Markdown and MDX mathematics

This release needs starter configuration changes; npm alone does not connect the new processor. Prefer a fresh `#starter` project in a new directory and migrate your articles/assets/personal settings using the procedure below. Do not overwrite your customized site configuration.

For a matching Astro 7.3.7 / theme 0.12.0 project, the minimal manual migration is:

1. Run `npm install @anglefeint/astro-theme@^0.13.0 astro@^7.3.7 @astrojs/mdx@^8.0.3`.
2. Add `math: { enabled: boolean };` to `ThemeConfig.theme` in `src/site.config.schema.ts` and `math: { enabled: true },` to the default `theme` object in `src/site.config.defaults.ts`.
3. Add `MATH: { ENABLED: THEME_CONFIG.theme.math?.enabled ?? true },` to the exported `THEME` object in `scripts/adapter-templates/src/config/theme.ts`, then run `npm run sync-adapters`. Review the generated diff if you previously customized adapters.
4. Import `markdown from '@anglefeint/astro-theme/markdown'` in `astro.config.mjs` and add `markdown: { processor: markdown({ enabled: THEME.MATH.ENABLED }) }` to `defineConfig`. Keep the existing `THEME` import and `mdx()` integration. If you already have a custom Markdown processor/plugins, merge deliberately rather than replacing them with this example.
5. Run `npm run doctor`, then `npm run preview`. Check existing dollar text and formulas before redeploying.

Math is now on globally; no per-post flag is needed. Disable with `theme: { math: { enabled: false } }` in `src/site.config.ts`. Escape ambiguous literal dollars as `\$`. Disabling math restores normal MDX expression parsing, so formula braces are not automatically treated as literal text. Titles/descriptions remain plain text. See [0.13.0](docs/releases/0.13.0.md) for scope and delivery evidence.

### 2026-10-08: Astro dependency refresh

Main and the generated starter target Astro `^7.3.7` and MDX `^8.0.3`. Matching Astro 7.3.x / MDX 8.x projects can run `npm install astro@^7.3.7 @astrojs/mdx@^8.0.3`, then `npm run doctor`, preview and redeploy. This dependency-only refresh does not require a new theme package; `@anglefeint/astro-theme` remains 0.12.0. It does not enable mathematical formula rendering or change the Markdown processor/configuration. Earlier major-version migration requirements still apply.

### 0.12.0: optional social link relations

Compatible package-only feature for matching 0.11.x starters; no schema/adapter migration. Because `^0.11.x` does not select 0.12.0, use `npm install @anglefeint/astro-theme@^0.12.0`, then `npm run doctor`, preview and redeploy. Add `rel: 'me'` only to links representing your own identity, or other space-separated relations as needed. Without the field, existing behavior is unchanged. See [release notes](docs/releases/0.12.0.md).

### 0.11.3: About line breaks

Compatible package-only patch for matching 0.11.x starters. Update the theme, run `npm run doctor` and `npm run build`, preview and redeploy. About body paragraphs/signature preserve actual line feeds in configuration strings (`\n` for a new line, `\n\n` for a blank line). No configuration, schema or adapter migration; content remains plain text. See [release notes](docs/releases/0.11.3.md).

### 0.11.2: grouped and localized footer

Compatible package-only patch for matching 0.11.0/0.11.1 starters. Run `npm update @anglefeint/astro-theme`, `npm run doctor`, `npm run build`, then preview and redeploy. No schema, adapter or configuration edits are needed. Existing `site.tagline` and `PUBLIC_SITE_TAGLINE` remain global user text; no copyright/hosting statement is added by default. Built-in credits follow the page language and `theme.footer.showCredits` still controls them. See [release notes](docs/releases/0.11.2.md); earlier migration requirements remain unchanged.

### 0.11.1: reading-panel width fix

Package-only patch for matching 0.11.0 starters. Run `npm update @anglefeint/astro-theme`, then `npm run doctor`, preview, rebuild and redeploy. No local schema, configuration, route or content changes are required for this patch. It corrects Home/article overflow above the mobile breakpoint while preserving wide-screen reading widths. Earlier-version migration requirements still apply. See [release notes](docs/releases/0.11.1.md).

### 0.11.0: social icons and custom images

Adds nine optional built-in icons and local `iconSrc` images to `social.links`. Existing links and empty placeholders retain their behavior. The supported baseline is the matching starter plus `@anglefeint/astro-theme@^0.11.0`; `^0.10.0` does not include this minor release. New projects need only edit `src/site.config.ts`. For customized 0.10.0 projects, the only starter code delta is `src/site.config.schema.ts`: its `SocialLink` type now imports/re-exports the package's `@anglefeint/astro-theme/utils/social-icons.ts` type. npm alone does not update local schema files. No adapter, route, article or locale migration is required. Prefer the fresh-template migration below when unsure; do not overwrite personalized configuration. Rebuild, preview header/footer and redeploy. See [release notes](docs/releases/0.11.0.md).

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

The corrected starter makes `PUBLIC_SITE_URL` override Astro's build-time `site`, including canonical URLs, RSS and sitemap output. It changes `astro.config.mjs`, adds `scripts/resolve-site-url.mjs` and declares Vite as a direct build dependency. Updating the theme npm package alone cannot install these starter changes. In older starters, set `site.url` directly in `src/site.config.ts` and remove conflicting `PUBLIC_SITE_URL` values, or follow the fresh-template migration below. After adopting the corrected starter, rebuild and inspect canonical, RSS, sitemap and social-image URLs with your deployment domain. The theme package remains 0.7.0; the corrected starter was delivered as `2ede266`.

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

### Decoder and virtual terminal (0.18.0)

The matching starter adds `src/pages/[lang]/decoder.astro`. `theme.enableDecoderPage` defaults to true, independently of `enableAboutPage`; disable it to omit all localized decoder pages and the About dialog link. No `/decoder/` alias is generated. The quick dialog now clones a shared `DecoderWorkbench` template rather than serialized form HTML; upgrade package and starter route/runtime validator together. Text codecs, local crypto tasks, numeric reveal, actions, pipeline and window shell/controller are separate shared modules. Crypto dependencies load only on an explicit crypto operation; no RPC/API configuration is introduced.

The read-only About terminal additionally requires the starter-owned `src/pages/[lang]/terminal/[id].json.ts` route alongside the matching theme package. This static route supplies localized source-text files on demand; package upgrades alone do not add a new project route. Keep the About page and new route aligned through the starter upgrade workflow.

The matching Decoder Lab route now also renders static localized usage guidance and WebApplication metadata. Its enabled-only footer link is supplied by ThemeFrame; disabling `enableDecoderPage` removes both the route and its entries. About and the standalone route share the numeric reveal’s total 1.5–3 second timing (including 1.2 second crossfade), while each host supplies its own appearance. These animation parameters are internal module/CSS options, not new `site.config.ts` fields.
