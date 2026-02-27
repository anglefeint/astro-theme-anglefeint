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

## [0.0.1] - 2026-02-17

### Added

- Initial public theme release.
- Multi-atmosphere route design (home/blog/post/about).
- i18n routes for `en`, `ja`, `ko`, `es`, `zh`.
- Config-driven customization via `src/config/*`.
- Astro static output with sitemap, robots, and RSS support.
