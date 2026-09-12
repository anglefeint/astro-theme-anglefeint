---
doc_id: visual_systems
doc_role: reference
doc_purpose: Route-level visual system contracts and style/runtime behavior reference.
doc_scope: [visual-system, architecture]
update_triggers: [architecture-change, script-change]
source_of_truth: true
sync_targets: [README.md, ASTRO_THEME_LISTING.md, CLAUDE.md]
---

# Visual Systems

This theme uses four distinct atmospheres by route.

## 1) Home (`body.page-home`)

- Matrix-style terminal landing
- Canvas character rain (`packages/theme/src/scripts/home-matrix.js`)
- Green-tinted glass panel with scanline overlays

## 2) Blog List (`body.cyber-page`)

- Cyberpunk archive mood (rain, haze, glow)
- Most effects are CSS-driven in `packages/theme/src/styles/theme-cyber.css`
- Runtime rain/dust distribution is initialized by `src/scripts/cyber-rain-dust.js`
- Paginated card grid for posts

## 3) Blog Post (`body.ai-page`)

- Shared header search uses a native modal dialog with scoped `.angle-search` styles and a single client script. Its top-layer placement avoids page effects and fixed navigation overlays; the header uses a compact icon-only trigger. The dialog inherits route chrome accents (green on Home, purple on Blog List, blue on Blog Post), with a terminal-style caption, an underlined search field, subtle result separators and tinted highlights. Only the result region scrolls; mobile expands the dialog within the viewport. Keyboard focus enters the input and returns to the trigger on close. Clicking the backdrop closes search; clicks inside and drags starting inside do not dismiss it. Search resources load only on opening; request revisions suppress stale results. Current-language results show titles and safe excerpt highlights, with eight results loaded per batch. Loading, empty, retry and dev-only states are localized. The global switch omits the component and its script.

- A scoped `.ai-article-toc` panel uses an article-height right gutter rail at viewport widths of 1360px and above, preserving the centered body width. It sticks 6rem from the viewport top, below the fixed header, with a viewport-bounded scroll area for long lists, and stops at the article panel end. While the rail exists, the back-to-top button sits 3rem from the right and clamp(1rem, 8vh, 4rem) from the bottom, inset from the corner to clear status notifications. The directory scroll area reserves space above the button. At the same wide-screen breakpoint, reading stage notifications sit 12px outside the actual article panel right edge, 1rem above the viewport bottom. Their position is measured on display and resize, and text wraps within the right gutter. Narrow screens retain the viewport-corner notification. Below this breakpoint the same panel sits before the body in normal flow. Native `details` opens by default and supports keyboard collapse; a nested unnumbered list links to Astro's heading slugs. Long text wraps. Only Markdown h2/h3 are included; empty lists are omitted.

- AI-interface reading environment
- AI network background, reading progress, reveal effects
- Hero canvas processing + side monitor effects via `packages/theme/src/scripts/blogpost-effects.js`
- Effect startup is phased:
  - Critical UI first (read progress, hero static paint, interactions)
  - Non-critical effects deferred (`requestIdleCallback` / `load` fallback)
- Left monitor (`.rq-tv`) playback contract:
  - With reduced motion requested, the monitor is hidden and no playlist media is loaded. A plain image is not a static fallback because the source assets are animated.
  - Auto run once after startup gates are met: `delay + load + idle`.
  - Current base delay uses `OPEN_DELAY_MS = 2000` before gate evaluation.
  - Monitor opens only for playback, then collapses back to a small replay button.
  - Opening sequence starts with TV-style static/no-signal phase (`WARMUP_STATIC_MS`), then media playback.
  - Playlist is sequential (item 1 -> item 2), each item plays once per run, then monitor collapses.
  - Replay button uses loading/disabled state while media preloading is in progress.
  - Canvas is created on playback start and destroyed after playback ends (DOM teardown by design).
  - If preload fails or times out, playback is aborted and monitor stays collapsed.
  - Lifecycle and performance gates are documented here (technical contract); do not move this logic detail into `README.md`.

## 4) About (`body.hacker-page`)

- Hacker/terminal profile page
- Modal-driven right sidebar tools
- Runtime text and modal content from `src/site.config.ts -> i18n.locales.<code>.about` (selected via `src/config/about.ts`)
- Interaction script: `packages/theme/src/scripts/about-effects.js`

## Naming Consistency

- Theme class and effect prefixes are aligned:
  - AI: `ai-*`
  - Cyber: `cyber-*`
  - Hacker: `hacker-*`
- This keeps CLI theme names, layout names, CSS selectors, and JS selectors in sync.

## CSS Organization Contract

- Style entry files:
  - `packages/theme/src/styles/theme-ai.css`
  - `packages/theme/src/styles/about-page.css`
- These files are import-only aggregators. Feature rules live in layered partials:
  - AI: `packages/theme/src/styles/ai/*`
  - About: `packages/theme/src/styles/about/*`
- Layer order is fixed and must not be reordered without review:
  - `base -> layout -> components -> states -> responsive`
- Cross-layer overrides are discouraged. If unavoidable, keep them local and add a short comment explaining the dependency.
- Keep selectors, class names, and runtime JS query hooks stable during refactors to avoid visual regressions.

## Performance Notes

- Heavy effects are concentrated on post/about pages.
- Large media assets (e.g. Red Queen visuals) may impact low-end devices.
- Keep `prefers-reduced-motion` support consistent when adding new animations.
- Favor compressed media (`webp`) and avoid large GIFs where possible.
- Blog post side monitor is guarded by preload readiness + retry/timeout logic to avoid half-play and rapid collapse on unstable networks.
- In-session memory reuse is preferred over repeated re-fetching during replay.

## Responsive Notes

- Main content widths are constrained with max-width patterns.
- Mobile breakpoints currently center around `720px`, `840px`, `900px`.
- Validate pagination and modal layouts when increasing post volume.
