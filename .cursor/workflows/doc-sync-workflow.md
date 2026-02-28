# Doc Sync Workflow (Metadata + Tree Propagation)

Use this workflow when code/config/theme behavior changes and docs must be updated consistently.

## Core Principle

Do deterministic semantic routing, not probabilistic retrieval:

- Discover all markdown files.
- Parse each file's frontmatter metadata.
- Build a dependency graph from `depends_on` and `sync_targets`.
- Map code changes to `doc_scope` + `update_triggers`.
- Propagate impact to derived docs.

## Required Frontmatter Contract

Every maintained technical doc should contain frontmatter at the top.

```yaml
---
doc_id: readme_en
doc_role: user-guide
doc_scope: [setup, commands, themes, config]
update_triggers: [command-change, theme-naming, config-change]
source_of_truth: true
depends_on: [docs/ARCHITECTURE.md]
sync_targets: [README.zh-CN.md, README.ja.md, README.es.md, README.ko.md]
---
```

Minimum required keys:

- `doc_id`
- `doc_role`
- `doc_scope` (array)
- `update_triggers` (array)

Recommended:

- `doc_purpose` (short one-line purpose summary for deterministic routing)
- `source_of_truth` (bool)
- `depends_on` (array)
- `sync_targets` (array)

Fallback when `doc_purpose` is missing:

- Parse the first heading + first non-empty paragraph as inferred purpose.
- Optional inline marker is allowed:
  - `<!-- doc_purpose: ... -->`

## Exclusions

Exclude these from strict frontmatter enforcement unless explicitly required:

- content markdown used as blog data: `src/content/blog/**`
- asset helper readmes: `public/images/**/README.md`
- workflow prompts themselves: `.cursor/workflows/**`

## Trigger

Run this workflow when any of these change:

- Theme naming, classes, selectors, scripts
- Layout/shell/component architecture
- CLI commands (`new-post`, `new-page`, install/upgrade commands)
- Config surface (`src/config/*`, env vars, feature flags)
- Routing/i18n/SEO behavior
- Deployment or packaging workflow
- Branch strategy or install path changes (`main` vs `starter`)

## Execution

1. Discovery:
   - `rg --files -g '*.md'`
2. Metadata scan:
   - Read first 20 lines of each markdown file.
   - Parse frontmatter keys and purpose signals (`doc_purpose` or fallback).
3. Quality gate for metadata:
   - If a maintained technical doc has no frontmatter, flag it and add to migration list.
4. Build graph:
   - Node = document
   - Directed edge A -> B when:
     - B is in A.`sync_targets`, or
     - A is listed in B.`depends_on`
5. Impact analysis:
   - Analyze code diff / requested change domains.
   - Select direct-hit docs where `doc_scope` or `update_triggers` match.
6. Propagation:
   - Add dependent docs through graph traversal.
   - Multi-language sync docs are always included when source doc changes.
7. Update order:
   - Source-of-truth docs first (`source_of_truth: true`)
   - Operational docs (`UPGRADING`, release/checklist/changelog)
   - Localized docs (`README.*`)
   - Internal guidance (`CLAUDE.md`, `AGENTS.md`)
8. Branch-aware consistency:
   - `README*` install commands must use `#starter`.
   - `README*` must include `npm update @anglefeint/astro-theme`.
   - `docs/BRANCH_POLICY.md` must exist and reflect current branch strategy.
   - If branch policy changed, include `UPGRADING.md` and packaging docs in update set.
9. Consistency scan:
   - Verify naming contract and command consistency.
10. Validation gate:
   - `npm run check:docs`
   - `npm run check`
   - run `npm run build` when routing/layout/SEO behavior changed
11. Final report:
   - discovered docs count
   - docs with valid metadata count
   - updated docs list
   - skipped docs + reason
   - metadata-missing docs list
   - validation result

## Naming Contract (Current)

- Theme variants: `base`, `ai`, `cyber`, `hacker`, `matrix`
- Internal prefixes: `ai-*`, `cyber-*`, `hacker-*`
- Composition: `ThemeFrame -> Shell -> Layout -> Page`

## Reusable Commands

```bash
npm run check:docs
```

```bash
rg -n "#starter|voidtem/astro-theme-anglefeint#starter" README*.md UPGRADING.md docs/BRANCH_POLICY.md
```

```bash
rg -n "npm update @anglefeint/astro-theme" README*.md UPGRADING.md
```

```bash
rg --files -g '*.md'
```

```bash
rg -n "doc_id:|doc_role:|doc_scope:|update_triggers:|source_of_truth:|depends_on:|sync_targets:" README*.md docs/*.md CLAUDE.md AGENTS.md UPGRADING.md ASTRO_THEME_LISTING.md CHANGELOG.md packages/theme/README.md
```

```bash
rg -n "base|ai|cyber|hacker|matrix|ThemeFrame -> Shell -> Layout -> Page" README*.md docs/*.md CLAUDE.md AGENTS.md ASTRO_THEME_LISTING.md UPGRADING.md CHANGELOG.md packages/theme/README.md
```

```bash
npm run check && npm run build
```
