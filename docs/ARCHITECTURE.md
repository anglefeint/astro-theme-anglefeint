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
- Shared chrome: `src/components/Header.astro`, `src/components/Footer.astro`

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
