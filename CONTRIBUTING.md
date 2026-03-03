---
doc_id: contributing_guide
doc_role: contributor-guide
doc_purpose: Practical contribution workflow for code, adapter sync, and release-safe validation.
doc_scope: [contribution, workflow, validation, adapter-sync, branches]
update_triggers: [workflow-change, command-change, adapter-change, branch-policy-change]
source_of_truth: true
depends_on: [AGENTS.md, docs/BRANCH_POLICY.md, docs/PACKAGING_WORKFLOW.md]
---

# Contributing

## Development Setup

```bash
npm install
npm run check
```

## Daily Workflow

1. Create a working branch from `main`.
2. Make focused changes.
3. Run validation:

```bash
npm run check
npm run build
```

4. Commit with clear scope and push.

## Adapter Changes (Important)

Adapter templates are the source of truth.

- Edit `scripts/adapter-templates/*` first.
- Regenerate outputs:

```bash
npm run sync-adapters
```

- Verify contract:

```bash
npm run check:adapters
```

Do not only edit `src/config/*` or `src/i18n/*` without syncing templates.

## Branch Roles

- `main`: theme development and release source.
- `starter`: install template branch for `npm create astro -- --template ...#starter`.

Do not merge `starter` into `main`.

## Release Safety

Before release:

```bash
npm run check
npm run build
npm run check:docs
```

If package internals changed, follow packaging docs in `docs/PACKAGING_WORKFLOW.md` and `docs/PACKAGE_RELEASE.md`.
