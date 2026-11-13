[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/en/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">A cinematic Astro publishing theme with distinct atmospheres, built for human readers and AI agents.</p>

Automatically generates `llms.txt`, multilingual indexes, full-text collections and article Markdown for AI agents to read and cite, supporting GEO (generative engine optimization).

<p align="center">
  <a href="https://demo.anglefeint.com/en/">Live demo</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">Repository</a>
</p>

<p align="center">
  <a href="#ai-assistant">AI assistants</a> · <a href="#installation">Install</a> · <a href="#setup">Site setup</a> · <a href="#writing">Write</a> · <a href="#upgrade">Upgrade</a> · <a href="#deployment">Build and deploy</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## What can Anglefeint do?

Write articles in Markdown/MDX and capture brief thoughts with Fragments. Built-in features include multiple languages, search, tags, contents, code copying, image previews, math and automatic article share images. Enable comments, music and GA4 as needed.

| Page               | Visual atmosphere                                         |
| ------------------ | --------------------------------------------------------- |
| Home               | Matrix: green code rain, terminals and a pixel avatar     |
| Blog and tag lists | Cyberpunk: neon, rain and urban light beams               |
| About              | Hacker: profile, virtual terminal and interactive tools   |
| Article detail     | AI: network background, monitors and OUTPUT reading panel |

Builds also generate Markdown for public articles, About and Fragments, plus `llms.txt` and multilingual full-text collections for AI tools. No separate production server is required; model indexing or citation is not guaranteed.

<a id="ai-assistant"></a>

## Work with an AI assistant

Ask Cursor, Codex or Claude Code to configure your site and manage content following the current project's `AGENTS.md`. Existing `CLAUDE.md` and Cursor rules point to the relevant guidance. Describe the change, have the assistant inspect actual configuration and the relevant section here, and use the demo reference when field details are needed.

For theme development, start with this repository's [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) and [contribution guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CONTRIBUTING.md). Blog users need not learn maintainer release procedures first.

<a id="installation"></a>

## 1. Install and start

Requires **Node.js 22.12.0 or newer**. The template uses **Astro 7**. In the directory where you want your blog, run:

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

Open the URL printed in the terminal. For an existing project, run `npm install` and `npm run dev` in its original directory rather than recreating it. Stop the server with Ctrl+C. Run subsequent commands at the project root, either after stopping dev or in another terminal.

New projects can also use `pnpm install` and `pnpm dev`. Keep one package manager per project. Examples below use npm; the automatic upgrader currently supports npm projects only.

Detailed steps: [Install your blog and make it yours](https://demo.anglefeint.com/en/blog/starter-guide-1-configure-your-site/).

<a id="setup"></a>

## 2. First setup: replace the site information

Your installed project already includes `src/site.config.ts`. **Edit that file directly; do not create another config file or declare a new config object.**

Add the following `site` section inside the existing `defineThemeConfig({ ... })`, replacing name, author, description and domain with your own. The starter omits `site` and uses package defaults. If your file already has `site`, edit its fields while retaining other settings; do not duplicate the object. Keep the existing imports, exports and remaining configuration.

```ts
site: {
  title: '我的博客',
  author: '你的名字',
  description: '记录项目、阅读和生活。',
  url: 'https://your-domain.example',
},
```

This changes global information without changing language settings. Without a localized `homeTitle`, the homepage heading uses global `title`. You can also replace the homepage introduction, About content and socials; see the tutorials/references linked below.

`site.url` is the public production address, not the local dev URL. Deployment `PUBLIC_SITE_URL` overrides it; check that variable first if an old domain remains after editing.

Initial settings enable nine languages, default to English, and redirect `/` to `/en/`. Documentation language does not determine your site's default language. To change the default or publish fewer languages, follow the [language tutorial](https://demo.anglefeint.com/en/blog/starter-guide-languages/). Omitting a language does not disable it; the default is always enabled. Articles are not translated automatically. Remove example articles after backing up or committing to Git, and retain images still referenced by content.

Tutorials: [Installation and first setup](https://demo.anglefeint.com/en/blog/starter-guide-1-configure-your-site/), [Languages and homepage addresses](https://demo.anglefeint.com/en/blog/starter-guide-languages/). References: [Site and shared interface](https://demo.anglefeint.com/en/blog/config-site-chrome/), [Home](https://demo.anglefeint.com/en/blog/config-home/).

<a id="writing"></a>

## 3. Write your first article

Create an article at the project root:

```bash
npm run new-post -- my-first-post
```

Without `--locales` or `ANGLEFEINT_LOCALES`, the command reads all enabled project languages and creates a same-named skeleton for each. Initial settings enable nine languages, so nine files are created. If you changed enabled languages, it follows those settings. Bodies are not translated, and existing files are never overwritten.

Files live at `src/content/blog/<语言>/my-first-post.md`, with article URL `/<语言>/blog/my-first-post/` and list `/<语言>/blog/`. For example: English `src/content/blog/en/my-first-post.md`, Chinese `src/content/blog/zh/my-first-post.md`. Open the files you need and edit title, description and body; routes require no manual creation. Minimal content:

```md
---
title: '我的第一篇文章'
description: '记录这次开始写博客的想法。'
pubDate: '2026-11-13'
---

这里开始写正文。
```

Only required fields are shown. You may retain the generated cover and other optional fields. Ordinary article slugs use lowercase letters, digits and hyphens, such as `my-first-post`.

Use `--locales` when you want specific languages only. These are alternatives; do not run every example:

```bash
# English only
npm run new-post -- my-first-post --locales en

# Chinese only
npm run new-post -- my-first-post --locales zh

# Selected languages
npm run new-post -- my-first-post --locales en,zh
```

`--locales` selects files without enabling languages. A language must be enabled in site configuration for its pages to build. New files in one invocation share one randomly chosen default cover when the source pool contains images. Existing files still remain untouched.

`ANGLEFEINT_LOCALES` can also select languages. Priority: `--locales` → environment variable → enabled project languages. In Bash: `ANGLEFEINT_LOCALES=zh,en npm run new-post -- my-first-post`. In PowerShell, use the `--locales` examples above.

**Drafts and future dates are not automatically hidden.** Generated language skeletons also become public in builds. Finish intended content and move unpublished files outside content collections before publishing. Neither `draft: true` nor `search: false` makes an article private.

Tutorials: [Write your first article](https://demo.anglefeint.com/en/blog/starter-guide-2-languages-and-routing/), [Add images](https://demo.anglefeint.com/en/blog/starter-guide-images/). Reference: [Article details and frontmatter](https://demo.anglefeint.com/en/blog/config-article/).

## 4. Publish a fragment

Fragments suit brief text, images or code. **Fragments are disabled by default in both the theme and new starter; the demo enables them separately.** To enable them, set `fragments.enabled: true` in the existing `theme` object in `src/site.config.ts`. The merged structure below should not create a duplicate theme:

```ts
theme: {
  fragments: { enabled: true },
},
```

If `enabled: true` already exists, no addition is needed. Change false to true if necessary. This switch controls the fragment list and homepage preview entry; comments remain off by default.

Create a fragment, defaulting to skeletons for the same entry in every enabled project language:

```bash
npm run new-fragment
```

To create only selected languages, choose suitable parameters:

```bash
# Chinese only
npm run new-fragment -- --locales zh

# Selected languages
npm run new-fragment -- --locales en,zh
```

Each invocation creates a new entry. These are alternatives, not a sequence to execute. CLI language selection does not change site language switches.

Files appear in `src/content/fragments/<语言>/`, with names such as `2026-11-13-aB3dE6gH.md`; the terminal prints actual paths. Edit the body and retain the generated eight-character alphanumeric ID. Translations created together share ID and publication time. Do not rerun creation commands to edit an existing entry.

Lists use `/<语言>/fragments/`, such as `/en/fragments/` and `/zh/fragments/`. A language's homepage shows the avatar preview when it has fragments. Stable sharing uses `/<语言>/fragments/#ID`, not page numbers as identity. Changing IDs affects links and discussion matching. Fragment comments default off.

Tutorial: [Publish a fragment](https://demo.anglefeint.com/en/blog/starter-guide-5-fragments/). Reference: [Fragments](https://demo.anglefeint.com/en/blog/config-fragments/).

## 5. Create a custom page

Use `new-post` for articles and `new-page` for independent project or portfolio pages:

```bash
npm run new-page -- projects
```

This creates `src/pages/[lang]/projects.astro`, using the `base` theme by default. Edit its content and visit `/<语言>/projects/`, such as `/en/projects/`. One file generates pages for all enabled languages without translating content or adding navigation automatically.

To choose a visual style, add `--theme`: `base`, `matrix`, `cyber`, `hacker` or `ai`. For example, `npm run new-page -- portfolio --theme cyber` creates another Cyberpunk page.

Nested paths are supported:

```bash
npm run new-page -- projects/labs --theme hacker
```

Each segment uses lowercase letters, digits and hyphens; avoid uppercase, underscores and leading/trailing slashes. Existing files are not overwritten, and reserved standard routes cannot be recreated with this command.

Detailed steps: [Customize pages and features](https://demo.anglefeint.com/en/blog/starter-guide-3-comments-about-and-theme-toggles/).

## 6. Prepare images and retain generated files

Article bodies use ordinary Markdown images: place `photo.jpg` beside the article and write `![Image description](./photo.jpg)`. For a cover, set frontmatter `heroImage: ./cover.jpg` after creating the file. Public image URLs omit the public prefix.

Covers and supported local fragment images need persisted responsive files. Prepare them explicitly locally, or check existing output:

```bash
npx @anglefeint/astro-theme prepare-covers
npx @anglefeint/astro-theme prepare-covers --check
```

Local dev and local doctor prepare missing/stale derivatives. build and CI doctor only check; deployment does not regenerate them. Commit originals and all of `src/assets/blog/covers/`, including `manifest.json` and `generated/`. For missing/stale/modified errors, prepare and commit locally before rebuilding.

This does not mean all ordinary article-body images are compressed. See the [image tutorial](https://demo.anglefeint.com/en/blog/starter-guide-images/) for supported inputs, paths and sharing rules.

<a id="reference"></a>

## Configure features as needed

This page covers common commands and first operations. Open a tutorial or field reference when adjusting functionality. References explain types, defaults, limits, examples and currently unused fields individually.

| Goal                                                   | Tutorial                                                                                                                                                                                                 | Configuration reference                                                                                                                                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home, site information, navigation, socials and footer | [Customize pages and features](https://demo.anglefeint.com/en/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                    | [Home](https://demo.anglefeint.com/en/blog/config-home/), [Site and shared interface](https://demo.anglefeint.com/en/blog/config-site-chrome/)                                               |
| List size, tags and pagination                         | [Customize pages and features](https://demo.anglefeint.com/en/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                    | [Blog List and tags](https://demo.anglefeint.com/en/blog/config-blog-list/)                                                                                                                  |
| Contents, math, OUTPUT and search inclusion            | [Write your first article](https://demo.anglefeint.com/en/blog/starter-guide-2-languages-and-routing/)                                                                                                   | [Article details](https://demo.anglefeint.com/en/blog/config-article/), [Search and discovery](https://demo.anglefeint.com/en/blog/config-search/)                                           |
| About, terminal and Decoder                            | [Customize pages and features](https://demo.anglefeint.com/en/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                    | [About](https://demo.anglefeint.com/en/blog/config-about/), [Terminal](https://demo.anglefeint.com/en/blog/config-terminal/), [Decoder](https://demo.anglefeint.com/en/blog/config-decoder/) |
| Music and comments                                     | [Music setup](https://demo.anglefeint.com/en/blog/starter-guide-3-comments-about-and-theme-toggles/), [Let readers leave comments](https://demo.anglefeint.com/en/blog/starter-guide-4-giscus-comments/) | [Music](https://demo.anglefeint.com/en/blog/config-music/), [Giscus and shared discussions](https://demo.anglefeint.com/en/blog/config-comments/)                                            |
| Languages, analytics and public text supplements       | [Languages](https://demo.anglefeint.com/en/blog/starter-guide-languages/), [Deployment](https://demo.anglefeint.com/en/blog/starter-guide-deployment/)                                                   | [Languages and fallback](https://demo.anglefeint.com/en/blog/config-languages/), [GA4 and AI context](https://demo.anglefeint.com/en/blog/config-analytics-ai/)                              |

Find unfamiliar fields in the [configuration index](https://demo.anglefeint.com/en/blog/config-reference/). Changing interface messages does not translate content. Both configuration and content changes require rebuilding and redeploying.

<a id="upgrade"></a>

## 7. Upgrade an existing blog

New installations can skip this section and continue to [checks, preview and first deployment](#deployment).

Save your changes, for example with a Git commit. Stop dev and preview. At the original project root, check compatibility before upgrading:

```bash
npx @anglefeint/astro-theme@latest upgrade --check
npx @anglefeint/astro-theme@latest upgrade
```

`--check` changes no files, installs nothing and does not build. Actual upgrades support npm integration starters with `package-lock.json` and `anglefeint.projectSchema: 1`. pnpm/yarn/bun projects cannot bypass restrictions by deleting their lockfile.

The upgrader updates theme dependencies and runs doctor while preserving articles, personal settings, music, images and custom pages. It backs up two dependency files under `.anglefeint/backups/`, not the entire site. Installation/check failures restore those files and attempt reinstalling old dependencies. Never deploy leftover `dist/` after a failure.

Select a specific version with `npx @anglefeint/astro-theme@latest upgrade --to <version>`, replacing the placeholder with an explicit compatible version. Automatic downgrades are unsupported. Successful upgrades already check and build; run `npm run preview` directly without immediately rebuilding. Upgrades neither publish your site nor automatically migrate incompatible Astro versions.

Copied skeletons from before 0.27 need a fresh starter, the retained old project, and migration of personal content/assets; direct in-place upgrading is unsupported. Do not copy old standard-route or adapter implementations.

Detailed steps and recovery: [Upgrade an existing project](https://demo.anglefeint.com/en/blog/starter-guide-1-configure-your-site/), [Upgrade guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md), [Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases).

<a id="deployment"></a>

## 8. Check, preview and deploy for the first time

Stop dev at the project root. Check and build, then preview the generated site:

```bash
npm run doctor
npm run preview
```

`npm run doctor` includes checks and build. `npm run check` is its alias; choose one, without immediately repeating check/build afterward. For Astro/TypeScript checks without building, use `npm run check:no-build`. preview serves build output locally, stops with Ctrl+C and uploads nothing. Real search also requires built preview; dev shows a development notice only.

If you need only a build without full checks, use this alternative pair:

```bash
npm run build
npm run preview
```

For pnpm, use `pnpm run doctor` / `pnpm preview`, or `pnpm build` / `pnpm preview`. Do not shorten the check to `pnpm doctor`, which can call pnpm's own diagnostic command. Choose one pair; avoid duplicate builds.

For your first static-host deployment:

1. Set `site.url` or `PUBLIC_SITE_URL` to the production address. Commit content, image originals and generated files.
2. Set the hosting build command to `npm run build` and output directory to `dist`. For manual uploads, upload **all contents of a successfully built dist**.
3. Retain `_astro/`, `pagefind/`, `_social/`, public text and other generated output; do not upload HTML alone.
4. Deploy at the domain root with directory-index routing. Arbitrary subpaths still require adaptation; setting Astro base alone does not establish full-site support.
5. Bind the domain and HTTPS with your host, then inspect Home, articles, language entries, images and search.

The site is static output, requiring neither production Node.js nor another hosting adapter. Terminal JSON noindex headers merge into built `dist/_headers`. Compatible hosts apply them; other platforms need equivalents. Astro preview does not emulate hosting headers. Rebuild and fully deploy after configuration/content changes.

Detailed steps: [Publish your blog on your own domain](https://demo.anglefeint.com/en/blog/starter-guide-deployment/).

## License

This theme uses the [MIT License](LICENSE).

## Previews

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### Share preview

![Anglefeint default share image](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

### Screenshots

| Home                                                           | Blog cards                                                                |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · List view                                                           |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| Article                                                                  |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| Blog pagination                                                                   | Related articles                                                                |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| ![Blog pagination](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![Related articles](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · Cypherpunk resources                                                   |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |
