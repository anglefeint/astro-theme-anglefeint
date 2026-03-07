---
doc_id: doc_sync_workflow
doc_role: internal-guide
doc_purpose: Metadata-driven algorithm for deciding which repository documents must be updated after code or workflow changes.
doc_scope:
  - doc-sync
  - docs
  - workflow
  - validation
update_triggers:
  - docs-workflow-change
  - doc-process-change
  - workflow-change
source_of_truth: true
audience:
  - agent
  - maintainer
depends_on:
  - docs/DOC_METADATA_SPEC.md
  - docs/AI_WORKFLOW.md
machine_summary: Deterministic doc-sync procedure based on markdown metadata, dependency graph traversal, and minimal sufficient validation.
---

# Doc Sync Workflow (Metadata-Driven, Fully Dynamic)

Use this workflow when code/config/theme behavior changes and docs must be synchronized.

## Core Rule

This workflow defines the update algorithm, not the metadata schema itself.

- Responsibilities are defined inside each markdown file's own metadata.
- The canonical metadata schema is defined in `docs/DOC_METADATA_SPEC.md`.
- The workflow must never hardcode which specific docs are "always updated."
- Decision chain: discover -> read metadata -> compare against current code changes -> update or skip per file.

## Metadata Source

Use `docs/DOC_METADATA_SPEC.md` as the canonical metadata specification.

This workflow consumes that metadata; it does not redefine the schema.

## Metadata Contract

Maintained technical markdown should self-describe with one of these metadata sources:

1. top-level frontmatter
2. approved sidecar metadata file for public-facing markdown

Sidecar metadata is an exception mechanism for README-like documents that must stay clean in GitHub or npm surfaces.

Example frontmatter:

```yaml
---
doc_id: readme_en
doc_role: user-guide
doc_purpose: End-user setup and usage guide
doc_scope: [setup, commands, config]
update_triggers: [command-change, config-change]
source_of_truth: true
depends_on: [docs/ARCHITECTURE.md]
sync_targets: [README.zh-CN.md, README.ja.md, README.es.md, README.ko.md]
---
```

Example sidecar:

```yaml
doc_id: readme_en
doc_role: user-guide
doc_purpose: End-user setup and usage guide
doc_scope:
  - setup
  - commands
  - config
update_triggers:
  - command-change
  - config-change
source_of_truth: true
depends_on:
  - docs/ARCHITECTURE.md
sync_targets:
  - README.zh-CN.md
  - README.ja.md
  - README.es.md
  - README.ko.md
```

Minimum required keys:

- `doc_id`
- `doc_role`
- `doc_scope` (array)
- `update_triggers` (array)

Recommended keys:

- `doc_purpose`
- `source_of_truth`
- `depends_on`
- `sync_targets`

Fallback when `doc_purpose` is missing:

- Infer from first heading + first non-empty paragraph.
- Optional comment fallback allowed:
  - `<!-- doc_purpose: ... -->`

## Exclusions (by pattern, not by fixed filename list)

Exclude these from strict metadata enforcement unless explicitly requested:

- content markdown used as data (for example blog posts under `src/content/**`)
- asset helper markdown (for example image folder readmes)
- tool-owned workflow prompt markdown that is not a canonical repository doc

## Trigger

Run this workflow whenever repository changes may alter documentation truth:

- naming/classes/selectors/scripts
- architecture/layout/components
- commands/CLI/install/upgrade
- config surface
- routing/i18n/SEO
- deployment/packaging/release

## Execution Chain

1. Discover all markdown files:
   - `rg --files -g '*.md'`
2. Read metadata per file:
   - parse frontmatter if present
   - otherwise resolve approved sidecar metadata if applicable
   - fallback to inferred purpose if needed
3. Build dependency graph:
   - edge A -> B when B is in A.`sync_targets`
   - edge A -> B when A is in B.`depends_on`
4. Analyze current engineering changes:
   - extract changed domains from code/config/commands/behavior
5. Per-file decision (must be deterministic):
   - direct hit if change-domain intersects `doc_scope`/`update_triggers`
   - otherwise skip with explicit reason
6. Propagate:
   - include dependent docs via graph traversal
   - traversal is transitive and breadth-first until no new dependent docs are discovered
7. Apply updates in dependency-safe order:
   - source docs -> derived docs
8. Validate:
   - `npm run check:docs`
   - run `npm run check` only if the updated docs describe changed behavior, commands, routing, layout, runtime, release flow, or SEO
   - run `npm run build` only if behavior/routing/layout/SEO changed
9. Report:
   - discovered docs count
   - updated docs list
   - skipped docs list + reason
   - metadata-missing docs list
   - validation result

## Reusable Commands

```bash
rg --files -g '*.md'
```

```bash
npm run check:docs
```

```bash
npm run check
```

```bash
npm run build
```
