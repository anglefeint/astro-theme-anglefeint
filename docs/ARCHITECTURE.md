---
doc_id: architecture
doc_role: architecture-source
doc_scope: [architecture, layouts, shells, components, routing, seo]
update_triggers: [architecture-change, layout-change, shell-change, seo-change, i18n-change]
source_of_truth: true
sync_targets: [README.md, CLAUDE.md]
---

# Architecture Notes

## Stack

- Framework: Astro 5
- Content: Astro Content Collections (`md` + `mdx`)
- Styling: global CSS + page CSS + scoped styles
- Output: static build (`astro build`)

## Runtime Model

- Most pages are statically generated at build time.
- Interactivity is implemented with lightweight vanilla scripts in `public/scripts/`.
- No API routes and no SSR runtime required.
- Blog post side monitor runtime is stateful and event-driven in `public/scripts/blogpost-effects.js` (`initRedQueenTv`).

## Layered Theme Architecture

The project now follows a compositional structure:

1. Shared chrome
- `src/components/shared/ThemeFrame.astro`
- `src/components/shared/CommonHeader.astro`
- `src/components/shared/CommonFooter.astro`
- Responsibility: shared HTML skeleton, head metadata, navigation, footer.

2. Theme shells
- `src/layouts/shells/BaseShell.astro`
- `src/layouts/shells/AiShell.astro`
- `src/layouts/shells/CyberShell.astro`
- `src/layouts/shells/HackerShell.astro`
- `src/layouts/shells/MatrixShell.astro`
- Responsibility: route atmosphere container, theme body class, background layers, theme-specific script/style hooks.

3. Page layouts
- `src/layouts/BasePageLayout.astro`
- `src/layouts/AiPageLayout.astro`
- `src/layouts/CyberPageLayout.astro`
- `src/layouts/HackerPageLayout.astro`
- `src/layouts/MatrixPageLayout.astro`
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

- `/` is canonical English home
- `/en/` redirects to `/` (noindex)
- Other locales are explicit via `/:lang/`
- Blog list: `/:lang/blog` (paginated)
- Blog post: `/:lang/blog/[slug]`
- About page: `/:lang/about` (feature-toggled)
- RSS: `/:lang/rss.xml`
- Language switcher behavior:
  - Preserves the current route when switching locales.
  - For blog detail/pagination, if the target-locale page does not exist, it falls back to that locale's blog index.

## Configuration Surface

- `src/config/site.ts`: site title, URL, author, description
- `src/config/theme.ts`: pagination, home latest count, About toggle
- `src/config/about.ts`: About copy and modal/effects text
- `src/config/social.ts`: header/footer social links

## SEO and Discovery

- Head metadata and hreflang: `src/components/BaseHead.astro`
- Sitemap integration: `@astrojs/sitemap` in `astro.config.mjs`
- robots.txt route: `src/pages/robots.txt.ts`

## Key Layout and Components

- **Sticky footer:** `body` uses flex column with `min-height: 100vh`; `main` uses `flex: 1` so footer stays at viewport bottom on short pages (2K/4K, blog with no articles).
- Home layout: `src/layouts/HomePage.astro`
- Post layout: `src/layouts/BlogPost.astro`
- Shared chrome: `src/components/shared/CommonHeader.astro`, `src/components/shared/CommonFooter.astro`
- Unified frame: `src/components/shared/ThemeFrame.astro`

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
```
