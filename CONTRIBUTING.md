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

1. For external contributions, create a branch from `main` in your fork and submit a pull request targeting `main`. Maintainer and repository-agent implementation follows `docs/AI_WORKFLOW.md` on `main`; `starter` is generated output, never a development target.
2. Make focused changes based on the actual implementation.
3. For code changes, run:

```bash
npm run lint
npm run check
```

In this maintainer checkout, `check` already includes unit tests, documentation and adapter checks, Astro diagnostics, and a build through `check:about-runtime`. Do not repeat `build` for the same unchanged source. For documentation-only edits, run `npm run check:docs` and verify the described behavior against code.

For routing, SEO, or browser-level behavior changes, also run:

```bash
npm run e2e:install
npm run e2e
```

4. Review documentation against the implementation using `docs/DOC_SYNC_WORKFLOW.md`. Run `npm run suggest:docs` (or pass changed paths explicitly for committed work), trace configuration/routes/scripts to their responsible guides, and run `npm run check:docs`. Metadata validation alone does not prove descriptions match code.
5. Commit with clear scope and push.

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

Follow `docs/MAINTAINER_WORKFLOW.md` and `docs/PACKAGE_RELEASE.md` for release validation, package publication and starter delivery. The daily checks above do not replace independent installed-starter checks or post-delivery acceptance. For package/starter ownership, see `docs/PACKAGING_WORKFLOW.md`.
