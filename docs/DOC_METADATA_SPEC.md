---
doc_id: doc_metadata_spec
doc_role: reference
doc_purpose: Canonical metadata contract for maintained markdown files in this repository.
doc_scope:
  - docs
  - doc-metadata
  - validation
  - agent-guidance
update_triggers:
  - doc-process-change
  - workflow-change
  - validation-change
source_of_truth: true
audience:
  - agent
  - maintainer
depends_on:
  - AGENTS.md
  - docs/AI_WORKFLOW.md
  - docs/DOC_SYNC_WORKFLOW.md
machine_summary: Defines the frontmatter schema, field semantics, and validation boundaries for maintained markdown documents.
---

# Doc Metadata Spec

This document defines the canonical metadata contract for maintained markdown files in this repository.

Use it to answer three questions:

1. What belongs in frontmatter or sidecar metadata.
2. What must stay in visible markdown body content.
3. What `npm run check:docs` is allowed to validate.

## Design Principles

### Frontmatter is for definition, not full content

Frontmatter exists to describe a document's identity, role, update rules, and machine-readable relationships.

It must not become a second body section filled with long prose, decision logs, or implementation details.

### Body content remains the human source of explanation

Visible markdown body content should hold:

- workflow steps
- architectural reasoning
- exceptions and caveats
- examples
- release notes and rationale

### Hidden notes are supplemental only

HTML comments may be used for local AI hints, but they are not a primary contract layer.

Use comments sparingly for short prompts such as:

```md
<!-- ai-note: keep this README user-facing; do not add maintainer-only release steps -->
```

Do not move core workflow rules or document ownership into HTML comments.

### Public docs may use sidecar metadata

Public-facing markdown such as repository READMEs may keep metadata in sidecar `.meta.yaml` files instead of visible frontmatter.

Use sidecars only when the markdown file is intended to stay clean on GitHub or npm-facing surfaces.

## Metadata Layers

Maintained markdown in this repository uses a four-layer model:

1. Frontmatter
   - structured metadata for validators and agents
2. Sidecar metadata
   - optional metadata file for approved public-facing markdown
3. Markdown body
   - canonical human-readable content
4. HTML comments
   - optional local hints only

Default metadata source is frontmatter. Sidecars are an exception for public-facing documents.

## Required Metadata Fields

These fields are required for maintained technical docs covered by `npm run check:docs`, whether the metadata lives in frontmatter or in an approved sidecar file.

### `doc_id`

- Type: `string`
- Purpose: stable unique identifier for the document
- Rule: must remain stable even if the visible title changes

### `doc_role`

- Type: `string`
- Purpose: classify document function
- Recommended values:
  - `user-guide`
  - `internal-guide`
  - `runbook`
  - `reference`
  - `adapter-entry`

### `doc_purpose`

- Type: `string`
- Purpose: one-sentence summary of what the document exists to do
- Rule: must be concise and human-readable

### `doc_scope`

- Type: `string[]`
- Purpose: declare the domains the document covers
- Rule: must use a real YAML array, not a comma-separated string

### `update_triggers`

- Type: `string[]`
- Purpose: declare which classes of repository changes should trigger document review or update
- Rule: must use a real YAML array

## Recommended Metadata Fields

These are not strictly required for every doc, but they are part of the preferred end-state contract.

### `source_of_truth`

- Type: `boolean`
- Purpose: marks the document as canonical within its scope
- Guidance: keep `true` limited to genuinely authoritative docs

### `audience`

- Type: `string[]`
- Purpose: clarify intended readers
- Recommended values:
  - `user`
  - `maintainer`
  - `agent`

### `depends_on`

- Type: `string[]`
- Purpose: declare upstream documents that provide required context
- Rule: each path must resolve to a repository file

### `sync_targets`

- Type: `string[]`
- Purpose: declare downstream documents that often require review when this file changes
- Rule: each path must resolve to a repository file

### `machine_summary`

- Type: `string`
- Purpose: short routing hint for agents
- Rule: keep it to a single concise sentence

## Optional Metadata Fields

These fields are allowed when they add value, but they are not part of the minimum contract.

- `status`
- `owner`
- `review_on_release`

Do not add new metadata keys casually. Prefer extending this spec before introducing repository-wide fields.

## Public Sidecar Metadata

Sidecar metadata is allowed for approved public-facing markdown files, currently intended for README-like surfaces.

Recommended naming pattern:

- `README.md` -> `README.meta.yaml`
- `README.zh-CN.md` -> `README.zh-CN.meta.yaml`
- `packages/theme/README.md` -> `packages/theme/README.meta.yaml`

Rules:

- Sidecar schema must match the frontmatter schema.
- Sidecars are metadata only, not alternate document bodies.
- Sidecars should be used sparingly and only where visible frontmatter would harm the public reading experience.
- Internal docs under `docs/` should continue to prefer frontmatter.

## What Must Not Go Into Metadata

Do not place the following in frontmatter:

- long decision records
- multi-step workflow instructions
- large examples
- exception lists
- verbose release notes
- implementation commentary that belongs in the body

If the text must be read by a human to understand the document, it usually belongs in the body.

## Current Role Model

This repository currently uses the following role model:

- Core roles:
  - `user-guide`
  - `internal-guide`
  - `runbook`
  - `reference`
  - `adapter-entry`
- Extended roles currently in use:
  - `localized-user-guide`
  - `package-guide`
  - `contributor-guide`
  - `ops-guide`
  - `ops-reference`
  - `release-policy`
  - `submission-checklist`
  - `submission-copy`

Use the core roles by default. Extended roles exist for current repository compatibility and should only be reused when the distinction matters.

## Current Scope Vocabulary

Prefer the existing vocabulary below before inventing new scope values:

- `agent-guidance`
- `workflow`
- `release`
- `starter-sync`
- `doc-sync`
- `validation`
- `architecture`
- `visual-system`
- `commands`
- `config`
- `routing`
- `seo`
- `package-install`
- `package-upgrade`
- `package-usage`
- `doc-metadata`
- `docs`
- `setup`
- `themes`
- `package`
- `upgrade`
- `packaging`
- `branches`
- `branching`
- `contribution`
- `adapter-sync`
- `risk-areas`
- `doc-routing`
- `agent-workflow`
- `release-flow`
- `submission`
- `review-checks`
- `screenshots`
- `theme-description`
- `feature-summary`

If a new scope term is needed, add it deliberately and keep naming stable.

## Current Trigger Vocabulary

Prefer the existing trigger vocabulary below:

- `workflow-change`
- `release-change`
- `command-change`
- `architecture-change`
- `doc-process-change`
- `config-change`
- `adapter-change`
- `validation-change`
- `script-change`
- `routing-change`
- `i18n-change`
- `theme-naming`
- `visual-change`
- `package-change`
- `package-release`
- `branch-change`
- `branch-policy-change`
- `docs-workflow-change`
- `submission-change`
- `feature-change`
- `sync-from-readme-en`

## Source-of-Truth Mapping

The current intended mapping is:

- `AGENTS.md`
  - neutral repository entrypoint for agents
- `docs/AI_WORKFLOW.md`
  - canonical agent workflow
- `docs/MAINTAINER_WORKFLOW.md`
  - maintainer operational workflow
- `docs/PACKAGE_RELEASE.md`
  - package and starter release runbook
- `docs/ARCHITECTURE.md`
  - architecture reference
- `docs/VISUAL_SYSTEMS.md`
  - visual/runtime reference
- `README.md`
  - template user guide
- `packages/theme/README.md`
  - package user guide

Tool adapters such as `CLAUDE.md` and `.cursor/rules/00-repo.mdc` should normally not be marked as source-of-truth.

## Validation Boundaries

`npm run check:docs` should validate the contract, not the entire quality of prose.

### It should validate

- metadata exists where required
- YAML parses successfully
- required keys are present
- field types are correct
- `doc_id` values remain unique
- `doc_role`, `doc_scope`, `update_triggers`, and `audience` use allowed vocabulary
- relationship paths in `depends_on` and `sync_targets` resolve
- repository policy checks that are explicitly encoded in the validator

### It should not attempt to validate

- prose quality
- narrative completeness
- whether a workflow explanation is good enough
- large semantic judgments better handled in review

## Example Frontmatter

```yaml
---
doc_id: ai_workflow
doc_role: internal-guide
doc_purpose: Canonical workflow for AI agents making code, release, and documentation changes.
doc_scope:
  - workflow
  - release
  - starter-sync
  - doc-sync
  - validation
update_triggers:
  - workflow-change
  - release-change
  - command-change
  - doc-process-change
source_of_truth: true
audience:
  - agent
  - maintainer
depends_on:
  - AGENTS.md
  - docs/MAINTAINER_WORKFLOW.md
  - docs/PACKAGE_RELEASE.md
sync_targets:
  - CLAUDE.md
  - .cursor/rules/00-repo.mdc
machine_summary: Canonical agent workflow. Read before code changes, releases, or doc updates.
---
```

## Relationship to Other Docs

- `AGENTS.md` declares that this metadata contract exists and points here.
- `docs/AI_WORKFLOW.md` defines when doc updates must be considered during engineering work.
- `docs/DOC_SYNC_WORKFLOW.md` defines the update algorithm that consumes this metadata.

If these documents drift, this file is the canonical metadata reference.
