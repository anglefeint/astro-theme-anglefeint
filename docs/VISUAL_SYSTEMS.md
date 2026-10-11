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

## Article mathematics

Global mathematics is enabled in the current starter. `packages/theme/src/styles/math.css` imports bundled KaTeX styles/fonts and inherits article text color. Display formulas own horizontal overflow within the prose width; inline formulas remain inline. The BlogPost head includes the stylesheet only when the math adapter is enabled, with false fallback for old adapters. No canvas/background effect or article width contract changes. HTML plus MathML preserves accessible output; formula subtrees are excluded only from Pagefind, not accessibility. Nine-language browser checks cover 320, 390, 721 and 1440 px widths. Formula syntax, disabled-state MDX behavior and migration are user-guide concerns, not additional visual toggles.

This theme uses four distinct atmospheres by route.

## Nine-language layout validation

The built-in locales use horizontal LTR. Narrow article panels include padding and borders in their width, long prose paths can wrap, and inactive link-preview pseudo-elements do not create horizontal overflow. These local layout fixes retain the scene effects. New-language browser coverage exercises Home, Blog, About and article pages at 1280, 390 and 320 pixels.

## Reading-panel width caps

Above 720px, Home reserves its existing two 2rem paddings and two 1px borders in `max-width`; article prose reserves its two 2em paddings and borders. Both keep their 720px content-width cap on wide screens. Existing <=720px rules, cinematic effects and animations are unchanged; no global overflow clipping is introduced. The nine-language browser regression covers Home and a representative article at 320/390/720/721/740/768/800/820/900/1440px and asserts the wide-screen content width.

## Shared social menus

Optional per-link `rel` changes static anchor semantics only; it does not affect colors, layout or interaction. No platform automatically receives `me`, and both new-window protection tokens remain present.

The shared footer groups copyright, optional localized theme/Astro credits and optional custom `site.tagline` separately, with social icons below. Content is capped at 720px; credits and custom text use smaller type, wrap on narrow screens and inherit the scene's chrome palette. Empty text and disabled credits do not reserve a row. The existing global tagline/environment override stays unchanged across languages; only built-in credits follow the page locale via `ThemeFrame` and the existing messages resolver. The legacy `Built with Astro.` tagline is still suppressed to avoid duplicate credits. No new client script or configuration field is needed.

Header and footer use the same configured order. The twelve built-in SVGs retain `currentColor` and existing menu hover colors; custom images use a fixed square box with `object-fit: contain` and retain source colors. Text-only links have readable line height and wrap. Footer menus wrap. Header menus stay in one horizontally scrollable row so fixed headers do not grow over page content; desktop headers with four or more links allocate remaining space to the controls. Keyboard links have a visible focus outline and can scroll into view. Header social links remain hidden at <=720px; footer links remain available. Empty configuration keeps three non-interactive placeholders. This does not alter the four scene effects.

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
- home-effects.js coordinates one rain loop and independent mirror/rabbit/passage controllers. Initialization and resume are idempotent; hidden pages pause, live reduced-motion changes update behavior, persisted history pages retain state, and non-persisted pagehide aborts listeners and disposes resources. Rabbit assignments and repaired-mirror state remain stable on cached returns, while reload creates fresh state. ests/e2e/home-effects-lifecycle.spec.mjs covers single-loop ownership, cached-page lifecycle and live motion preferences.
- A local upper-right cracked mirror samples the live background rain into a bounded WebGL surface. A crooked seam and two staggered branches form four broad shards; seam tint reads the panel border color, while independent shard offsets, rotation and magnification visibly break the alignment of rain columns across seams. These seams and shard refraction transition into slow liquid distortion and silver folds under a fine-pointer hover; exit restores the cracks. The surface has a keyboard-accessible repair button and sits behind content. Clicking stitches the shard offsets back together over 0.85 seconds, fades back to ordinary panel glass, then removes its input listeners and releases GPU resources for the remainder of the visit; refresh restores the cracks. Reduced motion repairs immediately. It uses a 30fps shared rain clock and at most 1.5 DPR, and exposes idempotent disposal to the shared lifecycle entry. Same-sized texture updates reuse storage via texSubImage2D. Reduced motion retains a static cracked surface without hover flow; unavailable WebGL omits it.
- Canvas character rain (`packages/theme/src/scripts/home-matrix.js`)
- Green-tinted glass panel with scanline overlays
- Home keeps the original plain introduction and compact post-row spacing, without extra labels or numbered archive markers. Post hover/keyboard focus adds only a faint local green tint, preserving the original > marker without a side signal line, with no movement or enlarged link target. The all-posts link has no prompt/cursor or resting underline; a text-width underline reveals on hover/focus. Decorations are pointer-transparent, preserving selection and native links. Reduced motion removes transitions while retaining static feedback.
- Post-row fine-pointer hover or keyboard focus reveals a small binary-to-white-rabbit decoration immediately after the title text, anchored by a zero-width inline decoration. A 1-second Canvas decode uses independently moving binary particles with local glow and pale highlights: the three post rows and all-posts link receive a shuffled, non-repeating assignment of scatter, falling code, horizontal reconstruction and left-to-right scan on each home-page load, stable during that visit, then end in a stationary monochrome SVG rabbit. The fourth mode is a left-to-right scan decode with a luminous vertical sweep and progressively settling particles; it can appear on any of the four entries, including the localized all-posts link (English: `View All Posts`). All four entries share `HomeWhiteRabbit.astro` and the same bounded canvas lifecycle. Rendering is capped at 30 fps and stops after reveal, pointer exit, loss of focus, resize or page hiding; no title width, row height or click target is changed. Generated digits and an aria-hidden, pointer-transparent, unselectable SVG keep copied text and accessible link names intact. Mobile uses a smaller inline icon; reduced motion shows the rabbit directly.
- Matrix passage module boundaries: `matrix-corridor.js` is the compatibility entry point; `matrix-passage/scene.js` assembles the scene; `geometry.js` provides CPU face/box/curve/ellipsoid writers and point transforms; `materials.js` creates shared-font texture canvases with explicit flow roles; `renderer.js` owns WebGL shaders, uploads, draw calls and idempotent disposal. `corridor.js` builds the first corridor, `attachments.js` its cables, `door.js` the opaque frame and separately animated leaf, `square.js` the open ground, and `crows.js` randomized spaced bird meshes. Bench and Oracle remain independent builders linked by a seat anchor. `timeline.js` owns camera/door sampling and duration constants; the navigation loop supplies one elapsed clock for all code flow. Builders accept an injected random source for reproducible geometry. Crow body, head/neck, two leg, two independent wing and tail meshes are packed once into a separate material-batched group with per-vertex origin, scale, phase and part attributes. `crow-motion.js` supplies GPU articulation for staggered pecking, alert head turns, bounded walking, occasional short hops, backward head turns for preening, asymmetric wing stretches and quick feather ruffles. Per-bird phase and cadence vary; each three-slot block randomly places one bounded walk/skip-hop trip among two resting slots. Resting slots use duration-limited weighted gestures: 1–3 discrete pecks followed by head-up pauses, 2–3-second preening, roughly 1-second stretches and half-second feather shakes. Maintenance gestures cannot repeat in adjacent slots; head scans settle between turns, and quiet observation fills unused time. Alert head raising/tilting and tail flicks remain small secondary gestures. World movement follows facing direction, holds its destination during resting gestures, and stays within reserved bird/bench clearance; meshes are never rebuilt during animation. Crows have a pale-green minimum body luminance and brighter glyph accents to remain visible against floor code; they do not feed the wall/door bloom mask. First-corridor wall panels have a separate render group: their code columns move at independent speeds in locally grouped upward/downward bands, with short pale heads, green trails and softly blended world-space bright/dark patches; `wall-signals.js` generates eight independent moving character clusters per wall (four large, four small), uploaded once as shader uniforms. Each cluster spans multiple glyph rows/columns and has coherent signed motion, a pale character center and additive soft green glow independent of the dark base texture; it is evaluated on actual wall geometry so perspective and occlusion remain consistent. The first-corridor floor has a separate group with bidirectional longitudinal flow (toward the exit is brighter, with sparse featured lanes over a darker base); ceiling code flows in mixed forward/backward world-space lanes with independent speeds, softer light pulses and continuous longitudinal UVs. Attachments have independent light amplification against a darker rear-left wall, and continuous world-scaled wall UVs preserve glyph size across shallow irregular recesses, with only two sparse projections instead of pillars on every panel edge. `code-rain.js` owns shared column motion, heads, trails and patch lighting; `rain-profiles.js` supplies independent corridor/door parameters. The door uses leaf-local coordinates, slower mixed-direction columns, three small coherent signals and reduced glow; the latch area is dimmed as a stable reference. Door rotation remains independent of the rain profile. Frame code is stationary and the silver knob retains its original UVs. Square and Oracle flow retain their own behavior. The opaque doorway wall excludes the outer frame footprint; frame fronts, backs and reveals form a physical rim rather than overlapping coplanar overlays. `camera.js` supplies standard perspective/view matrices with a fixed eye height and slight downward pitch; the round handle is fixed at the leaf’s vertical midpoint, near its latch edge. `signal-glow.js` renders a depth-tested signal-only mask at quarter resolution (one sixth on mobile), applies separable blur and composites it over the sharp scene. Only profiled wall/door signals contribute to bloom; GPU targets and programs are disposed with the renderer, and failed glow initialization retains basic wall emission.

- About adds an Oracle quick-action folder: each activation randomly selects Matrix green, Cyber ice-blue/purple, AI cold-blue/coral, or Hacker white/gray with warm-gold accents, extracted into `matrix-passage/palettes.js` from route CSS. About is predominantly monochrome, with minor green status/hover accents. The same 8-second passage reveals a continuously animated square without navigation; a subsequent click anywhere or Escape closes it, restores focus/scroll/inert state and disposes GPU resources. Reduced motion presents a static final scene. No visible close button is added. `matrix-passage/player.js` shares overlay, click-centered reveal and rendering lifecycle with Home; the renderer maps both scene and selective bloom into the chosen palette. Matrix bypasses recoloring, so homepage visuals remain unchanged when explicitly enabled. The Matrix glyph font face is shared via `styles/matrix-font.css` and loaded before Oracle textures are rasterized. On small screens Oracle remains reachable as a compact floating action while other sidebar folders retain their existing visibility.
- `theme.effects.enableHomePassage` defaults to false; disabling it preserves native link navigation without affecting homepage rain or hover effects. Home-only exit passage delegates article-title clicks on `.home-post-list` and binds the marked header Blog link. `home-passage.js` owns an 8-second overlay and normal document navigation. `matrix-corridor.js` uses dependency-free WebGL perspective-correct texture sampling, mipmaps and optional anisotropic filtering to render a finite corridor with individually recessed wall panels, protruding pillars, a single asymmetric Catmull-Rom cable bundle with slack loops and unequal dangling ends on the left, rounded ceiling conduits and ellipsoid couplings on the right, a shortened first corridor, a hinged door with a round silver knob reflecting green code and a brighter urban courtyard directly beyond the door, inspired by the Reloaded Oracle scene: a broad code-covered ground plane extending into darkness with no surrounding walls or ceiling, a three-dimensional slatted bench, a seated code figure seen from behind with a tailored neck/shoulder/back/hip torso and shoulder-curved UVs, whose readable texture samples flow down at varied column speeds with occasional pale highlights while its geometry stays still. Corridor and door code also flows slowly; floor code moves at a lower rate, while the silver knob stays stable and 18–27 articulated three-dimensional code crows with pointed beaks, folded wings, tapered long tails and thin legs, newly sampled spaced positions/orientations, staggered pecking and head turns, small walking motions, short hops, backward preening turns, independent wing stretches and feather ruffles. All surfaces share perspective and depth occlusion; no scenic billboard or residential facade is used. `matrix-passage/bench.js` and `oracle.js` own independent geometry builders, joined by a seat anchor supplied by the scene; they do not access WebGL or navigation. Homepage rain and passage share `matrix-glyphs.js` character/font definitions (Matrix Code NFI). Eight independently randomized textures combine dim fine underlying code with larger 19–30px prominent streams, dark recesses and local pale-green halos; floor and ceiling use separate textures. World-scaled repeating wall UVs keep doorway glyph density consistent with the corridor. A complete opaque wall partitioned around the outer frame occludes the courtyard around the doorway; the three-sided frame has separate front/back faces and side reveals, avoiding coplanar decorative overlays; the courtyard is larger and set farther back. The door pulls toward the viewer and clears the camera path as it approaches, revealing the digital square; the door starts opening at 3.5 seconds with the camera at depth 2.6, then the camera advances just 0.2 world units during the 1.5-second pull-open phase, then stops just before the threshold on the final frame and navigates immediately; the courtyard is scenery rather than another camera flight. Rendering is capped at 30 fps with reduced mobile canvas/texture resolution. After its first GPU frame is ready, the overlay reveals a 96×60px rectangular window centered on the click (link center for keyboard activation, clamped inside the viewport). A clip-path expands the four window edges to the viewport linearly over 2.5 seconds while opacity rises from 0.08 to 1 on the same animation clock, without scaling the canvas or distorting perspective; the existing homepage stays visible outside the window, and camera travel starts after expansion. The doorway view remains visible until navigation. Modified clicks, new-window/download links and reduced motion retain native navigation; unavailable WebGL or initialization failure navigates normally, with a 9.5-second navigation fallback. Pagehide/pageshow remove the overlay and dispose GPU resources for history restoration. The all-posts link is outside this effect.
- Home's selectable terminal intro sequentially shares one grid position. `Initialize...` types over 1.5 seconds after a 0.25-second delay, its cursor blinks for 2.5 seconds, then disappears for 1 second. At 5.25 seconds, the cursor advances one preserved space and types `done.` slowly over 0.85 seconds. After a 1.5-second cursor pause, the startup line fades out over 1 second (7.6–8.6 seconds). Only then does `Wake Up...` type over 0.8 seconds in the same position; its cursor ends at 11.25 seconds, waits 2 seconds, and continues with a space and `Follow The White Rabbit...` over 1.35 seconds. The final cursor ends at 16.8 seconds. The grid preserves content position; cursor blinking has finite iteration counts, and narrow screens wrap naturally. Reduced motion shows only the completed wake/rabbit message without cursors.
- The canvas combines a dense distant layer (13px glyphs), the original 22px rain and sparse near columns (32px glyphs), with different brightness and speeds for depth. Each column keeps a 14–23 glyph trail and a 0.75–1.3 speed multiplier. Leading glyphs glow; trails avoid per-glyph blur. A short green signal travels around the content panel border during the first half of a 6-second CSS animation cycle, then rests. A masked conic gradient confines it to the 2px edge; the pseudo-element is pointer-transparent and omitted under reduced motion. Configured FPS/DPR caps, pointer-transparent background, pointer glow and reduced-motion opt-out are retained; foreground text and selection remain unchanged.

## 2) Blog List (`body.cyber-page`)

- Cyberpunk archive mood (rain, haze, glow)
- Most effects are CSS-driven in `packages/theme/src/styles/theme-cyber.css`
- `src/components/CyberAtmosphere.astro` mounts the rain/dust layers and initializes their distribution through `src/scripts/cyber-rain-dust.js`. The blog variant retains the original CSS appearance.
- Paginated card grid for posts
- Card covers have blue/pink reflected-light gradients at their bottom corners and a luminous lower edge, using the existing image overlay. Reflection strengthens on hover or keyboard focus. Rain, spotlight, ambient flicker and particle parameters retain their original values.

## Article share image template

`packages/theme/src/social/render.mjs` produces a static 1200×630 card with bundled code rain, terminal planes and a cyan/pink network core over a dark blue grid. Site name, title and author are generated from user content. A localized reading-area gradient protects wrapped titles while keeping the artwork vivid below; its extent estimates glyph width, including CJK. The bottom-right `Theme by Anglefeint` label follows `theme.footer.showCredits` (default true), and is omitted when false. The artwork itself contains no editorial text or brand signature. It is independent of the page hero and does not add navigation or client effects. Titles scale with length; beyond 120 grapheme clusters they are shortened only on the image. Site/author labels are also bounded. Bundled Noto CJK covers the default Latin/CJK languages; arbitrary emoji and other scripts are not guaranteed.

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

Direct body paragraphs and the signature use `white-space: pre-line`: actual line feeds in configured text remain visible, consecutive line feeds leave blank lines, and ordinary long text still wraps. This does not parse Markdown/HTML or create additional paragraph elements. The rule does not target headings, list items, sidebar labels or modal content.

- Hacker/terminal profile page
- Modal-driven right sidebar tools; below 900px the existing folder tools stay hidden, while the independent Oracle button remains reachable at the lower right. Oracle selects a route-derived palette at click time without immediately repeating the previous choice, restores scroll/focus/inert state on click or Escape dismissal, and retains a static preview under reduced motion.
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

Player scene styles are separated into `packages/theme/src/styles/music-scenes/{matrix,cyber,hacker,ai}.css`. The parent shell selects a scene through `components/shared/music-scenes.ts`; `MusicDeck.astro` loads only that stylesheet alongside common `music-deck.css` and exposes `data-scene`. Home and blog-list effects therefore have independent files. Base/unknown shells use common styling. Matrix alone loads `music/effects/host.js` and `music/effects/matrix.js`: a shallow green hover reflection follows fine pointers, PLAY emits a single 1.1-second expanding ring, and real playing state adds a static soft glow with a 500ms transition. Text/controls remain stationary and selectable; the decorative layer has no pointer events. Touch omits hover reflection; reduced motion hides the layer, and hidden pages/destroy stop pending frames and ripples. No continuous simulation, audio analyser or coupling to code rain is added. Other scenes, track mood precedence and playback behavior are preserved. See Architecture's music scene separation for the module lifecycle contract.

The default-off music deck restores the legacy terminal panel: layered shell-colored glass gradients, scan grid, inset borders, twin status LEDs, separate STATE/SIGNAL rows, pill controls and numbered playlist cards. It sits at the lower left, separating it from article controls on the right, while retaining the legacy desktop dimensions. The compact mode retains the track title, luminous progress rail and previous/play/next controls. A transparent native range input overlays the gradient progress fill and radial glowing thumb for keyboard and touch seeking. The footer includes mute/restore-volume and a volume slider. Visible control captions retain the original English device labels; accessible control names and playback feedback use the locale registry. Desktop sessions initially open expanded and remember collapse preference. At widths up to 720px, each page starts compact, and entering this breakpoint also collapses the deck. The compact width reserves room for return-to-top at the lower right; expanding the deck temporarily hides that button, and collapsing restores its normal scroll-dependent visibility. Mobile positioning respects safe-area insets. This coordination is CSS-only and does not couple playback to article scripts.

Scoped music-deck selectors isolate the chrome from page styles, including home-page list markers. The panel scrolls within the viewport on short screens; mobile controls retain the legacy padding and progress rail dimensions. Twin LEDs breathe continuously, with a reduced-motion opt-out. Playback/core/storage remain independent of this presentation and do not call page-effect scripts.

The music deck displays `LOCKED` with a localized click-to-continue message when automatic session resume is blocked; media errors remain `OFFLINE`. Session resume does not change navigation or page-effect lifecycles.

Both the deck's overflow area and its playlist use thin shell-accent scrollbars with transparent tracks, explicitly overriding inherited page scrollbar colors. Scoped WebKit scrollbar rules provide a fallback for browsers without standard scrollbar styling support.

The music palette inherits the shell’s `--chrome-*` variables: Matrix green, Cyberpunk pink/ice blue, AI ice blue/pink, and Hacker terminal green/neutral text. Hacker maps its hover token to the primary accent because its active-link token is neutral; Cyberpunk uses the link token for its secondary light. Panel tint, controls, selected tracks, progress glow and scrollbars derive from the same local music variables. Standalone decks retain fallback colors; no playback script or user configuration is needed.

On Hacker/About, the deck also follows the terminal panel’s neutral border, black surface, monospace type and compact corners. Green remains on playback/status accents and interactive highlights instead of tinting the whole frame; LED animation and the other shells are unchanged.
