---
tags: ['anglefeint', 'starter']
title: 'User Guide 4: Configure Giscus Comments'
description: 'User Guide 4: Configure Giscus Comments'
pubDate: '2026-11-10'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

In `src/site.config.ts`, merge the following `theme.comments` fields into your existing `defineThemeConfig({...})` object. Keep your other settings; do not create duplicate `theme` or `comments` keys.

`shareAcrossLocales: false` — `mapping: 'pathname'`

## Comments setup guide

Use the [Giscus setup page](https://giscus.app/): prepare a public GitHub repository, enable Discussions, install the Giscus app, and select a category. Copy the actual repository/category IDs from its generated configuration:

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

Replace both `REPLACE_WITH_...` values, and use your actual category name. Fill in the theme configuration only; do not paste the full Giscus script into each post.

Comments appear on article pages. Missing core repo/category fields prevent rendering; placeholders do not make a working configuration. `lang: ''` follows the article language (`zh` maps to `zh-CN`); the default is fixed to `en`.

Keep `mapping: 'pathname'` to associate discussions with article paths. `specific` requires a nonempty `term`; `number` requires a positive integer as a string in `number`. Invalid or missing parameters for these modes throw errors.

Check the bottom of a post. If comments are absent, check IDs, repository permissions, connectivity, and browser blocking. Optional fields such as `inputPosition`, `theme`, and `reactionsEnabled` can retain defaults. `strict` and `reactionsEnabled` take strings `'0'` / `'1'`.

## Share comments across article languages

Comments and cross-language sharing are off by default. For ordinary path-based comments, use the setup above. To share one discussion across translations, keep your repository/category fields and replace the mapping options with:

```ts
theme: {
  comments: {
    // Keep your enabled, repo, repoId, category and categoryId values.
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

In shared mode, mapping must be specific, term and number must be empty, and strict must be 1. The article supplies its own locale-independent slug as data-term. For example, nine translations use cypherpunk-ideals-ai-and-the-future-of-crypto; guides/setup and other/setup remain different discussions. A missing slug is an error. Translations must use identical slugs. lang: empty follows the page language; an explicit lang remains fixed. Comments are not translated. Share only discussions and reactions.

When sharing is off, custom mapping/term/number/strict retain their current behavior: specific requires a nonempty term and number requires a positive integer string. When sharing is on, conflicting mapping, nonempty term/number or strict other than 1 causes a configuration error while comments are enabled. Open two translations and another article to check the discussion association. Visitors need GitHub authorization to comment. Merge these fields into your existing comments object; do not replace unrelated settings.

Existing discussions are not automatically merged, moved or deleted. Enabling sharing can select a different discussion, so old comments may not appear there. Before switching, record your original mapping, term, number and strict. To restore the previous association, set shareAcrossLocales: false and restore those exact values. If you need old comments in the shared discussion, review and migrate manually on GitHub; the theme performs no migration.

For an existing integration starter, first upgrade to a theme release containing this option. After changing configuration, rebuild and deploy your site. Preview the production build to verify comments.

```bash
npx @anglefeint/astro-theme@latest upgrade
npm run build
npm run preview
```

[← User Guide 3](/en/blog/starter-guide-3-comments-about-and-theme-toggles/)
