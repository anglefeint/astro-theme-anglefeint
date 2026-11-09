---
doc_id: packaging_workflow
doc_role: ops-reference
doc_purpose: Packaging strategy and template/package boundary operations guide.
doc_scope: [packaging, release, upgrade]
update_triggers: [package-change, release-change]
source_of_truth: true
---

# Theme Packaging Workflow

## Current boundary: integration starter

Version 0.27.0 moves standard routes, config defaults/types/normalization, derived config/i18n modules, internal fonts and build wiring into the npm theme. New consumers receive a thin starter: Astro and content entrypoints, tsconfig, neutral site config, user-facing guidance and sample content/resources. They do not receive implementation copies or generated adapters. The repository's legacy root adapters/templates remain maintainer diagnostic fixtures; they are not the source of consumer runtime behavior.

The package exports `./integration`, `./config`, `./env`, `./runtime/*` and existing layout/component/build APIs. The integration registers unchanged Home, archives/articles, Tags, About, Decoder, RSS, robots and terminal JSON, plus MDX/math/search/social/machine-readable/sitemap behavior. User content/configuration/public files/custom pages stay project-owned. Configured defaults resolve in the package so future compatible menu/button/page/default changes can ship through dependencies.

`packages/theme/package.json` files/exports/bin lists must cover the actual route/runtime/integration/CLI/font implementations; `scripts/check-theme-pack-cli.mjs` validates key tarball entries. `astro-theme` is the name-matching bin enabling `npx @anglefeint/astro-theme@latest upgrade`, alongside the existing new-post/new-page bins.

## Starter generation

`starter` remains a maintainer-generated distribution branch, never a branch for hand-edited runtime. `scripts/starter-manifest.mjs` lists thin managed entrypoints, neutral config/guidance source overrides, whitelisted sample posts and all referenced cover/font/favicon resources. Obsolete copied standard routes/adapters/helper scripts are removed only during maintainer distribution generation. Never use this deletion list against an existing personal blog.

`starter-package.mjs` emits only Astro/theme runtime dependencies, check/TypeScript tools, projectSchema 1 and package-owned commands. npm is supported by the automatic upgrader; manual pnpm installation/check/build remains separate. Existing rendering security overrides are retained. Main stays a workspace for development and the full public demo content library. Starter sync must not replace that library or the demo's identity/configuration.

## Consumer upgrades

Pre-0.27 projects intentionally cross a breaking boundary by creating a fresh starter separately and migrating site-config values, articles, music/images, custom pages and hosting settings. Do not pretend npm update can migrate the old copied skeleton. See [UPGRADING](../UPGRADING.md#0270-integration-starter-breaking-not-yet-published).

For schema-1 integration projects, the updater performs compatible dependency upgrades, exact target resolution, backup, doctor and recoverable dependency rollback. It never copies template files over user files, calls maintainer starter sync, pushes or deploys. Unknown schemas and incompatible Node/Astro versions require deliberate migration; skipped package versions within the supported schema are allowed. Project marker/type/runtime helpers are internal contracts, not personal settings.

## Validation and delivery

- `npm run check` and lint cover source, metadata, package configuration wiring, unit tests, package CLI, scaffold/type checking and build/About payloads.
- `npm run e2e` covers the complete functional browser suite. Bounded worker reruns diagnose resource timeouts without changing runtime behavior or weakening assertions. Optional appearance review still requires consent.
- `npm run check:installed -- --build --audit` installs the actual tarball without workspace links, checks the thin skeleton and exercises the locale/prefix/disabled/music build matrix with a blocking dependency audit.
- `npm run check:upgrade` uses an isolated unpublished future tarball and local fixture registry to run the real npm exec upgrade command. It skips a package version, introduces a menu/button/page and checks byte-for-byte preservation of config/content/music/images/host rules/custom pages. Unit tests separately cover incompatible targets, readonly preflight and failed-doctor rollback.
- `node scripts/check-music-browser.mjs` exercises actual audio/session/lifecycle behavior in an isolated Astro fixture.
- After authorized publication and starter push, run public-template acceptance and live demo verification. Local tarballs/fixture registries do not prove remote npm/starter delivery.

All audit findings and registry errors remain blocking release gates. Formal publishing/starter/tag/announcement steps follow [AI_WORKFLOW](AI_WORKFLOW.md), [MAINTAINER_WORKFLOW](MAINTAINER_WORKFLOW.md) and [PACKAGE_RELEASE](PACKAGE_RELEASE.md). Record actual 0.27.0 delivery results and pending remote steps in [its ledger](releases/0.27.0.md).

## Distribution consistency guard

Official starter sync uses buildStarterPackage as the single dependency policy; it must not copy main's runtime dependencies back after sanitizing the thin package. Git source/target reads use literal cat-file blob lookups so absent [lang] routes are null, not successful empty git-show pattern results. Public-template acceptance asserts exactly Astro and the theme as direct runtime dependencies. A final sync check must pass after delivery; factory-only fixtures cannot replace this check.
