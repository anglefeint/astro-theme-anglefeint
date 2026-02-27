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

In the starter/site project, map that alias to `src/config/*` in both Vite and TS config.

## CLI

- `anglefeint-new-post`
- `anglefeint-new-page`

Starter projects can invoke these directly (or wrap them in npm scripts).
