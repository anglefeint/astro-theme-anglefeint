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

## Design Intent and Change Principles

The product positioning is defined in [AGENTS.md](../AGENTS.md#product-identity-and-design-intent): lightweight, simple publishing with conspicuous cinematic character. The following describes creative intent; the route sections below describe implemented behavior.

| Atmosphere | Creative reference                          | Identity to preserve                                                                             |
| ---------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Matrix     | Matrix films                                | Green code rain, luminous terminal text and the sense of entering a digital world                |
| Cyberpunk  | Cyberpunk cinema, particularly Blade Runner | Clearly visible rain, sweeping light beams, halos, neon and Japanese night-market/street imagery |
| Hacker     | Hacker culture                              | Terminal typography, commands, files and tool-like interactions                                  |
| AI         | AI-product interfaces                       | Network visuals, monitors, system feedback and a futuristic reading environment                  |

The four scenes should remain distinct while sharing usable navigation and publishing features. Film-like impact is a core reason to choose this theme. "More cool" should mean stronger scene identity, expressive light/motion and cohesive interaction, rather than automatically making all effects quieter.

- Treat cyber rain, light beams and neon as signature scene elements. Do not reduce their visibility as a generic polish pass. The historical CSS explicitly names Blade Runner and describes its rain as dirty white rather than amber or cold cyan.
- Keep lightweight implementation and strong visual presence as simultaneous goals. Prefer efficient rendering, bounded resources and appropriate lifecycle management over erasing the visual identity. Do not assume an effect is expensive without checking its implementation or measuring it.
- Resolve concrete reading or interaction problems locally. Preserve accessible controls, mobile usability and reduced-motion alternatives; strong default atmosphere does not require forcing motion on every visitor.
- Compare visual changes in motion, including mobile, since a still screenshot cannot establish rain density, sweep timing or flicker rhythm. Explain any deliberate reduction in a signature effect before treating it as an improvement.
- Keep configuration and setup straightforward. Creative references guide design; they do not require adding every referenced motif, film asset or a new dependency.

## 1) Home (`body.page-home`)

- Matrix-style terminal landing
- Canvas character rain (`packages/theme/src/scripts/home-matrix.js`)
- Green-tinted glass panel with scanline overlays
- The existing canvas gives each column a 14–23 glyph trail and a 0.75–1.3 speed multiplier. Pale green-white leading glyphs have an 8px glow; green trail glyphs avoid per-glyph blur. Column spacing, configured FPS/DPR caps, pointer glow, visibility pause and reduced-motion opt-out are retained.

## 2) Blog List (`body.cyber-page`)

- Cyberpunk archive mood (rain, haze, glow)
- Most effects are CSS-driven in `packages/theme/src/styles/theme-cyber.css`
- `src/components/CyberAtmosphere.astro` mounts the rain/dust layers and initializes their distribution through `src/scripts/cyber-rain-dust.js`. The blog variant retains the original CSS appearance.
- Paginated card grid for posts
- Card covers have blue/pink reflected-light gradients at their bottom corners and a luminous lower edge, using the existing image overlay. Reflection strengthens on hover or keyboard focus. Rain, spotlight, ambient flicker and particle parameters retain their original values.

## Article share image template

`packages/theme/src/social/render.mjs` produces a static 1200×630 dark blue card with a subtle grid, title, site name and author. It is independent of the page hero and does not add navigation or client effects. Titles scale with length; beyond 120 grapheme clusters they are shortened only on the image. Site/author labels are also bounded. Bundled Noto CJK covers the default Latin/CJK languages; arbitrary emoji and other scripts are not guaranteed.

## Shared footer

The shared footer uses understated inherited-color Anglefeint and Astro links, separated by middle dots after the build year and site title. Text wraps naturally on narrow screens and links retain visible keyboard focus. `theme.footer.showCredits: false` removes both credits without hiding copyright or custom tagline text. There is no mandatory attribution banner or added animation.

## Shared header language selector

`packages/theme/src/components/shared/LangSwitcher.astro` groups the localized label and native select in a transparent, borderless layout wrapper. Only the select has a rounded border and background; its focus highlight remains visible. `CommonHeader.astro` supplies the select color variables.

## Shared header search

- Shared header search uses a native modal dialog with scoped `.angle-search` styles and a single client script. Its top-layer placement avoids page effects and fixed navigation overlays; the header uses a compact icon-only trigger. The dialog inherits route chrome accents (green on Home, purple on Blog List, blue on Blog Post), with a terminal-style caption, an underlined search field, subtle result separators and tinted highlights. Only the result region scrolls; mobile expands the dialog within the viewport. Keyboard focus enters the input and returns to the trigger on close. Clicking the backdrop closes search; clicks inside and drags starting inside do not dismiss it. Search resources load only on opening; request revisions suppress stale results. Current-language results show titles and safe excerpt highlights, with eight results loaded per batch. Loading, empty, retry and dev-only states are localized. The global switch omits the component and its script.

## 3) Blog Post (`body.ai-page`)

- A scoped `.ai-article-toc` panel uses an article-height right gutter rail at viewport widths of 1360px and above, preserving the centered body width. It sticks 6rem from the viewport top, below the fixed header, with a viewport-bounded scroll area for long lists, and stops at the article panel end. Below this breakpoint the same panel sits before the body in normal flow. Native `details` opens by default and supports keyboard collapse; a nested unnumbered list links to Astro's heading slugs. Long text wraps. Only Markdown h2/h3 are included; empty lists are omitted. There is no active-heading tracking script.

- AI-interface reading environment
- AI network background, reading progress, reveal effects
- The existing network canvas carries up to six simultaneous signal paths. Each bright signal travels along a graph edge, then creates an expanding ring at the destination. It reuses the 30fps loop and existing graph rather than adding a canvas or timer. Reduced motion omits signals; the existing hidden-tab pause remains.
- Hero canvas processing + side monitor effects via `packages/theme/src/scripts/blogpost-effects.js`
- Effect startup is phased:
  - Critical UI first (code copy and image preview, then read progress, hero static paint and interactions)
  - Non-critical effects deferred (`requestIdleCallback` / `load` fallback)
- Left monitor (`.rq-tv`) playback contract:
  - With reduced motion requested, the monitor is hidden and no playlist media is loaded. A plain image is not a static fallback because the source assets are animated.
  - Auto run once after startup gates are met: `delay + load + idle`.
  - Current base delay uses `OPEN_DELAY_MS = 2000` before gate evaluation.
  - Monitor opens only for playback, then collapses back to a small replay button.
  - Opening sequence starts with TV-style static/no-signal phase (`WARMUP_STATIC_MS`), then media playback.
  - Playlist items advance sequentially. With `ImageDecoder`, frames are decoded through a sequence; the fallback displays browser images for configured hold durations (GIF uses a minimum duration), rather than guaranteeing one full animation loop. The monitor then collapses.
  - Replay button uses loading/disabled state while media preloading is in progress.
  - Canvas is created on playback start and destroyed after playback ends (DOM teardown by design).
  - If preload fails or times out, playback is aborted and monitor stays collapsed.
  - Lifecycle and performance gates are documented here (technical contract); do not move this logic detail into `README.md`.

## 4) About (`body.hacker-page`)

- Hacker/terminal profile page
- Modal-driven right sidebar tools
- Runtime text and modal content from `src/site.config.ts -> i18n.locales.<code>.about` (selected via `src/config/about.ts`)
- Interaction script: `packages/theme/src/scripts/about-effects.js`
- Opening a tool resolves its modal title from decorative scrambled glyphs in 360ms and briefly lights the window edge. The real title stays available to assistive technology and reserves layout space; the animated duplicate is aria-hidden. Grapheme segmentation preserves localized text. Closing, reopening or reinitializing cancels the title timer; hidden documents finish on the next tick. Reduced motion and labels over 64 graphemes display immediately. Tool contents and controls are available without waiting for the decoration.

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
- These files are import-only aggregators. Feature rules live in plain CSS partials:
  - AI: `packages/theme/src/styles/ai/*`
  - About: `packages/theme/src/styles/about/*`
- The actual import order is:
  - AI: `base -> background -> hero -> prose -> controls -> related -> responsive`
  - About: `base -> background -> panel -> sidebar -> modals -> keyboard -> responsive`
- There is no CSS `@layer` declaration or `.module.css` isolation here. The cascade depends on import order and selector specificity; review overrides before reordering partials.
- Keep selectors, class names, and runtime JS query hooks stable during refactors to avoid visual regressions.

## Performance Notes

- `tests/e2e/cinematic-effects.spec.mjs` verifies rapid modal close/reopen, stable accessible titles and final decoded text, moving canvases in normal mode, and static/omitted effects under reduced motion. These are behavioral regression checks, not frame-rate or GPU benchmarks.
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

## Tag browsing

Tag archives use CyberShell and existing blog card/pagination styling. Directory links are uniform wrapping chips with counts. Blog navigation uses a compact All posts / Tags row only when tags exist. Article tags use the blue article palette, separate from the title's search-indexed text. No extra animation or client-side tag filtering is introduced.

The tag directory uses a centered 680px content column, a text return link, a title/count row with a subtle divider, and compact count badges. Both tag routes mount the starter-owned `src/components/CyberAtmosphere.astro` with `variant="tags"`, sharing the blog rain/dust initializer (48 drops and 22 particles). CyberShell still owns the spotlight, flicker, haze and glitch layers.

The tags variant applies an ice-blue/lavender palette through route-scoped CSS: spotlight opacity 0.42 with 18s/30s sweeps, rain opacity 0.7, dust opacity 0.45, subdued 10s glow flicker and an 18s glitch cycle. Effects remain visible without changing tag/card layout or the blog palette. Existing mobile particle thinning remains active. With reduced motion, tag pages hide rain/dust/glitch and stop the spotlight, glow, haze and body fog animations, retaining a static background. The shared component is included in the starter manifest; npm upgrades alone do not add it to existing projects.

## Code copy

Code copy buttons sit at the top-right of a relative wrapper, outside the horizontally scrolling pre. The existing runtime decoration and syntax highlighting remain. Buttons use 44px targets and localized live status messages; failures never show the success checkmark. The script preserves `code.textContent` rather than copying wrapper decorations; status resets after two seconds. These controls require JavaScript and a permitted Clipboard API context.

## Image preview

Article image preview uses a native top-layer dialog with a dark backdrop, a contained image, alt-text caption and 44px close target. Only body images outside links/buttons receive zoom-in cursors and Enter/Space activation; hero images are excluded. Escape, close button and a primary click starting on the backdrop dismiss it; clicking the image or dragging from it onto the backdrop does not. It restores document overflow and focuses the source image without scrolling. The same selected image source is displayed; there is no original-resolution lookup, gallery navigation or zoom gesture implementation. No images means no preview dialog is created.

## Reading feedback

About's `.hacker-toast` follows the same wide-screen placement as the article status: at 1360px and above, it sits 12px outside `.about-shell > .prose` and 1rem above the viewport bottom, with text wrapping within the gutter. `about/reading-ui.js` measures the panel on initialization, display, window resize and panel resize. Narrower viewports retain the right-corner position. Its existing 30/60/90% scroll milestones, localized messages and 1800ms display duration are unchanged; it is reading feedback, not loading status.

`blogpost/read-progress.js` calculates progress from document scroll height, not article loading or a network request. Once the scroll position exceeds 6px, each 10%, 30%, 60% and 90% milestone can display its localized stage message once per page initialization, for 1800ms. A restored scroll position can also pass this gate. The final message says output is finalized at the 90% threshold; it is decorative reading feedback.

At viewport widths of 1360px and above, `.ai-stage-toast` is fixed 12px outside the measured article panel right edge and 1rem above the viewport bottom, with text constrained to the gutter. Measurement runs on display, window resize and panel `ResizeObserver` updates. This positioning applies even when TOC is hidden. Narrow screens use the existing viewport-corner placement.

Return-to-top becomes visible after 400px of scroll and uses smooth scrolling unless reduced motion is requested. When a TOC rail exists at the wide breakpoint, the button sits 3rem from the right and `clamp(1rem, 8vh, 4rem)` from the bottom; the TOC scroll area reserves room above it. The underlying button placement remains in effect on narrower pages or pages without a rail. Source and regression entry points are listed in [Architecture's code-to-document map](ARCHITECTURE.md#code-to-documentation-map).

## Optional music deck

The default-off music deck restores the legacy terminal panel: layered teal/blue glass gradients, scan grid, inset borders, twin status LEDs, separate STATE/SIGNAL rows, pill controls and numbered playlist cards. It sits at the lower left, separating it from article controls on the right, while retaining the legacy desktop dimensions. The compact mode retains the track title, luminous progress rail and previous/play/next controls. A transparent native range input overlays the gradient progress fill and radial glowing thumb for keyboard and touch seeking. The footer includes mute/restore-volume and a volume slider. Visible control captions retain the original English device labels; accessible control names and playback feedback use the locale registry. Desktop sessions initially open expanded and remember collapse preference. At widths up to 720px, each page starts compact, and entering this breakpoint also collapses the deck. The compact width reserves room for return-to-top at the lower right; expanding the deck temporarily hides that button, and collapsing restores its normal scroll-dependent visibility. Mobile positioning respects safe-area insets. This coordination is CSS-only and does not couple playback to article scripts.

Scoped music-deck selectors isolate the chrome from page styles, including home-page list markers. The panel scrolls within the viewport on short screens; mobile controls retain the legacy padding and progress rail dimensions. Twin LEDs breathe continuously, with a reduced-motion opt-out. Playback/core/storage remain independent of this presentation and do not call page-effect scripts.

The music deck displays `LOCKED` with a localized click-to-continue message when automatic session resume is blocked; media errors remain `OFFLINE`. Session resume does not change navigation or page-effect lifecycles.
