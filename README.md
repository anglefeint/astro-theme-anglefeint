<h1 align="center">Anglefeint</h1>
<p align="center">A cinematic, multi-atmosphere Astro theme for personal publishing.</p>

<p align="center">
  <a href="https://demo.anglefeint.com/">Live Demo</a>
  ·
  <a href="https://github.com/voidtem/astro-theme-anglefeint">Repository</a>
  ·
  <a href="ASTRO_THEME_LISTING.md">Theme Listing</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-en%20%7C%20ja%20%7C%20ko%20%7C%20es%20%7C%20zh-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## Template Install

```bash
npm create astro@latest -- --template voidtem/astro-theme-anglefeint
```

Or with `pnpm`:

```bash
pnpm create astro@latest --template voidtem/astro-theme-anglefeint
```

## Requirements

- Node.js `18+` (LTS recommended)
- Package manager: `npm`, `pnpm`, `yarn`, or `bun`

## Quick Start

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

With `pnpm`:

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Create New Post

Create the same slug in all locales (`en`, `ja`, `ko`, `es`, `zh`):

```bash
npm run new-post -- my-first-post
```

Slug rule: use lowercase letters, numbers, and hyphens only (example: `my-first-post`).

## Create New Page

`new-post` creates blog content only. For custom pages, use:

```bash
npm run new-page -- projects --theme base
```

Available themes: `base`, `br`, `mesh`, `term`, `matrix`.
The command creates `src/pages/[lang]/projects.astro` with locale routes via `getStaticPaths()`.

## Languages

English (this file) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [Español](README.es.md) · [한국어](README.ko.md)

## Preview

| Home | Blog List |
| --- | --- |
| ![Home preview](public/images/theme-previews/preview-home.png) | ![Blog list preview](public/images/theme-previews/preview-blog-list.png) |

| Blog Post (Open) | Blog Post (Collapsed) |
| --- | --- |
| ![Blog post open preview](public/images/theme-previews/preview-blog-post-open.png) | ![Blog post collapsed preview](public/images/theme-previews/preview-blog-post-collapsed.png) |

| About |
| --- |
| ![About preview](public/images/theme-previews/preview-about.png) |

## Route Atmospheres

- `/`: Matrix-inspired terminal landing
- `/:lang/blog`: cyberpunk archive mood
- `/:lang/blog/[slug]`: AI-interface reading layout
- `/:lang/about`: optional hacker-style profile page

## Features

- Astro 5 static output
- Markdown + MDX content collections
- Built-in locales: `en`, `ja`, `ko`, `es`, `zh`
- Per-locale RSS feeds
- Sitemap + robots support
- Config-driven customization
- Sticky footer (viewport-bottom on short pages)

## Theme Setup

1. Copy `.env.example` to `.env` and set site identity variables.
2. Update social links in `src/config/social.ts`.
3. Edit About content in `src/config/about.ts`.
4. Toggle About route/nav with `ENABLE_ABOUT_PAGE` in `src/config/theme.ts`.
5. Replace starter posts in `src/content/blog/<locale>/`.

## Configuration Surface

- Site identity: `src/config/site.ts` (or `PUBLIC_*` env vars)
- Theme behavior: `src/config/theme.ts`
- About content/runtime text: `src/config/about.ts`
- Social links: `src/config/social.ts`

## Docs

- Architecture: `docs/ARCHITECTURE.md`
- Visual systems: `docs/VISUAL_SYSTEMS.md`
- Submission checklist: `docs/THEME_SUBMISSION_CHECKLIST.md`
- Theme listing draft: `ASTRO_THEME_LISTING.md`
- Upgrading guide: `UPGRADING.md`
- Changelog: `CHANGELOG.md`

## License

MIT License. See `LICENSE`.
