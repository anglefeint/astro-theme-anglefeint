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

Homepage switches in `src/site.config.ts`: `theme.home.showInitialize` controls the Initialize/done sequence, `showFollow` controls Wake Up/Follow, and `showTrace` controls the lower-right terminal status. All default to `true`; set each to `false` to hide it independently. The adapter maps these flags to `THEME.HOME`. Explicit startup/message CSS classes avoid selector ambiguity when one sequence is absent. With startup disabled, Wake Up begins immediately and Follow retains its relative pause. No dynamic JavaScript character/width calculation or client-side switch logic is added; the fixed text retains CSS width/steps animations. Disabled sections are omitted during Astro rendering, so their text and cursor animations do not exist in the generated page. These switches do not disable the background rain, mirror or rabbit effects.

## Stack

- Framework: Astro 7 (root `package.json` declares the compatible range; `package-lock.json` records the resolved version)
- Content: Astro Content Collections (`md` + `mdx`)
- Styling: package-owned plain CSS files + Astro scoped component styles (not CSS Modules)
- Output: static build (`astro build`)

The default output directory is `dist/`. Deploy its contents to a static web root with directory-index support (`/<locale>/blog/` resolves to its `index.html`). Cloudflare is the demo's hosting choice, not a runtime dependency; no Node.js server is required in production. Set the production origin before building (including any `PUBLIC_SITE_URL` override), and rebuild after content/configuration changes. Optional GA4, Giscus and externally hosted audio still make their own browser requests.

## Article statistics

`src/utils/metrics.ts` estimates from `post.body`, not rendered HTML or an AI service. It removes triple-backtick code, inline code, HTML tags, Markdown images and complete Markdown links (including link text), strips selected punctuation and collapses whitespace. Han/Hiragana/Katakana/Hangul characters count individually; remaining whitespace-separated chunks count as words. This regex heuristic is not linguistic segmentation and does not specially remove formula or MDX expression source.

With `safeWords = max(words, 1)`, tokens are `round(safeWords * 1.3)` and reading minutes are `max(1, ceil(safeWords / 220))`. Latency/confidence fallbacks are deterministic visual estimates from the same count, not measured inference time or model confidence. The article route independently prefers supplied frontmatter `wordCount`, `tokenCount`, `readMinutes`, `aiLatencyMs` and `aiConfidence`; overriding wordCount does not recalculate the other fallbacks. BlogPost formats counts at 1,000 and above with one decimal and `k`. The current tokens label does not explicitly say estimated; documentation must not present it as real model usage. No AI API is called for these values.

## Article mathematics

`astro.config.mjs` selects the package's `@anglefeint/astro-theme/markdown` processor with `THEME.MATH.ENABLED`, normalized from the global `theme.math.enabled` setting (default true). `packages/theme/src/markdown.mjs` retains Sätteri and replaces only parsed math/inlineMath nodes with KaTeX HTML plus MathML at build time; MDX inherits the same processor. Disabled math leaves ordinary Markdown/MDX parsing in place. The plugin fails with file context on invalid formulas and excludes formula subtrees from Pagefind to prevent duplicate representations; surrounding prose is unaffected. This does not render frontmatter titles/descriptions, RSS summaries or social-card text.

`BlogPost.astro` conditionally links `styles/math.css`, which bundles local KaTeX fonts/styles and constrains display overflow. Its missing-adapter fallback is false so package-only upgrades of old skeletons do not start loading formula CSS before migration. New adapters default to true. Dependencies and processor exports are package-owned; schema/defaults, adapter templates and Astro wiring are starter-owned. Existing manifest entries cover all changed starter files; new processor files are distributed through the npm package files/exports, not copied into starter. There is no per-post toggle or browser formula engine.

Coverage: `tests/math.unit.test.mjs` (syntax, MDX, escaping, disabled behavior, errors), `tests/e2e/math.spec.mjs` (nine locales, local stylesheet, MathML and mobile scrolling), and `scripts/check-installed-starter.mjs` (real MD/MDX content in enabled and disabled installed builds). Migration is documented in `UPGRADING.md`.

## Runtime Model

### Hidden homepage status

`HomePage.astro` retains the configured `theme.home.showTrace` row in the initial markup. `styles/home-page.css` reserves its layout space but independently hides the left pirate signal and right trace, including their glow and the trace cursor. Fine-pointer hover reveals only the hovered item. `scripts/home-effects.js` listens for `selectionchange` and `pageshow` through its existing AbortSignal, setting `data-selected` independently on each item intersected by a non-collapsed range and removing it on disposal. Select-all reveals both; selecting one reveals only that item. The non-text block cursor follows only the trace, without a new timer or rendering loop. Hover uses CSS; selection-driven reveal requires the initialized home script. Reduced motion keeps the revealed cursor static. The main panel's bottom padding is 0.8rem on desktop and 0.75rem on mobile. The archive row has no bottom margin and the status row has a 0.15rem top margin, keeping the ALL/status gap compact while preserving the 44px archive-link target. `tests/e2e/home-status.spec.mjs` covers independent hover/selection, select-all, stable geometry, compact bottom spacing and mobile selection under reduced motion; native mobile long-press handles are not automated.

### Music scene separation

`MusicDeck.astro` defaults `initiallyCollapsed` to true, so its initial HTML already has the compact layout, track-title caption and matching OPEN/ARIA state. The default initial-state attribute keeps each new page compact even when session storage records an expanded deck; callers can pass false for an expanded entry on desktop or mobile. `ThemeFrame` forwards `musicInitiallyCollapsed` to this prop; it is not a new site-config field. Explicit false also prevents the narrow-screen breakpoint from forcing collapse on resize or BFCache restoration. `music/controller.js` retains manual expansion, mobile breakpoint handling and the latest saved presentation on BFCache restoration. Playback position, volume and resume intent are independent of the page-entry presentation. `scripts/check-music-browser.mjs` checks all four scenes before JavaScript and with an existing expanded session, alongside playback/navigation/seek coverage.

`ThemeFrame.astro` resolves the parent shell's class tokens through `components/shared/music-scenes.ts` and passes `scene` to `MusicDeck.astro`. Supported scenes are `base`, `matrix`, `cyber`, `hacker`, and `ai`; unknown shells and standalone decks use base. Selection is independent of locale paths and track mood. Blog lists and tag archives intentionally share Cyber because they use the same shell.

`styles/music-deck.css` owns shared layout, controls, responsive behavior and track mood rules. The four `styles/music-scenes/*.css` files own scene presentation/effects. `MusicDeck` emits only the selected scene stylesheet after the base stylesheet, and exposes `data-scene` for scoped rules. Scene selectors keep low specificity so track moods preserve their existing precedence. These files are package-owned and already covered by package distribution; no starter file or configuration field is added. Playback (`music/core.js`), session state (`music/storage.js`) and control binding (`music/controller.js`) do not depend on scene modules.

`MusicDeck.astro` selects the optional runtime URL separately from playback; currently only Matrix mounts `music/effects/host.js` and `music/effects/matrix.js`. The host reads the existing `data-status`/`data-collapsed` attributes, observes presentation changes and calls the scene module's `mount(root)`, `setState(snapshot)` and `destroy()` contract. It handles visibility, pagehide/pageshow (including BFCache), late import cancellation and observer cleanup on `music:destroy`; visual failures do not disable playback. No scene branch is added to the audio controller/core and no page-background script is imported.

Matrix uses a pointer-transparent decorative layer for a local hover reflection and a one-shot play-button ripple. Pointer changes are coalesced into an animation frame; transform/opacity animate the decorative layer without changing text or controls. Hidden pages, reduced motion and destruction stop active work. Playback adds a static glow that fades on pause. This is state-driven, not audio-frequency analysis. `src/pages/preview-player/[scene].astro` provides a main-checkout-only dev preview with generated test audio, using ThemeFrame's `music` slot to replace the configured deck without duplication; its production `getStaticPaths` is empty and it is not starter-consumed. Validation: music unit tests, build/scaffold checks and browser hover/play/pause/selection/reduced-motion/mobile/destroy checks.

The main checkout's `src/site.config.ts` configures the public demo. `starterSourcePath()` in `scripts/starter-manifest.mjs` maps the distribution destination `src/site.config.ts` to `scripts/starter-templates/site.config.ts.template`. Both maintainer synchronization (including drift detection) and independent installed-starter checks use that mapping. The same source-override mechanism distributes consumer-oriented `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/00-repo.mdc` and all nine README metadata sidecars from `scripts/starter-templates/`. Consumer instructions describe personal-blog tasks and contain only local document relationships; the main checkout retains its maintainer instructions and metadata. Other managed files retain their source paths. Consumers edit `src/site.config.ts` with neutral title/domain/author defaults. Template source files themselves are not distributed. Installed and remote-template checks validate the delivered guide entries through `scripts/check-starter-guidance.mjs`.

`CommonFooter.astro` reads `THEME.FOOTER.SHOW_CREDITS`, normalized from `theme.footer.showCredits` (default true). Disabling it omits theme/Astro links, retaining build-year/site-title copyright and any custom `site.tagline`. The default tagline is empty; the former default `Built with Astro.` is treated as built-in credit to avoid duplication. The optional About email link is omitted when `contact.email` is empty.

- Most pages are statically generated at build time.
- Matrix passage models are separated into `scripts/matrix-passage/bench.js` and `oracle.js`. They receive geometry writers and named material roles; the bench exposes an `oracleSeat` anchor consumed by the scene. Oracle geometry is written directly into its own render group. `scripts/matrix-glyphs.js` owns the shared character pool and Matrix Code NFI font stack used by the homepage rain and passage textures.
- Interactivity is implemented with lightweight vanilla scripts in:
  - `packages/theme/src/scripts/` (theme-shared runtime)
  - `src/scripts/` (starter-owned page runtime)
    (bundled via Vite modules).
- No production API server or SSR runtime is required. Share-image endpoints are prerendered to static PNG files.
- Blog post side monitor runtime is stateful and event-driven in `packages/theme/src/scripts/blogpost/red-queen-tv.js` (`initRedQueenTv`), called by `packages/theme/src/scripts/blogpost-effects.js`.

`home-effects.js` is the Matrix shell's sole startup and lifecycle entry. WeakMap-backed controllers expose idempotent start/pause/resume/dispose; the entry coordinates visibility, live reduced-motion changes and pagehide/pageshow. Persisted history pages pause without disposing, while actual teardown aborts listeners, cancels frames/timers and frees canvas/GPU resources. `home-matrix.js` owns rain and a frame subscription set; it does not construct the mirror. `home-mirror.js` samples that rain through a bounded offscreen texture, using texSubImage2D for same-sized updates. Repair unregisters its frame subscriber and releases its texture, buffer, program, shaders and canvas backing stores. `home-rabbit-decode.js` owns four short local decoders and retains shuffled assignments across pause/resume; `home-passage.js` owns optional link interception and clears any active player/fallback on pause or disposal.

Matrix passage module boundaries: `matrix-corridor.js` is the compatibility entry point (default Matrix palette); `matrix-passage/player.js` shares overlay, inline rendering and clock between homepage navigation, the terminal preview and About Oracle exploration; `palettes.js` supplies four route-derived palettes, recoloring scene and bloom only for non-Matrix presets; `about/oracle.js` owns click-time random selection excluding the previous palette, Escape/close-button dismissal, focus/scroll restoration and reduced-motion static preview; `matrix-passage/scene.js` assembles the scene; `geometry.js` provides CPU face/box/curve/ellipsoid writers and point transforms; `materials.js` creates shared-font texture canvases with explicit flow roles; `renderer.js` owns WebGL shaders, uploads, draw calls and idempotent disposal. `corridor.js` builds the first corridor, `attachments.js` its cables, `door.js` the opaque frame and separately animated leaf, `square.js` the open ground, and `crows.js` randomized spaced bird meshes. Bench and Oracle remain independent builders linked by a seat anchor. `timeline.js` owns camera/door sampling and duration constants; the navigation loop supplies one elapsed clock for all code flow. Builders accept an injected random source for reproducible geometry. Crow body, head/neck, two leg, two independent wing and tail meshes are packed once into a separate material-batched group with per-vertex origin, scale, phase and part attributes. `crow-motion.js` supplies GPU articulation for staggered pecking, alert head turns, bounded walking, occasional short hops, backward head turns for preening, asymmetric wing stretches and quick feather ruffles. Per-bird phase and cadence vary; each three-slot block randomly places one bounded walk/skip-hop trip among two resting slots. Resting slots use duration-limited weighted gestures: 1–3 discrete pecks followed by head-up pauses, 2–3-second preening, roughly 1-second stretches and half-second feather shakes. Maintenance gestures cannot repeat in adjacent slots; head scans settle between turns, and quiet observation fills unused time. Alert head raising/tilting and tail flicks remain small secondary gestures. World movement follows facing direction, holds its destination during resting gestures, and stays within reserved bird/bench clearance; meshes are never rebuilt during animation. Crows have a pale-green minimum body luminance and brighter glyph accents to remain visible against floor code; they do not feed the wall/door bloom mask. First-corridor wall panels have a separate render group: their code columns move at independent speeds in locally grouped upward/downward bands, with short pale heads, green trails and softly blended world-space bright/dark patches; `wall-signals.js` generates eight independent moving character clusters per wall (four large, four small), uploaded once as shader uniforms. Each cluster spans multiple glyph rows/columns and has coherent signed motion, a pale character center and additive soft green glow independent of the dark base texture; it is evaluated on actual wall geometry so perspective and occlusion remain consistent. The first-corridor floor has a separate group with bidirectional longitudinal flow (toward the exit is brighter, with sparse featured lanes over a darker base); ceiling code flows in mixed forward/backward world-space lanes with independent speeds, softer light pulses and continuous longitudinal UVs. Attachments have independent light amplification against a darker rear-left wall, and continuous world-scaled wall UVs preserve glyph size across shallow irregular recesses, with only two sparse projections instead of pillars on every panel edge. `code-rain.js` owns shared column motion, heads, trails and patch lighting; `rain-profiles.js` supplies independent corridor/door parameters. The door uses leaf-local coordinates, slower mixed-direction columns, three small coherent signals and reduced glow; the latch area is dimmed as a stable reference. Door rotation remains independent of the rain profile. Frame, reveal and surrounding wall code flows; the silver knob retains static material UVs. Square and Oracle flow retain their own behavior. The opaque doorway wall excludes the outer frame footprint; frame fronts, backs and reveals form a physical rim rather than overlapping coplanar overlays. `camera.js` supplies standard perspective/view matrices with a fixed eye height and slight downward pitch; the round handle is fixed at the leaf’s vertical midpoint, near its latch edge. `signal-glow.js` renders a depth-tested signal-only mask at quarter resolution (one sixth on mobile), applies separable blur and composites it over the sharp scene. Only profiled wall/door signals contribute to bloom; GPU targets and programs are disposed with the renderer, and failed glow initialization retains basic wall emission.

## Shared terminal and Oracle passage

The homepage terminal and About Oracle use the same [player](../packages/theme/src/scripts/matrix-passage/player.js), [facade](../packages/theme/src/scripts/matrix-corridor.js), [scene builder](../packages/theme/src/scripts/matrix-passage/scene.js), materials, renderer and camera/door timeline. They create separate instances when activated, not separate implementations. Home's [lifecycle entry](../packages/theme/src/scripts/home-effects.js) only manages the keyhole trigger, cancellation, CSS expansion/fades and the bounded inline cache. About's [wrapper](../packages/theme/src/scripts/about/oracle.js) manages palette selection, modal accessibility and closing. MatrixShell exposes a named `signal-monitor` slot outside the reading panel.

The terminal first creates corridor-only geometry using quality resolved once from its final canvas size; compact views use 256px textures and simpler cable meshes. Clicking the projected door appends missing courtyard/Oracle/crow buffers to that renderer without replacing textures or programs. Closed-door frames skip those rear groups in both color and glow-mask passes while retaining their buffers. Reverse travel samples the existing timeline; fixed-position drag-to-look changes orientation only. A short rear hall with four side-door pairs and a right-angle elbow replaces the distant straight extension. See [Visual Systems](VISUAL_SYSTEMS.md#1-home-bodypage-home) for exact input and timing behavior.

Home pauses on pointer exit and requires another explicit activation to resume; its single retained instance expires after 15 seconds. Resize and pagehide dispose it. About closes and releases its instance through Escape, × or pagehide. Shared rendering caps drawing at 30fps and pauses while the page is hidden. Reduced motion skips the key animation and uses static views. These are resource-budget choices, not a guarantee of smoothness or absence of leaks on every GPU.

Regression ownership: [passage timeline/camera/geometry tests](../tests/passage-timeline.unit.test.mjs), [terminal message fallback test](../tests/home-transmission.test.mjs) and [Home/About browser lifecycle tests](../tests/e2e/home-effects-lifecycle.spec.mjs). No new starter runtime files are introduced; the existing manifest already owns the changed message adapter template and its generated target. Both package and starter adapter updates are required for the new message fallback.

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

## Shared component boundaries

Reusable UI remains package-owned; starter consumes it through the theme package rather than copying runtime implementations. Component markup and base CSS, browser behavior, and page-specific adapters have distinct ownership.

- `components/shared/NetworkBackdrop.astro` owns its SVG fallback, base CSS import and browser entry. `scripts/effects/network-background.js` accepts the SVG element and returns cleanup; the independent entry handles mounting, optional failures and page lifecycle. Decoder only composes the component. The old DecoderNetwork component/module remain forwarding adapters. Palette custom properties provide presentation overrides.
- `components/shared/WindowShell.astro` imports `styles/window-shell.css` and exposes body/actions slots. `scripts/window-controller.js` owns window behavior; About injects tool content and close handling, with tool skins kept in `styles/about/modals.css`. The existing class names remain compatible.
- `scripts/effects/lifecycle.js` isolates optional initialization and runs reverse-order cleanup even after a disposer fails. About modules mount independently and release the shared decoder clock last. Home signal preview interaction lives in `scripts/home-signal-preview.js`; scene rendering remains in matrix-passage. About title reveal lives in `scripts/effects/title-reveal.js`.
- Article modules return disposers and own listeners, timers, frames, idle callbacks, observers and image callbacks through local effect scopes. The entry cancels deferred starts on disposal, cleans up before Astro swaps and non-cached exits, and replaces its previous mount on reinitialization. Cached documents retain modules and existing visibility-based pause/resume behavior.
- Music remains one deck and one session per document. The DOM bootstrap delegates to `mountMusicDeck(root)`; core/storage, the session key, source-URL identity and resume behavior are preserved. The exported mount function is not a promise of simultaneous independent player sessions.
- Terminal renderer/session/filesystem/controller remain separate from About activation/layout. The shared Matrix passage engine remains separate from Home preview and About Oracle adapters. These boundaries need no directory-only migration or starter copies.

## Social links

Optional `SocialLink.rel` is passed through the existing schema/adapter without migration. `utils/social-links.ts` validates it as a string, normalizes case/HTML whitespace, deduplicates tokens, removes conflicting `opener` and retains `noopener noreferrer`. `SocialMenu.astro` renders the resolved value in static header/footer anchors. `me` is never inferred from an icon or domain. Built-in, custom-image and text links share the behavior. Identity verification uses the actual page containing the backlink; the root meta-refresh page has no shared menus. No route, SEO head or redirect changes are introduced.

`social.links` passes unchanged through the generated social adapter to both shared menus. `utils/social-icons.ts` owns the twelve icon paths and the shared SocialLink type; starter schema imports/re-exports that type. No icon library or client script is added. `utils/social-links.ts` resolves optional `iconSrc` during rendering against Astro's actual `publicDir`, verifies containment/file existence and the SVG/PNG/WebP extension, then prefixes Astro's `base`. Remote URLs, query/fragment/encoded paths and traversal are rejected with an indexed configuration error. Custom images override built-ins; otherwise unknown icon names fail clearly and omitted icons render text. Empty links keep the original placeholders. Image contents are served as ordinary images, not injected markup.

## Content Pipeline

The collection implementation is [packages/theme/src/content-schema.ts](../packages/theme/src/content-schema.ts), re-exported by the starter's [src/content.config.ts](../src/content.config.ts). Article schema fields `tags?: string[]`, `toc?: boolean` and `search?: boolean` feed the capabilities below. Their global defaults are enabled in `src/site.config.defaults.ts` and mapped to `THEME.TAGS/TOC/SEARCH.ENABLED` by the theme adapter. Tags are trimmed/deduplicated by tag utilities when consumed, not rewritten by the collection schema.

### Article share images

This implementation is included in 0.5.0 with its matching starter. The complete bundled font is approximately 16.4 MB; no font download, system-font lookup or dynamic subsetting is performed during generation.

`packages/theme/src/social-image.mjs` injects the prerendered `social/endpoint.ts` route at `/_social/[key].png` and provides the resolved public directory via a virtual module. Starter `astro.config.mjs` registers the integration. `theme.socialImage.enabled` defaults to true and maps through the generated theme adapter. The endpoint includes configured-locale blog entries without `ogImage`; identical render inputs share a file. `social/model.mjs` hashes template version, title, author, site, locale and the resolved credit visibility. Template/font changes must bump that version.

`BlogPost.astro` resolves explicit `ogImage` (article-relative Astro image, public path, or HTTPS URL) before generation, then falls back to `heroImage` when disabled. This only changes head imagery; the visible hero remains independent. `AiShell -> ThemeFrame -> BaseHead` passes the result to Open Graph, Twitter and article JSON-LD. Public paths are checked for containment/existence and use a byte-derived query revision. Remote URLs are not fetched or validated by the generator. Local imported images use Astro's asset pipeline.

`social/render.mjs` uses Satori and Sharp with a package-bundled Noto CJK font and its license, resolved from package exports. The package also bundles `assets/theme/social/network-core.webp` (about 91 KiB), composited locally beneath the text. Both `BlogPost` and the PNG endpoint pass `THEME.FOOTER?.SHOW_CREDITS ?? true`; false removes the bottom-right `Theme by Anglefeint` label and changes the generated URL. Custom `ogImage` takes priority and is never stamped. No browser font or generator script is added. The font increases install size; per-article PNG generation increases build time. `tests/social-image.unit.test.mjs` covers rendering and resolver behavior; `scripts/check-installed-starter.mjs --build --audit` validates packed assets, all default locales, metadata, custom images and disabled output. Custom article layouts using BlogPost should correspond to blog collection entries or supply `ogImage` explicitly.

### Article search

- Static search: `packages/theme/src/search.mjs` exports an Astro integration registered by starter `astro.config.mjs`. After build it runs Pagefind on the generated output, limited to article panels with `data-anglefeint-search` and their `data-pagefind-body` regions (title, subtitle, body). Frontmatter `search: false` excludes an article; `theme.search.enabled` disables UI and indexing together. The package owns the Pagefind dependency and exports; no new starter support script is required. A generated manifest lists indexed languages so empty sites and languages return no results. `Search.astro` and `scripts/search.js` own the lazy client UI. Dev mode displays a notice; build + preview tests the deployed behavior.

### Article contents

- Article routes pass `render(post).headings` to `BlogPost`. `ArticleToc.astro` renders Markdown h2/h3 anchors using native details/navigation elements, sticky in the right gutter on wide screens and before the body on narrow screens; it adds no client script. `theme.toc.enabled` is the default, overridden by optional article frontmatter `toc`. Missing headings render no contents, preserving custom layout compatibility. An h3 without an earlier h2 stays at the root; h1 resets the parent. This is article navigation, not a separate route, scroll-spy or automatic heading numbering.

- Collection entry: `src/content.config.ts` re-exports the package schema
- Content location: `src/content/blog/<locale>/`
- Key required fields: `title`, `description`, `pubDate`
- Optional fields include visual/AI metadata (`heroImage`, `aiModel`, `aiConfidence`, etc.)

## Built-in languages

The terminal's author message is the specific exception to normal UI translation fallback. `getMessages(locale)` in [the message adapter template](../scripts/adapter-templates/src/i18n/messages.ts) resolves `home.transmission` from that locale's explicit `messages.home.transmission`, then the explicit `en` configuration, then the package's single `Knock, knock.` constant. It uses normalized locale entries directly so an absent English entry cannot alias the default locale. Built-in locale messages and other configured fallback languages cannot override this order; empty strings are explicit overrides. All other message fields retain the normal merge chain. Edit `src/site.config.ts`, regenerate adapters from their template when updating the starter, and rebuild after changing text.

Optional `i18n.locales.<code>.site.homeTitle` is preserved by `src/site.config.runtime.ts`. The generated site adapter's `getHomeTitle(locale)` reads trimmed non-empty headings in `getLocaleResolutionChain` order, then returns `SITE_TITLE`, including its environment override. `HomePage.astro` uses this value only for its escaped-text h1; page metadata and shared site identity keep the global title. No per-language default heading is injected, and user-added locales use the same path. The source adapter is `scripts/adapter-templates/src/config/site.ts`; regenerate with `sync-adapters`. Existing starter manifest entries already distribute the schema, runtime and adapter. Package and matching starter must be delivered together. Configuration tests cover custom locales, blank/missing values, explicit fallbacks and unchanged global identity.

The matching starter enables `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru` and `zh-hant`. English remains the default; old route keys are unchanged. Region/script route keys are lowercase, while HTML language and hreflang metadata use `pt-BR` and `zh-Hant`. All built-in languages use horizontal LTR layout. Traditional Chinese uses `zh_TW` for Open Graph and `zh-TW` for Giscus; Brazilian Portuguese uses `pt_BR` and Giscus `pt`. Giscus follows the page only when its configured language is empty.

The UI registry is package-owned; enabled locales and localized default About text are starter-owned. The new-post CLI creates one localized skeleton per enabled locale (nine initially), not translations. Starter contains four guides per language; main contains fourteen articles per language. New README translations and content are explicitly included in the starter manifest.

## Routing

- `src/site.config.ts -> i18n.routing.defaultLocalePrefix` controls default-locale home routing
- `'never'`: `/` is canonical for the default locale and `/<default-locale>/` redirects back to `/` (noindex)
- `'always'`: `/<default-locale>/` is canonical and `/` redirects to it (noindex)
- These homepage redirects are generated HTML documents with meta refresh, canonical and `noindex, follow`, not server-side HTTP 301/302 responses implemented by the theme.
- Other locales are explicit via `/:lang/`
- Language menu labels come from `i18n.locales.<code>.meta.label`. The default `zh` label is `简体中文`; users can override it in `src/site.config.ts` without changing the `zh` route key or SEO locale metadata.
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

### Optional Google Analytics 4

`analytics.googleAnalyticsId` is a top-level setting in `src/site.config.ts`, typed/defaulted by the adjacent schema/defaults files and mapped to `THEME.ANALYTICS.GOOGLE_ANALYTICS_ID` by `scripts/adapter-templates/src/config/theme.ts`. The default and package fallback are empty. `GoogleAnalytics.astro`, included after the head slot in `ThemeFrame.astro`, validates the measurement ID with `utils/analytics.ts` and emits the inline `scripts/google-analytics.js` loader only for a nonempty ID in production builds. Missing adapter fields remain disabled. This does not change BaseHead, SEO or i18n routing.

The loader skips localhost, `.localhost`, IPv4 loopback, IPv6 loopback and `0.0.0.0`; remote and LAN previews still track. It preserves an existing dataLayer/gtag, queues `js` and one `config` command, then appends the asynchronous official Google tag. Normal full-page navigation supplies subsequent page views. There is no manual page_view, client-router listener, language dimension, consent banner, automatic Consent Mode setup or new dependency. Synchronous inline consent defaults in the head slot precede this initialization; sites requiring consent management must arrange it before enabling the option. Other independently installed analytics tags are the site's responsibility.

`tests/analytics.unit.test.mjs` checks validation, local guards, duplicate initialization and queue preservation. `scripts/check-installed-starter.mjs --build` checks all nine built-in languages with six default locales: GA is enabled in the `always` prefix fixtures and disabled in the `never` fixtures. Home, blog and article HTML are checked in both states; About HTML is checked in the enabled fixtures, while the disabled fixtures also disable About itself. This is not an independent cross-product of GA and routing switches. Shared custom layouts using ThemeFrame inherit tracking; standalone HTML/redirect documents do not.

- `src/site.config.ts`: single user-facing config entry
- `src/site.config.schema.ts`: internal config types and normalized config types
- `src/site.config.defaults.ts`: internal config defaults and `defineThemeConfig()`
- `src/site.config.runtime.ts`: internal config normalization helpers
- `src/site.config.ts -> i18n`: single locale registry, localized messages, hero copy, and About content
- `src/config/site.ts`: site adapter (env override + mapped exports)
- `src/config/theme.ts`: theme adapter (pagination, home latest count, About toggle, effect switches such as `enableRedQueen`)
- `src/config/about.ts`: About adapter selector (`getAboutConfig(locale)` from `src/site.config.ts -> i18n.locales`)
- `src/config/social.ts`: social adapter (header/footer social links)
- Shared header navigation is implemented as Home, Blog and optional About in `CommonHeader.astro`; labels are localizable, but there is no arbitrary navigation-link array. `new-page` creates page routes without adding a header entry.
- `packages/theme/src/components/shared/SocialMenu.astro`: both header and footer show Mastodon/Twitter/GitHub non-clickable placeholders when the social list is empty; a non-empty list renders only its configured links. Main's demo config supplies X, Mastodon and GitHub links; the neutral starter defaults to an empty list. About contact links and footer theme/Astro credits are configured separately.
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

- Build-time origin: `astro.config.mjs` calls `scripts/resolve-site-url.mjs` before Astro resolves `site`. It uses Vite `loadEnv` for the CLI mode (`dev`: development; build/preview/sync: production; `--mode` overrides it), rooted beside the config. `PUBLIC_SITE_URL` from the process environment takes precedence over dotenv files, then the configured site URL is used. This is necessary because `import.meta.env` is not populated during Astro config evaluation. Vite is a direct starter dependency for this build-time helper; no browser dependency is added. `tests/site-url.unit.test.mjs` covers fallback, dotenv modes and process precedence. Custom programmatic Astro invocations should pass their intended `site` explicitly rather than relying on CLI argument detection.
- Head metadata and hreflang: `packages/theme/src/components/BaseHead.astro`
- `BlogPost` automatically resolves SEO alternates from the blog collection for standard `/<locale>/blog/<slug>/` routes, matching only enabled, existing same-slug translations. It passes that map through `AiShell` → `ThemeFrame` → `BaseHead`, separately from the route's language-menu `localeHrefs` fallbacks. An explicit `seoLocaleHrefs` prop overrides discovery, including an empty map. Unrecognized custom routes or missing current entries resolve to an empty map rather than guessed translations. `BaseHead` uses the map for hreflang and OG alternate locales; missing default-language translations omit `x-default`. Canonical URLs and blog-list pagination retain their behavior. The shared head's legacy fallback remains available to other callers that omit an SEO map.
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

Home switches and footer links follow [configuration types](../src/site.config.schema.ts) → [defaults](../src/site.config.defaults.ts) → [adapter template](../scripts/adapter-templates/src/config/theme.ts) → generated `src/config/theme.ts` → [HomePage](../packages/theme/src/layouts/HomePage.astro) / [CommonFooter](../packages/theme/src/components/shared/CommonFooter.astro). [Homepage CSS](../packages/theme/src/styles/home-page.css) owns startup/message timing and trace cursor behavior. Package fallback config lives in `packages/theme/src/config/theme.ts`; consumer schemas and adapters remain starter-owned. See README configuration, the nine-language optional-features tutorials and [migration](../UPGRADING.md#0150-home-switches-and-footer-links). Existing [adapter checks](../scripts/check-adapter-contract.mjs) and [scaffold checks](../scripts/check-scaffold.mjs) validate structure; they do not assert every visual state or prove the new options work with an old installed package. Current local browser evidence is separate from released-version acceptance. Local acceptance in `acceptance-results/home-switches-preview.mjs` checked all eight flag combinations and retained visible main content; `home-terminal-config-preview.mjs` checked desktop/mobile status, cursor blinking and reduced motion. These ignored local scripts are evidence for this work, not permanent regression tests.

Follow the implementation column before editing a feature explanation. User-facing usage lives in README sections; visual details live in [VISUAL_SYSTEMS.md](VISUAL_SYSTEMS.md). These paths are the review entry points, not a claim that metadata checks validate their semantics.

| Capability                           | Implementation entry points                                                                                                                                                                                                                                         | Responsible explanation                                                                                              | Existing verification                                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Global and article switches          | [defaults](../src/site.config.defaults.ts), [adapter template](../scripts/adapter-templates/src/config/theme.ts), [schema](../packages/theme/src/content-schema.ts)                                                                                                 | Configuration Surface and Content Pipeline above; README Article Search / Article Contents / Tag browsing            | [project config tests](../tests/project-config.test.mjs), [installed starter checks](../scripts/check-installed-starter.mjs) |
| TOC generation and route wiring      | [article route](../src/pages/[lang]/blog/[...slug].astro), [TOC utility](../packages/theme/src/utils/article-toc.ts), [component](../packages/theme/src/components/ArticleToc.astro)                                                                                | Article contents above; Visual Systems Blog Post                                                                     | [unit tests](../tests/article-toc.test.mjs), [browser tests](../tests/e2e/article-toc.spec.mjs)                              |
| Search index and exclusions          | [Astro config](../astro.config.mjs), [integration](../packages/theme/src/search.mjs), [BlogPost markup](../packages/theme/src/layouts/BlogPost.astro)                                                                                                               | Article search above; package README Static article search                                                           | [index tests](../tests/search.test.mjs), installed starter checks                                                            |
| Search dialog and language isolation | [Search component](../packages/theme/src/components/Search.astro), [client script](../packages/theme/src/scripts/search.js), [messages](../packages/theme/src/i18n/messages.ts)                                                                                     | Visual Systems Shared header search                                                                                  | [browser tests](../tests/e2e/search.spec.mjs)                                                                                |
| Tag URLs, counts and pagination      | [tag utility](../packages/theme/src/utils/tags.ts), [directory route](../src/pages/[lang]/tags/index.astro), [archive route](../src/pages/[lang]/tags/[tag]/[...page].astro), [TagLinks](../packages/theme/src/components/TagLinks.astro)                           | Tag Archives above; Visual Systems Tag browsing                                                                      | [unit tests](../tests/tags.test.mjs), [browser tests](../tests/e2e/tags.spec.mjs), installed starter checks                  |
| Tag SEO exception                    | Tag routes above; [BaseHead](../packages/theme/src/components/BaseHead.astro), [ThemeFrame](../packages/theme/src/components/shared/ThemeFrame.astro)                                                                                                               | SEO and Discovery above                                                                                              | Tags browser tests; installed starter checks                                                                                 |
| Code copy                            | [script](../packages/theme/src/scripts/blogpost/code-copy.js), [prose styles](../packages/theme/src/styles/ai/prose.css)                                                                                                                                            | Article Copy and Image Preview above; Visual Systems Code copy                                                       | [browser tests](../tests/e2e/code-copy.spec.mjs)                                                                             |
| Image preview                        | [script](../packages/theme/src/scripts/blogpost/image-preview.js), [post styles](../packages/theme/src/styles/blog-post.css)                                                                                                                                        | Article Copy and Image Preview above; Visual Systems Image preview                                                   | [browser tests](../tests/e2e/image-preview.spec.mjs)                                                                         |
| Reading status and return to top     | [progress script](../packages/theme/src/scripts/blogpost/read-progress.js), post styles and TOC component above                                                                                                                                                     | Visual Systems Reading feedback                                                                                      | TOC browser tests                                                                                                            |
| Package/starter delivery             | [exports](../packages/theme/package.json), [starter manifest](../scripts/starter-manifest.mjs), [sync tool](../tools/maintainer/sync-starter.mjs)                                                                                                                   | [Packaging workflow](PACKAGING_WORKFLOW.md), [upgrade guide](../UPGRADING.md), [release runbook](PACKAGE_RELEASE.md) | [starter sync tests](../tests/starter-sync.unit.test.mjs), installed starter checks                                          |
| Cinematic effects                    | [Matrix rain](../packages/theme/src/scripts/home-matrix.js), [cyber card CSS](../packages/theme/src/styles/theme-cyber.css), [AI network](../packages/theme/src/scripts/blogpost/network-canvas.js), [Hacker modals](../packages/theme/src/scripts/about/modals.js) | Visual Systems route sections and design intent; AGENTS product identity                                             | [Cinematic browser tests](../tests/e2e/cinematic-effects.spec.mjs), smoke tests                                              |
| About reading status placement       | [Reading UI](../packages/theme/src/scripts/about/reading-ui.js), [panel styles](../packages/theme/src/styles/about/panel.css)                                                                                                                                       | Visual Systems Reading feedback                                                                                      | [About toast browser test](../tests/e2e/about-toast.spec.mjs)                                                                |

## Optional music player

The public demo enables eight unchanged user-supplied MP3 recordings in `public/music/` through `src/site.config.ts`. `public/music/CREDITS.txt` and `credits.html` record each creator, FMA source and license (six CC0 1.0, two CC BY 4.0); READMEs link to the HTML credits. These demo-only assets are outside the npm package and starter manifest. The neutral starter configuration continues to default to disabled music and an empty playlist.

Code-to-document map: [config schema](../src/site.config.schema.ts), [defaults](../src/site.config.defaults.ts), [adapter template](../scripts/adapter-templates/src/config/theme.ts) and [normalizer](../packages/theme/src/utils/music.ts) define the README configuration example. [MusicDeck](../packages/theme/src/components/shared/MusicDeck.astro), [controller](../packages/theme/src/scripts/music/controller.js) and [stylesheet](../packages/theme/src/styles/music-deck.css) implement the Visual Systems music contract. [Core/storage unit checks](../tests/music.unit.test.mjs) and [installed-starter checks](../scripts/check-installed-starter.mjs) cover lazy audio, event races, validation/storage failure and package installation with music disabled/enabled.

`ThemeFrame` conditionally mounts `MusicDeck` from normalized `THEME.MUSIC`. Configuration lives in `src/site.config.ts`; the adapter template calls package-owned `utils/music.ts` for validation. Missing settings default to disabled. Empty playlists are hidden. Public-path tracks are resolved against the Astro base URL; HTTPS sources remain unchanged.

`components/shared/MusicDeck.astro` receives tracks and localized labels. Its URL-based stylesheet and module entry are only referenced when mounted. `scripts/music/controller.js` remains the single-deck DOM bootstrap and delegates to `scripts/music/deck.js`. The latter exports `mountMusicDeck(root)`, imports independent core/storage modules using emitted asset URLs, and returns an idempotent disposer also used by music:destroy. `core.js` owns native Audio instances without DOM, config or storage imports; `storage.js` guards sessionStorage access. Selection disposes the previous source and ignores stale events. On a first visit no audio instance/source is created before Play; a valid active session can trigger a resume attempt on a later page. Pause/resume reuses the current source. Errors stop rather than cycling through unavailable tracks.

The core fetches the complete selected track before assigning a Blob URL to Audio, so seeking does not depend on the host honoring HTTP Range. Loading is lazy, pause/resume shares the pending download or loaded Blob, and selection/destruction aborts downloads and revokes object URLs. Revision and play-attempt guards prevent stale downloads or a pause during loading from starting playback. HTTP/network failures remain retryable errors. Cross-origin sources require CORS; full-track loading increases startup latency/memory and repeats across documents subject to browser HTTP caching. Unit tests cover cancellation, stale results, retry and URL release; the browser fixture explicitly serves audio with HTTP 200 and no Range support.

Session state identifies a track by resolved source URL and stores position, volume, collapse preference and `shouldResume` (missing/invalid values default false). Ordinary navigation/reload attempts to resume active sessions; manual pause remains paused. `pagehide` saves a snapshot before suspending writes and pausing. `pageshow.persisted` reconciles the latest session for BFCache restores. Removed tracks never autoplay replacements. The core sets the default playback start position before play, clamps it on metadata, and distinguishes `NotAllowedError` as `blocked` from media errors. Both failures cancel automatic retry and keep manual recovery available. Navigation can briefly interrupt audio and browser policy can require a click. No ClientRouter or global navigation changes are introduced. Controls use the existing nine-language messages registry and fallback/override mechanism. Music files are user-owned and are not shipped in the theme package.

The music stylesheet inherits body-level `--chrome-*` tokens supplied by the four shells; ThemeFrame mounts the deck under that body. About’s Hacker player uses neutral framing, monospace controls and amber interaction accents. This package-only presentation needs no new config or route adapters. [Music browser checks](../scripts/check-music-browser.mjs) cover actual shell styles, token propagation, mobile bounds and playback/session behavior; visual specifics live in [Visual Systems](VISUAL_SYSTEMS.md#optional-music-deck).

About metadata (`i18n.locales.<code>.about.metaLine`) may be an empty string. The configuration adapter preserves that explicit value; the About route omits the command row when empty without reserving its layout space; the static title uses the resulting natural position. Nonempty custom metadata continues to render. Adapter smoke checks require a string rather than nonempty text; the i18n integration regression covers an empty default-locale value and a nonempty localized override.

Hacker Decryptor uses the About modal route and the shared `decoder/controller.js` controller for strict local Base64/Base64URL, URL, Hex, HTML entities, Unicode escapes and JWT header/payload decoding. The route passes translated `messages.decoder` labels and clones the shared static form template; input and decoded output use value/textContent. The numeric reveal now runs on successful tool results, through the independent demand-driven `createDecoderClock`, separate from the background terminal. Main page titles remain static. Input has a 16,384-code-unit cap; a total 1.5–3-second animation uses a result-box-sized numeric grid (maximum 420px visible height) with no per-character measurements and includes a final 1.2-second numeric/result crossfade. New submissions and modal lifecycle operations cancel prior work. Package-owned scripts/styles/i18n are already included by the package directory exports; the changed About route, defaults and runtime validator are existing starter-manifest entries, while the standalone Decoder and terminal-document routes are additional manifest-owned starter files.

### Independent local decoder

`src/pages/[lang]/decoder.astro` generates one static page per enabled locale when `theme.enableDecoderPage` is true (default), independent of About. No unprefixed alias is generated. The route uses generic `ThemeFrame` directly with its own full-width main class and decoder language URL map, without loading the About shell or stylesheet; canonical, hreflang and sitemap use existing SEO infrastructure. The static HTML includes localized descriptions, formats and labels; only current-locale messages enter runtime JSON.

`components/decoder/DecoderWorkbench.astro` is the single form for page and quick dialog. About clones its template, and its modal runtime no longer serializes a form. `shared/WindowShell.astro` and `scripts/window-controller.js` own generic window markup, focus, open/close/collapse/expand and geometry events. About's modal module mounts tools without owning decoder algorithms. The compatibility `about/modal-decryptor.js` re-exports shared APIs.

`scripts/decoder/codecs/` separates six text formats; Hex/Base64 expose byte primitives independent of UTF-8. `controller.js` binds one container, `actions.js` handles copy/export, and `pipeline.js` bounds in-memory history to ten records and 262,144 aggregate input/output UTF-16 code units. Continuing from an earlier result truncates later steps. Input edits invalidate current output; task changes clear history. Nothing is stored in URLs or browser persistence.

`scripts/decoder/examples.js` owns synchronous public fixtures for both quick and full workbenches; it does not depend on the crypto engine. `scripts/decoder/crypto/` is a lazy chunk. It uses @scure/base and @noble/hashes for address encodings and hashes, plus a deliberately limited exact-length static ABI reader for transfer, approve and transferFrom. EVM/HyperEVM share rules; TRON converts ABI address bodies into Base58Check; decimals are user-supplied, uint256 stays exact, and changing precision reuses parsed fields. Bitcoin address inspection supports Base58Check, Bech32 and Bech32m, verifies selected-network rules and derives scriptPubKey. These are local interpretations, not chain-state verification. No RPC, API keys, token registry, arbitrary ABI, Bitcoin transaction/PSBT decoder or Solana/HyperCore transaction parser is included.

`scripts/effects/numeric-reveal.js` provides one configurable DOM-target reveal, used by both hosts. The page and About each create an independent demand-driven decoder clock; neither uses the terminal’s clock. The canvas is capped to 420px visible height, DPR 1.5 and 30fps. Duration is separate from rendering. All steps in one crypto task share one total 1.5–3-second reveal including its final crossfade. Abort, page exit, hidden state, scroll and geometry changes finish/release decoration; UI updates never create per-step loops.

About effect ownership: `about-effects.js` is a lifecycle coordinator, not a renderer. The reusable `TerminalBackdrop.astro`/`terminal.css` and `terminal/controller.js` accept a caller-provided canvas and options; `about/background.js` adapts About layout/configuration. Terminal rendering/input and Decoder animation clocks are independent. Each About module returns disposal; pagehide/reinitialization clean up timers/listeners/observers and Oracle resources, with bfcache restoration supported. See the reusable terminal contract in VISUAL_SYSTEMS.md for options and performance behavior.

Read-only virtual terminal browsing is split into pure `terminal/filesystem.js`, `commands.js`, `session.js`, a bounded same-origin `loader.js`, Canvas `renderer.js`, input/lifecycle `controller.js`, and pure reading-state `reader.js`. The original Canvas also draws the read-only article view; the optional mode callback only controls host presentation. About injects the JSON manifest/current directory and wires these parts; no terminal module depends on About configuration or Decoder. Locale-specific document JSON is generated by the starter-owned `[lang]/terminal/[id].json.ts` route, with a package-owned build-time identifier helper. It publishes the already-public article Markdown/MDX source as inert text, fetched only on cat/vi. The route follows the About enable flag and is registered in the starter manifest.

### Decoder discovery and animation ownership

`src/pages/[lang]/decoder.astro` is starter-owned and manifest-listed. Shared `components/decoder/DecoderWorkbench.astro`, `scripts/decoder/*`, `scripts/effects/numeric-reveal*.js`, i18n and styles are package-owned. About’s compatibility entry re-exports the same controller used by `decoder/page.js`; codecs, pipeline, actions and animation are not duplicated. `decoder/examples.js` provides dependency-free fixtures; crypto implementation remains lazy-loaded and local.

The route uses localized functional title/description, WebApplication JSON-LD, static usage/limitations content, canonical/hreflang and the existing sitemap. ThemeFrame provides an enabled-only localized footer entry through CommonFooter’s generic `extraLinks` prop. No server redirects, API configuration, `/decoder/` alias or new locale routing rules are required.

The shared effect accepts `durationRangeMs`, `inputLength`, `fadeMs`, optional fixed `durationMs`, colors, opacity range and trail opacity. Both Decoder hosts pass total range [1500, 3000] and a 1200ms fade included within that total. Length selects a subrange; actual decoding completes before animation starts. The host CSS supplies appearance: Lab uses output currentColor, full digit opacity and no trail; About uses amber/pale gold and the default phosphor treatment. CSS values are resolved once per submission. See [Visual Systems](VISUAL_SYSTEMS.md#shared-numeric-reveal-configuration-and-decoder-seo) for the parameter contract and defaults.

| Responsibility                     | Implementation                                                               | Validation                                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Static route, SEO and locale links | `src/pages/[lang]/decoder.astro`, ThemeFrame, CommonFooter                   | `tests/e2e/decoder-page.spec.mjs`, built route checks                                        |
| Shared form and controller         | DecoderWorkbench, `scripts/decoder/controller.js`, About compatibility entry | decoder-page, hacker-decoder and about-modules browser suites                                |
| Duration and rendering             | `effects/numeric-reveal-timing.js`, `effects/numeric-reveal.js`              | `tests/text-decoder.test.mjs`; palette, crossfade, long-input and cancellation browser cases |
| Host appearance                    | `styles/decoder-page.css`, `styles/about/palette.css`                        | host-palette Canvas assertions, layout screenshots                                           |

The maintainer root TypeScript configuration excludes ignored `acceptance-results/` audit copies, in addition to build output and adapter source templates. Shipped source and generated site types remain checked by the unchanged `npm run check` gate.
