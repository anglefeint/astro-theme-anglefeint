---
doc_id: claude_adapter
doc_role: tool-adapter
doc_purpose: Thin Claude Code adapter that points to the repository's neutral agent entrypoint and canonical workflow docs.
doc_scope: [tool-adapter, agent-entry]
update_triggers: [doc-structure-change, workflow-change, architecture-change]
source_of_truth: false
depends_on: [AGENTS.md, docs/AI_WORKFLOW.md]
---

# CLAUDE.md

Claude Code should treat this file as a thin adapter, not as the canonical workflow source.

## Required Read Order

1. `AGENTS.md`
2. `docs/AI_WORKFLOW.md`
3. `README.md`
4. Task-relevant source docs:
   - `docs/ARCHITECTURE.md`
   - `docs/VISUAL_SYSTEMS.md`
   - `docs/MAINTAINER_WORKFLOW.md`
   - `.cursor/workflows/doc-sync-workflow.md`

## Claude-Specific Note

- Prefer the repository-neutral rules in `AGENTS.md` over maintaining Claude-only workflow variants here.
- If this file and `AGENTS.md` ever conflict, `AGENTS.md` and `docs/AI_WORKFLOW.md` win.
