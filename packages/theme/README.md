# @anglefeint/astro-theme

Core package for the Anglefeint Astro theme.

Version 0.4.0 requires Astro `^7.3.2`. Its matching starter uses Sharp `^0.35.4` and updated official integrations for the AVIF image-processing security fix. Astro 5/6 are no longer supported; migrate the site dependencies together with the theme.

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

Article share images require the matching starter's `theme.socialImage.enabled` config/adapter and `socialImage()` from `@anglefeint/astro-theme/social-image` in Astro's integrations. The package owns the prerendered PNG endpoint, Satori/Sharp rendering and offline font assets. Article `ogImage` overrides generation independently of `heroImage`; see the repository README for image paths and the disable switch. This capability requires 0.5.0 and its matching starter; 0.4.0 does not include it.

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

## Article contents

`BlogPost` accepts optional `headings` from `const { Content, headings } = await render(post)`. Pass these alongside the article data to enable its native, collapsible table of contents for Markdown h2/h3 headings. The panel sticks to the right on wide screens and appears before the body on narrow screens. No headings means no contents. The optional boolean frontmatter field `toc` overrides `THEME.TOC.ENABLED` (default `true`); starter users configure the default with `theme.toc.enabled`. MDX component-generated and raw HTML/JSX headings are not collected automatically.

## Site Config Injection

This package reads site-specific config from alias imports:

- `@anglefeint/site-config/site`
- `@anglefeint/site-config/theme`
- `@anglefeint/site-config/social`
- `@anglefeint/site-i18n/config`
- `@anglefeint/site-i18n/messages`

In the starter/site project, map these aliases to `src/config/*` and `src/i18n/*` in both Vite and TS config.

Package installation alone does not configure these aliases. Manual integrations must provide them explicitly; bundled fallback configuration files do not automatically resolve missing aliases.

Giscus comments are configured from site-side `theme.comments` (core IDs + behavior fields like `mapping`, `inputPosition`, `theme`, and `lang`). If required core fields are not set, comments are not rendered. When `mapping="specific"` set `term`; when `mapping="number"` set `number`.

## CLI

- `anglefeint-new-post`
- `anglefeint-new-page`

The post CLI executes your trusted `src/site.config.ts` with Jiti and uses the merged, enabled locale registry. Configuration failures stop generation before writing posts. `--locales` takes precedence over `ANGLEFEINT_LOCALES`, then configured locales; explicit overrides skip config loading. Missing configuration requires an explicit override. Existing posts are never overwritten.

Explicit locale overrides create content files only. They do not add/enable locales in site configuration; routes still require the target locale to be enabled. Default-cover selection is stable for a fixed sorted cover set and slug; adding or removing covers can change the assignment for future generated posts.

Examples:

```bash
# create one post slug in all default locales
npx anglefeint-new-post my-first-post

# create post only for selected locales
npx anglefeint-new-post my-first-post --locales en,fr

# or via environment variable
ANGLEFEINT_LOCALES=en,fr npx anglefeint-new-post my-first-post

# create a custom page with theme variant
npx anglefeint-new-page projects --theme base
npx anglefeint-new-page projects --theme ai
npx anglefeint-new-page projects --theme cyber
npx anglefeint-new-page projects --theme hacker
npx anglefeint-new-page projects --theme matrix
```

Run these inside a project with the theme installed. `npx` resolves the package's local binaries; a local npm installation does not put them on your ordinary terminal's PATH. Starter projects already provide `npm run new-post -- ...` and `npm run new-page -- ...`. The environment-variable example uses POSIX shell syntax. For most users, `#starter` is the recommended installation path.

## Static article search

Register `import search from '@anglefeint/astro-theme/search'` in Astro's integrations with `search({ enabled: THEME.SEARCH.ENABLED })`. After build, the integration writes `pagefind/` into Astro's output directory. The package owns the dependency, indexing hook and dialog; the starter supplies configuration and integration registration. Only `BlogPost` panels marked `data-anglefeint-search` are indexed, limited to title, subtitle and body. Frontmatter `search: false` excludes an article. The default `theme.search.enabled: true` controls both UI and indexing.

Indexes load only after opening search, using the current HTML language. Full search works in build + preview and deployed static output. Dev mode displays instructions. This integration targets static output and requires no search server.

## Tag browsing

Version 0.3.0 supports `theme.tags.enabled` (default `true`) and article `tags: string[]`. Starter-owned `/[lang]/tags/` routes generate static per-language archives using package tag utilities and shared blog cards. Include the new routes when adopting this feature; updating the npm package alone does not install routes. Use the matching current starter.

## Code block copy

Article-body `pre > code` blocks include an automatic upper-right copy button with localized success/failure feedback. Copy uses `code.textContent` and the browser Clipboard API; HTTPS/localhost and browser permission are required. Inline code is excluded. No additional dependency, configuration switch or author markup is required.

## Image preview

Article-body images outside links/buttons include a native modal preview with keyboard/backdrop dismissal and localized labels. Hero images are excluded. The preview uses `currentSrc || src`, not a separately fetched full-resolution original, and restores scrolling/focus on dismissal. It is initialized with the article runtime; no images means no modal. There is no gallery navigation, gesture zoom or configuration switch. No additional dependency or author markup is required.
