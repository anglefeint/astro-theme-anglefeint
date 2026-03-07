---
doc_id: cursor_doc_sync_adapter
doc_role: adapter-entry
doc_purpose: Thin Cursor-facing adapter that points to the canonical repository doc-sync workflow.
doc_scope:
  - doc-sync
  - workflow
update_triggers:
  - docs-workflow-change
  - workflow-change
source_of_truth: false
audience:
  - agent
depends_on:
  - AGENTS.md
  - docs/AI_WORKFLOW.md
  - docs/DOC_SYNC_WORKFLOW.md
---

# Cursor Doc Sync Adapter

Read `AGENTS.md` first.

Then use the canonical repository workflow here:

- `docs/DOC_SYNC_WORKFLOW.md`

Do not maintain a second Cursor-only copy of the doc-sync algorithm in this file.

If this adapter and the canonical doc workflow ever disagree, `docs/DOC_SYNC_WORKFLOW.md` wins.
