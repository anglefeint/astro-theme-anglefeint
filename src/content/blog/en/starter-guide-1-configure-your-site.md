---
tags: ['anglefeint', 'starter']
title: 'User Guide 1: Set Up Your Blog'
subtitle: 'Install the starter, configure your site and languages, replace example posts, and deploy.'
description: 'Install the starter, configure your site and languages, replace example posts, and deploy.'
pubDate: '2026-03-07'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

## Start with the essentials

This series covers the accompanying starter: setup, writing, and optional features. You do not need to understand every setting first. Replace the site identity and content, and keep the other defaults. These tutorials are ordinary blog posts, so you can try their table of contents, code copying, and search.

## 1. Install and open locally

Use Node.js 22.12.0 or newer and run:

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
```

The command creates `my-blog` without installing dependencies. Run it from the parent directory; if you choose another name, update the creation command and `cd` together. Then install and start:

```bash
cd my-blog
npm install
npm run dev
```

Open the local URL printed in the terminal; the port can change if occupied. For pnpm, use the same creation command, then run `pnpm install` and `pnpm dev` instead of the npm installation/start commands.

## 2. Set your name, homepage introduction, and links

Open `src/site.config.ts`. Keep its imports and exports; edit the object inside `defineThemeConfig({...})`. Here is a complete example of that configuration declaration. Replace the domain, name, text, and links with your own.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    description: 'My notes and projects.',
    url: 'https://example.com',
    author: 'Your Name',
    tagline: '',
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: {
        site: { hero: 'Welcome to my blog.' },
        messages: { siteDescription: 'My notes and projects.' },
      },
    },
  },
  social: {
    links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
  },
});
```

`site.title` is the site name. Set `site.url` to the complete deployed URL: it affects canonical URLs, RSS, the sitemap, and social image URLs. `site.author` is the default post author; `site.tagline` is the footer text.

The footer separates copyright, theme/Astro credits and your optional `site.tagline` into independent groups, followed by social icons. Built-in credits follow the page language; your tagline stays unchanged across languages. Empty taglines take no space, and long text wraps on mobile. Existing configuration and `PUBLIC_SITE_TAGLINE` overrides still work; no migration is needed.

The introduction beneath the homepage heading comes from the current locale’s `site.hero`. `site.description` is the default site description, while the homepage meta description prefers the locale’s `messages.siteDescription`. Changing only `site.description` does not replace the visible introduction.

Social icons support `github`, `twitter`, `mastodon`, `youtube`, `bluesky`, `linkedin`, `discord`, `telegram`, `instagram`, `facebook`, `whatsapp`, `line`. For your own icon, put a local SVG/PNG/WebP in `public/icons/` and set `iconSrc: "/icons/community.svg"`; it overrides `icon` and retains its original colors. Omit both icon fields for text. See the [README](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/README.md#social-links) for path rules and examples. Use `social: { links: [] }` to remove all links. An empty list still shows three non-clickable placeholder icons (Mastodon, Twitter, GitHub) in the header and footer; a non-empty list shows only the configured entries. Existing environment overrides such as `PUBLIC_SITE_TITLE` and `PUBLIC_SITE_URL` take priority over the config file; check them if a change seems ineffective.

In the 0.27+ integration starter, the theme package handles `PUBLIC_SITE_URL` from the project-root `.env` or hosting build environment, overriding `site.url` for canonical links, RSS, sitemap and social images. Restart development or rebuild after changes. Keep the starter’s `astro.config.mjs` integration entry; no local URL resolver or copied adapters are needed. Pre-0.27 copied skeletons require the one-time migration in the upgrade guide.

## 3. Keep the languages you need

The defaults enable `en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru`, `zh-hant`. The first example sets the default language to `en`, but does not disable the others. For English only, merge the following into your existing `i18n`, preserving the homepage text above:

```ts
i18n: {
  defaultLocale: 'en',
  locales: {
    en: { meta: { enabled: true } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    zh: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

Configuration is deeply merged with defaults. Omitting a locale does not remove it: set `meta.enabled: false` explicitly. The default locale remains enabled. Language settings control menu options and routes; they neither translate posts nor delete files. Visit `/en/` and check the language menu.

## 4. Replace examples and write your first post

Posts live in `src/content/blog/<locale>/`. Each default locale contains `welcome-to-anglefeint.md` and three `starter-guide-*.md` examples, including this tutorial. After making a backup, delete unwanted example Markdown files or keep the guides for reference. Do not delete configuration directories or images still referenced by posts.

```bash
npm run new-post -- my-first-post
```

This creates a post with the same filename for each enabled locale; it does not translate the body. Edit the title, description, and content in `src/content/blog/en/my-first-post.md`, then visit `/en/blog/my-first-post/`. Guide 2 explains fields, images, and tags.

## 5. Check, build, and deploy

Use `npm run dev` while developing. Before deployment, run these in the project directory:

```bash
npm run doctor
npm run preview
```

`doctor` checks the project and includes a build, producing static output in `dist/` with the search index and default social images. No additional `check` or `build` is needed after it succeeds. `preview` serves that output locally; it does not publish it. Stop it with Ctrl+C.

For static hosting, set the build command to `npm run build` and the output directory to `dist`. Set `site.url` to your actual domain first. Follow the [Astro deployment guide](https://docs.astro.build/en/guides/deploy/) for your platform’s repository, domain, and publishing steps. After deployment, check the homepage, posts, language switching, search, and `/<locale>/rss.xml`. Content or configuration changes require rebuilding and redeploying.

Cloudflare is optional. See the [deployment settings by platform](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/README.md#deployment) for Netlify, Vercel, Cloudflare Pages, GitHub Pages and self-hosting, including the current domain-root requirement.

## 6. Remember three configuration rules

Keep a single `theme` and a single `i18n` key in the same object. Merge feature settings into existing objects rather than appending duplicate keys. Omitted settings retain defaults; arrays, such as tracks and social links, are replaced as a whole.

Standard pages, configuration defaults and build features come from the theme package in the 0.27+ integration starter. Keep your configuration values in `src/site.config.ts`. Theme upgrades do not rewrite your articles, music, images or custom pages; pre-0.27 copied skeletons require the one-time migration in the [upgrade guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

## In this series

- [User Guide 1: Set Up Your Blog](/en/blog/starter-guide-1-configure-your-site/)
- [User Guide 2: Write and Organize Content](/en/blog/starter-guide-2-languages-and-routing/)
- [User Guide 3: Enable and Customize Optional Features](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)

---

## Upgrade the theme

The integration starter keeps standard pages, configuration defaults, translations and build features in the theme package. Your articles, `src/site.config.ts`, music, images and custom pages remain in your project.

For integration starters using npm, run the command below from the project root. It checks project/Node/Astro compatibility, backs up dependency files, installs an exact theme version and runs doctor. On failure it restores dependency files and attempts to reinstall the previous dependencies. Rebuild output is ready for your normal deployment; the command does not publish your site.

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Pre-0.27 projects require a one-time fresh-starter migration: create a new template in a separate directory, migrate articles and resources, and merge personal values into the new site configuration. Do not copy the old standard routes, adapters or default/schema/runtime helpers. Keep article slugs, locale paths, music/image URLs and hosting settings.

The automatic updater currently supports npm only and refuses pnpm/yarn/bun lockfiles. `--check` previews compatibility without changing files; `--to 0.27.1` selects an exact release. Read the [upgrade guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md) and [GitHub Releases](https://github.com/anglefeint/astro-theme-anglefeint/releases), especially for Astro or starter-schema changes.

If an upgrade fails, do not deploy `dist/`: dependency rollback does not restore previous build output. Resolve the error and run `npm run doctor` successfully before deploying. pnpm users update explicitly with `pnpm add @anglefeint/astro-theme@latest` and `pnpm run doctor`; keep their lockfile and review release compatibility first.
