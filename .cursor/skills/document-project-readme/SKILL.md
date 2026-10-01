---
name: document-project-readme
description: Review project documentation against implemented code using the repository's canonical documentation workflow. Keep README user-facing and route internal details to their responsible documents.
---

# Document Project README

Read `AGENTS.md` first, then follow `docs/AI_WORKFLOW.md` and `docs/DOC_SYNC_WORKFLOW.md`. Paths here are relative to the repository root. This skill is an entrypoint, not a second documentation algorithm or a fixed README template.

Implemented code defines current behavior. Inspect configuration, callers, routes and tests before editing prose. Correct stale documentation; do not change working code to match a description. Record suspected code defects separately.

Use the canonical workflow to discover responsible documents and decide which need updates:

- Keep README focused on installation, configuration, writing, upgrades and user-visible behavior. Update translations only when the user-facing facts change.
- Put implementation structure and ownership in `docs/ARCHITECTURE.md`, and route-specific styles and effects in `docs/VISUAL_SYSTEMS.md`.
- Keep dated release evidence in `docs/releases/`; do not present historical results as current validation.
- Read actual file paths, defaults and effects from the current implementation. Do not copy examples from an older project layout.

Run `npm run suggest:docs` to identify review candidates and `npm run check:docs` to validate metadata. For committed changes, pass the reviewed paths explicitly as described in the canonical workflow. Neither command proves that prose agrees with code; verify that correspondence manually.
