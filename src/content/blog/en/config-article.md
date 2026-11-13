---
tags: ['anglefeint', 'config']
title: 'Configuration Reference: Article Detail Pages'
subtitle: 'Global article controls, all frontmatter fields, output labels and interaction messages.'
description: 'Types, defaults, limits and examples for article pages, including sharing priority, compatibility-only metrics and current unsupported settings.'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

**Version note:** Live reduced-motion updates and consistent article-author/share-image keys require 0.36.1 or later; 0.36.0 does not include these fixes.

[Back to the configuration index](/en/blog/config-reference/). First distinguish files: site-wide functionality/messages belong in `src/site.config.ts`; article titles, dates, images and statistics belong in Markdown/MDX frontmatter. Do not interchange them.

This page describes package-owned standard article routes. For enabled languages they provide contents, statistics, translation links and up to three other articles according to actual content. Custom direct BlogPost calls must supply relevant component props themselves rather than expecting all route behavior automatically.

## 1. Global feature switches

<a id="feature-switches"></a>

These site.config theme fields are all `boolean`, with theme default `true`. Each row includes an example to merge into theme. Choose as needed; this is not advice to disable everything.

| Full path                      | Purpose and conditions                                                                                                           | Limits and example                                                                                                                              |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.toc.enabled`            | Shows article contents by default, using compiler-provided second/third-level Markdown headings; hidden without usable headings. | Per-article toc: true/false wins. Component/internal raw HTML headings are not included automatically. Example `toc: { enabled: false }`.       |
| `theme.math.enabled`           | Enables Markdown/MDX math processing; imports math styles only when the body actually contains math markers.                     | Global, without a per-article math switch. Invalid expressions fail compilation; disabling changes parsing. Example `math: { enabled: false }`. |
| `theme.effects.enableRedQueen` | Shows the Red Queen monitor beside articles.                                                                                     | false does not disable background networks, cover Canvas or the AI atmosphere. Example `effects: { enableRedQueen: false }`.                    |
| `theme.search.enabled`         | Enables search entry and article index generation. See [search](/en/blog/config-search/#enabled).                                | Per-article search: false excludes an article; true cannot reenable globally disabled search. Example `search: { enabled: false }`.             |
| `theme.tags.enabled`           | Shows article tag links and controls the tag directory/list.                                                                     | false does not delete tags. Example `tags: { enabled: false }`; see [list scope](/en/blog/config-blog-list/#tags-enabled).                      |
| `theme.socialImage.enabled`    | Automatically generates 1200×630 share images for articles without explicit ogImage.                                             | false retains manual ogImage and falls back to cover/site image; does not hide covers. Example `socialImage: { enabled: false }`.               |

All are conditional on content, regions and listed precedence. For example, disable default contents while retaining other defaults:

```ts
theme: { toc: { enabled: false } },
```

Third-level headings can nest under second-level headings; standalone third-level headings also become entries. Level four and deeper are excluded. Body text remains immediately visible; contents is not a loading prerequisite.

## 2. Related author, attribution, share-image and comment controls

<a id="shared-controls"></a>

These belong to shared modules; this section describes only their article effects:

| Full path                  | Effect on articles                                                                                                                 | Main reference                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `site.author`              | Author fallback when article author is omitted/blank; also used in generated share images.                                         | [Site identity](/en/blog/config-site-chrome/#identity)                    |
| `theme.enableAboutPage`    | When enabled and article author matches site author, links to localized About; otherwise plain text.                               | [About switch](/en/blog/config-about/#page-enabled)                       |
| `theme.footer.showCredits` | Affects theme attribution in generated share images, without changing custom images.                                               | [Footer](/en/blog/config-site-chrome/#footer)                             |
| `site.ogImage`             | Site share-image fallback without higher-priority page images.                                                                     | [Site identity and image priority](/en/blog/config-site-chrome/#identity) |
| `theme.comments.enabled`   | Article comments also require complete connection values and valid mapping constraints. No per-article frontmatter comment switch. | [Giscus](/en/blog/config-comments/#controls)                              |

## 3. Per-article fields: not site.config

<a id="frontmatter"></a>

These are all 22 article frontmatter fields, not new site.config keys. Types start with author input; dates parse to Date and local images to image metadata.

### Content and metadata

| Field         | Type and default behavior                                             | Purpose, limits and example                                                                                                                        |
| ------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | required string, no default                                           | Article title and metadata, not the global name. Example `title: 'My notes'`.                                                                      |
| `description` | required string, no default                                           | Page meta description, also title-area context when context is unset. Not the full body. Example `description: 'Notes from a debugging session.'`. |
| `pubDate`     | required parseable date, no default                                   | Publication time, list sorting and publishing metadata. Detail dates use UTC; future dates do not hide articles. Example `pubDate: '2026-11-13'`.  |
| `updatedDate` | optional date, unset                                                  | Displays update date and takes priority in sitemap. Does not replace pubDate sorting. Example `updatedDate: '2026-11-14'`.                         |
| `author`      | optional string; omitted/blank uses site author                       | Does not create an author page. Example `author: 'Guest author'`.                                                                                  |
| `subtitle`    | optional string, unset                                                | Visible subtitle, omitted when identical to context. Example `subtitle: 'From symptoms to the cause'`.                                             |
| `context`     | optional string; omitted uses description                             | Context below title. Empty strings hide that line without clearing meta description. Example `context: 'Solving a specific problem.'`.             |
| `tags`        | optional string array; no entries when unset                          | Link display also depends on global tags. Example `tags: ['astro', 'notes']`.                                                                      |
| `heroImage`   | optional local image path; no cover when unset                        | Remote URLs/public URLs do not follow this rule. Example `heroImage: ./cover.jpg`; prepare the file first.                                         |
| `ogImage`     | optional local image/public path/HTTPS; omitted uses sharing fallback | Does not change body cover. Example `ogImage: /images/share.png`; prepare the file first.                                                          |
| `toc`         | optional boolean; inherits global contents setting                    | true overrides global false, but still needs headings. Example `toc: false`.                                                                       |
| `search`      | optional boolean; default true                                        | false excludes site search without hiding articles, RSS, sitemap or AI exports. Example `search: false`.                                           |

Begin with required fields, adding others as needed:

```yaml
---
title: 'My notes'
description: 'Notes from a debugging session.'
pubDate: '2026-11-13'
subtitle: 'From symptoms to the cause'
context: 'Solving a specific problem.'
tags: ['astro', 'notes']
toc: true
search: true
---
```

There is no draft, scheduled publication, per-article comments, Red Queen or math switch. Keep unfinished material outside content directories. Unknown keys are not privacy controls.

<a id="output-fields"></a>

### OUTPUT statistics and status text

| Field        | Type and default behavior                                                       | Purpose, limits and example                                                                                    |
| ------------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `wordCount`  | optional nonnegative integer; calculated from body source                       | Independent word-count override. Example `wordCount: 800`; does not change tokenCount.                         |
| `tokenCount` | optional nonnegative integer; default round(max(automatic word count, 1) × 1.3) | Estimate, not model tokenization or actual usage. Example `tokenCount: 1040`.                                  |
| `aiModel`    | optional string; no label when unset                                            | Shown in title status and OUTPUT, without model verification. Example `aiModel: 'Author-supplied model name'`. |
| `aiMode`     | optional string; no label when unset                                            | Mode label only; does not execute tasks. Example `aiMode: 'notes'`.                                            |
| `aiState`    | optional string; no label when unset                                            | Status label only, without health checks. Example `aiState: 'edited'`.                                         |

Automatic counts strip some Markdown, code and links. CJK ideographs, kana and Korean count by character; other text mostly by whitespace-delimited words. Math and MDX source can affect estimates. Setting only wordCount does not recalculate tokenCount. Values from 1,000 display with one decimal and k, without changing raw values.

```yaml
wordCount: 800
tokenCount: 1040
aiModel: 'Author-supplied model name'
aiMode: 'notes'
aiState: 'edited'
```

<a id="legacy-frontmatter"></a>

### Compatibility and currently unused fields

| Field            | Type / default                      | Status, limits and example                                                                                                                                                  |
| ---------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `readMinutes`    | optional positive integer, unset    | Compatibility only; reading time is no longer displayed. `readMinutes: 3` does not restore it.                                                                              |
| `aiLatencyMs`    | optional nonnegative integer, unset | Compatibility only; latency is no longer displayed. `aiLatencyMs: 150` is not a measurement.                                                                                |
| `aiConfidence`   | optional number from 0–1, unset     | Compatibility only; confidence is no longer displayed. `aiConfidence: 0.9` is not an accuracy assessment.                                                                   |
| `canonicalTopic` | optional string, unset              | Currently unused. `canonicalTopic: 'astro'` creates no topic and changes no canonical.                                                                                      |
| `sourceLinks`    | optional address array, unset       | Validation/normalization only. Accepts HTTP(S), adds https to bare domains. `sourceLinks: ['https://example.com/']` does not render references or enter exported body text. |

Put Markdown reference links directly in the body if readers should see sources. Accepted legacy fields do not imply their old interface still exists, nor must they be removed for upgrades.

## 4. Article interface messages

<a id="article-messages"></a>

Prefix: `i18n.locales.<locale>.messages.blog`. Every field is an optional string override using ordinary locale resolution. The table shows Simplified Chinese / English built-in defaults. Examples are individual blog-object members, not frontmatter.

Active messages are conditional on their area appearing. Empty strings may clear a label without disabling functionality; retain accessible names. Currently unused fields have no page effect.

| Field                | Simplified Chinese / English defaults | Purpose and limits                                                        | Status           | Member example                         |
| -------------------- | ------------------------------------- | ------------------------------------------------------------------------- | ---------------- | -------------------------------------- |
| `rqBadge`            | 监视器信号 / monitor feed             | Monitor badge; requires Red Queen and does not represent real monitoring. | Conditional      | `rqBadge: "monitor feed"`              |
| `rqReplayAria`       | 重放监视器信号 / Replay monitor feed  | Monitor replay accessible name; does not change assets/playback strategy. | Conditional      | `rqReplayAria: "Replay monitor feed"`  |
| `backToTop`          | 返回顶部 / Back to top                | Back-to-top accessible name; visibility depends on scroll state.          | Conditional      | `backToTop: "Back to top"`             |
| `toastP10`           | 语境解析 10% / context parsed 10%     | Early reading-progress toast, not AI request progress.                    | Conditional      | `toastP10: "context parsed 10%"`       |
| `toastP30`           | 语境解析 30% / context parsed 30%     | Reading-progress toast, not semantic parsing results.                     | Conditional      | `toastP30: "context parsed 30%"`       |
| `toastP60`           | 推理稳定 60% / inference stable 60%   | Reading-progress toast, not model inference state.                        | Conditional      | `toastP60: "inference stable 60%"`     |
| `toastDone`          | 输出完成 / output finalized           | End-of-reading toast, not proof of generation/validation.                 | Conditional      | `toastDone: "output finalized"`        |
| `metaPublished`      | 发布 / published                      | Publication-date label, without changing the date.                        | Conditional      | `metaPublished: "published"`           |
| `metaAuthor`         | 作者 / by                             | Author label, without changing its value.                                 | Conditional      | `metaAuthor: "by"`                     |
| `metaUpdated`        | 更新 / updated                        | Update-date label; requires updatedDate.                                  | Conditional      | `metaUpdated: "updated"`               |
| `systemStatusAria`   | 模型状态 / Model status               | Accessible name of title status; needs at least one status field.         | Conditional      | `systemStatusAria: "Model status"`     |
| `systemModelLabel`   | 模型 / model                          | Model label when aiModel exists, also used in OUTPUT.                     | Conditional      | `systemModelLabel: "model"`            |
| `systemModeLabel`    | 模式 / mode                           | Mode label; needs aiMode.                                                 | Conditional      | `systemModeLabel: "mode"`              |
| `systemStateLabel`   | 状态 / state                          | State label; needs aiState.                                               | Conditional      | `systemStateLabel: "state"`            |
| `promptContextLabel` | 语境 / Context                        | Context label; needs nonempty context.                                    | Conditional      | `promptContextLabel: "Context"`        |
| `heroMonitor`        | 神经监视器 / neural monitor           | Cover monitor text; needs heroImage.                                      | Conditional      | `heroMonitor: "neural monitor"`        |
| `heroSignalSync`     | 信号同步中 / signal sync active       | Static decorative cover signal text, without synchronization checks.      | Conditional      | `heroSignalSync: "signal sync active"` |
| `heroModelOnline`    | 模型在线 / model online               | Static decorative cover model text, without service checks.               | Conditional      | `heroModelOnline: "model online"`      |
| `toc`                | 文章目录 / On this page               | Contents name; requires enabled contents and usable headings.             | Conditional      | `toc: "On this page"`                  |
| `responseOutput`     | 输出 / Output                         | Body OUTPUT bar name; does not control content.                           | Conditional      | `responseOutput: "Output"`             |
| `statsWords`         | 词 / words                            | Word-count label, without changing values.                                | Conditional      | `statsWords: "words"`                  |
| `statsTokens`        | 令牌 / tokens                         | Token label, without changing estimates.                                  | Conditional      | `statsTokens: "tokens"`                |
| `copySectionLink`    | 复制本节链接 / Copy section link      | Body h2/h3 section-link-copy accessible name, without changing anchors.   | Conditional      | `copySectionLink: "Copy section link"` |
| `regenerate`         | 重播扫描 / Replay scan                | Scan replay text; visual effect only.                                     | Conditional      | `regenerate: "Replay scan"`            |
| `relatedAria`        | 相关文章 / Related posts              | Related-region accessible name; requires other articles.                  | Conditional      | `relatedAria: "Related"`               |
| `related`            | 相关文章 / Related                    | Related heading, without changing recommendation logic.                   | Conditional      | `related: "Related"`                   |
| `backToBlogAria`     | 返回博客 / Back to blog               | Accessible name for back-to-blog navigation.                              | Conditional      | `backToBlogAria: "Back to blog"`       |
| `backToBlog`         | 返回博客 / Back to blog               | Visible back-to-blog text, without changing its target.                   | Conditional      | `backToBlog: "Back to blog"`           |
| `comments`           | 评论 / Comments                       | Comments-region accessible name; requires valid article comments.         | Conditional      | `comments: "Comments"`                 |
| `metaReadMinutes`    | 分钟阅读 / min read                   | Currently unused; changing this does not restore reading time.            | Currently unused | `metaReadMinutes: "min read"`          |
| `latencyLabel`       | 延迟估计 / latency est                | Currently unused; changing this does not restore latency.                 | Currently unused | `latencyLabel: "latency est"`          |
| `confidenceLabel`    | 置信度 / confidence                   | Currently unused; changing this does not restore confidence.              | Currently unused | `confidenceLabel: "confidence"`        |

Status labels, cover markers and scroll toasts mainly express atmosphere; they do not measure live model health, network synchronization or accuracy. regenerate only replays a visual scan, without rewriting articles or requesting AI.

For example, change OUTPUT and section-copy labels:

```ts
i18n: {
  locales: {
    en: {
      messages: {
        blog: {
          responseOutput: 'Article body',
          statsWords: 'Words',
          statsTokens: 'Estimated tokens',
          copySectionLink: 'Copy this section URL',
          regenerate: 'Replay the scan effect',
        },
      },
    },
  },
},
```

Back-to-blog still targets the current-language list. Related articles are the latest up to three other articles in the same language, without AI similarity ranking or count/similarity settings. related/relatedAria change only text and accessibility labels.

<a id="interaction-messages"></a>

### Code-copy and image-preview text

Prefix: `i18n.locales.<locale>.messages`. Each field is also an optional, conditional string override. It changes neither copy permissions nor image sources and adds no feature switch.

| Path suffix          | Simplified Chinese / English defaults                               | Purpose and limits                                                            | Member example                                                   |
| -------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `codeCopy.copy`      | 复制代码 / Copy code                                                | Code-copy button text; does not change copied content.                        | `codeCopy: { copy: "Copy code" }`                                |
| `codeCopy.copied`    | 已复制 / Copied                                                     | Code and section-link copy success text.                                      | `codeCopy: { copied: "Copied" }`                                 |
| `codeCopy.failed`    | 复制失败，请手动选择代码。 / Copy failed. Select the code manually. | Code and section-link copy failure text; does not grant clipboard permission. | `codeCopy: { failed: "Copy failed. Select the code manually." }` |
| `imagePreview.open`  | 查看大图 / View image                                               | Accessible name of image-preview entry/dialog.                                | `imagePreview: { open: "View image" }`                           |
| `imagePreview.close` | 关闭图片预览 / Close image preview                                  | Image-preview close accessible name; does not change image source.            | `imagePreview: { close: "Close image preview" }`                 |

```ts
i18n: {
  locales: {
    en: {
      messages: {
        codeCopy: { copy: 'Copy content', copied: 'Copied', failed: 'Copy failed. Select the text manually.' },
        imagePreview: { open: 'Enlarge this image', close: 'Close image' },
      },
    },
  },
},
```

Section-copy buttons attach only to body h2/h3 headings with IDs and reuse codeCopy.copied/failed. Code copying and image preview require JavaScript. Ordinary body-image previews exclude covers and images inside links/buttons; enlargement reuses the browser-selected source without separately requesting the original. Neither feature has a site.config enabled field.

## 5. Current boundaries and verification

Article pages respond to changes in the system reduced-motion preference without a reload. Enabling it makes the cover and background network static and stops/hides Red Queen; disabling it restores effects with their existing startup timing. Switching does not reset reading progress or rebind code copying, section links or image previews. No site.config switch is added.

Body and body panel appear directly and remain still. Background networks, title light bands and cover effects are independent. There are no public global AI-scene switch, body-entry duration, panel-breathing, related-count, image-preview enabled or code-copy enabled settings. Arbitrary keys do not activate them.

locale, articleSlug, headings, filePath, related, localeHrefs and seoLocaleHrefs are BlogPost props, not site.config/frontmatter. Standard routes supply them. Ordinary articles require no manual component props.

In dev, inspect content with/without headings and covers, and check copying, section links and image preview. Verify search in built preview. Before publishing, stop dev, run npm run doctor then npm run preview. Success needs no immediate repeat check/build; production updates only after redeployment.

See [installation and upgrading](/en/blog/starter-guide-1-configure-your-site/), [writing articles](/en/blog/starter-guide-2-languages-and-routing/) and [deployment](/en/blog/starter-guide-deployment/).
