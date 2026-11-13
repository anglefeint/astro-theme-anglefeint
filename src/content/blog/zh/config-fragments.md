---
tags: ['anglefeint', 'config']
title: '配置字典：Fragments'
subtitle: '碎片列表、首页预览、独立评论与稳定链接。'
description: '按实际实现查阅 Fragments 开关、分页、评论、界面文案和内容字段，区分有效设置与当前未使用字段。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

想先发一条内容，读[发布一条碎片](/zh/blog/starter-guide-5-fragments/)；这里用于查配置。安装与配置文件的位置见[第一篇教程](/zh/blog/starter-guide-1-configure-your-site/)，所有模块从[配置字典总入口](/zh/blog/config-reference/)进入。

本文默认值指主题包默认值，不是演示站当前配置。所有配置片段都合并进 `src/site.config.ts` 现有的 `defineThemeConfig({...})`；不要重复创建 theme 或 i18n。

## 先找到要改的位置

| 想改什么                     | 配置路径或位置                                                    |
| ---------------------------- | ----------------------------------------------------------------- |
| 开启碎片列表和首页入口       | `theme.fragments.enabled`                                         |
| 完整列表每页条数             | `theme.fragments.pageSize`                                        |
| 碎片独立评论                 | `theme.fragments.comments.enabled`，连接参数共用 `theme.comments` |
| 标题、描述、提示和关闭文案   | `i18n.locales.<语言>.messages.fragments`                          |
| 页码和跳页交互               | `theme.pagination`，文案使用 `messages.blog`                      |
| 单条内容的 ID、时间和标题    | Markdown frontmatter，不是 site.config                            |
| 首页显示几条、预览高度、头像 | 当前没有对应公开配置字段                                          |

<a id="enabled"></a>

## theme.fragments.enabled：开启碎片

- **类型 / 默认值：** boolean / `false`。
- **状态 / 作用：** 生效。开启后加载 `src/content/fragments/<语言>/**/*.md`，生成启用语言的碎片列表和定位索引；首页有该语言内容时显示碎片入口。
- **限制：** 关闭后不加载碎片集合，也不生成对应列表路由。文件仍保留。开启但没有内容时，列表显示空状态，首页不显示入口。只读取 `.md`，不读取 `.mdx`。
- **示例：** `theme: { fragments: { enabled: true } }`。

列表首页是 `/<语言>/fragments/`，第二页起是 `/<语言>/fragments/2/` 等；不要自行添加首页 `/1/`。语言必须先启用，见[多语言教程](/zh/blog/starter-guide-languages/)。

`theme.fragments.enabled: false` 时，dev、build 和 prepare-covers／doctor 跳过碎片正文中的图片引用；仅由这些引用纳入处理的图片不再要求原图或派生文件存在。文章封面引用，以及 `src/assets/blog/default-covers/`、`src/assets/blog/covers/originals/` 两个来源池仍正常准备和校验，即使某张图只用于碎片。关闭不会删除文件，重新开启后恢复碎片图片准备与检查。

**版本说明：** 上述关闭后的图片隔离从 0.36.1 起提供，0.36.0 不包含；不要视为旧版本已有的行为。

<a id="page-size"></a>

## theme.fragments.pageSize：完整列表每页数量

- **类型 / 默认值：** number / `20`。
- **状态 / 作用：** 生效，控制完整列表分页和 ID 到页码的定位索引。
- **限制：** 必须是 **1–100 的安全整数**，小数、0、负数及超出范围会报错，不会自动截断。即使碎片关闭，填写的 pageSize 也会被校验。首页预览仍固定取最新三条，不受此字段或 `theme.homeLatestCount` 影响。
- **示例：** `theme: { fragments: { pageSize: 10 } }`。

同一语言内先按 pubDate 从新到旧排序；时间相同时再按 ID 的 `localeCompare` 结果排序。没有按文件名排序，也没有自动排除未来日期。调整每页条数会改变内容所在页，分享时使用下面的稳定链接。

<a id="comments-enabled"></a>

## theme.fragments.comments.enabled：碎片评论

- **类型 / 默认值：** boolean / `false`。
- **状态 / 作用：** 条件生效。碎片功能开启后，在完整列表的每条卡片中显示评论按钮，点击打开共用弹窗并加载该条讨论。首页预览不显示评论按钮。
- **限制：** 独立于 `theme.comments.enabled`（文章评论开关）。必须同时配置共用 Giscus 连接参数；缺失会在生成碎片页面时抛错，不能靠空列表绕过。Giscus 服务与仓库权限仍需正确设置。
- **示例：** `theme: { fragments: { enabled: true, comments: { enabled: true } } }`。

只开碎片、不启用评论：

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 10,
    comments: { enabled: false },
  },
},
```

只开碎片评论时，文章开关可保持 false，但仍须配置公共的 repo、repoId、category、categoryId。四项参数的类型、默认值和校验统一见[Giscus 连接参数](/zh/blog/config-comments/#connection)；可直接合并的完整示例见[仅开启碎片评论](/zh/blog/config-comments/#fragment-overrides)。主题本地检查不能证明远端权限或 ID 正确。

碎片以 `fragment/<稳定ID>` 绑定讨论，同 ID 的多语言内容共享讨论。此绑定不使用文章的 mapping、term、number 或 shareAcrossLocales 设置；碎片固定 specific 映射、strict 为 `'1'`、emitMetadata 为 `'1'`，语言跟随页面，不使用 `theme.comments.lang`。如果同时开启文章评论，文章配置自身的校验仍然执行。

评论主题、反应和输入框位置继续共用 Giscus 设置；完整操作见评论教程。第一次点击才插入 Giscus 脚本；这里的 loading 固定 eager，指点击之后立即加载，不是首屏提前加载。关闭弹窗保留已创建的 iframe；换一条内容时切换讨论。约 15 秒无有效加载响应时显示失败与重试界面，没有公开超时配置。

<a id="fragment-messages"></a>

## 碎片界面文案：messages.fragments

完整前缀是 `i18n.locales.<语言>.messages.fragments`。下面每个字段都是 **string**，只改文案，不改变功能。默认使用内置当前语言文案，并遵循语言回退；表中只列中文 / 英文默认值。省略字段保留默认文案，空字符串是主动覆盖，不保证对应控件消失。示例列写在 fragments 对象内。

| 字段             | 中文 / 英文默认值                                                                                                         | 状态、作用与限制                                                         | 示例                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------- |
| `title`          | 碎片 / Fragments                                                                                                          | 条件生效：列表标题、页面标题的一部分、首页入口的无障碍名称；不是单条标题 | `title: '随手记'`                       |
| `description`    | 沿途记录的几句话。 / Brief thoughts, kept along the way.                                                                  | 条件生效：列表可见介绍及页面描述；首页展开窗口不显示此介绍               | `description: '记录工作与生活的小事。'` |
| `empty`          | 还没有碎片。 / No fragments yet.                                                                                          | 条件生效：完整列表没有内容时的提示，不会强制显示首页入口                 | `empty: '稍后再来看看。'`               |
| `comments`       | 评论 / Comments                                                                                                           | 条件生效：开启碎片评论后的按钮文字                                       | `comments: '参与讨论'`                  |
| `close`          | 关闭 / Close                                                                                                              | 条件生效：评论弹窗关闭文字及首页窗口关闭按钮的无障碍名称                 | `close: '关闭窗口'`                     |
| `previous`       | 上一页 / Previous                                                                                                         | **当前未使用**：类型仍接受，实际分页使用 messages.blog.previous          | `previous: '上一页'`                    |
| `next`           | 下一页 / Next                                                                                                             | **当前未使用**：类型仍接受，实际分页使用 messages.blog.next              | `next: '下一页'`                        |
| `loading`        | 正在加载评论… / Loading comments…                                                                                         | 条件生效：评论加载状态                                                   | `loading: '正在连接讨论…'`              |
| `error`          | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | 条件生效：评论加载失败提示，不是定位索引错误                             | `error: '讨论暂时不可用，请重试。'`     |
| `retry`          | 重试 / Retry                                                                                                              | 条件生效：评论加载失败后的重试按钮                                       | `retry: '重新连接'`                     |
| `copyLink`       | 复制碎片链接 / Copy fragment link                                                                                         | 条件生效：分享链接按钮的标题和无障碍名称，按钮由脚本启用                 | `copyLink: '复制本条链接'`              |
| `linkCopied`     | 链接已复制 / Link copied                                                                                                  | 条件生效：复制成功提示                                                   | `linkCopied: '已复制'`                  |
| `copyLinkFailed` | 未能自动复制，请复制下方链接。 / Unable to copy automatically. Copy the link below.                                       | 条件生效：剪贴板复制失败，提示手动复制                                   | `copyLinkFailed: '请手动复制此链接。'`  |
| `notFound`       | 找不到这条碎片，它可能已被移除。 / Fragment not found. It may have been removed.                                          | 条件生效：稳定 ID 定位失败，不是通用 404 文案                            | `notFound: '这条记录已不存在。'`        |
| `indexError`     | 暂时无法定位这条碎片，请刷新页面后重试。 / Unable to locate this fragment. Refresh the page and try again.                | 条件生效：定位索引请求或校验失败                                         | `indexError: '定位失败，请刷新重试。'`  |

例如只覆盖中文的标题和描述：

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

## Fragments 还会用到哪些通用配置？

| 路径                                                                                                         | 默认值与作用                                             | 限制、示例与完整说明                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme.pagination.*`                                                                                         | 共用 Blog List 的八个分页字段及默认值                    | 多于一页才显示分页；如 `theme: { pagination: { windowSize: 5 } }`。类型、范围和逐字段示例见[分页设置](/zh/blog/config-blog-list/#pagination-window)及其后各节 |
| `i18n.locales.<语言>.messages.blog.previous`、`next`、`paginationAria`、`jumpTo`、`jumpInputLabel`、`jumpGo` | string，内置当前语言文案，控制碎片分页的可见及无障碍文字 | 如 `previous: '上一页'`；见[分页文案字典](/zh/blog/config-blog-list/#pagination-messages)，不要改同名 fragments 字段                                          |
| `i18n.locales.<语言>.messages.blog.backToTop`                                                                | string，内置当前语言文案                                 | 完整列表返回顶部按钮；如 `backToTop: '回到顶部'`，见[文章界面文案](/zh/blog/config-article/#article-messages)                                                 |
| `i18n.locales.<语言>.messages.home.viewAll`                                                                  | string，内置当前语言文案                                 | 首页窗口底部归档链接的无障碍名称还会结合碎片标题；如 `viewAll: '查看全部'`，见[首页文案](/zh/blog/config-home/#home-messages)                                 |
| `theme.math.enabled`                                                                                         | boolean / `true`                                         | 完整列表按当前页内容决定是否需要数学样式；如 `theme: { math: { enabled: false } }`，见[数学开关](/zh/blog/config-article/#feature-switches)                   |

`theme.comments` 的完整公共参数见[Giscus 评论字典](/zh/blog/config-comments/)；本篇明确列出碎片需要的连接字段和绑定差异，不把文章的映射设置当成碎片配置。`theme.toc.enabled`、文章 OUTPUT、Red Queen 等文章功能不控制碎片列表；碎片也没有 Blog List 的 Cards/List 切换。

<a id="content-fields"></a>

## 单条碎片的三个 frontmatter 字段

这是 `src/content/fragments/<语言>/` 下 Markdown 文件的字段，**不写进 site.config**。当前公开 schema 只有以下三项，没有额外的兼容字段。

| 字段      | 类型 / 默认值                     | 作用、状态与限制                                                                             | 示例                                  |
| --------- | --------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------- |
| `id`      | string / 无，必填                 | 生效。恰好 8 位 ASCII 英文字母或数字；同一语言内不能重复。链接和评论都依赖它，发布后保持不变 | `id: 'aB3dE6gH'`                      |
| `pubDate` | 可转换为 Date 的日期值 / 无，必填 | 生效。必须能解析成日期；决定排序，列表按 UTC 展示。推荐带时区的 ISO 字符串，避免日期歧义     | `pubDate: '2026-11-13T08:00:00.000Z'` |
| `title`   | string，可省略 / 未设置           | 条件生效。可选的卡片标题，同时用于首页预览；不填也能发布，不会自动取文件名作为标题           | `title: '今天的小发现'`               |

```md
---
id: 'aB3dE6gH'
pubDate: '2026-11-13T08:00:00.000Z'
title: '今天的小发现'
---

这里写正文。图片和代码直接放在 Markdown 正文中。
```

使用 `npm run new-fragment -- --locales zh,en` 会生成一组共享新 ID 和当前时间的文件。每次运行都生成新的 ID；补译已有碎片时应沿用原 ID，不要重新生成身份。不同语言可以使用同一个 ID；同一语言重复会报错。文件名可改变，ID 不应随文件名或页码改变。旧格式 ID 不会自动迁移，随意改 ID 会改变评论绑定和分享地址。

`description`、`heroImage`、`tags`、`draft`、单条 `comments` 等没有对应的碎片配置消费逻辑，不要套用文章 frontmatter。特别是添加 `draft: true` 不能让碎片变成草稿；不要把尚未公开的内容放进启用的集合。

<a id="preview-and-links"></a>

## 首页预览、图片和链接的固定行为

这些行为由实现决定，当前没有额外公开字段：

- **首页条数：** 当前语言最新三条，不足三条就显示实际数量。底部是“当前显示条数 / 当前语言总数”的归档链接；不会读取其他语言补足数量。
- **首页摘要：** 从渲染后的内容提取文字、第一张可用 HTTP(S) 图片及第一个代码块。文字最多 180 个 Unicode 码点；代码最多 8 行、800 个码点，超出追加省略号。窗口卡片限制预览高度，超出的部分不展示；完整内容仍在列表中。标题单独显示。不是完整 Markdown 渲染，也没有可配置的 previewCount 或 previewHeight。
- **图片：** 支持处理的本地图片通过已有图片清单提供尺寸和 srcset；远程或不支持处理的图片不保证自动优化。完整列表每页第一张图片 eager / high，其余图片 lazy，统一异步解码。准备原图、生成尺寸和检查产物见[图片教程](/zh/blog/starter-guide-images/)，不需要手动给碎片添加 heroImage。
- **稳定链接：** 分享地址是 `/<语言>/fragments/#<ID>`。脚本通过定位索引找到当前页，必要时跳转；新增内容或调整 pageSize 后仍按 ID 定位。删除内容或改 ID 无法保留原目标。关闭 JavaScript 后普通分页仍可使用，跨页自动定位与复制按钮不可依赖。
- **语言切换：** 列表的语言切换链接进入目标语言的碎片首页，不保证直接定位同 ID 的译文。
- **公开内容：** 碎片 Markdown 聚合出口是 `/<语言>/fragments/index.md`。它不是站内搜索或文章 RSS 的启用开关；公开内容不要放敏感信息。

首页头像、悬停动画、窗口边框和代码预览高度目前不是 site.config 配置项；字典不提供不存在的设置。返回[配置总入口](/zh/blog/config-reference/)查其他模块。
