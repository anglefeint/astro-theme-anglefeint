---
doc_id: changelog
doc_role: reference
doc_purpose: Versioned log of user-visible changes and migration impact.
doc_scope: [release, package-upgrade]
update_triggers: [release-change, command-change]
source_of_truth: true
depends_on:
  - docs/releases/README.md
---

# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

## [0.2.1] - 2026-03-07

### Changed

- Tightened locale runtime correctness around path stripping, hero resolution, Giscus locale mapping, and safer region-code fallback parsing in `new-post`.
- Improved visitor-facing UX with a visible mobile language switcher, modal focus management, longer reading toasts, and clearer replay-scan wording.
- Hardened JSON-LD serialization, RSS item mapping, adapter contract validation, and removed dead config/runtime surface that no longer had real behavior.
- Updated docs and submission-facing copy to match the current default-locale routing model and current config terminology.

### Notes

- See [`docs/releases/0.2.1.md`](docs/releases/0.2.1.md) for release details and validation summary.

## [0.2.0] - 2026-03-07

### Changed

- Rebuilt the starter i18n system around a single source of truth in `src/site.config.ts -> i18n`.
- Added structured locale metadata, localized UI overrides, per-locale hero copy, and localized About config under `i18n.locales`.
- Completed default-locale routing support with configurable `i18n.routing.defaultLocalePrefix` behavior across runtime, SEO, and sitemap generation.
- Hardened `new-post` so it follows configured enabled locales, supports region-code locales, and safely falls back for unknown locale templates.
- Added a minimal Playwright smoke-test layer via `npm run e2e:install` and `npm run e2e`.

### Notes

- See [`docs/releases/0.2.0.md`](docs/releases/0.2.0.md) for release details and validation summary.

## [0.1.40] - 2026-03-06

### Changed

- Closed the comments/runtime hardening phase with:
  - stronger Giscus mapping validation
  - localized remaining hardcoded system labels
  - improved metrics/runtime correctness for mixed-language content and comment integration
- Consolidated release/starter synchronization rules and documentation workflow ownership.

### Notes

- See [`docs/releases/0.1.38-0.1.40.md`](docs/releases/0.1.38-0.1.40.md) for grouped release details.

## [0.1.39] - 2026-03-05

### Changed

- Hardened the single-source starter synchronization workflow and release dependency restoration contract.

### Notes

- See [`docs/releases/0.1.38-0.1.40.md`](docs/releases/0.1.38-0.1.40.md) for grouped release details.

## [0.1.38] - 2026-03-05

### Changed

- Completed the transition toward a stronger comments configuration surface and safer release workflow ownership.

### Notes

- See [`docs/releases/0.1.38-0.1.40.md`](docs/releases/0.1.38-0.1.40.md) for grouped release details.

## [0.1.37] - 2026-03-05

### Changed

- Exposed the full Giscus attribute surface through theme config and continued hardening release gates.

### Notes

- See [`docs/releases/0.1.32-0.1.37.md`](docs/releases/0.1.32-0.1.37.md) for grouped release details.

## [0.1.36] - 2026-03-05

### Changed

- Improved about-page localization/runtime validation and tightened release safety documentation.

### Notes

- See [`docs/releases/0.1.32-0.1.37.md`](docs/releases/0.1.32-0.1.37.md) for grouped release details.

## [0.1.35] - 2026-03-05

### Changed

- Made comments configurable, removed remaining deprecated config surface, and improved starter/runtime safety checks.

### Notes

- See [`docs/releases/0.1.32-0.1.37.md`](docs/releases/0.1.32-0.1.37.md) for grouped release details.

## [0.1.34] - 2026-03-05

### Changed

- Continued pagination/config cleanup and maintainer workflow hardening.

### Notes

- See [`docs/releases/0.1.32-0.1.37.md`](docs/releases/0.1.32-0.1.37.md) for grouped release details.

## [0.1.33] - 2026-03-04

### Changed

- Introduced componentized config-driven pagination styles and continued about/runtime cleanup.

### Notes

- See [`docs/releases/0.1.32-0.1.37.md`](docs/releases/0.1.32-0.1.37.md) for grouped release details.

## [0.1.32] - 2026-03-04

### Changed

- Hardened about runtime validation and moved further toward fully config-driven localized about content.

### Notes

- See [`docs/releases/0.1.32-0.1.37.md`](docs/releases/0.1.32-0.1.37.md) for grouped release details.

## [0.1.31] - 2026-03-04

### Changed

- Expanded about modal copy and packaging quality during the org/starter cleanup phase.

### Notes

- See [`docs/releases/0.1.25-0.1.31.md`](docs/releases/0.1.25-0.1.31.md) for grouped release details.

## [0.1.30] - 2026-03-04

### Changed

- Continued starter/content/repo alignment work during the packaging and org migration phase.

### Notes

- See [`docs/releases/0.1.25-0.1.31.md`](docs/releases/0.1.25-0.1.31.md) for grouped release details.

## [0.1.29] - 2026-03-04

### Changed

- Improved about sidebar interaction styling and polished distributed starter/demo content.

### Notes

- See [`docs/releases/0.1.25-0.1.31.md`](docs/releases/0.1.25-0.1.31.md) for grouped release details.

## [0.1.28] - 2026-03-04

### Changed

- Aligned starter content and packaging during the midstream content/tooling cleanup phase.

### Notes

- See [`docs/releases/0.1.25-0.1.31.md`](docs/releases/0.1.25-0.1.31.md) for grouped release details.

## [0.1.27] - 2026-03-04

### Changed

- Added richer multilingual demo content and advanced cyber pagination behavior for the archive page.

### Notes

- See [`docs/releases/0.1.25-0.1.31.md`](docs/releases/0.1.25-0.1.31.md) for grouped release details.

## [0.1.26] - 2026-03-04

### Changed

- Continued packaging identity cleanup and starter-facing documentation/content refinement.

### Notes

- See [`docs/releases/0.1.25-0.1.31.md`](docs/releases/0.1.25-0.1.31.md) for grouped release details.

## [0.1.25] - 2026-03-04

### Changed

- Added unified publish/lint safety tooling and completed a broad repo/org identity cleanup.

### Notes

- See [`docs/releases/0.1.25-0.1.31.md`](docs/releases/0.1.25-0.1.31.md) for grouped release details.

## [0.1.24] - 2026-03-04

### Changed

- Added font validation checks and synchronized Red Queen lifecycle documentation with runtime behavior.

### Notes

- See [`docs/releases/0.1.16-0.1.24.md`](docs/releases/0.1.16-0.1.24.md) for grouped release details.

## [0.1.23] - 2026-03-04

### Changed

- Finalized the first post-detail performance stabilization pass around hero rendering and monitor startup timing.

### Notes

- See [`docs/releases/0.1.16-0.1.24.md`](docs/releases/0.1.16-0.1.24.md) for grouped release details.

## [0.1.22] - 2026-03-04

### Changed

- Localized read-progress toasts, extracted metrics, and continued detail-page lifecycle optimization.

### Notes

- See [`docs/releases/0.1.16-0.1.24.md`](docs/releases/0.1.16-0.1.24.md) for grouped release details.

## [0.1.21] - 2026-03-03

### Changed

- Improved Red Queen preload/decoder behavior and reduced duplicate fetch risk during playback.

### Notes

- See [`docs/releases/0.1.16-0.1.24.md`](docs/releases/0.1.16-0.1.24.md) for grouped release details.

## [0.1.20] - 2026-03-03

### Changed

- Continued post-detail animation and asset delivery optimization work.

### Notes

- See [`docs/releases/0.1.16-0.1.24.md`](docs/releases/0.1.16-0.1.24.md) for grouped release details.

## [0.1.19] - 2026-03-03

### Changed

- Intermediate performance iteration during the blog-post stabilization phase.

### Notes

- See [`docs/releases/0.1.16-0.1.24.md`](docs/releases/0.1.16-0.1.24.md) for grouped release details.

## [0.1.18] - 2026-03-02

### Changed

- Added config-driven locale/doctor improvements and expanded runtime/documentation contract coverage.

### Notes

- See [`docs/releases/0.1.16-0.1.24.md`](docs/releases/0.1.16-0.1.24.md) for grouped release details.

## [0.1.17] - 2026-03-02

### Changed

- Hardened scaffolding, checks, and locale/config contract behavior in preparation for later runtime work.

### Notes

- See [`docs/releases/0.1.16-0.1.24.md`](docs/releases/0.1.16-0.1.24.md) for grouped release details.

## [0.1.16] - 2026-03-01

### Changed

- Established the Astro 6 beta baseline and aligned runtime/schema/documentation expectations around it.

### Notes

- See [`docs/releases/0.1.16-0.1.24.md`](docs/releases/0.1.16-0.1.24.md) for grouped release details.

## [0.1.15] - 2026-03-01

### Changed

- Refactored theme effects scripts into smaller runtime modules under:
  - `packages/theme/src/scripts/blogpost/*`
  - `packages/theme/src/scripts/about/*`
- Replaced About page script-folder `set:html` string injection with component-rendered Astro markup.
- Added lint/format toolchain (`eslint` + `prettier`) with commands:
  - `npm run lint`
  - `npm run lint:fix`
  - `npm run format`
  - `npm run format:check`

## [0.1.14] - 2026-03-01

### Changed

- Migrated theme CSS source-of-truth to `packages/theme/src/styles/*` and removed duplicated app/public CSS copies.
- Updated shells and post layout to load theme CSS through Vite URL imports (`?url`) for hashed build assets.
- Attached blog list pagination styles from `CyberShell` so package consumers always receive consistent archive styling.

## [0.1.13] - 2026-03-01

### Fixed

- Restored language switcher styling by moving switcher UI styles into `LangSwitcher.astro` (component-local scope).

### Changed

- Social links now render non-clickable placeholder icons when `social.links` is empty, improving template discoverability.
- Footer shows a development hint to configure social links in `src/site.config.ts` when links are unset.

## [0.1.12] - 2026-03-01

### Changed

- Replaced blog post AI background network from server-rendered SVG nodes to client-rendered `<canvas>`.
- Added canvas performance guards in blog post effects:
  - DPR cap (`<= 2`)
  - FPS cap (`30fps`)
  - hidden-tab pause/resume lifecycle
  - reduced-motion fallback

## [0.1.11] - 2026-03-01

### Changed

- Moved client-side effects scripts from `public/scripts` to `packages/theme/src/scripts` and switched to module imports in layouts/pages.
- Let Vite pipeline handle script bundling for minification, hashed assets, and cache-friendly output.

## [0.1.10] - 2026-03-01

### Fixed

- Corrected Spanish accents in sample content and `new-post` scaffolding templates.
- Removed unused `messages.footer.tagline` fields from i18n message maps to avoid misleading configuration surface.

### Changed

- Added a second short demo post (`hello-world`) for each locale (`en`, `ja`, `ko`, `es`, `zh`) with minimal AI metadata fields for richer post-detail previews.

## [0.1.9] - 2026-03-01

### Fixed

- Added `public/styles/blog-list.css` to the published theme package.
- Added `locale` support to `FormattedDate` and wired locale-aware date rendering in blog list/post related sections.
- Added `prefers-reduced-motion` fallbacks for post-detail and about page effects scripts.
- Updated Chinese footer copy in i18n message maps.

## [0.1.8] - 2026-02-28

### Changed

- Enforced single app-source runtime wiring for package UI:
  - package layouts/components now read site config from `@anglefeint/site-config/*`
  - package layouts/components now read i18n from `@anglefeint/site-i18n/*`
- Added `@anglefeint/site-i18n` alias mapping in:
  - `astro.config.mjs`
  - `tsconfig.json`
- Updated package/release docs for the config+i18n alias contract.

## [0.1.7] - 2026-02-28

### Changed

- Unified app page shell imports to package paths:
  - `@anglefeint/astro-theme/layouts/shells/HackerShell.astro`
  - `@anglefeint/astro-theme/layouts/shells/CyberShell.astro`
- Removed duplicated app-level implementation directories:
  - `src/layouts/`
  - `src/components/`
- Updated architecture/internal docs to reflect package-source-of-truth paths under `packages/theme/src/*`.

## [0.1.3] - 2026-02-28

### Added

- `npm run new-post -- <slug>` script to scaffold the same post slug across `en`, `ja`, `ko`, `es`, `zh`.
- Multilingual README sections for post scaffolding command usage.
- Upgrade guide (`UPGRADING.md`) and changelog links in all README language variants.

### Changed

- Language switcher now preserves current route by default.
- Blog detail and blog pagination language switching now use existence-aware fallback:
  - If target-locale page exists, go to that page.
  - If not, fall back to target-locale blog index.
- Blog sample content is aligned to one post per locale (`welcome-to-anglefeint`).
- About page default content now uses neutral, non-placeholder profile/contact text.
- Theme CSS was split from `global.css` into route-theme files (`theme-cyber.css`, `theme-ai.css`) to reduce cross-theme coupling.

## [0.0.1] - 2026-02-17

### Added

- Initial public theme release.
- Multi-atmosphere route design (home/blog/post/about).
- i18n routes for `en`, `ja`, `ko`, `es`, `zh`.
- Config-driven customization via `src/config/*`.
- Astro static output with sitemap, robots, and RSS support.
