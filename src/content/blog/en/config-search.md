---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Search and Content Discovery'
subtitle: 'Search entry, article inclusion, language indexes and other discovery routes.'
description: 'Actual search settings, messages and per-article inclusion, distinguished from latest posts, related posts, tags, RSS and machine-readable exports.'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

Start with [writing posts](/en/blog/starter-guide-2-languages-and-routing/), or [preview/deployment](/en/blog/starter-guide-deployment/). See [installation](/en/blog/starter-guide-1-configure-your-site/) for configuration location, and the [reference index](/en/blog/config-reference/) for other modules.

Search retrieves articles from build-generated indexes. Homepage latest posts, tags, recommendations and RSS are separate discovery routes, not all controlled by the search switch. Defaults come from the theme package rather than demo overrides.

<a id="enabled"></a>

## theme.search.enabled: global search switch

- **Type / default:** boolean / true.
- **Status and purpose:** active. Shared headers display search, participating articles get index markers, and the completed build produces static Pagefind resources.
- **Limits:** false removes the standard entry and this build's indexing. Per-article search: true cannot override global off. It does not delete posts, prevent Internet indexing or clean old deployed index files.
- **Example:** theme: { search: { enabled: false } }.

This is the only public theme.search leaf field. No server URL, API key, index directory, sorting, term-weight or cross-language switch exists. Pagefind builds static search without a deployed search backend.

<a id="article-search"></a>

## Per-article search: not a site.config field

| Location                                                      | Type / default                                             | Status, purpose and limits                                                                                                                          | Example       |
| ------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| frontmatter.search in `src/content/blog/<locale>/某篇文章.md` | optional boolean / unset by schema, true in article layout | Conditional: outputs the indexing root when global search is on. False does not remove lists, recommendations, RSS, machine exports or public URLs. | search: false |

To exclude one article from site search, add to existing frontmatter:

```yaml
search: false
```

Do not write theme.search: false or add top-level search: false. It is not a privacy switch. There is no draft/future-date filter; keep unready content outside collections. See [article fields](/en/blog/config-article/#frontmatter).

### What is indexed?

Standard articles emit data-anglefeint-search only when both switches permit it. Marked content includes title, visible subtitle and body. context identical to subtitle is handled once in that subtitle position, not as a separate field for every context.

Navigation, player, footer, comments and related posts are excluded from the article body. frontmatter.description is not directly used as this UI's result excerpt; tags are not configurable filters. Pagefind returns title metadata/body excerpts. No OCR or audio/video transcription is performed.

About, Fragments, Decoder, home and lists have no default article indexing roots and do not become results merely by enabling search. Custom pages must implement the indexing-marker contract; arbitrary site.config fields cannot add that capability.

<a id="messages"></a>

## messages.search: eleven messages

Full prefix: `i18n.locales.<locale>.messages.search.`. All are optional string overrides using built-in language text/fallback. Defaults below are Simplified Chinese / English. Examples are field values. All are conditional on the corresponding search entry/interface/state.

| Field         | Simplified Chinese / English default                                                                                                 | Purpose, limits and placeholders                                                                      | Example value                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `label`       | 搜索 / Search                                                                                                                        | Search-entry accessible name/tooltip and dialog title, not a query.                                   | `"SearchArticles"`                               |
| `close`       | 关闭搜索 / Close search                                                                                                              | Close-button accessible name/tooltip; visible esc/icon stay fixed.                                    | `"Close search"`                                 |
| `placeholder` | 搜索文章… / Search articles…                                                                                                         | Input placeholder and accessible label; does not prefill a query.                                     | `"Enter article keywords"`                       |
| `hint`        | 搜索当前语言的文章。 / Search articles in the current language.                                                                      | Production hint before a query.                                                                       | `"Search articles in the current language."`     |
| `loading`     | 正在搜索… / Searching…                                                                                                               | Searching/preparing status, not a timing/loading-policy setting.                                      | `"Searching…"`                                   |
| `empty`       | 没有找到匹配的文章。 / No matching articles.                                                                                         | No-result message; may also appear without an index for the language.                                 | `"No matching articles found."`                  |
| `error`       | 搜索加载失败，请重试。 / Search could not load. Please try again.                                                                    | Failure loading language manifest, search module or result details, not build-error text.             | `"Search is unavailable; please retry."`         |
| `retry`       | 重试 / Retry                                                                                                                         | Retry-button text; retries engine loading without rebuilding an index in the browser.                 | `"Reload"`                                       |
| `more`        | 加载更多 / Load more                                                                                                                 | Loads another batch without changing batch size.                                                      | `"More results"`                                 |
| `results`     | 找到 {count} 篇文章 / {count} articles found                                                                                         | Found-result count. Preserve literal {count}; first occurrence is replaced. Not displayed-card count. | `"{count} articles found"`                       |
| `dev`         | 本地完整搜索请先运行 npm run build，再运行 npm run preview。 / To test full search locally, run npm run build, then npm run preview. | Development-mode notice. No real search in dev, and editing this cannot create indexes.               | `"Build the site, then test search in preview."` |

Messages render as text, not executable HTML. Empty strings replace labels without hiding controls and may harm accessible naming. {count} is not appended automatically to custom results text; retain it once to show the number.

### Mergeable example

Merge into existing defineThemeConfig({...}) in src/site.config.ts, retaining imports/exports/personal settings without duplicate theme/i18n:

```ts
theme: { search: { enabled: true } },
i18n: {
  locales: {
    en: {
      messages: {
        search: {
          label: 'Search articles',
          placeholder: 'Enter article keywords',
          results: 'Found {count} articles',
          empty: 'No matching articles found.',
        },
      },
    },
  },
},
```

<a id="language-and-loading"></a>

## Language, resource loading and results

- Build output pagefind/ includes language manifest anglefeint.json and Pagefind modules. Opening search loads the manifest/engine, while the UI script itself ships with pages containing the entry. Not all search code waits for the click.
- Resource paths include Astro BASE_URL. Missing pagefind/, HTML-only deployment or resource URLs rewritten to HTML can fail loading. There is no public index-path setting.
- The client compares document html lang with the manifest case-insensitively. Missing current-language indexes yield no results, not fallback English search. Effective page language, not message fallback, chooses articles.
- Input debounces about 200ms. IME composition waits until completion; form submission can search immediately. Empty terms do not search. Timing is not configurable or an AI request.
- Each batch loads at most eight result details, then “more.” No pageSize option. The count is total matches, not current batch size. Only same-origin result links survive; excerpts retain text/mark highlights rather than arbitrary article HTML.
- Pagefind determines order. No theme ranking/recommendation parameters exist; message fallback does not add another language's articles.

See [language metadata](/en/blog/config-languages/#meta). Search messages change UI, not content generation or index languages.

<a id="preview"></a>

## Why is real search unavailable in dev?

Indexing runs after Astro builds, not in npm run dev. Dev displays messages.search.dev and does not actually search entered terms. This is intended, not missing configuration.

After preparing content, run locally:

```bash
npm run build
npm run preview
```

preview serves build output. Rebuild after editing posts, language metadata, inclusion switches or site paths to test a new index. Deploy pages and pagefind together. Editing in dev does not update production indexes.

With no indexable articles, an identifiable empty language manifest still allows empty-result UI. Indexing failures stop the build rather than silently publishing false success. Retry reloads existing resources; it cannot repair builds or create missing articles in a visitor's browser.

<a id="discovery"></a>

## Settings for other discovery routes

These reuse their original modules' fields/defaults rather than adding search configuration:

| Path or location                                  | Type / default                            | Purpose, limits and example                                                                                              | Reference                                                     |
| ------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| theme.homeLatestCount                             | number / 3                                | Homepage latest count, e.g. theme: { homeLatestCount: 5 }; not search batch size or related-post count.                  | [Homepage count](/en/blog/config-home/#latest-count)          |
| theme.blogPageSize                                | number / 10                               | Blog/tag items per page, e.g. theme: { blogPageSize: 8 }; not search results.                                            | [List pagination](/en/blog/config-blog-list/#page-size)       |
| theme.tags.enabled                                | boolean / true                            | Tags and standard tag pages, e.g. theme: { tags: { enabled: false } }; does not delete tags or disable full-text search. | [Tags switch](/en/blog/config-blog-list/#tags-enabled)        |
| Article frontmatter.tags                          | optional string[] / unset                 | Tag archives and labels, e.g. ['Astro', 'Notes']; not current recommendation relevance or a search allowlist.            | [Article fields](/en/blog/config-article/#frontmatter)        |
| `i18n.locales.<locale>.messages.blog.related`     | string / built-in language defaults below | Related-post heading, text only; example 'Keep reading'.                                                                 | [Article messages](/en/blog/config-article/#article-messages) |
| `i18n.locales.<locale>.messages.blog.relatedAria` | string / built-in language defaults below | Related-area accessible name; example 'More articles'.                                                                   | [Article messages](/en/blog/config-article/#article-messages) |

Related posts are the latest three current-language posts excluding the current one, not tag/content/canonicalTopic similarity. No relatedCount, related switch or manual recommendation list exists in site.config. With no other posts the area disappears. search: false posts can still be recommended.

| Message                   | Simplified Chinese / English default |
| ------------------------- | ------------------------------------ |
| messages.blog.related     | 相关文章 / Related                   |
| messages.blog.relatedAria | 相关文章 / Related posts             |

<a id="public-outputs"></a>

## RSS, SEO and machine exports are not site search

| Entry                            | Current behavior and relationship                                                                                                                                                                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/<locale>/rss.xml`              | Per-enabled-language article-summary feed. Title uses the site name, description messages.blog.archiveDescription. Items use title, description, pubDate and public URL. search: false does not exclude them. Not full-text RSS, and no RSS switch exists inside theme.search. |
| Page metadata and search engines | Separate from site-search indexes. search: false adds no noindex and does not disable sitemap or control Internet crawlers.                                                                                                                                                    |
| Public machine-readable text     | Articles/About/Fragments have separate export pipelines independent of Pagefind. See [language context](/en/blog/config-languages/#ai-context). search: false is not a privacy filter.                                                                                         |

Use real site names, domains and feed descriptions. See [deployment](/en/blog/starter-guide-deployment/) for public URLs and [list descriptions](/en/blog/config-blog-list/#archive-messages) for RSS archiveDescription. No site-search result does not mean the content is not public.

Global search, per-article search and all eleven messages have consumers. No old search compatibility fields need filling. Unused article canonicalTopic does not become an index category by proximity to search settings; see [article compatibility](/en/blog/config-article/#legacy-frontmatter). No cross-language merged search, OCR, search-term analytics, result weights or configurable index types are exposed.

Return to the [reference index](/en/blog/config-reference/).
