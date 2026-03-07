---
doc_id: claude_adapter
doc_role: adapter-entry
doc_purpose: Thin Claude Code adapter that points to the repository's neutral agent entrypoint and canonical workflow docs.
doc_scope: [agent-guidance, workflow]
update_triggers: [workflow-change, architecture-change, adapter-change]
source_of_truth: false
depends_on: [AGENTS.md, docs/AI_WORKFLOW.md, docs/DOC_METADATA_SPEC.md]
---

# CLAUDE.md

Claude Code should treat this file as a thin adapter, not as the canonical workflow source.

## Required Read Order

1. `AGENTS.md`
2. `docs/AI_WORKFLOW.md`
3. `docs/DOC_METADATA_SPEC.md`
4. `README.md`
5. Task-relevant source docs:
   - `docs/ARCHITECTURE.md`
   - `docs/VISUAL_SYSTEMS.md`
   - `docs/MAINTAINER_WORKFLOW.md`
   - `docs/DOC_SYNC_WORKFLOW.md`

## Claude-Specific Note

- Prefer the repository-neutral rules in `AGENTS.md` over maintaining Claude-only workflow variants here.
- If this file and `AGENTS.md` ever conflict, `AGENTS.md` and `docs/AI_WORKFLOW.md` win.
