---
tags: ['anglefeint', 'starter']
title: 'User Guide 7: Make the Blog Available in More Languages'
subtitle: 'Choose languages, adjust homepage addresses, provide localized text, and translate posts and fragments.'
description: 'Language switches, default-language routing, fallback rules, new languages, and multilingual article and fragment identities.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
---

This is part 7 of 8. [See the full tutorial sequence](/en/blog/starter-guide-1-configure-your-site/#tutorial-order) · [Look up configuration fields](/en/blog/config-reference/).

You can write in one language now and add translations later. The theme supplies multilingual interfaces and routes, not automatic article translation. Enabling a language, changing UI text and publishing a translation are separate operations.

Merge all configuration into the existing `defineThemeConfig({...})` in `src/site.config.ts`, preserving `i18n` and personal settings rather than appending duplicate objects.

## 1. Choose the languages you need

Nine languages are enabled initially, with `en` as default:

| Code      | Language           |
| --------- | ------------------ |
| `en`      | English            |
| `zh`      | 简体中文           |
| `zh-hant` | 繁體中文           |
| `ja`      | 日本語             |
| `ko`      | 한국어             |
| `es`      | Español            |
| `pt-br`   | Português (Brasil) |
| `de`      | Deutsch            |
| `ru`      | Русский            |

If you want only Chinese and English, also changing the default to Chinese, choose this configuration. Otherwise retain the project defaults:

```ts
i18n: {
  defaultLocale: 'zh',
  locales: {
    zh: { meta: { enabled: true } },
    en: { meta: { enabled: true } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    'pt-br': { meta: { enabled: false } },
    de: { meta: { enabled: false } },
    ru: { meta: { enabled: false } },
    'zh-hant': { meta: { enabled: false } },
  },
},
```

Omission does not disable a language because settings merge with defaults. Explicitly set `meta.enabled: false`. The default language always remains enabled: `defaultLocale: 'zh'` cannot be combined with an expectation that disabling zh hides it.

Disabling a language removes its theme selector entry and stops its standard-page generation without deleting articles. Re-enabling makes retained content available again. Changing the language code changes directories and URLs, not just its display label; existing sites must handle old links themselves.

## 2. Choose the default-language homepage address

Add or edit `routing` in existing `i18n`:

```ts
i18n: {
  defaultLocale: 'zh',
  routing: { defaultLocalePrefix: 'never' },
},
```

With zh as the example default:

| Setting                   | `/`                       | `/zh/`                 | `/en/`                       |
| ------------------------- | ------------------------- | ---------------------- | ---------------------------- |
| `'always'`, theme default | Static redirect to `/zh/` | Chinese homepage       | English homepage, if enabled |
| `'never'`                 | Chinese homepage directly | Static redirect to `/` | English homepage, if enabled |

Configuration determines the default language; visitors' browser languages do not change it automatically. Redirects are generated HTML pages requiring no application server, and may briefly display a redirect notice.

**This setting affects only the default-language homepage.** Chinese blog, articles, About, Decoder and Fragments retain `/zh/`, such as `/zh/blog/my-first-post/`, not `/blog/my-first-post/`. Changing the default does not move or translate existing files.

## 3. Provide homepage and interface text for each language

Set text under the corresponding language, for example:

```ts
i18n: {
  locales: {
    zh: {
      meta: { label: '简体中文' },
      site: {
        homeTitle: '小林的数字花园',
        hero: '记录开发、阅读和生活。',
      },
      messages: {
        siteDescription: '小林的个人博客，分享项目和学习笔记。',
        nav: { home: '首页', blog: '文章', about: '关于我' },
      },
    },
    en: {
      site: {
        homeTitle: "Lin's Digital Garden",
        hero: 'Notes on code, books and everyday life.',
      },
      messages: { siteDescription: 'Projects and learning notes by Lin.' },
    },
  },
},
```

- `meta.label` is the language-menu label. Changing “简体中文” to “中文” does not rename zh or its URLs.
- `site.homeTitle` changes only that language's visible homepage title. The global name still uses top-level `site.title` or its environment override.
- `site.hero` is the visible introduction beneath the homepage title.
- `messages.siteDescription` is homepage metadata, not the visible introduction. Top-level `site.description` alone may not replace the built-in homepage description.
- `messages.nav` changes entry labels without changing routes or article content.

Likewise, `i18n.locales.<代码>.about` changes localized About content; modules under `messages` change their UI text. About and Decoder still require their global feature switches; adding translations does not enable pages. See [page and feature customization](/en/blog/starter-guide-3-comments-about-and-theme-toggles/) for examples.

See the [language reference](/en/blog/config-languages/#registry) for metadata/default addresses, and [homepage fields](/en/blog/config-home/#home-title) for the three different homepage texts.

## 4. Understand where omitted values come from

`meta.fallback` chooses configuration fallback languages. For example, to use English for missing Simplified Chinese configuration, merge:

```ts
i18n: {
  locales: {
    zh: { meta: { fallback: ['en'] } },
  },
},
```

en must exist in the language registry. Nondefault languages receive the default language as a necessary fallback. Self-references, duplicates and unknown languages are filtered. Arrays replace completely, so specify the entire desired order.

Different fields have different fallback behavior:

| Content                               | Current behavior                                                                                                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ordinary `messages`                   | Starts with built-in English, then merges built-in packs and personal overrides along the chain, with the current language highest. Built-in translations participate too. |
| Homepage `homeTitle`                  | Finds a trimmed, nonempty title in the current language and its fallbacks, finally using the global name.                                                                  |
| Homepage `hero`                       | Finds the first defined value; `''` explicitly clears it and stops fallback.                                                                                               |
| About                                 | Starts with default About, then merges personal About configuration along the chain.                                                                                       |
| Homepage `messages.home.transmission` | Special current-language personal value → English personal value → `Knock, knock.`, outside the normal complete message chain.                                             |

Changing English navigation does not automatically replace built-in Chinese navigation with your English override. Set an override in the language you want to change. Disabling its pages does not delete its configuration; registered fallback values can still participate.

Fallback fills configuration and interface text only. It does not insert English posts into the Chinese blog or create translated files. It is not content translation.

## 5. Add a new language

For example, add fr to existing locales while retaining prior enabled/disabled settings:

```ts
i18n: {
  locales: {
    fr: {
      meta: {
        label: 'Français',
        hreflang: 'fr',
        ogLocale: 'fr_FR',
        enabled: true,
        fallback: ['en'],
      },
      site: {
        homeTitle: 'Le jardin de Lin',
        hero: 'Notes de lecture et projets.',
      },
      messages: {
        siteDescription: 'Le blog personnel de Lin.',
        nav: { home: 'Accueil', blog: 'Articles', about: 'À propos' },
      },
    },
  },
},
```

fr is the directory/route code. Use normalized lowercase codes. Creation commands accept two or three letters plus one optional hyphen suffix, such as `fr`, `pt-br` or `zh-hant`, not paths or spaces. This example retains the existing default rather than making French default.

`hreflang` identifies alternate-language links and falls back to the language code. `ogLocale` is an Open Graph language/region identifier, such as fr_FR, not the URL code format. Neither translates content nor guarantees indexing.

A new language has no complete built-in translation pack. This example translates a few entries; the rest falls back. For a full French interface, supply messages for the search, pagination, comments, tools and About modules you use. Start with actual visible areas; you need not modify theme implementation merely to display an article.

## 6. Add an article translation

Create matching Chinese and English skeletons:

```bash
npm run new-post -- my-first-post --locales zh,en
```

Write Chinese in `src/content/blog/zh/my-first-post.md` and English in `src/content/blog/en/my-first-post.md`. For the new-language example, use `npm run new-post -- french-note --locales fr`, then supply the content yourself.

To translate an existing Chinese article, copy it to the target language directory with the same basename, then translate title, description and body. Relative images resolve from the new file; check paths if directory depth changes. Creation skips existing files rather than overwriting them.

Translations match the complete slug outside the language directory. zh/my-first-post and en/my-first-post match; renaming the English file to my-story makes a different article, even with identical titles. Nested paths must match too.

Article language menus open the target translation when the same slug exists, otherwise that language's blog list. SEO alternate links advertise only actual enabled translations, never mislabeling a list as an article translation.

`--locales` selects files without enabling languages. Without it, `ANGLEFEINT_LOCALES` takes precedence over enabled languages; explicit arguments take precedence over the environment. Creating skeletons and translating bodies remain separate.

## 7. Languages in fragments and other pages

Fragment translations use matching frontmatter `id`, not filenames. Copy an existing fragment into the target language directory, keep id/pubDate, then translate title/body. Rerunning new-fragment creates another identity, not a translation of the same fragment.

One `npm run new-fragment -- --locales zh,en` creates skeletons with a shared ID/timestamp. Switching fragment-list language always opens the target first page, without guaranteeing the same translated fragment. See [fragments](/en/blog/starter-guide-5-fragments/).

Article comment sharing requires `theme.comments.shareAcrossLocales`, off by default. Fragment comments share by ID. Interface language and discussion association are different, and replies are not translated. See [comments](/en/blog/starter-guide-4-giscus-comments/).

Custom Astro pages from `new-page` generate enabled-language routes from one source file. Provide language-dependent content yourself; the command does not copy or translate a separate source for every language.

## 8. Check changed behavior

In dev, open every enabled-language homepage and check menu labels, homepage title/introduction and About content. Test an article with a translation and one without to confirm switching. Directory and configured language codes must match exactly.

Stop dev before publication, then run:

```bash
npm run doctor
npm run preview
```

doctor includes checking and building; do not immediately repeat check/build. Verify each language's article search in built preview: indexes search the current language, not a merged multilingual collection. Every enabled language's `/<代码>/rss.xml` contains only its own articles.

Confirm the public domain, then redeploy all of `dist/`. Language switches, default addresses and content changes require rebuilding; local configuration edits do not update production. Remove stale deployment output: disabling languages does not create redirects for old URLs.

| Symptom                              | Check first                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Unwanted language remains in menu    | Was its override merely removed instead of setting enabled: false?                             |
| Cannot disable the default language  | Is it still defaultLocale? Select a new default first.                                         |
| File created but no page             | Enabled language, exact directory code and a fresh build.                                      |
| Page still has English               | Incomplete new-language overrides or missing About content.                                    |
| Title change has no effect           | Global site.title, homepage homeTitle/hero or page messages? Also check environment overrides. |
| Switching opens a list               | Missing same-slug translation; this is the current fallback behavior.                          |
| Articles retain prefixes after never | Only the default homepage changes; this is expected.                                           |

See [installation](/en/blog/starter-guide-1-configure-your-site/) for site identity/upgrades and [writing posts](/en/blog/starter-guide-2-languages-and-routing/) for daily publishing.

## Tutorial navigation and configuration reference

[Previous: let readers leave comments](/en/blog/starter-guide-4-giscus-comments/) · [Next: publish on your own domain](/en/blog/starter-guide-deployment/) · [All eight tutorials](/en/blog/starter-guide-1-configure-your-site/#tutorial-order).

Related fields: [languages, addresses and fallback](/en/blog/config-languages/), [cross-language comment sharing](/en/blog/config-comments/). Full paths, defaults and limits are in the [reference index](/en/blog/config-reference/).
