# Visual Systems

This theme uses four distinct atmospheres by route.

## 1) Home (`body.page-home`)

- Matrix-style terminal landing
- Canvas character rain (`public/scripts/home-matrix.js`)
- Green-tinted glass panel with scanline overlays

## 2) Blog List (`body.br-page`)

- Cyberpunk archive mood (rain, haze, glow)
- Most effects are CSS-driven in `src/styles/global.css`
- Paginated card grid for posts

## 3) Blog Post (`body.mesh-page`)

- AI-interface reading environment
- Mesh background, reading progress, reveal effects
- Hero canvas processing + side monitor effects via `public/scripts/blogpost-effects.js`
- Left monitor (`.rq-tv`) playback contract:
  - Auto run once after page load (`500ms` delayed start) when assets are ready.
  - Monitor opens only for playback, then collapses back to a small replay button.
  - Opening sequence starts with TV-style static/no-signal phase (`WARMUP_STATIC_MS`), then media playback.
  - Playlist is sequential (item 1 -> item 2), each item plays once per run, then monitor collapses.
  - Replay button uses loading/disabled state while media preloading is in progress.
  - Canvas is created on playback start and destroyed after playback ends (DOM teardown by design).
  - If preload fails or times out, playback is aborted and monitor stays collapsed.

## 4) About (`body.term-page`)

- Hacker/terminal profile page
- Modal-driven right sidebar tools
- Runtime text and modal content from `src/config/about.ts`
- Interaction script: `public/scripts/about-effects.js`

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
