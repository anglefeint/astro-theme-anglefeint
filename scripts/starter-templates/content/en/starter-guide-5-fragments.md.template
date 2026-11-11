---
tags: ['anglefeint', 'starter']
title: 'User Guide 5: Publish Fragments'
description: 'Publish brief thoughts as Markdown, with optional popup comments.'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

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

Create one fragment in the default language:

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

Use --locales en,zh to create matching skeletons with one shared ID. The CLI does not translate content. Only enabled languages are accepted. New starters also offer npm run new-fragment; existing users can use the npx command without adding scripts.

Edit the generated file in `src/content/fragments/<locale>/`. A title is optional:

To add a translation later, copy the original Markdown into the target locale folder, keep its id and translate the body.

```md
---
id: 550e8400-e29b-41d4-a716-446655440000
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

This is static publishing: edit Markdown, then rebuild and redeploy. There is no online posting form. Fragments are separate from article search, RSS and article Markdown exports. Images can use `/images/...` from `public/images/`.

Upgrade to theme 0.29.0 or newer, then opt in using configuration. Personal content, configuration, music and images are preserved. Existing personal tutorials are not replaced; consult the current demo guide. No GitHub discussions are merged or deleted.

Comments load remotely. The loading message stays until Giscus is ready; a failure or 15-second timeout shows Retry. Check your network or Giscus settings if it fails. The popup uses the same Giscus integration as articles; no separate Giscus npm package is needed, and existing article mappings stay unchanged.

```bash
npm run build
```
