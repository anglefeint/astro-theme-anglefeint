---
tags: ['anglefeint', 'starter']
title: 'User Guide 1: Set Up Your Blog'
subtitle: 'Install the starter, configure your site and languages, replace example posts, and deploy.'
description: 'Install the starter, configure your site and languages, replace example posts, and deploy.'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

## Start with the essentials

This series covers the accompanying 0.8.0 starter: setup, writing, and optional features. You do not need to understand every setting first. Replace the site identity and content, and keep the other defaults. These tutorials are ordinary blog posts, so you can try their table of contents, code copying, and search.

## 1. Install and open locally

Use Node.js 22.12.0 or newer and run:

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

Choose a project directory in the wizard, such as `my-blog`. Enter the directory actually created; adjust the first line below to match. Skip `npm install` if the wizard already installed dependencies.

```bash
cd my-blog
npm install
npm run dev
```

Open the local URL printed in the terminal; the port can change if occupied. For pnpm, use the same npm template command, skip dependency installation in the wizard, then run `pnpm install` and `pnpm dev`.

## 2. Set your name, homepage introduction, and links

Open `src/site.config.ts`. Keep its imports and exports; edit the object inside `defineThemeConfig({...})`. Here is a complete example of that configuration declaration. Replace the domain, name, text, and links with your own.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    description: 'My notes and projects.',
    url: 'https://example.com',
    author: 'Your Name',
    tagline: 'Built with Astro.',
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

The introduction beneath the homepage heading comes from the current locale’s `site.hero`. `site.description` is the default site description, while the homepage meta description prefers the locale’s `messages.siteDescription`. Changing only `site.description` does not replace the visible introduction.

Social icons support `github`, `twitter`, and `mastodon`. Use `social: { links: [] }` to remove all links. An empty list still shows three non-clickable placeholder icons (Mastodon, Twitter, GitHub) in the header and footer; a non-empty list shows only the configured entries. Existing environment overrides such as `PUBLIC_SITE_TITLE` and `PUBLIC_SITE_URL` take priority over the config file; check them if a change seems ineffective.

Set `PUBLIC_SITE_URL=https://your-domain.example` in the project-root `.env` file or your hosting build environment to override `site.url`. Restart development or rebuild after changing it. The resulting canonical links, RSS, sitemap, and absolute social image URLs should use that domain. This requires the matching starter-side `astro.config.mjs` and URL resolver; an npm theme update alone does not update these files.

## 3. Keep the languages you need

The defaults enable `en`, `ja`, `ko`, `es`, and `zh`. The first example sets the default language to `en`, but does not disable the others. For English only, merge the following into your existing `i18n`, preserving the homepage text above:

```ts
i18n: {
  defaultLocale: 'en',
  locales: {
    en: { meta: { enabled: true } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    zh: { meta: { enabled: false } },
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
npm run check
npm run build
npm run preview
```

`check` checks configuration/adapters, Astro files, and the built About configuration. `build` produces static output in `dist/`, including the search index and automatically generated social images by default. `preview` serves the built site locally; it does not publish it online. Stop the preview with Ctrl+C.

For static hosting, set the build command to `npm run build` and the output directory to `dist`. Set `site.url` to your actual domain first. Follow the [Astro deployment guide](https://docs.astro.build/en/guides/deploy/) for your platform’s repository, domain, and publishing steps. After deployment, check the homepage, posts, language switching, search, and `/<locale>/rss.xml`. Content or configuration changes require rebuilding and redeploying.

## 6. Remember three configuration rules

Edit the configuration object in `src/site.config.ts`; do not paste guide snippets into generated adapters such as `src/config/*`.

Keep a single `theme` and a single `i18n` key in the same object. Merge feature settings into existing objects rather than appending duplicate keys. Omitted settings retain defaults; arrays, such as tracks and social links, are replaced as a whole.

Updating the npm package in an older project does not automatically update local starter files. If settings or features are missing, consult the [upgrade guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md). Do not delete configuration helpers merely to suppress errors.

## In this series

- [User Guide 1: Set Up Your Blog](/en/blog/starter-guide-1-configure-your-site/)
- [User Guide 2: Write and Organize Content](/en/blog/starter-guide-2-languages-and-routing/)
- [User Guide 3: Enable and Customize Optional Features](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)
