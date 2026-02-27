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

- `source_of_truth` (bool)
- `depends_on` (array)
- `sync_targets` (array)

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

## Execution

1. Discovery:
   - `rg --files -g '*.md'`
2. Metadata scan:
   - Read first 20 lines of each markdown file.
   - Parse frontmatter keys.
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
8. Consistency scan:
   - Verify naming contract and command consistency.
9. Validation gate:
   - `npm run check`
   - run `npm run build` when routing/layout/SEO behavior changed
10. Final report:
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

## Legacy Blacklist

- `mesh-page`, `br-page`, `term-page`
- theme prefixes `mesh-*`, `br-*`, `term-*` (except historical notes)

## Reusable Commands

```bash
rg --files -g '*.md'
```

```bash
rg -n "doc_id:|doc_role:|doc_scope:|update_triggers:|source_of_truth:|depends_on:|sync_targets:" README*.md docs/*.md CLAUDE.md AGENTS.md UPGRADING.md ASTRO_THEME_LISTING.md CHANGELOG.md packages/theme/README.md
```

```bash
rg -n "mesh-|br-|term-|mesh-page|br-page|term-page" README*.md docs/*.md CLAUDE.md AGENTS.md ASTRO_THEME_LISTING.md UPGRADING.md CHANGELOG.md packages/theme/README.md
```

```bash
npm run check && npm run build
```
