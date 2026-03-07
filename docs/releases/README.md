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

## Contract

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
