---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Fragments'
subtitle: 'Fragment lists, homepage previews, independent comments and stable links.'
description: 'Actual Fragments switches, pagination, comments, interface text and content fields, including currently unused values.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

To publish first, read [publish a fragment](/en/blog/starter-guide-5-fragments/). This page is a field reference. See [installation](/en/blog/starter-guide-1-configure-your-site/) for configuration location, or the [reference index](/en/blog/config-reference/) for all modules.

Defaults refer to the theme package, not the demo's configuration. Merge fragments into existing `defineThemeConfig({...})` in `src/site.config.ts`, without duplicating theme/i18n.

## Find the setting

| What to change                             | Path or location                                                            |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| Fragment list and homepage entry           | `theme.fragments.enabled`                                                   |
| Items per full-list page                   | `theme.fragments.pageSize`                                                  |
| Independent fragment comments              | `theme.fragments.comments.enabled`, connection shared with `theme.comments` |
| Title, description, prompts and close text | `i18n.locales.<语言>.messages.fragments`                                    |
| Page numbers and jumping                   | `theme.pagination`, with text from `messages.blog`                          |
| Per-fragment ID, time and title            | Markdown frontmatter, not site.config                                       |
| Homepage count, height and avatar          | No corresponding public fields currently.                                   |

<a id="enabled"></a>

## theme.fragments.enabled: enable fragments

- **Type / default:** boolean / `false`.
- **Status / purpose:** active. Loads `src/content/fragments/<语言>/**/*.md`, generates enabled-language lists and positioning indexes, and shows a homepage entry when that language has content.
- **Limits:** off means no collection loading/list routes, without deleting files. Enabled but empty lists show an empty state and no homepage entry. Only `.md`, not `.mdx`, is loaded.
- **Example:** `theme: { fragments: { enabled: true } }`.

The first page is `/<语言>/fragments/`, then `/<语言>/fragments/2/`, not a manually added `/1/`. Enable the language first; see [languages](/en/blog/starter-guide-languages/).

With `theme.fragments.enabled: false`, dev, build and prepare-covers/doctor skip image references in Fragment content. Originals and derivatives are no longer required for images included solely through those references. Article-cover references and the `src/assets/blog/default-covers/` and `src/assets/blog/covers/originals/` pools still undergo preparation and validation, even if an image is used only in Fragments. Disabling deletes no files; re-enabling restores Fragment image processing.

**Version note:** Disabled-content image isolation requires 0.36.1 or later; 0.36.0 does not include it. Do not assume older versions provide this behavior.

<a id="page-size"></a>

## theme.fragments.pageSize: full-list page size

- **Type / default:** number / `20`.
- **Status / purpose:** active; determines list pagination and ID-to-page indexing.
- **Limits:** a **safe integer from 1–100**. Fractions, zero, negatives and out-of-range values fail rather than clamp. It is validated even with Fragments off. Homepage previews remain the latest three, unaffected by this or `theme.homeLatestCount`.
- **Example:** `theme: { fragments: { pageSize: 10 } }`.

Each language sorts by descending pubDate, then ID `localeCompare` on ties. Filenames do not sort content; future dates are not filtered. Page-size changes move entries between pages, so share stable links below.

<a id="comments-enabled"></a>

## theme.fragments.comments.enabled: fragment comments

- **Type / default:** boolean / `false`.
- **Status / purpose:** conditional. With Fragments enabled, each full-list card receives a comment button opening a shared dialog for that discussion. Homepage previews have no comment button.
- **Limits:** independent of article `theme.comments.enabled`. Shared Giscus connection settings are required. Missing values fail during fragment-page generation, even for empty lists. Service/repository permissions must still work remotely.
- **Example:** `theme: { fragments: { enabled: true, comments: { enabled: true } } }`.

Enable fragments without comments:

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 10,
    comments: { enabled: false },
  },
},
```

For fragment-only comments, keep articles false but configure repo, repoId, category and categoryId. See [connection parameters](/en/blog/config-comments/#connection) for types/defaults/validation and [fragment-only examples](/en/blog/config-comments/#fragment-overrides). Local checks cannot prove remote IDs/permissions.

Binding uses `fragment/<稳定ID>`; matching IDs share discussions across languages. Article mapping, term, number and shareAcrossLocales are ignored. Fragments force specific, strict `'1'`, emitMetadata `'1'`, and page-derived language instead of `theme.comments.lang`. Enabled article comments still undergo their own validation.

Theme, reactions and input position remain shared. The first click inserts the Giscus client; eager loading means immediately after clicking, not initial-page loading. Closing retains the iframe; switching fragments changes its discussion. About 15 seconds without a valid response shows failure/retry. No timeout setting is public.

<a id="fragment-messages"></a>

## Interface text: messages.fragments

Full prefix: `i18n.locales.<语言>.messages.fragments`. All fields are **string** values changing text, not behavior, with built-in language defaults/fallback. The table lists Simplified Chinese / English defaults. Omission retains defaults; an empty string is an override and does not guarantee removing its control. Examples belong inside the fragments object.

| Field            | Simplified Chinese / English default                                                                                      | Status, purpose and limits                                                                          | Example                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `title`          | 碎片 / Fragments                                                                                                          | Conditional: list/page heading and homepage entry accessible name, not a per-fragment title.        | `title: '随手记'`                       |
| `description`    | 沿途记录的几句话。 / Brief thoughts, kept along the way.                                                                  | Conditional: visible list introduction and page metadata; absent from the homepage expanded window. | `description: '记录工作与生活的小事。'` |
| `empty`          | 还没有碎片。 / No fragments yet.                                                                                          | Conditional: empty full-list notice; cannot force the homepage entry to appear.                     | `empty: '稍后再来看看。'`               |
| `comments`       | 评论 / Comments                                                                                                           | Conditional: button text when fragment comments are enabled.                                        | `comments: '参与讨论'`                  |
| `close`          | 关闭 / Close                                                                                                              | Conditional: comment-dialog close text and homepage close accessible name.                          | `close: '关闭窗口'`                     |
| `previous`       | 上一页 / Previous                                                                                                         | **Currently unused:** accepted by types, but pagination uses messages.blog.previous.                | `previous: '上一页'`                    |
| `next`           | 下一页 / Next                                                                                                             | **Currently unused:** accepted by types, but pagination uses messages.blog.next.                    | `next: '下一页'`                        |
| `loading`        | 正在加载评论… / Loading comments…                                                                                         | Conditional: comment loading status.                                                                | `loading: '正在连接讨论…'`              |
| `error`          | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | Conditional: comment failure, not positioning-index failure.                                        | `error: '讨论暂时不可用，请重试。'`     |
| `retry`          | 重试 / Retry                                                                                                              | Conditional: retry button after comment-loading failure.                                            | `retry: '重新连接'`                     |
| `copyLink`       | 复制碎片链接 / Copy fragment link                                                                                         | Conditional: share-link button title and accessible name; JavaScript enables the button.            | `copyLink: '复制本条链接'`              |
| `linkCopied`     | 链接已复制 / Link copied                                                                                                  | Conditional: successful copying.                                                                    | `linkCopied: '已复制'`                  |
| `copyLinkFailed` | 未能自动复制，请复制下方链接。 / Unable to copy automatically. Copy the link below.                                       | Conditional: clipboard failure, offering manual copying.                                            | `copyLinkFailed: '请手动复制此链接。'`  |
| `notFound`       | 找不到这条碎片，它可能已被移除。 / Fragment not found. It may have been removed.                                          | Conditional: stable-ID lookup failure, not general 404 text.                                        | `notFound: '这条记录已不存在。'`        |
| `indexError`     | 暂时无法定位这条碎片，请刷新页面后重试。 / Unable to locate this fragment. Refresh the page and try again.                | Conditional: positioning-index request or validation failure.                                       | `indexError: '定位失败，请刷新重试。'`  |

For example, override the Chinese title/description only:

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        fragments: {
          title: '随手记',
          description: '记录工作与生活的小事。',
        },
      },
    },
  },
},
```

<a id="shared-settings"></a>

## Shared settings used by Fragments

| Path                                                                                                         | Default and purpose                                                      | Limits, examples and full reference                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.pagination.*`                                                                                         | Shares the eight Blog List pagination fields/defaults.                   | Appears only with multiple pages; for example `theme: { pagination: { windowSize: 5 } }`. See [pagination](/en/blog/config-blog-list/#pagination-window) and subsequent sections for types/ranges/examples. |
| `i18n.locales.<语言>.messages.blog.previous`、`next`、`paginationAria`、`jumpTo`、`jumpInputLabel`、`jumpGo` | string, built-in language text for visible/accessible pagination labels. | For example `previous: '上一页'`; see [pagination text](/en/blog/config-blog-list/#pagination-messages), not matching fragments fields.                                                                     |
| `i18n.locales.<语言>.messages.blog.backToTop`                                                                | string, built-in language text.                                          | Full-list back-to-top button; for example `backToTop: '回到顶部'`. See [article text](/en/blog/config-article/#article-messages).                                                                           |
| `i18n.locales.<语言>.messages.home.viewAll`                                                                  | string, built-in language text.                                          | Homepage footer archive accessible name also combines the fragment title; for example `viewAll: '查看全部'`. See [homepage messages](/en/blog/config-home/#home-messages).                                  |
| `theme.math.enabled`                                                                                         | boolean / `true`                                                         | Full lists include mathematical styles only for pages that need them. Example `theme: { math: { enabled: false } }`; see [math switch](/en/blog/config-article/#feature-switches).                          |

See the [Giscus reference](/en/blog/config-comments/) for all common connection/presentation parameters. Article mapping settings are not fragment binding settings. Article contents, OUTPUT and Red Queen do not control fragment lists; Fragments also lacks the Blog List Cards/List switch.

<a id="content-fields"></a>

## Three per-fragment frontmatter fields

These belong to Markdown in `src/content/fragments/<语言>/`, **not site.config**. The public schema has these three fields, without additional compatibility fields.

| Field     | Type / default                          | Purpose, status and limits                                                                                                          | Example                               |
| --------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `id`      | string / none, required                 | Active. Exactly eight ASCII letters/digits, unique within a language. Links and comments depend on it; retain it after publication. | `id: 'aB3dE6gH'`                      |
| `pubDate` | Date-convertible value / none, required | Active. Must parse as a date; determines ordering and displays in UTC. Prefer timezone-qualified ISO strings to avoid ambiguity.    | `pubDate: '2026-11-13T08:00:00.000Z'` |
| `title`   | optional string / unset                 | Conditional. Optional card/homepage title. Omission is valid, with no automatic filename-based title.                               | `title: '今天的小发现'`               |

```md
---
id: 'aB3dE6gH'
pubDate: '2026-11-13T08:00:00.000Z'
title: '今天的小发现'
---

这里写正文。图片和代码直接放在 Markdown 正文中。
```

`npm run new-fragment -- --locales zh,en` generates files sharing a new ID and current timestamp. Every invocation generates a new identity. Keep an existing ID when adding translations. IDs can match across languages, but duplicates within one language fail. Filenames may change; IDs must not depend on filename/page number. Old formats are not migrated automatically, and arbitrary ID changes break discussion/link identity.

`description`, `heroImage`, `tags`, `draft` and per-fragment `comments` have no corresponding fragment consumers. Do not apply article frontmatter wholesale. In particular, `draft: true` does not create a private draft; keep unready content outside enabled collections.

<a id="preview-and-links"></a>

## Fixed preview, image and link behavior

No additional public fields configure the following:

- **Homepage count:** latest three in the current language, or fewer when unavailable. The archive footer shows displayed/current-language total. Other languages never fill missing entries.
- **Excerpt:** extracts text, first usable HTTP(S) image and first code block from rendered HTML. Text is limited to 180 Unicode code points; code to eight lines/800 code points, with ellipses on truncation. Cards crop height overflow while full content remains in the list. Titles are separate. This is not full Markdown rendering; no previewCount/previewHeight setting exists.
- **Images:** supported local files receive dimensions/srcset from the manifest. Remote/unsupported images are not guaranteed optimization. Each list page's first image uses eager/high; others lazy, all asynchronous decoding. See [images](/en/blog/starter-guide-images/) for originals, variants and validation; no fragment heroImage is needed.
- **Stable links:** `/<语言>/fragments/#<ID>`. The positioning index finds the current page and navigates if necessary, retaining ID lookup after additions/pageSize changes. Deletion or changed IDs lose the target. Without JavaScript, pagination works but cross-page lookup/copy cannot be relied upon.
- **Language switching:** enters the target fragment-list first page, not necessarily the matching ID.
- **Public output:** combined Markdown is `/<语言>/fragments/index.md`. This does not enable article search/RSS. Never publish sensitive data there.

Avatar assets, hover animation, window borders and code-preview height are not site.config fields. Return to the [reference index](/en/blog/config-reference/) for supported settings.
