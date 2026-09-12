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

For starter projects, review the repository release notes when scaffold commands change. If an older project still routes `npm run new-post` or `npm run new-page` through local wrapper files, migrate the package scripts to the package-owned bins:

```bash
npm pkg set scripts.new-post="anglefeint-new-post"
npm pkg set scripts.new-page="anglefeint-new-page"
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

`BlogPost` accepts optional `headings` from `const { Content, headings } = await render(post)`. Pass these alongside the article data to enable its native, collapsible table of contents for Markdown h2/h3 headings. The panel sticks to the right on wide screens and appears before the body on narrow screens. No headings means no contents. The optional boolean frontmatter field `toc` overrides `THEME.TOC.ENABLED` (default `true`); starter users configure the default with `theme.toc.enabled`. MDX component-generated and raw HTML/JSX headings are not collected automatically.

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

The post CLI executes your trusted `src/site.config.ts` with Jiti and uses the merged, enabled locale registry. Configuration failures stop generation before writing posts. `--locales` takes precedence over `ANGLEFEINT_LOCALES`, then configured locales; explicit overrides skip config loading. Missing configuration requires an explicit override. Existing posts are never overwritten.

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

### Static article search

Register `import search from '@anglefeint/astro-theme/search'` in Astro's integrations with `search({ enabled: THEME.SEARCH.ENABLED })`. After build, the integration writes `pagefind/` into Astro's output directory. The package owns the dependency, indexing hook and dialog; the starter supplies configuration and integration registration. Only `BlogPost` panels marked `data-anglefeint-search` are indexed, limited to title, subtitle and body. Frontmatter `search: false` excludes an article. The default `theme.search.enabled: true` controls both UI and indexing.

Indexes load only after opening search, using the current HTML language. Full search works in build + preview and deployed static output. Dev mode displays instructions. This integration targets static output and requires no search server.
