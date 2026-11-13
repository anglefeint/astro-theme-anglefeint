---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Blog List and Tag Lists'
subtitle: 'Archive size, tags, shared pagination, interface text and current view boundaries.'
description: 'Types, defaults, behavior and limitations for blog archives, tag directories, pagination windows, jump forms and visual variants.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

**Version note:** Strict `blogPageSize` validation requires 0.36.1 or later; 0.36.0 does not include it. Supply a reasonable positive integer when using an older version.

[Back to the configuration index](/en/blog/config-reference/). This page covers the blog archive, tag directory, articles under a tag and their shared pagination. It follows current theme code; demo article counts and colors are not defaults.

The Chinese blog is `/zh/blog/`, page two is `/zh/blog/2/`, and the tag directory is `/zh/tags/`. Use generated links for individual tags. Replace zh for another language; default-language homepage addressing does not remove language prefixes from these routes.

Merge TypeScript examples into the existing defineThemeConfig object in `src/site.config.ts`. Update existing theme, i18n and pagination objects while preserving other values; do not duplicate objects.

## 1. Articles per page

<a id="page-size"></a>

### `theme.blogPageSize`

- **Type:** `number`.
- **Theme default:** `10`.
- **Purpose:** Shared article count per page for the blog archive and each tag list. Articles are filtered by language, then sorted by pubDate newest first.
- **Status:** Active.
- **Limits:** Must be a positive safe integer. Zero, negative numbers, fractions, NaN, Infinity and values outside the safe-integer range fail explicitly during configuration resolution; they are not truncated or reset to the default. Zero does not disable pagination.
- **Scope:** Does not change homepage latest-post counts or Fragments page sizes. The tag directory itself does not paginate using this field.

```ts
theme: { blogPageSize: 12 },
```

An empty blog still generates page one. Pagination is hidden when there is only one page. Rebuild and redeploy after changing the page size. Higher page numbers may disappear; no redirects are generated automatically.

Sorting does not use updatedDate, filenames or clicks. There is currently no draft/future-date filter or configurable sort key; see [Write your first article](/en/blog/starter-guide-2-languages-and-routing/).

## 2. Tag entries and pages

<a id="tags-enabled"></a>

### `theme.tags.enabled`

- **Type:** `boolean`.
- **Theme default:** `true`.
- **Purpose:** Controls theme-provided tag entries, the tag directory and tag article lists, including theme tag links on cards and article pages.
- **Status:** Active.
- **Limits:** false does not delete frontmatter tags, articles or deployed files. It does not filter the blog by tag. The blog tag shortcut also requires tags in the current language. An enabled directory with no tags shows its empty message.

```ts
theme: { tags: { enabled: false } },
```

Tags come from article frontmatter `tags` arrays; there is no site.config registry. Within an article, tags are trimmed, empty entries discarded and duplicates removed. Case remains significant: Astro and astro are different tags.

The directory sorts by article count descending, then tag string for ties. Special characters, Chinese, reserved names and long tags use stable encoding; follow generated links. Renaming a tag can change its path, without preserving its old URL.

Cards show at most two tags, with no configuration for that count. This does not limit tags per article or valid tags in the directory.

## 3. Page window and jump form

<a id="pagination-window"></a>

### `theme.pagination.windowSize`

- **Type:** `number`.
- **Theme default:** `7`.
- **Purpose:** Influences which page numbers, boundary pages and ellipses appear, not articles per page.
- **Status:** Conditional: pagination exists only when there is more than one page.
- **Limits:** Normal numeric values are floored and clamped to 5–21. This strategy parameter does not guarantee that all numbers, previous/next links and ellipses total exactly this value. Use a finite integer.

<a id="jump-threshold"></a>

### `theme.pagination.showJumpThreshold`

- **Type:** `number`.
- **Theme default:** `12`.
- **Purpose:** Allows the jump input only when the total page count is strictly greater than this threshold and jump.enabled is true.
- **Status:** Conditional.
- **Limits:** Normal numeric values are floored, with a minimum of 1. With the default, 12 pages hide the form and 13 show it. This counts pages, not articles; zero does not mean always show.

<a id="jump-enabled"></a>

### `theme.pagination.jump.enabled`

- **Type:** `boolean`.
- **Theme default:** `true`.
- **Purpose:** Allows the jump form.
- **Status and limits:** Conditional on total pages exceeding the threshold. false removes only the form, leaving numbered and previous/next links. Jump interaction requires JavaScript; ordinary pagination links do not.

<a id="jump-enter"></a>

### `theme.pagination.jump.enterToGo`

- **Type:** `boolean`.
- **Theme default:** `true`.
- **Purpose:** Allows Enter in the page input to navigate.
- **Status and limits:** Applies only when the form exists. false blocks Enter submission while retaining the button. The client strips non-digits and clamps the destination to actual pages; arbitrary URL navigation is not supported.

These settings can be combined:

```ts
theme: {
  pagination: {
    windowSize: 9,
    showJumpThreshold: 8,
    jump: { enabled: true, enterToGo: false },
  },
},
```

Fragments also uses this pagination behavior, but its own pageSize controls entries per page. These settings do not apply to just one particular tag list.

## 4. Pagination appearance strategy

<a id="style-enabled"></a>

### `theme.pagination.style.enabled`

- **Type:** `boolean`.
- **Theme default:** `true`.
- **Purpose:** Enables appearance variants for the pagination container and page buttons.
- **Status and limits:** Conditional. false uses base variant 1; it does not remove pagination, change counts or disable the page's Cyberpunk effects. It does not control article cards or random colors on the Cards/List switch.

<a id="style-mode"></a>

### `theme.pagination.style.mode`

- **Type:** `'random' | 'sequential' | 'fixed'`.
- **Theme default:** `'random'`.
- **Purpose:** Selects the appearance variant strategy.
- **Status and limits:** Used only when style.enabled is true:

| Mode       | Current behavior                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| random     | Stable initial variant at build time; client initialization picks random container/button variants again. Repetition is possible; this is not an ongoing animation. |
| sequential | Selects container variants by page number and button variants by position. Buttons need not share a color; selection does not rotate with time.                     |
| fixed      | Uses fixedVariant for both container and buttons.                                                                                                                   |

Without JavaScript, the initial static HTML styles remain; client-side random selection does not run.

<a id="style-variants"></a>

### `theme.pagination.style.variants`

- **Type:** `number`.
- **Theme default:** `9`.
- **Purpose:** Number of participating variants, numbered 1 through N; not a selection array or the number of site themes.
- **Status and limits:** Conditional. Normal numeric values are floored and clamped to 1–12. Shared neon colors currently define only 1–9: 10–12 are not three additional complete palettes and may inherit/base-fallback. Use 1–9, normally the default 9. The accepted range does not add colors.

<a id="style-fixed"></a>

### `theme.pagination.style.fixedVariant`

- **Type:** `number`.
- **Theme default:** `1`.
- **Purpose:** Selects the variant in fixed mode.
- **Status and limits:** Normal values are floored and clamped between 1 and variants. random and sequential do not use this to fix their appearance. Complete neon colors are currently 1–9. Use finite integers.

For example, fix the second appearance:

```ts
theme: {
  pagination: {
    style: { enabled: true, mode: 'fixed', variants: 9, fixedVariant: 2 },
  },
},
```

For base pagination styling, merge `theme: { pagination: { style: { enabled: false } } }`. Choose the example you need rather than repeatedly overwriting one with another.

## 5. Archive titles, descriptions and pagination text

<a id="archive-messages"></a>

The full prefix is `i18n.locales.<语言>.messages.blog`. Each field is an optional `string` override, conditionally visible when its heading, description or control is used. Defaults resolve through built-in locale messages and fallback. Only Simplified Chinese and English are shown; other languages have their own built-in values.

| Field                | Simplified Chinese / English defaults                                                                            | Purpose and limits                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`              | 博客 / Blog                                                                                                      | First blog page title and hidden section title; does not rename articles or the fixed view-switch buttons.                                         |
| `pageTitle`          | 博客 - 第 / Blog - Page                                                                                          | Title prefix for later blog pages and later tag pages; code appends the page number, without custom placeholder processing.                        |
| `archiveDescription` | 关于 AI 时代开发、Web 工程与系统架构的文章。 / Essays on AI-era craft, web engineering, and system architecture. | Meta description for the first blog page and tag directory, not card excerpts.                                                                     |
| `pageDescription`    | 博客归档页 / Blog archive page                                                                                   | Meta description prefix for later blog pages; code appends the page number and a period. Not used in the equivalent position on tag article lists. |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          title: '文章归档',
          pageTitle: '文章归档 - 第',
          archiveDescription: '项目、阅读与学习笔记。',
          pageDescription: '文章归档分页',
        },
      },
    },
  },
},
```

<a id="pagination-messages"></a>

Pagination fields share that prefix and string type:

| Field            | Simplified Chinese / English defaults | Purpose and limits                                                                    |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| `previous`       | 上一页 / Previous                     | Visible text and accessible name of the previous-page link; absent on the first page. |
| `next`           | 下一页 / Next                         | Visible text and accessible name of the next-page link; absent on the final page.     |
| `paginationAria` | 分页导航 / Pagination                 | Accessible name of the pagination nav, not another visible heading.                   |
| `jumpTo`         | 跳转到页 / Jump to page               | Visible text beside the page input; appears only when the form qualifies.             |
| `jumpInputLabel` | 页码 / Page number                    | Hidden accessible label for the input; does not change input format.                  |
| `jumpGo`         | 跳转 / Go                             | Submit button text; does not change the destination path.                             |

Tag lists and Fragments share these messages. Blog routes provide extra English fallbacks for empty jumpTo/jumpInputLabel/jumpGo; tag routes pass resolved values directly. Do not hide controls across pages with empty strings. Use jump.enabled and retain meaningful accessible labels.

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          previous: '前一页',
          next: '后一页',
          paginationAria: '文章分页',
          jumpTo: '前往第几页',
          jumpInputLabel: '目标页码',
          jumpGo: '前往',
        },
      },
    },
  },
},
```

## 6. Tag directory and shared entry text

<a id="tag-messages"></a>

These also use `i18n.locales.<语言>.messages.blog`, optional string overrides and ordinary interface-message fallback. Their areas must exist for them to appear:

| Field         | Simplified Chinese / English defaults | Purpose and limits                                                                                     |
| ------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `tags`        | 标签 / Tags                           | Tag shortcut, directory and tag-list headings and accessible names; does not change tag text or slugs. |
| `allPosts`    | 全部文章 / All posts                  | Text for returning to all articles, also used on the homepage; does not change the count.              |
| `noTags`      | 暂无标签 / No tags yet.               | Empty tag-directory message, not the empty-blog message.                                               |
| `taggedPosts` | 文章 / Posts                          | Description of the article count and tag-page description, not a manually set count.                   |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          tags: '按标签浏览',
          allPosts: '返回全部文章',
          noTags: '暂时没有可浏览的标签。',
          taggedPosts: '篇文章',
        },
      },
    },
  },
},
```

Empty text does not disable a feature and can leave blank links or incomplete descriptions. Disable tags with theme.tags.enabled, not false or an empty string in a message.

## 7. Cards/List, covers and other boundaries

<a id="view-and-limits"></a>

The following describe current implementation, not additional configuration fields:

- Blog and tag lists share the Cards/List switch. With no saved preference, cards is the default. JavaScript enables switching; the same localStorage preference is shared across blogs, tags and languages. Switching still works without storage, but persistence is not guaranteed.
- There are no site.config fields for default view, disabling the switch, switch text, list column names or card colors. The switch and archive bar use built-in component locale tables, falling back to English for custom languages without an entry. messages.blog.title cannot change them.
- Cards render title, date, cover and at most two tags. There are no settings for card excerpts, cover-priority candidate count or updatedDate sorting. Changing the archive meta description does not make article description a card excerpt.
- The first two candidates that actually have covers use eager/high; others are lazy. Hiding covers in List view does not guarantee those candidates will not download. See the [image tutorial](/en/blog/starter-guide-images/) for preparation and size control.
- Switching language on a main blog page retains the page number if it exists in the target language, otherwise returns to its first page. On tag lists, the same tag text is sought: the target tag's first page if present, otherwise the target tag directory. Tags are not translated or matched by synonyms.
- Homepage latest-post count and passage effects are covered in the [homepage reference](/en/blog/config-home/). Public navigation, search, footer and comments are not redefined here.

No list-specific compatibility-only fields were found. Nonexistent blogView, showExcerpt and cardTheme are not supported; arbitrary keys do not enable unconfigured capabilities.

## How to verify changes

In dev, inspect the first blog page, later pages, the tag directory and a tag list. The jump form requires enough pages; fixed styling should differ from random. Inspect head for meta descriptions; visible headings alone cannot verify hidden labels or accessible names.

After changing page size or tag names, rebuild and fully redeploy, taking care with leftover old files. Before publishing, stop dev, run npm run doctor, then npm run preview for the built result. doctor already includes a build; do not immediately repeat check and build. See the [installation](/en/blog/starter-guide-1-configure-your-site/) and [deployment](/en/blog/starter-guide-deployment/) tutorials.
