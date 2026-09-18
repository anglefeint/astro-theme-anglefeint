---
tags: ['anglefeint', 'starter']
title: 'User Guide 2: Write and Organize Content'
subtitle: 'Create posts and use covers, tags, the table of contents, image previews, code copying, search, and social images.'
description: 'Create posts and use covers, tags, the table of contents, image previews, code copying, search, and social images.'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

## Daily writing starts with content files

This guide assumes you completed setup in Guide 1. Site-wide options belong in `src/site.config.ts`; a post’s title, tags, and overrides belong in its Markdown frontmatter, between the opening pair of `---` lines. These are different places.

## 1. Create a post and understand its URL

From the project root, run:

```bash
npm run new-post -- my-first-post
```

By default, files are created for enabled locales. To create only an English version, use this command instead; do not run both:

```bash
npm run new-post -- my-first-post --locales en
```

It creates `src/content/blog/en/my-first-post.md` at `/en/blog/my-first-post/`. Use lowercase letters, numbers, and hyphens in the slug, without spaces or underscores. Existing files are skipped, never overwritten.

`--locales` selects files to create; it does not enable locales. Routes still depend on site configuration. Keep the same filename across translations and write each body yourself. Switching a post to a language without that translation leads to that language’s blog list.

## 2. Fill in frontmatter and choose a cover

Put this usable frontmatter at the very beginning of the file; write the body after the second `---`:

```yaml
---
title: 'My first post'
description: 'What I learned while building my blog.'
pubDate: '2026-09-18'
tags: ['astro', 'notes']
---
```

`title`, `description`, and `pubDate` are required. `subtitle`, `updatedDate`, and `author` are optional; the author falls back to the site author. Lists sort by `pubDate`, newest first. There is currently no draft or scheduled-publication filter: neither `draft: true` nor a future date hides a post. Keep unfinished content outside the content directory.

For a cover, use `heroImage: ./cover.jpg` with the image beside the post, or keep the local cover path assigned by the creation command. Automatic assignment happens only when images exist in `src/assets/blog/default-covers/`; no image is downloaded. `heroImage` is optional. Reading time and related content metrics are calculated automatically, so ordinary posts need no manual values.

These are estimates, not measurements from an AI service. Frontmatter values for `readMinutes`, `wordCount`, `tokenCount`, `aiLatencyMs`, and `aiConfidence` override the calculated values; omit them to use estimates. Some demonstration posts deliberately contain fixed values.

## 3. Generate a table of contents with headings

Write normal second- and third-level headings:

```md
## First topic

Write your explanation here.

### A closer look

Add details here.
```

The table of contents is enabled by default and uses `##` and `###`. It appears to the right on wide screens and above the body on narrow screens, and is absent when there are no matching headings. Try this page’s table of contents.

To disable it for one post, add this inside the existing frontmatter:

```yaml
toc: false
```

`toc: true` overrides a site-wide disabled setting; omission inherits `theme.toc.enabled`. Normal Markdown headings in MDX work, but headings generated inside components or raw HTML/JSX are not automatically collected.

## 4. Organize posts with tags

Add `tags: ["astro", "notes"]` to frontmatter. No separate tag configuration or manual routes are needed. Builds create a tag index and paginated lists for each language; the blog tag entry and post tags are clickable. Check `/en/tags/`.

Tags are case-sensitive: `Astro` and `astro` differ. Surrounding whitespace is trimmed, and repeated tags in one post count once. Non-Latin text and special characters receive stable encoded URLs; use generated links rather than guessing. Renaming a tag changes its link. Untagged posts still display normally. `theme.tags.enabled: false` disables tag links and tag page generation.

## 5. Image previews and code copying need no setup

Body images can reference files beside the post or in `public/images/`. These are two alternatives; add the corresponding image before using either:

```md
![A description of the image](./photo.jpg)

![A description of the image](/images/photo.jpg)
```

Click an ordinary body image, or press Enter/Space when focused, to enlarge it. Close with Esc, the close button, or the backdrop. Covers and images inside links or buttons are excluded. The preview uses the image source already selected by the browser; it does not automatically fetch a higher-resolution original or provide gallery navigation.

Use ordinary fenced code blocks:

````md
```js
console.log('Hello, world!');
```
````

A copy button appears at the top right, preserving indentation and line breaks. Test on HTTPS or localhost. If clipboard access fails, a message asks you to copy manually. Neither feature needs an extra switch.

## 6. Test search after building

Search is enabled by default and searches post titles and body text in the current language. `npm run build` generates the index. Run `npm run preview`, open header search, and search for a sentence from a post to verify its link. `npm run dev` shows a development notice instead of live full-text search.

To exclude one post from the index, add to frontmatter:

```yaml
search: false
```

This is not a privacy or draft setting: the post remains directly accessible and visible in lists. `theme.search.enabled: false` disables both the global entry and index generation. Rebuild after changing posts.

## 7. Automatic and custom social images

By default, a build generates a 1200×630 PNG for posts without `ogImage`, using the title, post author (or site author), and site name. No image API or per-post design work is needed. This does not change the body cover, `heroImage`.

For a custom image, put `share.png` beside the post and add to frontmatter:

```yaml
ogImage: ./share.png
```

Alternatively, use `ogImage: /images/share.png` for `public/images/share.png`. Direct HTTPS image URLs also work. Missing local files cause errors; external images depend on the external service.

An explicit `ogImage` takes priority. `theme.socialImage.enabled: false` only disables generation: manual images still work, while other posts fall back to a cover or default image. Inspect `og:image` in the built post HTML; generated files are under `dist/_social/`. Sharing platforms may cache an old preview after redeployment. The bundled font does not guarantee support for every emoji or writing system.

## 8. Use new-page for a standalone page

For example, create a project introduction page:

```bash
npm run new-page -- projects --theme cyber
```

This creates `src/pages/[lang]/projects.astro`, generating `/<locale>/projects/` for enabled locales. Edit that Astro file to provide content. The command neither translates the body nor adds a header navigation item.

Choose one `--theme`: `base`, `ai`, `cyber`, `hacker`, or `matrix`. Page slugs support nested paths such as `projects/labs`, still using lowercase letters, numbers, and hyphens. An existing page causes an error; do not run five theme variants for the same path in sequence. Use `new-post` for articles.

## In this series

- [User Guide 1: Set Up Your Blog](/en/blog/starter-guide-1-configure-your-site/)
- [User Guide 2: Write and Organize Content](/en/blog/starter-guide-2-languages-and-routing/)
- [User Guide 3: Enable and Customize Optional Features](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)
