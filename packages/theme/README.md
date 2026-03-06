---
doc_id: package_readme
doc_role: package-guide
doc_purpose: Package-level install, upgrade, and manual integration reference for advanced users.
doc_scope: [package-install, package-upgrade, package-usage]
update_triggers: [package-change, command-change, export-change]
source_of_truth: true
depends_on: [docs/PACKAGING_WORKFLOW.md, docs/PACKAGE_RELEASE.md]
---

# @anglefeint/astro-theme

Core package for the Anglefeint Astro theme.

## Install

```bash
npm install @anglefeint/astro-theme
```

## Upgrade

```bash
npm update @anglefeint/astro-theme
```

## Usage in Starter/Site

Use the package exports in your pages/layout wiring, for example:

```astro
---
import HomePage from '@anglefeint/astro-theme/layouts/HomePage.astro';
---

<HomePage {...Astro.props} />
```

For content schema:

```ts
export { collections } from '@anglefeint/astro-theme/content-schema';
```

`sourceLinks` in blog frontmatter accepts standard `http(s)` URLs and bare domains such as `github.com/anglefeint/astro-theme-anglefeint`. Bare domains are normalized to `https://...` during schema parsing.

## Site Config Injection

This package reads site-specific config from alias imports:

- `@anglefeint/site-config/site`
- `@anglefeint/site-config/theme`
- `@anglefeint/site-config/social`
- `@anglefeint/site-i18n/config`
- `@anglefeint/site-i18n/messages`

In the starter/site project, map these aliases to `src/config/*` and `src/i18n/*` in both Vite and TS config.

Giscus comments are configured from site-side `theme.comments` (core IDs + behavior fields like `mapping`, `inputPosition`, `theme`, and `lang`). If required core fields are not set, comments are not rendered. When `mapping="specific"` set `term`; when `mapping="number"` set `number`.

## CLI

- `anglefeint-new-post`
- `anglefeint-new-page`

Examples:

```bash
# create one post slug in all default locales
anglefeint-new-post my-first-post

# create post only for selected locales
anglefeint-new-post my-first-post --locales en,fr

# or via environment variable
ANGLEFEINT_LOCALES=en,fr anglefeint-new-post my-first-post

# create a custom page with theme variant
anglefeint-new-page projects --theme base
anglefeint-new-page projects --theme ai
anglefeint-new-page projects --theme cyber
anglefeint-new-page projects --theme hacker
anglefeint-new-page projects --theme matrix
```

Starter projects can invoke these directly (or wrap them in npm scripts). For most users, `#starter` is the recommended installation path.
