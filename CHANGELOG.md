---
doc_id: changelog
doc_role: release-log
doc_purpose: Versioned log of user-visible changes and migration impact.
doc_scope: [release-notes, upgrade-impact]
update_triggers: [release-change, command-change, behavior-change]
source_of_truth: true
---

# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

No unreleased changes yet.

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
