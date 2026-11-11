---
doc_id: reusable_effects
doc_role: reference
doc_purpose: Explain the reusable visual effect boundaries and their existing theme adapters.
doc_scope: [architecture, visual-system, validation]
update_triggers: [architecture-change, script-change]
source_of_truth: true
depends_on: [docs/ARCHITECTURE.md, docs/VISUAL_SYSTEMS.md]
---

# Reusable effects

`packages/theme/src/effects/` contains visuals that accept their own elements or state, without looking up blog-specific markup or importing site configuration. This is part of the existing theme package, not a separate library. The current reusable groups and their page adapters are listed below. Other existing effects remain at their current locations; this directory does not claim they have all been extracted.

| Source                                                         | Responsibility                                                                      | Theme adapter                                                                                                                                                                                             |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `effects/matrix-rain/matrix-rain.js`                           | Canvas rendering, sizing, frame subscriptions and resource disposal                 | `scripts/home-matrix.js` selects the homepage canvas and passes theme FPS and pointer feedback; `scripts/home-effects.js` owns visibility, reduced motion, cached-page lifecycle and mirror subscriptions |
| `effects/matrix-rain/glyphs.js`                                | Shared glyph alphabet and font stack                                                | `scripts/matrix-glyphs.js` preserves the existing import path for passage materials                                                                                                                       |
| `effects/signal-loading/SignalLoading.astro`                   | Decorative CSS signal bars and scanning line, with a static reduced-motion fallback | `components/FragmentComments.astro` owns spacing; `scripts/fragment-comments.js` owns loading visibility and localized status                                                                             |
| `effects/cyber-spotlight/CyberSpotlight.astro`                 | CSS light surface and two rotating beams, with container/viewport sizing            | `layouts/shells/CyberShell.astro` supplies viewport mode; `styles/theme-cyber.css` supplies the layer; `components/CyberAtmosphere.astro` supplies the Tags variant                                       |
| `effects/white-rabbit/WhiteRabbit.astro` and `white-rabbit.js` | SVG/canvas presentation and one explicitly bound trigger                            | `components/HomeWhiteRabbit.astro` and `styles/home-page.css` own layout; `scripts/home-rabbit-decode.js` owns mode assignment and grouped controls                                                       |
| `effects/cyber-rain/CyberRain.astro` and `cyber-rain.js`       | CSS drop presentation and independent 48-drop initialization                        | `components/CyberAtmosphere.astro` supplies viewport/scene styling; `scripts/cyber-rain-dust.js` supplies page selection and the original random source                                                   |
| `effects/cyber-dust/`                                          | Root/CSS and independent 22-particle initialization                                 | CyberAtmosphere supplies scene styling; the paired adapter supplies the original random stream                                                                                                            |
| `effects/ai-background/`                                       | Ambient markup/CSS and article Canvas graph                                         | BlogPost supplies viewport placement; the article adapter retains lazy startup                                                                                                                            |
| `effects/network-backdrop/`                                    | Sparse SVG graph and component lifecycle                                            | shared/NetworkBackdrop supplies Decoder's viewport placement/body isolation                                                                                                                               |
| `effects/red-queen/`                                           | Monitor, play/loading controls and media player                                     | BlogPost supplies assets/labels; article CSS and script adapter supply placement/autoplay                                                                                                                 |
| `effects/key-button/`                                          | Keyhole SVG and cancellable unlock animation                                        | Home preview chooses what unlocking opens; no corridor import                                                                                                                                             |
| `effects/blink-cursor/`                                        | CSS block/underline/terminal blink rendering                                        | Host chooses geometry, color and activation                                                                                                                                                               |
| `effects/startup-text/`                                        | Configurable SSR/DOM typing sequence using one pure timing model                    | Home supplies its existing flags and default text                                                                                                                                                         |
| `effects/hidden-signal/`                                       | Hover/selection reveal for arbitrary text roots                                     | Home supplies its layout and grouped lifecycle                                                                                                                                                            |
| `effects/cyber-environment/`                                   | Six sibling CSS ambient layers                                                      | CyberShell chooses viewport mode; atmosphere owns Tags palette                                                                                                                                            |

## Matrix rain

```js
import { mountMatrixRain } from '@anglefeint/astro-theme/effects/matrix-rain/matrix-rain.js';

const canvas = document.querySelector('#my-rain');
const rain = mountMatrixRain(canvas, { fps: 45 });
rain?.start();
// When the owner is hidden or should show a reduced-motion fallback:
rain?.pause();
rain?.resume();
// On removal:
rain?.dispose();
```

The renderer mounts **paused**. The caller owns when it runs, including document visibility, reduced motion and navigation cleanup. This avoids adding a second lifecycle manager beside the existing homepage manager. A non-canvas or unavailable 2D context returns `undefined`. Mounting the same live canvas returns its existing controller; the first mount's options remain in force. A disposed canvas can be mounted again.

Set the canvas size through CSS (for example `width: 100%; height: 240px`). Default `sizing: 'element'` follows its CSS box using a ResizeObserver and window resize events, without assigning inline CSS dimensions. Pointer coordinates are local to that canvas. Use `sizing: 'viewport'` for the homepage's full-window renderer; this preserves its original sizing and avoids creating an extra observer. Position, stacking order and pointer transparency belong to the host page.

`fps` defaults to 45, is clamped to 15–60 and falls back to 45 for non-finite input. DPR stays capped at 2. The three rain layers, glyphs, colors, trail lengths, speed and head-only glow are unchanged. `onPointerMove(event)` is an optional callback while running; homepage CSS variables are updated by the adapter, not the renderer.

The controller exposes `start()`, `resume()`, `pause()`, `dispose()` and `subscribeFrame(callback)`. Subscription returns an unsubscribe function. The homepage mirror still draws from the rain's existing frame callback; extraction adds no animation loop. Disposal cancels the renderer's frame, removes its listeners/observer, clears subscriptions and releases canvas backing dimensions.

## Signal loading

```astro
---
import SignalLoading from '@anglefeint/astro-theme/effects/signal-loading/SignalLoading.astro';
---

<div id="my-loading">
  <SignalLoading active />
</div>
<p role="status">Loading…</p>
```

`active` defaults to `false`. For client-side changes, set the component root's `hidden` property: `container.querySelector('[data-signal-loading]').hidden = !isLoading`. Hidden instances have no active animation rule. The component has no client script, framework runtime, dialog selector or Giscus dependency. Its scoped CSS owns five cyan/pink bars, their 1.3-second staggered pulse, and the 2.2-second scanning line. Reduced motion keeps the decoration static.

The root is decorative (`aria-hidden="true"`); the caller supplies localized status text, an appropriate live region and any error/retry behavior. Parent layout owns margins, width constraints and panel scrolling. In Fragments, close/cleanup also hides the component, so closing during loading stops its animations. Two instances can be shown or hidden independently.

## Cyber spotlight

```astro
---
import CyberSpotlight from '@anglefeint/astro-theme/effects/cyber-spotlight/CyberSpotlight.astro';
---

<div class="light-panel"><CyberSpotlight /></div>
<style>
  .light-panel {
    position: relative;
    height: 300px;
    overflow: hidden;
  }
</style>
```

The default `sizing="container"` fills a positioned parent. Its CSS size container supplies `cqw`/`cqh` dimensions to the original diagonal-sized light surface, so resizing the host requires no JavaScript or observer. The parent decides whether light is clipped. `sizing="viewport"` uses a fixed full-viewport host; CyberShell uses this mode and the theme stylesheet sets `--spotlight-layer: 5`. The component defaults to layer 0, stays pointer-transparent and is decorative. Parent positioning, clipping and stacking are integration concerns.

The two conic gradients, sweep angles, 12s/24s cycles and right beam's -1.5s delay are preserved. `--spotlight-left-duration` and `--spotlight-right-duration` allow the scene adapter to supply Tags' existing 18s/30s cycles. `CyberAtmosphere.astro` still supplies its 0.42 opacity and ice-blue/lavender filter on the component root; the component imports no route/config logic. Under reduced motion both beams remain static. It has no client script or animation frame loop.

## White rabbit

```astro
---
import WhiteRabbit from '@anglefeint/astro-theme/effects/white-rabbit/WhiteRabbit.astro';
---

<button id="rabbit-trigger"><WhiteRabbit />Explore</button>
<script>
  import { mountWhiteRabbit } from '@anglefeint/astro-theme/effects/white-rabbit/white-rabbit.js';
  const trigger = document.querySelector('#rabbit-trigger');
  const rabbit = mountWhiteRabbit(trigger, trigger?.querySelector('[data-white-rabbit]') ?? null, {
    mode: 'scan',
  });
  // The owner calls rabbit.pause()/resume() for visibility/motion changes,
  // rabbit.reset() when layout changes, and rabbit.dispose() when removed.
</script>
```

`WhiteRabbit.astro` owns the unchanged 32×36 SVG silhouette, canvas and their scoped presentation. Default visual dimensions are 22×28px, overridable by inherited `--rabbit-width`/`--rabbit-height`. The decorative, pointer-transparent root is visible without JavaScript. Its caller decides where to place it or whether to reveal it only on hover/focus. `components/HomeWhiteRabbit.astro` remains a compatibility/layout wrapper; homepage CSS supplies the original article/archive placement, reveal rules and 13×19px mobile dimensions.

`mountWhiteRabbit(trigger, element, { mode = 'scatter' })` binds fine-pointer entry/exit and keyboard focus to the explicitly supplied elements. Supported modes are `scatter`, `rain`, `rebuild` and `scan`; the homepage adapter retains its shuffled assignment. A live visual mounts once, with its first trigger/options retained. Invalid elements or unavailable Canvas 2D return `undefined`. The controller exposes `start()`/`resume()`, `pause()`, `reset()` and idempotent `dispose()`; disposal removes trigger listeners, cancels its frame, clears particles and releases backing dimensions, allowing remount.

The one-second animation retains 30fps drawing, DPR ≤2, glyph/color/glow parameters and silhouette sampling. It schedules frames only during a triggered animation, stopping on completion, exit, pause or disposal. Reduced motion shows the SVG without particles. The caller owns visibility, motion-change and resize coordination: `scripts/home-rabbit-decode.js` preserves one resize listener for the whole homepage group, while `scripts/home-effects.js` retains page lifecycle ownership. This avoids a global listener/observer per rabbit. The reusable renderer knows no home selectors, article rows or site configuration.

## Cyber rain

`effects/cyber-rain/CyberRain.astro` owns the decorative root and CSS; `cyber-rain.js` initializes explicitly supplied roots, with a colocated `.d.ts` interface. No dust element, route lookup or site configuration is required by the effect.

```astro
---
import CyberRain from '@anglefeint/astro-theme/effects/cyber-rain/CyberRain.astro';
---

<div id="rain-panel"><CyberRain /></div>
<script>
  import { mountCyberRain } from '@anglefeint/astro-theme/effects/cyber-rain/cyber-rain.js';
  const rain = mountCyberRain(document.querySelector('#rain-panel [data-cyber-rain]'));
  // The owner can call rain?.pause(), rain?.resume(), and rain?.dispose().
</script>
<style>
  #rain-panel {
    position: relative;
    height: 300px;
  }
</style>
```

Default `sizing="container"` fills a positioned parent and clips drops to its bounds. CSS container-height units make the fall distance follow that root's height without a resize listener/observer. `sizing="viewport"` keeps fixed positioning and the original `100vh` travel distance. The effect defaults to layer 0; theme CSS sets `--cyber-rain-layer: 6`. Arbitrary root HTML attributes are forwarded, allowing the atmosphere adapter to retain its scene marker. Root and descendant CSS is narrowly namespaced by `[data-cyber-rain]`; JS-created drops do not require Astro scope attributes.

`mountCyberRain(root, { random = Math.random })` creates 48 drops in four alternating types (`normal`, `thin`, `fog`, `skew`), preserving shapes, gradients, blur, -20px origin, duration/delay/opacity ranges and skew angle. It starts with CSS animations active and returns `start()`/`resume()`, `pause()` and idempotent `dispose()`. Repeated mounting of the same live root returns its controller without creating extra drops. Disposal removes only that instance's generated nodes and permits remount. Invalid roots return `undefined`. An optional random source must return values in [0, 1); the theme adapter passes its existing seeded generator, then uses the same sequence for the unchanged 22 dust particles.

No JavaScript animation loop, timer or global listener is added. Pause/resume uses CSS play state. Viewports at most 720px hide every second drop, preserving the original mobile thinning rule. Reduced motion hides rain in both standalone and theme use. The caller owns page lifecycle and can pause/dispose when removing its custom view.

`components/CyberAtmosphere.astro` renders the viewport component and supplies Tags' 0.7 opacity and existing gradient through `--cyber-rain-background`. `scripts/cyber-rain-dust.js` retains page selection and seeding, invoking rain first and dust second with the original shared random stream. Both generators are independent. No configuration or tutorial setup steps change.

## Cyber dust

`effects/cyber-dust/CyberDust.astro` and `cyber-dust.js` follow the same explicit-root pattern as rain. Render the component inside a positioned, sized parent and call `mountCyberDust(parent.querySelector('[data-cyber-dust]'))`. `sizing="viewport"` retains fixed page placement; default container mode is absolute. `mountCyberDust(root, { random = Math.random })` returns `start()`/`resume()`, `pause()` and `dispose()`. Repeated live mounts reuse the controller; disposal removes only its own particles and permits remount.

The 22 particles retain 4–8px sizes, percentage positions, 0–10s delay, 8–20s duration, the original float keyframes and dual glow. Animation is CSS-only, without a timer/frame/observer/listener added by the initializer. Mobile viewports hide alternating particles (11 visible); reduced motion hides the effect. Generic roots default to layer 0; the theme adapter sets layer 2. Tags' existing color, glow and 0.45 opacity are supplied through `--cyber-dust-color`, `--cyber-dust-shadow` and the page adapter. Rain and dust need no paired root when mounted independently. The theme's small paired adapter still selects both page roots and preserves their shared random-stream order.

## Article AI background

```astro
---
import AiBackground from '@anglefeint/astro-theme/effects/ai-background/AiBackground.astro';
---

<div id="ai-panel"><AiBackground /></div>
<script>
  import { mountAiNetwork } from '@anglefeint/astro-theme/effects/ai-background/ai-network.js';
  const dispose = mountAiNetwork(document.querySelector('#ai-panel canvas'));
  // Call dispose() before removing the host.
</script>
<style>
  #ai-panel {
    position: relative;
    height: 300px;
    overflow: hidden;
  }
</style>
```

The component owns gradient glow, haze, vignette, stripes, noise, hex grid, twelve thought particles and Canvas network markup. Default sizing is container; BlogPost passes `sizing="viewport"`. The renderer retains its deterministic graph, 30fps drawing, DPR ≤2, at most six signal paths, hidden-document pause and static reduced-motion rendering. Options are `{ reducedMotion, observeResize }`; defaults use the current motion preference and container observation. Article orchestration passes `observeResize: false` and retains its previous idle startup/window resize behavior. Mounting the same canvas reuses its disposer. Disposal stops frames, removes listeners/observer and releases backing dimensions. The caller owns host removal and any remount when preference policy changes. No reading/hero/pointer interactions are imported by this component.

## SVG network backdrop

`effects/network-backdrop/NetworkBackdrop.astro` owns the separate sparse peer-to-peer SVG network used by Decoder Lab. Default container sizing fills a positioned parent; set `sizing="viewport"` for a fixed backdrop. Give a custom parent explicit dimensions and `isolation: isolate` to contain its negative background layer. Its static SVG fallback, mint palette variables, graph density bands, 20fps geometry updates, signal paths and reduced-motion behavior are retained. It is not the article Canvas network.

The component's small `entry.js` mounts marked SVG roots and owns visibility/pagehide/cached-pageshow recovery. `mountNetworkBackground(svg, { observeResize = true })` can also mount a supplied SVG directly and returns a disposer. Container sizing observes SVG dimensions; viewport roots skip the added observer and retain the existing window resize path. Disposal cancels frames and resize work, removes listeners/observer and leaves the last static SVG. `components/shared/NetworkBackdrop.astro` and `components/decoder/DecoderNetwork.astro` remain compatibility wrappers; the shared wrapper supplies Decoder's previous viewport sizing and body isolation. Old script/style paths forward to the single implementation.

## Red Queen monitor

```astro
---
import RedQueen from '@anglefeint/astro-theme/effects/red-queen/RedQueen.astro';
---

<div id="monitor">
  <RedQueen
    source="/images/first.webp"
    secondarySource="/images/second.gif"
    badge="Monitor"
    replayLabel="Play monitor"
  />
</div>
<script>
  import { mountRedQueen } from '@anglefeint/astro-theme/effects/red-queen/red-queen.js';
  const dispose = mountRedQueen(document.querySelector('#monitor [data-red-queen]'));
  // Call dispose() before removing the host.
</script>
```

The component includes the monitor shell, stage/canvas, badge/dot, loading state and play/replay button. Sources and localized badge/button labels are required caller inputs; the optional second source adds a playlist item. Default placement is inline, with a compact collapsed play button. `placement="article"` allows article CSS to retain fixed gutter positioning and the <=1300px hide rule without putting article layout assumptions in the player.

`mountRedQueen(root, { reducedMotion, autoPlay = false })` returns an idempotent disposer and reuses an already mounted root. Standalone use is click-to-play. The article adapter passes its motion snapshot and `autoPlay: true`, preserving the load/idle/2s delay gates and deferred startup. The existing decoder/image fallback, static warmup, retries, preload timeout and playback/collapse timings are unchanged. Reduced motion hides the monitor before media loads; a plain animated image is not used as a fallback. Disposal cancels asynchronous work, releases the current frame/canvas, removes the click listener and restores collapsed state. There is no autoplay/media access added to other pages. Film-inspired media remains in the theme's existing assets directory and is supplied by BlogPost.

## Key button

`key-button/KeyButton.astro` includes the existing keyhole/key SVG, hover/focus reveal and insertion/turn animation. Supply a localized `label`; normal button attributes such as `id` and `class` are forwarded. Its default layout is an inline button. Homepage CSS alone places it in the terminal monitor.

```js
import { mountKeyButton } from '@anglefeint/astro-theme/effects/key-button/key-button.js';
const key = mountKeyButton(document.querySelector('#unlock'), {
  onUnlock: () => openMyPanel(),
});
// key?.reset() cancels an unfinished unlock; key?.dispose() removes the binding.
```

The duration defaults to 600ms. `onStart` may return false to veto activation; `onUnlock` reports completion, and optional `signal` disposes the binding on abort. Repeated clicks during insertion are ignored. Reduced motion completes immediately without an animation timer. The effect does not import a terminal, passage player or navigation code. `home-signal-preview.js` retains its own activation, expansion, lazy import and retained-player policy; cancellation resets the supplied key controller. Mirror and corridor implementations are unchanged by this extraction.

## Blink cursor

`blink-cursor/BlinkCursor.astro` renders a decorative block or underline cursor. Props are `shape` (`block` by default), `active` (true) and `period` (milliseconds, 1000 by default). CSS variables control width, height, gap and alignment; color follows currentColor. `mountCursor(element, options)` applies the same presentation to an existing span and returns `setActive(boolean)`/`dispose()`. No JS animation timer or frame loop is used. Reduced motion keeps it static.

Home's latest heading uses an underline with its original 1400ms period and geometry. The trace signal uses a block with 1000ms period, inactive until the parent signal is revealed. Startup typing reuses the terminal cursor keyframe but retains its own finite visibility window. The three blink duty cycles remain as before; they are not flattened to one timing.

## Startup text

`startup-text/StartupText.astro` accepts `config` and renders all text/timing markup on the server. `mountStartupText(root, config)` supplies the same effect to an existing DOM element, returning a disposer that restores the original content/attributes. No HTML is interpreted and no per-character JS timer or DOM measurement is introduced. The shared pure `model.js` computes timing variables, grapheme counts and monospace width cells once; CSS width/steps animations perform the reveal. CJK/emoji use two cells and other graphemes one; use a monospace font for the intended layout.

```js
import { mountStartupText } from '@anglefeint/astro-theme/effects/startup-text/startup-text.js';
const stop = mountStartupText(document.querySelector('#intro'), {
  startup: [{ text: 'Connecting...', delay: 250, duration: 1500 }],
  message: [{ text: '你好，世界', duration: 800 }],
  fadeAt: 2500,
  fadeDuration: 1000,
  messageAt: 3500,
});
```

Segments accept `text`, `delay`, `duration`, `cursorDelay`, `cursorFor`, `blinks` and optional `initial` reserved leading cells (used for the completion's leading space). All times are milliseconds. Message delays are relative to `messageAt`; startup delays are relative to entry. Cursor delay defaults to the typing delay; the first default cursor starts immediately, independently of the 250ms text delay. Empty startup/message arrays omit those groups. Without startup the default message starts immediately. Existing Home switches map to empty arrays without adding site-config fields; the original Initialize/done/Wake Up/Follow text and 0.25/5.25/8.6/13.25-second typing starts, 7.6–8.6-second fade and finite cursor windows are preserved. Reduced motion shows the final message statically; a startup-only configuration retains its static text rather than going blank. Repeated DOM mounts reuse their disposer; dispose before binding a new configuration.

## Hidden signal

`hidden-signal/HiddenSignal.astro` accepts `text` or slot content, forwarding normal span attributes. It conceals content with opacity until fine-pointer hover or a non-collapsed text selection intersects its subtree. The content remains selectable; this is a decorative reveal, not access control. Layout, fonts, semantic labels and text content belong to the caller.

```js
import { mountHiddenSignal } from '@anglefeint/astro-theme/effects/hidden-signal/hidden-signal.js';
const stop = mountHiddenSignal(document.querySelector('#secret'), { text: 'A hidden signal' });
```

For several existing roots use `mountHiddenSignals(elements, { signal })`, which shares one selectionchange/pageshow listener pair for the group, as Home does. Each signal independently tracks whether its own text is selected, including select-all and touch selection. Clearing selection hides it again unless hovered. A nested BlinkCursor is animated only while the signal is revealed; reduced motion keeps it static. Disposal clears selection flags and removes listeners. Home retains its pirate/trace layout, colors and content; they are not required by the reusable binding.

## Cyber environment

`cyber-environment/CyberEnvironment.astro` renders six sibling CSS layers: base gradient, drifting fog, load glitch, ambient flicker, haze and vignette. Default `sizing="container"` uses a positioned, explicitly sized parent with `overflow: hidden; isolation: isolate`; viewport mode keeps the original fixed page positioning. Sibling layers preserve their original z-index relationships instead of introducing a new wrapper stacking context. Rain, dust and spotlights remain separate effects.

```js
import { mountCyberEnvironment } from '@anglefeint/astro-theme/effects/cyber-environment/environment.js';
const environment = mountCyberEnvironment(document.querySelector('#scene'));
// environment?.pause(), .resume(), .dispose()
```

The DOM binding adds only its own six nodes, supports idempotent mounting and removes only those nodes on disposal. Existing gradients, 20s fog/haze cycles, 6s flicker (8s mobile), 12s glitch and layer ordering are retained. It adds no JS timers, observers or animation loop. Reduced motion keeps static fog/light and omits glitch. CyberShell composes the viewport component; CyberAtmosphere retains Tags' ice-blue/lavender overrides and 10s flicker/18s glitch cycles. Styling and entry paths live in this directory; no body selector or site config is required by the effect itself.

## Validation and delivery boundary

The standalone fixture binds two independent keys/cursors/startup hosts/signals/environment roots to arbitrary DOM. New cases cover cancellable completion, reduced-motion immediate completion, cursor activation, safe configurable text, original typing timings, content restoration, independent text selection and ownership-safe layer cleanup. `startup-text.test.mjs` covers default scheduling, omitted groups and grapheme/width-cell computation. Existing Home status/interaction/lifecycle tests retain selection, key cancellation, retained preview, shared rain/mirror frames, motion preferences and GPU cleanup. Package checks require each new component, CSS, runtime and declaration. No author setup step or independent package is added.

Independent fixture cases additionally cover dust ownership/pause/mobile thinning, two container-sized article backdrops, two SVG backdrops and two Red Queen players with their own buttons. Red Queen's reduced-motion unit test reads its extracted implementation and still forbids media requests/images/timers. Decoder page tests retain SVG failure isolation, resizing, signal motion and cached-page lifecycle; cinematic tests retain article canvas movement/static reduced motion. The article compatibility adapters keep deferred startup and do not introduce extra observers in viewport use.

Spotlight and rabbit standalone cases and `tests/e2e/scene-effects.spec.mjs` additionally cover host sizing, independent triggers/cleanup, idle drawing, responsive homepage placement, Blog/Tags timing and reduced-motion behavior. No agent screenshot or appearance judgment is implied by these functional assertions.

`tests/fixtures/reusable-effects.astro` is built only into the isolated E2E fixture, not the demo. `tests/e2e/reusable-effects.spec.mjs` checks two arbitrary canvas elements, container resizing, independent pause/resume, idempotent mounting, disposal/remount and two independently controlled signal components outside any dialog. Existing home interaction/lifecycle and fragment tests retain route, motion, shared-frame, readiness, retry and scroll regression coverage.

The existing package's `files` and `./effects/*` export include this directory. `check-theme-pack-cli.mjs` checks the extracted assets are present in the tarball. They are package-owned and are not copied into starter-managed files. No site configuration, consumer tutorial steps, npm dependency or independent package is added. These are local implementation contracts; publication and remote starter delivery require their normal separate release gates.

The JavaScript renderers/initializers have colocated `.d.ts` interfaces for options, lifecycle controls and their `undefined` return on invalid inputs. The package tarball check requires these declarations alongside the implementation, keeping custom Astro/TypeScript callers type checked.
