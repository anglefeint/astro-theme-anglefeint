---
doc_id: architecture
doc_role: reference
doc_purpose: Source-of-truth architecture map for layouts, shells, routing, and SEO.
doc_scope: [architecture, routing, seo, config]
update_triggers: [architecture-change, config-change]
source_of_truth: true
sync_targets: [README.md, CLAUDE.md]
---

# Architecture Notes

## Stack

- Framework: Astro 7 (root `package.json` declares the compatible range; `package-lock.json` records the resolved version)
- Content: Astro Content Collections (`md` + `mdx`)
- Styling: package-owned plain CSS files + Astro scoped component styles (not CSS Modules)
- Output: static build (`astro build`)

## Runtime Model

- Most pages are statically generated at build time.
- Interactivity is implemented with lightweight vanilla scripts in:
  - `packages/theme/src/scripts/` (theme-shared runtime)
  - `src/scripts/` (starter-owned page runtime)
    (bundled via Vite modules).
- No API routes and no SSR runtime required.
- Blog post side monitor runtime is stateful and event-driven in `packages/theme/src/scripts/blogpost/red-queen-tv.js` (`initRedQueenTv`), called by `packages/theme/src/scripts/blogpost-effects.js`.

## Layered Theme Architecture

The project now follows a compositional structure:

1. Shared chrome

- `packages/theme/src/components/shared/ThemeFrame.astro`
- `packages/theme/src/components/shared/CommonHeader.astro`
- `packages/theme/src/components/shared/CommonFooter.astro`
- Responsibility: shared HTML skeleton, head metadata, navigation, footer.

2. Theme shells

- `packages/theme/src/layouts/shells/BaseShell.astro`
- `packages/theme/src/layouts/shells/AiShell.astro`
- `packages/theme/src/layouts/shells/CyberShell.astro`
- `packages/theme/src/layouts/shells/HackerShell.astro`
- `packages/theme/src/layouts/shells/MatrixShell.astro`
- Responsibility: route atmosphere container, theme body class, background layers, theme-specific script/style hooks.

3. Page layouts

- `packages/theme/src/layouts/BasePageLayout.astro`
- `packages/theme/src/layouts/AiPageLayout.astro`
- `packages/theme/src/layouts/CyberPageLayout.astro`
- `packages/theme/src/layouts/HackerPageLayout.astro`
- `packages/theme/src/layouts/MatrixPageLayout.astro`
- Responsibility: thin composition layer for page generation and custom routes.

4. Business pages

- `src/pages/**`
- Responsibility: content query, pagination, locale pathing, page-specific DOM/behavior.

## Content Pipeline

The collection implementation is [packages/theme/src/content-schema.ts](../packages/theme/src/content-schema.ts), re-exported by the starter's [src/content.config.ts](../src/content.config.ts). Article schema fields `tags?: string[]`, `toc?: boolean` and `search?: boolean` feed the capabilities below. Their global defaults are enabled in `src/site.config.defaults.ts` and mapped to `THEME.TAGS/TOC/SEARCH.ENABLED` by the theme adapter. Tags are trimmed/deduplicated by tag utilities when consumed, not rewritten by the collection schema.

### Article search

- Static search: `packages/theme/src/search.mjs` exports an Astro integration registered by starter `astro.config.mjs`. After build it runs Pagefind on the generated output, limited to article panels with `data-anglefeint-search` and their `data-pagefind-body` regions (title, subtitle, body). Frontmatter `search: false` excludes an article; `theme.search.enabled` disables UI and indexing together. The package owns the Pagefind dependency and exports; no new starter support script is required. A generated manifest lists indexed languages so empty sites and languages return no results. `Search.astro` and `scripts/search.js` own the lazy client UI. Dev mode displays a notice; build + preview tests the deployed behavior.

### Article contents

- Article routes pass `render(post).headings` to `BlogPost`. `ArticleToc.astro` renders Markdown h2/h3 anchors using native details/navigation elements, sticky in the right gutter on wide screens and before the body on narrow screens; it adds no client script. `theme.toc.enabled` is the default, overridden by optional article frontmatter `toc`. Missing headings render no contents, preserving custom layout compatibility. An h3 without an earlier h2 stays at the root; h1 resets the parent. This is article navigation, not a separate route, scroll-spy or automatic heading numbering.

- Collection entry: `src/content.config.ts` re-exports the package schema
- Content location: `src/content/blog/<locale>/`
- Key required fields: `title`, `description`, `pubDate`
- Optional fields include visual/AI metadata (`heroImage`, `aiModel`, `aiConfidence`, etc.)

## Routing

- `src/site.config.ts -> i18n.routing.defaultLocalePrefix` controls default-locale home routing
- `'never'`: `/` is canonical for the default locale and `/<default-locale>/` redirects back to `/` (noindex)
- `'always'`: `/<default-locale>/` is canonical and `/` redirects to it (noindex)
- These homepage redirects are generated HTML documents with meta refresh, canonical and `noindex, follow`, not server-side HTTP 301/302 responses implemented by the theme.
- Other locales are explicit via `/:lang/`
- Blog list: `/:lang/blog` (paginated)
- Blog post: `/:lang/blog/[slug]`
- Tag directory: `/:lang/tags/`; tag archive: `/:lang/tags/<tagSlug>/`, subsequent pages `/:lang/tags/<tagSlug>/N/` (only when tags are enabled)
- About page: `/:lang/about` (feature-toggled)
- RSS: `/:lang/rss.xml`
- Language switcher behavior:
  - Preserves the current route when switching locales.
  - For blog detail/pagination, if the target-locale page does not exist, it falls back to that locale's blog index.
  - For tag archives, an exact case-sensitive label match goes to that language's first archive page; otherwise it goes to its tag directory. It does not preserve the current pagination number or translate tag labels.

## Configuration Surface

- `src/site.config.ts`: single user-facing config entry
- `src/site.config.schema.ts`: internal config types and normalized config types
- `src/site.config.defaults.ts`: internal config defaults and `defineThemeConfig()`
- `src/site.config.runtime.ts`: internal config normalization helpers
- `src/site.config.ts -> i18n`: single locale registry, localized messages, hero copy, and About content
- `src/config/site.ts`: site adapter (env override + mapped exports)
- `src/config/theme.ts`: theme adapter (pagination, home latest count, About toggle, effect switches such as `enableRedQueen`)
- `src/config/about.ts`: About adapter selector (`getAboutConfig(locale)` from `src/site.config.ts -> i18n.locales`)
- `src/config/social.ts`: social adapter (header/footer social links)
- `packages/theme/src/config/*.ts`: package fallback defaults for non-starter/manual consumers

### Config Ownership Contract

- Source of truth for starter users is `src/site.config.ts`.
- Internal schema/default/normalize logic lives beside it in `src/site.config.schema.ts`, `src/site.config.defaults.ts`, and `src/site.config.runtime.ts`.
- App adapter files under `src/config/*` and `src/i18n/*` are generated/maintained integration glue for alias injection.
- Package defaults under `packages/theme/src/config/*` are fallback values and should not be treated as site-level runtime config in starter projects.
- Alias injection is still required: installing the package alone does not automatically resolve `@anglefeint/site-config/*` or `@anglefeint/site-i18n/*`. Manual consumers must supply mappings; package fallback files are not an automatic substitute for missing aliases.

### Adapter Sync Workflow

- Adapter templates live in `scripts/adapter-templates/*`.
- Starter/adapters file ownership is declared once in `scripts/starter-manifest.mjs`.
- Generated adapter targets are:
  - `src/config/*`
  - `src/i18n/*`
  - `src/types/theme-scripts.d.ts`
- Commands:
  - `npm run sync-adapters` to regenerate targets from templates
  - `npm run check:adapters` to verify alias and adapter contract
- Rule:
  - When changing adapter behavior, edit templates first, then sync, then run adapter checks.

### Installed Configuration Loading

- The post CLI and adapter smoke check use `packages/theme/src/scaffold/project-config.mjs` with Jiti to execute TypeScript config in both workspace and installed-package environments.
- The CLI consumes the site's exported normalization function when available; it does not parse source text to guess merged defaults.
- Explicit CLI locales take precedence over the environment override, then configured enabled locales. Config loading failures are reported before article files are created.
- An explicit locale override creates content files only; it does not add or enable locale configuration. Pages are generated only for `ENABLED_LOCALES`, so newly generated locale folders need matching site configuration to be reachable.
- Starter npm scripts are generated by `scripts/starter-package.mjs`; file ownership remains in `scripts/starter-manifest.mjs`. These generators only manage the upstream distribution, not customized user projects.

## SEO and Discovery

- Head metadata and hreflang: `packages/theme/src/components/BaseHead.astro`
- Page routes can pass `localeHrefs` through `ThemeFrame` so `<head>` alternate links use the same existence-aware locale fallback as the language switcher.
- Tag routes explicitly pass `includeAlternateLinks={false}` through `CyberShell` and `ThemeFrame` to `BaseHead`. They keep canonical metadata and UI language navigation, but omit hreflang links; tag label equality is not treated as proof of translated content.
- Open Graph and Twitter image metadata include alt text, defaulting to the page title when no explicit image alt is supplied.
- Sitemap integration: `@astrojs/sitemap` in `astro.config.mjs` (follows `defaultLocalePrefix` routing mode)
- robots.txt route: `src/pages/robots.txt.ts`

## Key Layout and Components

- **Sticky footer:** `body` uses flex column with `min-height: 100vh`; `main` uses `flex: 1` so footer stays at viewport bottom on short pages (2K/4K, blog with no articles).
- Home layout: `packages/theme/src/layouts/HomePage.astro`
- Post layout: `packages/theme/src/layouts/BlogPost.astro`
- Shared chrome: `packages/theme/src/components/shared/CommonHeader.astro`, `packages/theme/src/components/shared/CommonFooter.astro`
- Unified frame: `packages/theme/src/components/shared/ThemeFrame.astro`

## Theme Naming Contract

- Route theme names are now unified across CLI/layout/CSS/JS:
  - `base`
  - `ai`
  - `cyber`
  - `hacker`
  - `matrix`
- Internal selectors and scripts use the same prefixes (`ai-*`, `cyber-*`, `hacker-*`) to avoid naming drift.

## Blog Post Monitor Lifecycle

- DOM surface:
  - Container: `.rq-tv`
  - Stage: `.rq-tv-stage` (media sources via `data-rq-src`, `data-rq-src2`)
  - Replay control: `.rq-tv-toggle`
- Canvas lifecycle:
  - Create canvas on `startPlayback()`.
  - Destroy canvas after playback completion/collapse (`destroyCanvas()`).
- Suggested state model (for future refactors):
  - `idle` -> `loading` -> `revealed` -> `playing` -> `collapsing` -> `idle`
- Current guard rails:
  - Play token (`playToken`) cancels stale async branches.
  - Preload gate requires media readiness before reveal.
  - Retry + timeout prevents infinite waiting (`PRELOAD_RETRY_MAX`, `PRELOAD_TIMEOUT_MS`).
  - Hidden-tab behavior pauses progression and resumes safely.

## Blog Post Monitor Tuning Knobs

- Timing knobs (all in `initRedQueenTv`):
  - `OPEN_DELAY_MS`: a delay gate started by `queueAutoPlay()`; page load and idle readiness are separate gates checked alongside it.
  - `WARMUP_STATIC_MS`: TV static phase duration.
  - `FALLBACK_STEP_MS` / per-item `holdLast`: per-item hold timing.
  - `COLLAPSE_DELAY_MS`: delay before collapsing monitor after playlist completes.
- Reliability knobs:
  - `PRELOAD_RETRY_MAX`, `RETRY_BASE_MS`, `PRELOAD_TIMEOUT_MS`.
- Note:
  - For behavior changes, prefer adjusting these knobs before modifying decode/playback control flow.

## Build Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format:check
```

## Tag Archives

The blog list and both tag routes mount starter-owned `src/components/CyberAtmosphere.astro`, which owns rain/dust markup and imports `src/scripts/cyber-rain-dust.js`. Its tags variant tunes the shared CyberShell layers with scoped CSS while preserving the blog appearance. The component is managed by `scripts/starter-manifest.mjs`; visual and reduced-motion behavior is detailed in [Visual Systems](VISUAL_SYSTEMS.md#tag-browsing).

Starter routes `src/pages/[lang]/tags/index.astro` and `src/pages/[lang]/tags/[tag]/[...page].astro` use content collections and static pagination. `packages/theme/src/utils/tags.ts` owns case-sensitive normalization, deterministic filesystem-safe slug encoding, counting and grouping. Existing locale filtering/date ordering and page size are reused. `BlogCards.astro` preserves the blog list markup. `TagLinks.astro` owns directory/article navigation.

The `theme.tags.enabled` contract is mapped through the generated adapter. Disabled tags produce no archive routes or navigation. Empty locales retain an empty directory without a blog entry. Tag pages remain outside the Pagefind article root. Language navigation can fall back to another language's directory; tag archives pass `includeAlternateLinks=false` through CyberShell/ThemeFrame to BaseHead, avoiding unsupported translation claims while keeping canonical metadata. Other routes retain the previous default.

Grouping counts each article once per trimmed, case-sensitive label. Groups sort by descending article count, then label comparison; articles retain `postsForLocale()` date order and reuse `BLOG_PAGE_SIZE`. Safe lowercase names retain readable slugs, except Windows device names. Other labels use `~` plus UTF-8 hex; labels over 80 UTF-8 bytes use `~h` plus SHA-256. Slugs depend on the label, not group order. Renames change URLs; no tag translation registry or redirects are generated.

## Article Copy and Image Preview

Article code copying is initialized by `blogpost/code-copy.js` before the existing post interactions. Labels come from `messages.codeCopy` on the prose root. Each pre/code pair is wrapped once; buttons and live statuses are siblings excluded from Pagefind. Clipboard text comes exclusively from code.textContent.

The selector is `.ai-prose-body[data-code-copy] pre > code`; inline code and code outside that article body are unaffected. Clipboard writes use `navigator.clipboard.writeText`, with localized failure feedback and a two-second status reset. There is no fallback copy API, per-article toggle or separate copy dependency.

Article image preview is owned by `blogpost/image-preview.js`, initialized once per prose root. It creates a native modal dialog only when unlinked images exist, copies the current image source and alt text, locks document scrolling while open, and restores focus without scrolling on close. Labels use `messages.imagePreview`.

Only images present inside the first `.ai-prose-body[data-image-preview]` at initialization are bound; descendants of links/buttons and the hero image are excluded. The displayed source is `currentSrc || src`: preview does not fetch a higher-resolution original or add pinch zoom, a gallery, next/previous controls or a configuration switch. Closing synchronously restores overflow/focus; a delayed native close event cannot unlock a newly reopened dialog. The removed demonstration article is not required: browser tests inject image fixtures without publishing test content.

## Code-to-Documentation Map

Follow the implementation column before editing a feature explanation. User-facing usage lives in README sections; visual details live in [VISUAL_SYSTEMS.md](VISUAL_SYSTEMS.md). These paths are the review entry points, not a claim that metadata checks validate their semantics.

| Capability                           | Implementation entry points                                                                                                                                                                                                               | Responsible explanation                                                                                              | Existing verification                                                                                                        |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Global and article switches          | [defaults](../src/site.config.defaults.ts), [adapter template](../scripts/adapter-templates/src/config/theme.ts), [schema](../packages/theme/src/content-schema.ts)                                                                       | Configuration Surface and Content Pipeline above; README Article Search / Article Contents / Tag browsing            | [project config tests](../tests/project-config.test.mjs), [installed starter checks](../scripts/check-installed-starter.mjs) |
| TOC generation and route wiring      | [article route](../src/pages/[lang]/blog/[...slug].astro), [TOC utility](../packages/theme/src/utils/article-toc.ts), [component](../packages/theme/src/components/ArticleToc.astro)                                                      | Article contents above; Visual Systems Blog Post                                                                     | [unit tests](../tests/article-toc.test.mjs), [browser tests](../tests/e2e/article-toc.spec.mjs)                              |
| Search index and exclusions          | [Astro config](../astro.config.mjs), [integration](../packages/theme/src/search.mjs), [BlogPost markup](../packages/theme/src/layouts/BlogPost.astro)                                                                                     | Article search above; package README Static article search                                                           | [index tests](../tests/search.test.mjs), installed starter checks                                                            |
| Search dialog and language isolation | [Search component](../packages/theme/src/components/Search.astro), [client script](../packages/theme/src/scripts/search.js), [messages](../packages/theme/src/i18n/messages.ts)                                                           | Visual Systems Shared header search                                                                                  | [browser tests](../tests/e2e/search.spec.mjs)                                                                                |
| Tag URLs, counts and pagination      | [tag utility](../packages/theme/src/utils/tags.ts), [directory route](../src/pages/[lang]/tags/index.astro), [archive route](../src/pages/[lang]/tags/[tag]/[...page].astro), [TagLinks](../packages/theme/src/components/TagLinks.astro) | Tag Archives above; Visual Systems Tag browsing                                                                      | [unit tests](../tests/tags.test.mjs), [browser tests](../tests/e2e/tags.spec.mjs), installed starter checks                  |
| Tag SEO exception                    | Tag routes above; [BaseHead](../packages/theme/src/components/BaseHead.astro), [ThemeFrame](../packages/theme/src/components/shared/ThemeFrame.astro)                                                                                     | SEO and Discovery above                                                                                              | Tags browser tests; installed starter checks                                                                                 |
| Code copy                            | [script](../packages/theme/src/scripts/blogpost/code-copy.js), [prose styles](../packages/theme/src/styles/ai/prose.css)                                                                                                                  | Article Copy and Image Preview above; Visual Systems Code copy                                                       | [browser tests](../tests/e2e/code-copy.spec.mjs)                                                                             |
| Image preview                        | [script](../packages/theme/src/scripts/blogpost/image-preview.js), [post styles](../packages/theme/src/styles/blog-post.css)                                                                                                              | Article Copy and Image Preview above; Visual Systems Image preview                                                   | [browser tests](../tests/e2e/image-preview.spec.mjs)                                                                         |
| Reading status and return to top     | [progress script](../packages/theme/src/scripts/blogpost/read-progress.js), post styles and TOC component above                                                                                                                           | Visual Systems Reading feedback                                                                                      | TOC browser tests                                                                                                            |
| Package/starter delivery             | [exports](../packages/theme/package.json), [starter manifest](../scripts/starter-manifest.mjs), [sync tool](../tools/maintainer/sync-starter.mjs)                                                                                         | [Packaging workflow](PACKAGING_WORKFLOW.md), [upgrade guide](../UPGRADING.md), [release runbook](PACKAGE_RELEASE.md) | [starter sync tests](../tests/starter-sync.unit.test.mjs), installed starter checks                                          |
