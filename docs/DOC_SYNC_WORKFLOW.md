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

Implemented code is the authority for current feature behavior. Read the implementation, configuration defaults, callers and tests before rewriting its explanation. When prose disagrees with the implementation, correct the prose; do not change working code just to match old documentation. Record suspected code defects separately. `source_of_truth: true` identifies the canonical document within its documentation scope; it does not give prose precedence over code.

`suggest:docs` suggests review candidates from file paths and metadata. It does not read implementation semantics, generate documentation or prove that prose is accurate. `check:docs` validates metadata and explicitly encoded repository policies, not code/document agreement. Both can pass while a feature description is stale.

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

1. Start with the repository helper:
   - `npm run suggest:docs`
   - optional explicit paths:
     - `npm run suggest:docs -- src/site.config.ts docs/ARCHITECTURE.md`
   - Default input is the current Git working tree, not the conversation or commit history. For already committed work, inspect a deliberately chosen commit range and pass its changed paths explicitly. A clean worktree does not mean historical changes have been documented.
2. The helper will:
   - discover maintained markdown files
   - read metadata from frontmatter or approved sidecars
   - infer likely change domains from the changed file set
   - compute direct-hit docs from `doc_scope` / `update_triggers`
   - propagate dependent docs via `depends_on` / `sync_targets`
3. Use the suggested direct-hit and propagated docs as the review set. Broad domains may select every maintained document; a match is not an instruction to rewrite it.
4. Traverse each affected feature from user input/configuration through schema/adapter, route or build hook, component/script/style, generated output and relevant tests. Record concrete source paths and the observed behavior, including defaults, disabled/empty states and package-versus-starter ownership.
5. Compare those observations with the candidate documents. Update the responsible guide, architecture/visual reference and any public translations whose claims changed. Separate shipped features, proposals and release-time evidence. Keep historical release notes historical; do not rewrite an old release to describe today's code. Record why reviewed documents need no change.
6. Maintain a code-to-document map in the relevant architecture/project reference, with paths to the implementation and existing checks. Prefer extending existing references over creating a second implementation manual. For a broad retrospective audit, record the reviewed source revision/range and dispositions in a dated audit record.
7. Validate:
   - `npm run check:docs`
   - check added source/document links and compare examples against actual configuration/types/commands
   - docs-only corrections do not require runtime changes or a fresh build; run broader checks when behavior or executable commands were also modified, as defined in `docs/AI_WORKFLOW.md`
   - distinguish newly run checks from evidence reused from an earlier release
8. Report:
   - changed files used as input
   - direct-hit docs
   - propagated docs
   - skipped docs
   - metadata errors, if any
   - validation result
   - code/document mismatches corrected and any remaining uncertainty

### Reviewing committed changes in PowerShell

Choose the last reviewed source commit as the baseline; do not blindly use only the last commit (which may contain release notes alone):

```powershell
$docBaseline = '<last-reviewed-commit>'
$docInputs = @(git diff --name-only "$docBaseline..HEAD")
if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve documentation review baseline' }
if ($docInputs.Count -gt 0) {
  npm run suggest:docs -- @docInputs
}
```

Review `git log` as well when an addition and later removal cancel out in the net diff. Removed experiments must not remain listed as current capabilities. Runtime facts belong in current references; exact package versions, publication commits and per-release test results belong in `docs/releases/` and should be linked instead of repeatedly copied into living overviews.

## Reusable Commands

```bash
rg --files -g '*.md'
```

```bash
npm run suggest:docs
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
