---
tags: ['anglefeint', 'starter']
title: 'User Guide 5: Publish Fragments'
description: 'Publish brief thoughts as Markdown, with optional popup comments.'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
updatedDate: '2026-11-12'
---

## AI-readable content

Builds now include public articles, enabled Fragments and enabled About pages in `/llms.txt`, language indexes and full-text bundles. Article Markdown URLs stay unchanged. Each language has `/en/fragments/index.md` and `/en/about/index.md` (replace `en` with your language); the Fragments file combines all public pages and preserves each ID, publication time, body and stable `/<locale>/fragments/#ID` link. HTML pages advertise their Markdown companion. Files appear after `npm run build` and in preview; deploy all of `dist/`.

About exports its public biography, contact links and reachable AI text popup, excluding terminal configuration, tools and decorative UI. Comments are not exported. Disabled pages/languages, deleted content, noindex pages and off-site canonical pages are excluded; rebuilding removes stale generated exports and discovery links while preserving user-authored files (conflicts stop the build). Site/locale context supplements apply to all exported documents. JSON-LD includes page language; About uses AboutPage. No new configuration, server, UI dependency or guarantee of AI indexing/citation is added.

From 0.33.2, Fragments shares the article back-to-top button: it appears after scrolling and respects reduced-motion preferences. No configuration is needed.

For an existing blog, upgrade to theme 0.29.0 or newer first:

```bash
npx @anglefeint/astro-theme@latest upgrade
```

Merge this into the existing theme object in `src/site.config.ts`. Fragments and its comments are off by default. The menu appears below Decoder Lab.

```ts
theme: {
  fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
},
```

Open `/<locale>/fragments/` after enabling the feed. `pageSize` accepts integers from 1 to 100. Files use `.md`; there is no draft or future-date publication filter, so keep unpublished fragments outside `src/content/fragments/`.

Create skeletons of one fragment in every enabled language:

All-enabled-language defaults require theme 0.31.0 or newer. Upgrade first; on 0.29–0.30, pass `--locales` explicitly.

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

Like `new-post`, the default creates skeletons for all enabled project languages, sharing one ID and timestamp; it does not translate content. Locale priority is `--locales` → `ANGLEFEINT_LOCALES` → enabled project languages. Explicit lists are trimmed, lowercased and deduplicated; they skip config loading and create only the requested locale directories, without enabling languages in site configuration.

New starters also offer `npm run new-fragment`; existing users can use npx without adding scripts.

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales en
```

Edit the generated file in `src/content/fragments/<locale>/`. A title is optional:

To add a translation later, copy the original Markdown into the target locale folder, keep its id and translate the body.

```md
---
id: 'q8Lm3XzP'
pubDate: 2026-11-11T08:30:00+08:00
---

Fragments.
```

Keep id unchanged when editing or renaming the file. Use the same id only for translations of the same fragment; duplicates within one language fail the build. Different fragments need different IDs. pubDate includes time and timezone; display uses UTC and newest entries appear first.

To enable popup comments, set `theme.fragments.comments.enabled` to true and fill repo, repoId, category and categoryId under `theme.comments` using the Giscus setup page. See User Guide 4 for repository setup. Article comments may remain disabled. [Giscus](https://giscus.app/) · [4](../starter-guide-4-giscus-comments/)

```ts
theme: {
  fragments: { enabled: true, comments: { enabled: true } },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'R_...',
    category: 'Your category',
    categoryId: 'DIC_...',
  },
},
```

Fragment comments use specific mapping, strict matching and `fragment/<id>`. They ignore article mapping, term, number, shareAcrossLocales and lang; the interface follows the page language. Translations with the same ID share comments and reactions. Article discussion associations stay unchanged. The comment client loads on the first click. Closing hides the popup; reopening or selecting another fragment reuses the same comment instance.

Fragments remains separate from article search and RSS. Its own AI-readable Markdown export is generated during builds. Images in `public/images/` can be referenced with `/images/...`.

Upgrade to theme 0.29.0 or newer, then opt in using configuration. Personal content, configuration, music and images are preserved. Existing personal tutorials are not replaced; consult the current demo guide. No GitHub discussions are merged or deleted.

Comments load remotely. The loading message stays until Giscus is ready; a failure or 15-second timeout shows Retry. Check your network or Giscus settings if it fails. The popup uses the same Giscus integration as articles; no separate Giscus npm package is needed, and existing article mappings stay unchanged.

```bash
npm run build
```

Pagination in 0.32.0+: Fragments shares Blog’s page-number controls, neon styles and optional page jump. `theme.pagination` controls both lists; `theme.fragments.pageSize` still sets the Fragment page size independently.

## Stable sharing links (0.32.0+)

Sharing in 0.32.0+: dates link to a fragment within the feed, with a copy-link control beside them. Share `/en/fragments/#ID`, using the Markdown frontmatter ID. If the fragment is not on the current page, a small language-specific static index locates its current page automatically. Rebuild after adding content, changing dates or pageSize; keep IDs unchanged. Cross-page locating and copying require JavaScript.

The browser may end up on a numbered page; use the date link or copy control for sharing rather than copying that numbered address. Existing numbered pages can correct an outdated hash, but a removed page number still returns the hosting site’s normal 404. This feature does not intercept 404 pages.

Missing fragments and network errors show feedback instead of repeatedly jumping. If clipboard access is denied, a selectable link is shown for manual copying. This feature requires theme 0.32.0 or later; upgrade before relying on automatic locating.

## Default sharing image and short Fragment IDs (0.33.0+)

Set site.ogImage in src/site.config.ts to a public-root image path (for example /images/share.jpg, stored at public/images/share.jpg) or an HTTPS URL. Merge the property into your existing site settings. Leave it blank to use the bundled 1200×630 Anglefeint artwork. Fragments and all of its #ID sharing links use this default. Article-specific and automatically generated article images retain priority; with automatic generation disabled, an article hero also takes priority over the site default. Rebuild and deploy after changing images; sharing platforms may cache previews.

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment generates an eight-character Nano ID from case-sensitive letters and digits, checks existing Markdown IDs across languages and retries collisions. All languages from one invocation share the ID and timestamp. Fragment IDs must be exactly eight alphanumeric characters. Old UUID/long-ID entries are not supported: delete and repost them rather than expecting migration or old-link compatibility. Keep the new ID stable after publishing; changing it creates a new comment association.
