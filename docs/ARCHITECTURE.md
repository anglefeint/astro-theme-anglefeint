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

- Framework: Astro 6 (beta track)
- Content: Astro Content Collections (`md` + `mdx`)
- Styling: package-owned CSS modules + scoped component styles
- Output: static build (`astro build`)

## Runtime Model

- Most pages are statically generated at build time.
- Interactivity is implemented with lightweight vanilla scripts in:
  - `packages/theme/src/scripts/` (theme-shared runtime)
  - `src/scripts/` (starter-owned page runtime)
    (bundled via Vite modules).
- No API routes and no SSR runtime required.
- Blog post side monitor runtime is stateful and event-driven in `packages/theme/src/scripts/blogpost-effects.js` (`initRedQueenTv`).

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

- Collection schema: `src/content.config.ts`
- Content location: `src/content/blog/<locale>/`
- Key required fields: `title`, `description`, `pubDate`
- Optional fields include visual/AI metadata (`heroImage`, `aiModel`, `aiConfidence`, etc.)

## Routing

- `src/site.config.ts -> i18n.routing.defaultLocalePrefix` controls default-locale home routing
- `'never'`: `/` is canonical for the default locale and `/<default-locale>/` redirects back to `/` (noindex)
- `'always'`: `/<default-locale>/` is canonical and `/` redirects to it (noindex)
- Other locales are explicit via `/:lang/`
- Blog list: `/:lang/blog` (paginated)
- Blog post: `/:lang/blog/[slug]`
- About page: `/:lang/about` (feature-toggled)
- RSS: `/:lang/rss.xml`
- Language switcher behavior:
  - Preserves the current route when switching locales.
  - For blog detail/pagination, if the target-locale page does not exist, it falls back to that locale's blog index.

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

## SEO and Discovery

- Head metadata and hreflang: `packages/theme/src/components/BaseHead.astro`
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
  - `OPEN_DELAY_MS`: auto-start delay after load.
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
