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

## Forward Rule

Starting with the next publish after `0.1.40`, create a dedicated note file:

- `docs/releases/<version>.md`

Each new note should include:

- published version
- source commit or release commit
- user-visible changes
- migration notes, if any
- whether starter sync was required
- validation summary

## Naming

- Historical backfill groups may use ranges.
- Future notes should use exact versions only.
