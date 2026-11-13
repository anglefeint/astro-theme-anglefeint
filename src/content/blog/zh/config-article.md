---
tags: ['anglefeint', 'config']
title: '配置字典：文章详情页'
subtitle: '区分全站开关、文章字段和界面文案，查询目录、数学、监视器、OUTPUT 与阅读交互。'
description: '说明文章详情配置的类型、默认值、作用和限制，完整标记文章 frontmatter 中的兼容与当前未使用字段。'
pubDate: '2026-11-13'
updatedDate: '2026-11-14'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
---

**版本说明：** 实时响应减弱动画设置，以及文章作者与自动分享图键一致性的修复，从 0.36.1 起提供，0.36.0 不包含。

[返回配置字典总入口](/zh/blog/config-reference/)。先确认字段写在哪个文件：全站功能与文案放在 `src/site.config.ts`，单篇标题、日期、图片和统计放在 Markdown／MDX 顶部的 frontmatter。不要把两者互换。

本文基于包提供的标准文章路由。它为启用语言生成文章页，按实际内容提供目录、统计、译文链接及最多三篇其他文章；自定义直接调用 BlogPost 的页面需要自己传入相应组件属性，不能期待它自动具有所有路由行为。

## 1. 全站功能开关

<a id="feature-switches"></a>

以下字段在 site.config 的 theme 中，类型均为 `boolean`，主题默认值均为 `true`。下面每行都提供一段可合并进 theme 的示例，按需要选用，不是建议全部关闭。

| 完整路径                       | 作用与生效条件                                                                    | 限制与示例                                                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `theme.toc.enabled`            | 默认显示文章目录，收集编译器提供的二级／三级 Markdown 标题；没有可用标题时不显示  | 单篇 toc: true／false 优先；组件内部或原始 HTML 标题不自动纳入；例 `toc: { enabled: false }`                           |
| `theme.math.enabled`           | 开启 Markdown／MDX 数学处理；文章正文实际含数学标记时才引入数学样式               | 全局设置，没有单篇 math 开关；错误公式会编译失败，关闭会改变数学解析行为；例 `math: { enabled: false }`                |
| `theme.effects.enableRedQueen` | 显示文章侧面的 Red Queen 监视器                                                   | false 不关闭背景网络、封面 Canvas 或整页 AI 氛围；例 `effects: { enableRedQueen: false }`                              |
| `theme.search.enabled`         | 开启搜索入口与文章索引生成；完整定义见[搜索字典](/zh/blog/config-search/#enabled) | 单篇 search: false 可以排除；单篇 true 不能重新开启全站已关闭的搜索；例 `search: { enabled: false }`                   |
| `theme.tags.enabled`           | 显示文章标签链接，也控制标签目录和标签列表                                        | false 不删除原 tags 数据；例 `tags: { enabled: false }`；完整范围见[列表字典](/zh/blog/config-blog-list/#tags-enabled) |
| `theme.socialImage.enabled`    | 未明确填写 ogImage 的文章自动生成 1200×630 分享图                                 | false 不影响手动 ogImage，改为封面或站点默认图回退；不等于隐藏页面封面；例 `socialImage: { enabled: false }`           |

这些字段均为条件生效，受单篇内容、页面区域和所列优先级影响。例如可以只关闭默认目录，保留其他默认行为：

```ts
theme: { toc: { enabled: false } },
```

目录中的三级标题可嵌在二级标题下，孤立三级标题也能作为目录条目。四级及更深标题不进入此目录。正文仍然直接显示，目录不是必须等待的加载步骤。

## 2. 作者、署名、分享图和评论的关联设置

<a id="shared-controls"></a>

这些属于通用模块，本节只说明对文章的实际影响：

| 完整路径                   | 对文章的影响                                                          | 主说明                                                        |
| -------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------- |
| `site.author`              | 单篇 author 省略或空白时的作者回退，也用于生成分享图                  | [站点身份](/zh/blog/config-site-chrome/#identity)             |
| `theme.enableAboutPage`    | 开启且文章作者等于站点作者时，作者链接指向该语言 About；否则是纯文字  | [About 开关](/zh/blog/config-about/#page-enabled)             |
| `theme.footer.showCredits` | 影响自动文章分享图中的主题署名，不修改自定义图片                      | [页脚设置](/zh/blog/config-site-chrome/#footer)               |
| `site.ogImage`             | 页面没有更高优先级图片时的站点分享图回退                              | [站点身份与图片优先级](/zh/blog/config-site-chrome/#identity) |
| `theme.comments.enabled`   | 文章评论还需连接参数完整并满足映射约束；没有单篇 frontmatter 评论开关 | [Giscus 评论](/zh/blog/config-comments/#controls)             |

## 3. 单篇文章字段：不要放进 site.config

<a id="frontmatter"></a>

以下是文章 frontmatter 的完整 22 项，而不是新增的 site.config 字段。类型描述以作者填写的值为起点；日期会解析为 Date，本地图片会解析为图片元数据。

### 内容与元信息

| 字段          | 类型与默认行为                                     | 作用、限制与示例                                                                                      |
| ------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `title`       | 必填 string，无默认                                | 文章标题及相关元信息，不是全站名称；例 `title: '我的笔记'`                                            |
| `description` | 必填 string，无默认                                | 页面元描述，context 未设置时也用作标题下的上下文；不是整篇正文；例 `description: '一次调试的记录。'`  |
| `pubDate`     | 必填可解析日期，无默认                             | 发布时间、列表排序及发布元信息；详情以 UTC 日期显示，未来日期不会隐藏文章；例 `pubDate: '2026-11-13'` |
| `updatedDate` | 可选日期，未设置                                   | 显示更新日期，sitemap 优先使用它；不代替 pubDate 排序；例 `updatedDate: '2026-11-14'`                 |
| `author`      | 可选 string，省略或空白使用站点作者                | 不自动创建作者页；例 `author: '另一位作者'`                                                           |
| `subtitle`    | 可选 string，未设置                                | 显示副标题；与上下文完全相同时不重复显示；例 `subtitle: '从现象到定位'`                               |
| `context`     | 可选 string，省略使用 description                  | 标题下上下文文字；空字符串隐藏这行，但不清空元描述；例 `context: '解决一个具体问题。'`                |
| `tags`        | 可选 string 数组，未设置时无标签条目               | 链接显示还受全站标签开关控制；例 `tags: ['astro', '笔记']`                                            |
| `heroImage`   | 可选本地图片路径，未设置时无封面区                 | 不能直接用远程 URL 或把 public 网址当作同一规则；例 `heroImage: ./cover.jpg`，先放入文件              |
| `ogImage`     | 可选本地图片／public 路径／HTTPS，省略走分享图回退 | 不改变正文封面；例 `ogImage: /images/share.png`，先放入文件                                           |
| `toc`         | 可选 boolean，继承全站目录设置                     | true 可覆盖全站目录关闭，但没有标题仍不显示；例 `toc: false`                                          |
| `search`      | 可选 boolean，默认 true                            | false 排除该篇站内搜索，不隐藏文章、RSS、sitemap 或 AI 导出；例 `search: false`                       |

开始时可以只写必填字段，再按需要补充：

```yaml
---
title: '我的笔记'
description: '一次调试的记录。'
pubDate: '2026-11-13'
subtitle: '从现象到定位'
context: '解决一个具体问题。'
tags: ['astro', '笔记']
toc: true
search: true
---
```

文章没有 draft、定时发布、单篇 comments、单篇 Red Queen 或单篇数学开关。未完成的内容放在内容目录之外，不要把未知字段当成隐私控制。

<a id="output-fields"></a>

### OUTPUT 统计与状态文字

| 字段         | 类型与默认行为                                     | 作用、限制与示例                                                            |
| ------------ | -------------------------------------------------- | --------------------------------------------------------------------------- |
| `wordCount`  | 可选非负整数，默认从正文源文本计算                 | 独立覆盖字词数；例 `wordCount: 800`，不改变 tokenCount                      |
| `tokenCount` | 可选非负整数，默认 round(max(自动字词数, 1) × 1.3) | 估算而非模型分词器或实际用量；例 `tokenCount: 1040`                         |
| `aiModel`    | 可选 string，未设置时无此标签                      | 显示在标题状态区及 OUTPUT，不验证真实模型；例 `aiModel: '作者填写的模型名'` |
| `aiMode`     | 可选 string，未设置时无此标签                      | 仅显示模式文字，不执行任务；例 `aiMode: 'notes'`                            |
| `aiState`    | 可选 string，未设置时无此标签                      | 仅显示状态文字，不查询服务健康状态；例 `aiState: 'edited'`                  |

自动统计会去掉部分 Markdown、代码和链接等内容；CJK 汉字、假名及韩文按字符计，其余主要按空白分词。公式和 MDX 源码仍可能影响估算。只手填 wordCount 不会重算 tokenCount；两者达到 1,000 时以一位小数 k 显示，不修改原始值。

```yaml
wordCount: 800
tokenCount: 1040
aiModel: '作者填写的模型名'
aiMode: 'notes'
aiState: 'edited'
```

<a id="legacy-frontmatter"></a>

### 兼容和当前未使用字段

| 字段             | 类型与默认值               | 状态、限制与示例                                                                                                                  |
| ---------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `readMinutes`    | 可选正整数，未填写         | 兼容保留，当前不展示阅读时长；例 `readMinutes: 3` 不会使页面重新显示它                                                            |
| `aiLatencyMs`    | 可选非负整数，未填写       | 兼容保留，当前不展示延迟；例 `aiLatencyMs: 150` 也不是实际测量                                                                    |
| `aiConfidence`   | 可选 0–1 的 number，未填写 | 兼容保留，当前不展示置信度；例 `aiConfidence: 0.9` 不代表文章正确性评估                                                           |
| `canonicalTopic` | 可选 string，未填写        | 当前未使用；例 `canonicalTopic: 'astro'` 不生成专题、不修改 canonical                                                             |
| `sourceLinks`    | 可选地址数组，未填写       | 当前只有校验／规范化；接受 HTTP(S)，裸域名补 https；例 `sourceLinks: ['https://example.com/']` 不会自动显示参考链接或进入导出正文 |

需要读者看到引用来源，直接在正文放 Markdown 链接。旧字段被接受不等于对应界面仍存在，也不需要为了升级删除原内容。

## 4. 文章界面文案

<a id="article-messages"></a>

下面前缀为 `i18n.locales.<语言>.messages.blog`。字段类型均为可选 string 覆盖，按普通语言文案规则解析；下表列中文／英文内置默认值。示例列是放入对应 blog 对象的单个成员，不是 frontmatter。

所有有效文案均为条件生效，要求对应区域实际出现。空字符串可能清空标签但不会隐藏整个功能；可访问名称不应清空。标记为当前未使用的字段则没有页面效果。

| 字段                 | 中文默认 / 英文默认                  | 作用与限制                                          | 状态       | 成员示例                          |
| -------------------- | ------------------------------------ | --------------------------------------------------- | ---------- | --------------------------------- |
| `rqBadge`            | 监视器信号 / monitor feed            | 监视器徽标；仅 Red Queen 开启时出现，不代表真实监测 | 条件生效   | `rqBadge: "监视器信号"`           |
| `rqReplayAria`       | 重放监视器信号 / Replay monitor feed | 监视器重播按钮名称；不修改素材或播放策略            | 条件生效   | `rqReplayAria: "重放监视器信号"`  |
| `backToTop`          | 返回顶部 / Back to top               | 返回顶部按钮名称；按钮显示受滚动状态影响            | 条件生效   | `backToTop: "返回顶部"`           |
| `toastP10`           | 语境解析 10% / context parsed 10%    | 阅读进度早期提示，不是 AI 请求进度                  | 条件生效   | `toastP10: "语境解析 10%"`        |
| `toastP30`           | 语境解析 30% / context parsed 30%    | 阅读进度提示，不是语义解析结果                      | 条件生效   | `toastP30: "语境解析 30%"`        |
| `toastP60`           | 推理稳定 60% / inference stable 60%  | 阅读进度提示，不是模型推理状态                      | 条件生效   | `toastP60: "推理稳定 60%"`        |
| `toastDone`          | 输出完成 / output finalized          | 阅读完成阶段提示，不证明生成或校验完成              | 条件生效   | `toastDone: "输出完成"`           |
| `metaPublished`      | 发布 / published                     | 发布时间前的标签，不修改日期                        | 条件生效   | `metaPublished: "发布"`           |
| `metaAuthor`         | 作者 / by                            | 作者前的标签，不改变作者值                          | 条件生效   | `metaAuthor: "作者"`              |
| `metaUpdated`        | 更新 / updated                       | 更新日期前的标签，只有提供 updatedDate 才显示       | 条件生效   | `metaUpdated: "更新"`             |
| `systemStatusAria`   | 模型状态 / Model status              | 标题状态区可访问名称，需要至少一个状态字段          | 条件生效   | `systemStatusAria: "模型状态"`    |
| `systemModelLabel`   | 模型 / model                         | 模型标签，aiModel 存在时使用，也用于 OUTPUT         | 条件生效   | `systemModelLabel: "模型"`        |
| `systemModeLabel`    | 模式 / mode                          | 模式标签，需要 aiMode                               | 条件生效   | `systemModeLabel: "模式"`         |
| `systemStateLabel`   | 状态 / state                         | 状态标签，需要 aiState                              | 条件生效   | `systemStateLabel: "状态"`        |
| `promptContextLabel` | 语境 / Context                       | 上下文前的标签，需要有非空上下文                    | 条件生效   | `promptContextLabel: "语境"`      |
| `heroMonitor`        | 神经监视器 / neural monitor          | 封面监视器文字，需要 heroImage                      | 条件生效   | `heroMonitor: "神经监视器"`       |
| `heroSignalSync`     | 信号同步中 / signal sync active      | 封面信号标记，静态装饰文字，不查询同步状态          | 条件生效   | `heroSignalSync: "信号同步中"`    |
| `heroModelOnline`    | 模型在线 / model online              | 封面模型标记，静态装饰文字，不查询服务              | 条件生效   | `heroModelOnline: "模型在线"`     |
| `toc`                | 文章目录 / On this page              | 目录名称，需要目录启用且有可用标题                  | 条件生效   | `toc: "文章目录"`                 |
| `responseOutput`     | 输出 / Output                        | 正文 OUTPUT 栏名称，不控制正文内容                  | 条件生效   | `responseOutput: "输出"`          |
| `statsWords`         | 词 / words                           | 字词数标签，不修改统计值                            | 条件生效   | `statsWords: "词"`                |
| `statsTokens`        | 令牌 / tokens                        | tokens 标签，不修改估算                             | 条件生效   | `statsTokens: "令牌"`             |
| `copySectionLink`    | 复制本节链接 / Copy section link     | 正文 h2／h3 章节链接复制名称，不改变锚点算法        | 条件生效   | `copySectionLink: "复制本节链接"` |
| `regenerate`         | 重播扫描 / Replay scan               | 重播扫描按钮文字，仅触发视觉效果                    | 条件生效   | `regenerate: "重播扫描"`          |
| `relatedAria`        | 相关文章 / Related posts             | 相关文章区域的可访问名称，需要有其他文章            | 条件生效   | `relatedAria: "相关文章"`         |
| `related`            | 相关文章 / Related                   | 相关文章区标题，不控制推荐算法                      | 条件生效   | `related: "相关文章"`             |
| `backToBlogAria`     | 返回博客 / Back to blog              | 返回博客导航的可访问名称                            | 条件生效   | `backToBlogAria: "返回博客"`      |
| `backToBlog`         | 返回博客 / Back to blog              | 返回博客链接的可见文字，不改变链接目标              | 条件生效   | `backToBlog: "返回博客"`          |
| `comments`           | 评论 / Comments                      | 评论区域可访问名称，需要文章评论配置有效            | 条件生效   | `comments: "评论"`                |
| `metaReadMinutes`    | 分钟阅读 / min read                  | 当前未使用；改此文案不会恢复阅读时长                | 当前未使用 | `metaReadMinutes: "分钟阅读"`     |
| `latencyLabel`       | 延迟估计 / latency est               | 当前未使用；改此文案不会恢复延迟                    | 当前未使用 | `latencyLabel: "延迟估计"`        |
| `confidenceLabel`    | 置信度 / confidence                  | 当前未使用；改此文案不会恢复置信度                  | 当前未使用 | `confidenceLabel: "置信度"`       |

这些状态、封面标记和滚动提示主要表达界面氛围，不能当作真实 AI 模型在线、网络同步或准确率检测结果。regenerate 对应的按钮只重播扫描视觉效果，不改写文章、不请求 AI 服务。

例如修改 OUTPUT 和复制章节链接的文案：

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        blog: {
          responseOutput: '正文',
          statsWords: '字词',
          statsTokens: '估算 tokens',
          copySectionLink: '复制这一节的网址',
          regenerate: '重播扫描效果',
        },
      },
    },
  },
},
```

返回博客链接的实际目的地仍是当前语言的博客列表；修改文字不会改链接。相关文章当前取同语言中排除本篇后的最新最多三篇，不是 AI 相似度推荐，也没有数量或相似度配置字段。字段 related／relatedAria 只改变文字及可访问名称。

<a id="interaction-messages"></a>

### 代码复制与图片预览的文字

前缀改为 `i18n.locales.<语言>.messages`，以下每项也都是可选 string 覆盖和条件生效；不会改变复制权限、图片来源或添加功能开关。

| 路径末段             | 中文默认 / 英文默认                                                 | 作用与限制                                   | 成员示例                                             |
| -------------------- | ------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| `codeCopy.copy`      | 复制代码 / Copy code                                                | 代码块复制按钮文字，不修改被复制内容         | `codeCopy: { copy: "复制代码" }`                     |
| `codeCopy.copied`    | 已复制 / Copied                                                     | 代码及章节链接复制成功提示                   | `codeCopy: { copied: "已复制" }`                     |
| `codeCopy.failed`    | 复制失败，请手动选择代码。 / Copy failed. Select the code manually. | 代码及章节链接复制失败提示，不授予剪贴板权限 | `codeCopy: { failed: "复制失败，请手动选择代码。" }` |
| `imagePreview.open`  | 查看大图 / View image                                               | 图片预览入口和弹窗的可访问名称               | `imagePreview: { open: "查看大图" }`                 |
| `imagePreview.close` | 关闭图片预览 / Close image preview                                  | 关闭图片预览按钮名称，不修改图片源           | `imagePreview: { close: "关闭图片预览" }`            |

```ts
i18n: {
  locales: {
    zh: {
      messages: {
        codeCopy: { copy: '复制内容', copied: '复制好了', failed: '无法复制，请手动选择。' },
        imagePreview: { open: '放大这张图片', close: '收起图片' },
      },
    },
  },
},
```

复制章节链接只给正文中有 id 的 h2／h3 添加按钮，成功／失败复用 codeCopy.copied／failed。代码复制和图片预览需要 JavaScript；普通正文图片预览不包括封面或链接／按钮里的图片，放大复用浏览器选中的源，不另外请求高清原图。它们没有 site.config 的 enabled 字段。

## 5. 当前配置边界与验证

文章页会实时响应系统的“减弱动画”偏好，无需刷新。开启后，封面与背景网络使用静态呈现，Red Queen 停止并隐藏；关闭后按原有启动节奏恢复。切换不会重置阅读进度或重绑代码复制、章节链接和图片预览，也没有新增 site.config 开关。

正文和正文面板直接出现并保持静止；背景网络、标题光带和封面效果独立存在。当前没有全站 AI 主题切换、正文入场时长、面板呼吸、相关文章数量、图片预览 enabled 或代码复制 enabled 等公开配置。不要靠添加任意同名键期待生效。

locale、articleSlug、headings、filePath、related、localeHrefs 和 seoLocaleHrefs 是 BlogPost 组件调用属性，不是 site.config 或文章 frontmatter；标准路由会提供对应数据。新建普通文章不需要手工填写这些属性。

先在 dev 查看有标题／无标题、有封面／无封面等实际内容下的结果；代码复制、章节链接和图片预览自行检查交互。搜索在构建后的 preview 验证。发布前停止 dev，运行 npm run doctor 再 npm run preview，成功后无需紧接着重复 check 或 build；重新部署后线上才更新。

安装和升级见[第一篇教程](/zh/blog/starter-guide-1-configure-your-site/)，文章写法见[写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/)，发布见[部署教程](/zh/blog/starter-guide-deployment/)。
