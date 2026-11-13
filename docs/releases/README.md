---
doc_id: release_notes_index
doc_role: reference
doc_purpose: Index and operating contract for release notes in this repository.
doc_scope:
  - release
  - package-upgrade
  - docs
update_triggers:
  - release-change
  - doc-process-change
source_of_truth: true
audience:
  - maintainer
  - agent
  - user
depends_on:
  - CHANGELOG.md
  - docs/PACKAGE_RELEASE.md
  - docs/AI_WORKFLOW.md
machine_summary: Use this index to find grouped historical release notes and the per-version release note contract for future publishes.
---

# Release Notes Index

This directory is the structured release-notes ledger for `@anglefeint/astro-theme`.

Breaking integration release: [0.27.0](./0.27.0.md), package-owned standard routes/config/build features and the one-command npm upgrade entry. See its actual delivery status, verification boundaries and [migration](../../UPGRADING.md#0270-integration-starter-breaking-not-yet-published). Pre-0.27 projects require a one-time fresh-starter migration.

## Contract

Current release source: [0.36.2](./0.36.2.md), automatic image preparation during builds and corrected multilingual examples. Previous reliability/guides release: [0.36.1](./0.36.1.md). Its ledger defines compatibility and the selected technical plan; the linked GitHub Release and closeout evidence record actual delivery status and timings. Previous image/About release: [0.36.0](./0.36.0.md).

Previous package release: [0.35.0](./0.35.0.md), homepage Matrix Fragment previews, reversible avatar reactions and static article presentation. npm and starter delivered; its ledger and linked GitHub Release record actual source identities, registry recovery and technical evidence. Demo regression remains user-owned.

Previous package release: [0.34.0](./0.34.0.md), About and Fragments machine-readable coverage and language metadata. See its ledger and linked GitHub Release for actual delivery status and timings.

Previous package release: [0.33.2](./0.33.2.md), shared article/Fragments back-to-top control and agent-selected technical validation. npm and starter delivered; its GitHub Release records final delivery identities and timings.

Previous package release: [0.33.1](./0.33.1.md), direct Fragment anchors and composable maintainer release tools; see its ledger and linked GitHub Release for delivery and post-push completion evidence.

Previous package release: [0.33.0](./0.33.0.md), default sharing artwork, configurable fallback OG images and short Fragment IDs; see its ledger for delivery status.

Previous package release: [0.32.0](./0.32.0.md), stable Fragment sharing, static page indexes, shared Cyber pagination and visual refinements. See its ledger for actual delivery status. Previous release: [0.31.0](./0.31.0.md), matching fragment/post language-generation defaults; [0.30.0](./0.30.0.md) delivered reusable cinematic effects and Fragments presentation/loading improvements. Earlier feature release: [0.29.0](./0.29.0.md), optional Markdown Fragments and popup comments reusing the article Giscus integration. The earlier [0.28.0](./0.28.0.md) introduced opt-in shared Giscus discussions across article translations.

Earlier integration patch: [0.27.2](./0.27.2.md), complete search build-output handoff through Pagefind's public API, retaining the [0.27.1](./0.27.1.md) pnpm social-image fix. See the delivery and validation record.

- `CHANGELOG.md` remains the human-facing summary layer.
- `docs/releases/` is the release-notes ledger.
- Historical gaps may be backfilled as grouped milestone notes.
- New publishes should create one release note file per published package version.

## Historical Backfill

The following grouped notes backfill the release history that predates the formal release-note contract:

- [`0.1.16-0.1.24`](./0.1.16-0.1.24.md)
- [`0.1.25-0.1.31`](./0.1.25-0.1.31.md)
- [`0.1.32-0.1.37`](./0.1.32-0.1.37.md)
- [`0.1.38-0.1.40`](./0.1.38-0.1.40.md)
- [`0.2.0`](./0.2.0.md)
- [`0.2.1`](./0.2.1.md)
- [`0.2.2`](./0.2.2.md)
- [`0.2.3`](./0.2.3.md)
- [`0.2.4`](./0.2.4.md)
- [`0.2.5`](./0.2.5.md)
- [`0.2.6`](./0.2.6.md)
- [`0.2.7`](./0.2.7.md)
- [`0.2.8`](./0.2.8.md)
- [`0.2.9`](./0.2.9.md)
- [`0.2.10`](./0.2.10.md)
- [`0.2.11`](./0.2.11.md)
- [`0.2.12`](./0.2.12.md)
- [`0.3.0`](./0.3.0.md)
- [`0.4.0`](./0.4.0.md)

## Forward Rule

Starting with `0.2.0`, create a dedicated note file for each publish:

- `docs/releases/<version>.md`

Each new note should include:

- published version
- source commit or release commit
- user-visible changes
- migration notes, if any
- whether starter sync was required
- validation summary

Release-note metadata must also stay within the allowed `docs/DOC_METADATA_SPEC.md` vocab. Keep `doc_scope` values conservative (for example `release`, `package-upgrade`, `config`, `docs`) instead of inventing new labels during release prep.

## Naming

- Historical backfill groups may use ranges.
- Future notes should use exact versions only.
