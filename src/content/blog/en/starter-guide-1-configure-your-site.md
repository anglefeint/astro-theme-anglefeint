---
title: 'Anglefeint Starter Guide 1: Configure Your Site'
subtitle: 'The first fields to edit after creating a starter project'
description: 'Start with the real user-facing entry: site identity, social links, the About toggle, and replacing starter posts.'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

If you created your project from the Anglefeint starter, begin in `src/site.config.ts`.

That file is the main user-facing configuration entry. You do not need to chase settings across `src/config/*` or `src/i18n/*`.

## Start with site identity

Replace these fields first:

```ts
site: {
  title: 'Your Site Name',
  description: 'Your default site description.',
  url: 'https://example.com',
  author: 'Your Name',
  tagline: 'Built with Astro.',
}
```

What they currently affect:

- `site.title`: header, footer, page metadata, and RSS title
- `site.description`: site-level default description; the home page falls back to it when the current locale does not provide `messages.siteDescription`
- `site.url`: canonical URL, alternate locale URLs, RSS, and robots output
- `site.author`: default article author and SEO author metadata
- `site.tagline`: footer copy

Set `site.url` to your real production domain before deployment.

## Add your social links

Header and footer social links come from:

```ts
social: {
  links: [
    { href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' },
    { href: 'https://x.com/yourname', label: 'Twitter', icon: 'twitter' },
  ],
}
```

Supported built-in icons:

- `github`
- `twitter`
- `mastodon`

## Decide whether to keep the About page

Use:

```ts
theme: {
  enableAboutPage: true,
}
```

Set it to `false` if you do not want `/[lang]/about/` generated or shown in the header.

## Replace starter content

Posts live in:

```text
src/content/blog/<locale>/
```

To create a new localized post:

```bash
npm run new-post -- your-first-post
```

## Read next

- [Starter Guide 2: Configure Languages and Routing](/en/blog/starter-guide-2-languages-and-routing/)
- [Starter Guide 3: Configure Comments, About, and Theme Toggles](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)
