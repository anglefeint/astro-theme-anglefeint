---
doc_id: package_readme
doc_role: package-guide
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

## Site Config Injection

This package reads site-specific config from alias imports:

- `@anglefeint/site-config/site`
- `@anglefeint/site-config/theme`
- `@anglefeint/site-config/social`
- `@anglefeint/site-i18n/config`
- `@anglefeint/site-i18n/messages`

In the starter/site project, map these aliases to `src/config/*` and `src/i18n/*` in both Vite and TS config.

## CLI

- `anglefeint-new-post`
- `anglefeint-new-page`

Starter projects can invoke these directly (or wrap them in npm scripts).
