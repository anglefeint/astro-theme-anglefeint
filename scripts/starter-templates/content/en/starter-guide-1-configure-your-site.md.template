---
tags: ['anglefeint', 'starter']
title: 'User Guide 1: Install the Blog and Make It Yours'
subtitle: 'Run the blog locally, replace your information, create a post using the default workflow, and optionally adjust languages and homepage text.'
description: 'Installation, personal information, the default publishing workflow and local checks; existing projects can use the upgrade section at the end.'
pubDate: '2026-03-07'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

This is part 1 of 8. [See the full tutorial sequence](/en/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Look up configuration fields](/en/blog/config-reference/).

By the end, you can open the blog on your computer, replace the site name, homepage introduction and contact information, and find where to write your first post. Music, comments and page customization can wait until you need them.

If you already have an Anglefeint project, edit that project. To update the theme, use “Upgrade an existing project” below; you do not need another installation.

<a id="tutorial-order"></a>

## How should I read the eight tutorials?

For a first installation, follow this order. Fragments, comments and language changes are optional; installing the blog does not require enabling them. The language of the documentation does not determine your site's default language. Follow the language section when you want to change it. To look up an individual field later, open the [configuration reference index](/en/blog/config-reference/).

| Order | Tutorial                                                                                               | What you can do afterward                                                          |
| ----- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 1     | [Install the blog and make it yours](/en/blog/starter-guide-1-configure-your-site/)                    | Run the blog, replace personal information and understand the default workflow.    |
| 2     | [Write your first post](/en/blog/starter-guide-2-languages-and-routing/)                               | Create posts, set dates, and use headings, tags, code and formulas.                |
| 3     | [Add images to posts and fragments](/en/blog/starter-guide-images/)                                    | Add originals, choose covers, prepare images and commit derived files.             |
| 4     | [Publish a fragment](/en/blog/starter-guide-5-fragments/)                                              | Create a fragment, keep its stable ID, and add images and code.                    |
| 5     | [Adjust pages and features to your liking](/en/blog/starter-guide-3-comments-about-and-theme-toggles/) | Change page content, music and pagination, and create custom pages.                |
| 6     | [Let readers leave comments](/en/blog/starter-guide-4-giscus-comments/)                                | Connect Giscus and choose how posts, fragments and translations share discussions. |
| 7     | [Make the blog available in more languages](/en/blog/starter-guide-languages/)                         | Choose languages, adjust homepage addresses and add translations.                  |
| 8     | [Publish the blog on your own domain](/en/blog/starter-guide-deployment/)                              | Check build output, deploy all files and connect a domain.                         |

The links at the beginning and end of each tutorial return here so you can continue or find a specific topic.

## 1. Install and open the blog

Prepare Node.js 22.12.0 or newer and npm. Run these commands in a terminal and check that both print a version:

```bash
node --version
npm --version
```

Create the blog in the directory where you want to keep projects. This creates `my-blog` without installing dependencies automatically:

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

You may replace `my-blog` with another directory name; update the `cd` command too. Open the local address printed by the terminal. Do not assume the port is fixed: an occupied port may cause it to change. Keep the development server running, and press `Ctrl+C` to stop it.

Run subsequent commands in the project root, the directory containing `package.json`. When returning to an existing project, enter that directory and run `npm run dev`. You only need `npm install` for the first dependency installation or after dependencies change.

This tutorial uses npm. New pnpm projects can use `pnpm install` and `pnpm dev` instead, but the automatic updater below currently supports npm projects only. Keep one package manager per project.

## 2. Replace the site information and homepage text

The installed project already includes `src/site.config.ts`. Edit that file; do not create another configuration file or declare a new configuration object. The starter omits `site` and uses the theme defaults. Add the following fields inside the existing `defineThemeConfig({ ... })`. If `site` already exists, edit its fields and preserve your other settings instead of adding a duplicate object. Keep the file's existing imports, exports and other content.

```ts
site: {
  title: '小林的博客',
  description: '记录开发、阅读和生活。',
  url: 'https://example.com',
  author: '小林',
  tagline: '保持好奇，持续记录。',
},
```

This is a fragment of the existing object, not a new complete configuration file. Replace the name, text and domain with your own values. It does not change the default or enabled languages. Set `site.url` to your final public domain, such as `https://your-domain.example`, not the local preview address or a post URL. You can keep the example temporarily if you have no domain yet, but replace it before deployment. The theme currently expects deployment at a domain root; setting Astro `base` alone does not make subdirectory deployment fully supported.

The fields have these roles:

| Field              | Actual role                                                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.title`       | Global site name in page titles, navigation, footer and other output; also the final homepage-title fallback when no separate homepage title is configured. |
| `site.author`      | Default author for posts without their own author.                                                                                                          |
| `site.url`         | Public site address for canonical URLs, RSS, sitemap and sharing output.                                                                                    |
| `site.description` | Site-level fallback description; the homepage prefers resolved `messages.siteDescription` and uses this only when that value is empty.                      |
| `site.tagline`     | Custom footer text; `''` hides that text. Theme and Astro credits have a separate switch.                                                                   |

### Optionally change homepage text for a language

Set the visible homepage introduction and metadata description under the relevant language. This example uses the project's default English homepage. Add or merge `i18n` inside the existing configuration object, editing matching fields if it already exists:

```ts
i18n: {
  locales: {
    en: {
      site: { hero: 'Notes on projects, reading and everyday life.' },
      messages: { siteDescription: 'Personal projects and learning notes by Lin.' },
    },
  },
},
```

`i18n.locales.en.site.hero` controls the visible introduction below the English homepage title; `messages.siteDescription` controls that page's SEO description. Setting the former to `''` clears the visible introduction without clearing the latter. Replace en with another enabled language code to edit its text. This does not change the default language or translate other languages.

The homepage title defaults to the global site name. To use a different title, add `homeTitle` to the same `en.site`, retaining `hero`:

```ts
site: {
  homeTitle: "Lin's Digital Garden",
  hero: 'Notes on projects, reading and everyday life.',
},
```

This `site` is inside `i18n.locales.en`, not the top-level `site`. `homeTitle` changes only the visible homepage title, not the global name used by browser titles, navigation, footer or RSS. When omitted or blank, the language fallback chain is searched before using the global site name. See the [homepage reference](/en/blog/config-home/#home-title) for the complete field definition.

### Add your social links

Add or edit `social.links` inside the existing configuration object, replacing `yourname` with your account:

```ts
social: {
  links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
},
```

Each entry needs `href` (destination) and `label` (accessible name). `icon` is an optional built-in icon name. Supported icons are `github`, `twitter`, `mastodon`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp` and `line`.

The header and footer share `social.links`, in array order. Header social links are hidden at mobile widths; footer links remain. Arrays replace the entire default list, so include every entry you want to retain when adding accounts. Use `social: { links: [] }` if you have no accounts yet. An empty list retains three non-clickable placeholder icons rather than hiding the entire area.

### Changed something but see no difference?

Check the project-root `.env`, other applicable `.env.*` files, and the hosting platform's build environment for old overrides:

- `PUBLIC_SITE_TITLE` overrides the site name.
- `PUBLIC_SITE_AUTHOR` overrides the default author.
- `PUBLIC_SITE_URL` overrides the site address.
- `PUBLIC_SITE_DESCRIPTION` overrides the site-level description, but not a nonempty localized homepage description.
- `PUBLIC_SITE_TAGLINE` overrides custom footer text.

Remove unneeded overrides and use the configuration file. You do not need an `.env` file merely to use the theme. Restart dev after changing environment variables. Published pages require a rebuild and redeployment; saving a local file does not change the live site.

## 3. Keep the default languages, then adjust if needed

The initial configuration enables `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru` and `zh-hant`, with `en` as the default. Visiting `/` redirects to `/en/`. The documentation language does not require changing the site to Chinese or disabling other languages before creating your first post.

To change the default language, keep only selected languages, or serve the default-language homepage directly at `/`, follow [part 7: make the blog available in more languages](/en/blog/starter-guide-languages/). These changes are optional. Omitting a language does not disable it; set `meta.enabled: false` explicitly. The default language remains enabled. Disabling a language does not delete its posts.

See the [language reference](/en/blog/config-languages/#registry) for types, defaults and address behavior. The theme does not translate posts or homepage copy automatically. Notice which language files the default creation command generates below.

## 4. Replace the examples with your own posts

Articles live in `src/content/blog/<locale>/`. The starter’s `welcome-to-anglefeint.md`, `starter-guide-*.md` and `config-*.md` are ordinary blog posts: the welcome sample, eight tutorials and configuration dictionary. After a backup or Git commit, keep or remove unwanted content per language. Removing the welcome post and tutorials does not remove the dictionary. Do not delete images still referenced by other content.

Create a post using the default workflow:

```bash
npm run new-post -- my-first-post
```

Without `--locales` or `ANGLEFEINT_LOCALES`, the command creates matching skeletons for every enabled language: nine files with the initial configuration. It does not translate content. Existing files are skipped rather than overwritten.

Open `src/content/blog/<语言代码>/my-first-post.md` and edit the title, description and body. Its address is `/<语言代码>/blog/my-first-post/`. For example, the English file is in en and uses `/en/blog/my-first-post/`; Chinese uses zh and `/zh/blog/my-first-post/`. Before publication, move unfinished skeletons you do not want public outside the content directory; they are not automatically hidden drafts.

To create only one language, optionally use `npm run new-post -- my-first-post --locales zh`; use `--locales en,zh` for selected languages. Choose the form you need rather than running all examples. `--locales` itself does not enable a language.

See [writing and managing content](/en/blog/starter-guide-2-languages-and-routing/) for post fields, covers, code and formulas.

## 5. Confirm the result locally

Check the development pages: the site name and homepage introduction are yours, the language menu is as intended, your post opens, and social links point to real accounts. Files in other language directories produce routes only while those languages are enabled.

Before checking build output, stop dev with `Ctrl+C`, then run:

```bash
npm run doctor
npm run preview
```

Local `doctor` prepares missing or stale responsive images, runs Astro checks and builds the site. When About is enabled, it also checks the corresponding runtime configuration. After success, do not immediately repeat `check` or `build`. If a step fails, address the terminal error and rerun `doctor`; never deploy the remaining `dist/` after a failed build.

`preview` serves the built static website in `dist/`; open its printed address. It does not publish the blog online. Test article search in this built preview because `dev` has no live full-text search. Stop preview with `Ctrl+C`.

For deployment, use `npm run build` and output directory `dist`, and deploy every generated file. After adding or replacing local images, run local dev or doctor and commit the originals and the entire generated `src/assets/blog/covers/` directory. Deployment builds and CI doctor validate these responsive files without generating missing ones; absent or stale files cause failure. Content or configuration changes require rebuilding and redeploying.

## Upgrade an existing project

Skip this section for a new installation. Existing projects should first save changes, for example in Git, then stop dev and preview and run this from the original project root:

```bash
npx @anglefeint/astro-theme@latest upgrade --check
```

`--check` queries the target version and checks project, Node.js and Astro compatibility without modifying project files, installing or building. When it succeeds, run the actual upgrade:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Automatic upgrades support integration starters using npm and `package-lock.json`. Their `package.json` must contain `anglefeint.projectSchema: 1`, with standard pages supplied by the theme package. A pnpm, yarn or bun lockfile stops the updater; do not delete your lockfile to bypass this protection. Non-npm projects must update dependencies with their original manager after checking target compatibility, then run the project's doctor. The automatic updater does not provide rollback for that path.

The updater changes the theme dependency and runs doctor without rewriting posts, configuration, music, images or custom pages. It backs up `package.json` and `package-lock.json` under `.anglefeint/backups/`; that is not a whole-site backup. If installation or doctor fails, it restores those two files and attempts to reinstall the previous dependencies. If restoration also fails, fix the dependency error, then successfully run `npm run doctor`. Previous build output is not restored, so do not deploy `dist/` after failure.

Incompatible Node.js, Astro or starter schema stops the update; Astro migrations are not automatic. `--to` selects a compatible explicit theme version, but automatic downgrades are unsupported. Consult [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases) for changes. After a successful upgrade, use `npm run preview` to inspect the already-built result and deploy normally; another immediate build is unnecessary.

Copied skeletons from before 0.27 cannot be upgraded in place. Install a new starter in a separate directory, keep the old project, migrate articles and resources, and merge personal values into the new `src/site.config.ts`. Do not copy old standard routes, adapters or defaults/schema/runtime helpers. Check post slugs, language paths, music and image URLs, domain and hosting settings, then finish local checks and deployment.

## Tutorial navigation and configuration reference

[Next: write your first post](/en/blog/starter-guide-2-languages-and-routing/) · [All eight tutorials](/en/blog/starter-guide-1-configure-your-site/#tutorial-order).

Related fields: [site, social links and footer](/en/blog/config-site-chrome/), [homepage title and introduction](/en/blog/config-home/), [language settings](/en/blog/config-languages/). Use the [reference index](/en/blog/config-reference/) for full paths, defaults and limits.
