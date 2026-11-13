---
tags: ['anglefeint', 'config']
title: '配置字典：Giscus 评论和多语言讨论共享'
subtitle: '文章与碎片的独立开关、讨论映射、语言和共享规则。'
description: '按实际代码查阅全部 Giscus 公共配置，说明默认值、类型、校验条件、文章译文共享和碎片评论覆盖规则。'
pubDate: '2026-11-13'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

初次配置先读[让读者留下评论](/zh/blog/starter-guide-4-giscus-comments/)，其中包含仓库准备和参数获取。配置文件位置见[安装与站点信息](/zh/blog/starter-guide-1-configure-your-site/)，其他模块从[配置字典总入口](/zh/blog/config-reference/)进入。

公共配置写在 src/site.config.ts 的 theme.comments 中；评论默认关闭。下面列主题包默认值，不以 demo 已连接的个人仓库为准。ID 和仓库参数会写入页面，是公开连接信息，不要把 GitHub 访问令牌或其他秘密填进去。

<a id="controls"></a>

## 先分清两个评论开关

| 路径                             | 类型 / 默认值   | 状态、作用与限制                                                                                                   | 示例                                                                 |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| theme.comments.enabled           | boolean / false | 条件生效：文章评论；不控制碎片按钮。文章连接参数缺失时可能不输出评论区，不代表远端服务已验证成功                   | theme: { comments: { enabled: true } }                               |
| theme.fragments.comments.enabled | boolean / false | 条件生效：碎片列表评论；还需 theme.fragments.enabled 为 true。独立于文章开关，必填连接字段缺失会在生成碎片页时报错 | theme: { fragments: { enabled: true, comments: { enabled: true } } } |

文章没有单篇 comments: false frontmatter 开关。碎片也没有每条单独的评论开关；首页碎片预览不显示评论按钮。碎片其他设置见[Fragments 字典](/zh/blog/config-fragments/#comments-enabled)。

## theme.comments 的全部字段

下表字段的完整前缀均为 theme.comments.，例如 repo 的完整路径是 theme.comments.repo。所有字段在输入的部分配置中均可省略，由主题默认值补齐。字符串标志必须保留引号，不能写成 true/false 或数字。

这些字段都是条件生效：文章评论需要启用并满足输出条件；碎片仅使用其中一部分，其余会覆盖或忽略。没有通用的“空字符串恢复默认”规则，具体见每行。除明确校验的映射约束外，类型正确和非空不等于 Giscus 远端配置正确。

<a id="connection"></a>

### 仓库与分类

| 字段         | 类型   | 默认值 | 作用、条件与限制                                                                                           | 示例值                            |
| ------------ | ------ | ------ | ---------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `repo`       | string | `""`   | GitHub 的 owner/repo。文章侧要求值为真才输出；碎片侧还检查 trim 后非空。不要加首尾空格；主题不检查远端权限 | `"your-account/blog-discussions"` |
| `repoId`     | string | `""`   | Giscus 配置工具提供的仓库 ID，不是仓库名、数字序号或访问令牌；文章与碎片共用                               | `"YOUR_REPOSITORY_ID"`            |
| `category`   | string | `""`   | 讨论分类名称；填写 Giscus 提供的分类并与 categoryId 配套；不是博客文章标签                                 | `"Announcements"`                 |
| `categoryId` | string | `""`   | Giscus 提供的分类 ID，不是分类名称。文章要求值为真；碎片要求 trim 后非空，不验证远端真实性                 | `"YOUR_CATEGORY_ID"`              |

<a id="mapping"></a>

### 文章映射与严格匹配

| 字段      | 类型                                                                   | 默认值       | 作用、条件与限制                                                                                                                      | 示例值                  |
| --------- | ---------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `mapping` | 'pathname' \| 'url' \| 'title' \| 'og:title' \| 'specific' \| 'number' | `"pathname"` | 文章与讨论的关联方式，逐值含义见下文。共享模式必须 specific；碎片不使用这个字段                                                       | `"pathname"`            |
| `term`    | string                                                                 | `""`         | 非共享文章在 specific 模式使用，去除首尾空白后必须非空；这是全站固定 term。共享模式必须留空，渲染时按文章 slug 填入；其他模式不传此项 | `"my-fixed-discussion"` |
| `number`  | string                                                                 | `""`         | 非共享文章在 number 模式使用，trim 后必须为安全范围内的正整数字符串，不允许前导零、正号或小数；共享模式必须留空。其他模式不传此项     | `"42"`                  |
| `strict`  | '0' \| '1'                                                             | `"0"`        | 文章严格匹配标志；是字符串而非 boolean。共享模式要求 1；碎片固定覆盖为 1。并非将两个相同标题的讨论自动合并                            | `"1"`                   |

<a id="appearance"></a>

### 显示、语言和加载

| 字段               | 类型                             | 默认值        | 作用、条件与限制                                                                                                                     | 示例值        |
| ------------------ | -------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `reactionsEnabled` | '0' \| '1'                       | `"1"`         | 显示讨论主帖的反应区域；文章与碎片共用，不等于禁用所有评论操作                                                                       | `"1"`         |
| `emitMetadata`     | '0' \| '1'                       | `"0"`         | 让 Giscus 向父窗口发送讨论元数据；文章按设置传递，不会因此自动显示评论统计。碎片固定为 1，供加载及讨论切换状态判断                   | `"0"`         |
| `inputPosition`    | 'top' \| 'bottom'                | `"bottom"`    | 评论输入框在评论列表上方或下方；文章与碎片共用，不改变整个评论区在页面的位置                                                         | `"top"`       |
| `theme`            | string                           | `"dark"`      | 传给 Giscus 的 iframe 主题，不是博客 Matrix/Cyber/Hacker/AI 场景。文章与碎片共用；主题不校验服务支持的名称，也不会自动随页面场景切换 | `"dark"`      |
| `lang`             | string                           | `"en"`        | 文章评论界面语言。非空值直接传给 Giscus；空字符串按页面语言映射。碎片始终跟随页面，忽略此项。不翻译评论正文                          | `""`          |
| `loading`          | 'lazy' \| 'eager'                | `"lazy"`      | 文章 iframe 加载提示；不是延迟输出整个 client.js。碎片固定 eager，但点击评论按钮后才插入客户端                                       | `"lazy"`      |
| `crossorigin`      | 'anonymous' \| 'use-credentials' | `"anonymous"` | 传给 Giscus 客户端 script 的 crossorigin 属性，文章与碎片共用；不是仓库登录凭据、GitHub token 或解决权限问题的开关                   | `"anonymous"` |

<a id="sharing"></a>

## theme.comments.shareAcrossLocales：文章译文共享

- **类型 / 默认值：** boolean，可省略 / false。
- **状态与作用：** 条件生效；文章评论开启后，让相同完整 slug 的不同语言版本绑定同一个讨论。不同 slug 保持分开。
- **限制：** 要求 mapping 为 'specific'，term 和 number 在 trim 后均为空，strict 为字符串 '1'；不满足会报配置错误，不能只打开布尔开关。关闭文章评论时跳过这组启用约束，但碎片仍有自己的连接检查。
- **示例：** 下方共享配置片段。它不会翻译评论、合并旧讨论或改变碎片绑定方式。

| 文章文件                             | 共享模式实际 term |
| ------------------------------------ | ----------------- |
| src/content/blog/zh/my-first-post.md | my-first-post     |
| src/content/blog/en/my-first-post.md | my-first-post     |
| src/content/blog/zh/guides/setup.md  | guides/setup      |
| src/content/blog/en/other/setup.md   | other/setup       |

按完整、不含语言目录的 slug 关联，不根据文章标题、canonicalTopic 或正文自动识别译文。共享模式下标准文章路由会传入 articleSlug；自定义调用 BlogPost 也必须提供非空、无首尾空白、无空路径段及 . / .. 段的完整 slug。这个组件参数不是 site.config 字段。

同一个仓库与分类中，同 slug 的多个网站也可能命中相同讨论。它不是按域名额外隔离的数据库。保留路径的前提下，改变标题不改变共享 term；改 slug、仓库、分类或匹配策略可能关联到另一条讨论。

<a id="mapping-values"></a>

## mapping 各值的含义

| 值       | Giscus 使用的依据    | 限制及例子                                                             |
| -------- | -------------------- | ---------------------------------------------------------------------- |
| pathname | 页面的 URL 路径      | 默认值；不同语言路径通常不同，改路径可能改变关联                       |
| url      | 完整页面 URL         | 换域名或地址可能影响关联                                               |
| title    | 文档 title           | 更改文章或站点标题可能影响关联，不是只看正文 h1                        |
| og:title | 页面 Open Graph 标题 | 取页面已有元信息，不通过 theme.comments 填标题                         |
| specific | 指定 term            | 非共享时是全站固定词；共享时由每篇文章 slug 生成                       |
| number   | 已有 Discussion 编号 | 全站指向固定编号，填字符串如 '42'；不是 issue 编号，也不会自动创建讨论 |

以上关联与创建行为交给 Giscus：未找到讨论时，可在首次评论或反应时创建，单纯打开页面不保证创建。仓库需公开、启用 Discussions 并安装 Giscus 应用；具体操作见教程与[Giscus 官方配置页](https://giscus.app/)。主题不在本地保存评论数据库。

strict 为 '1' 时，Giscus 使用讨论正文中的标题哈希做严格匹配，不是主题在本地比较两个标题。早期已有讨论可能需要补充匹配标记；参见[Giscus 严格匹配说明](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-strict)。启用共享或更改映射不会自动迁移、合并、删除旧讨论；旧评论可能仍在 GitHub，但不出现在新绑定下。迁移前先确定现有讨论与新 term 的对应关系。

非共享时，specific + 一个固定 term 会让所有使用该配置的文章寻找同一讨论；number 也会全站指向同一编号。它们不是“每篇文章自动分配一个 ID”。与当前映射无关的 term/number 不发送给 Giscus；主题仍会对这两个配置值执行 trim，因此不要用 null 或数字替代字符串。

<a id="examples"></a>

## 可合并的配置示例

合并进 src/site.config.ts 现有 defineThemeConfig({...})，保留 import、export 和其他个人配置，不重复创建 theme。四个连接值必须从你自己的 Giscus 配置获取；下方占位值只能说明结构，不能用于线上验证。

### 文章评论按路径分开

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
    shareAcrossLocales: false,
    mapping: 'pathname',
    lang: '',
  },
},
```

### 同一篇文章的译文共用讨论

保留自己的连接参数，并将映射部分合并为：

```ts
theme: {
  comments: {
    enabled: true,
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

默认 lang 实际为 'en'，不是“跟随页面”；上面明确用空字符串启用页面语言映射。zh 转为 zh-CN、zh-hant 转为 zh-TW、pt-br 转为 pt，其他代码直接传入。语言是否被 Giscus 支持由服务决定；更改语言只改界面，不改变讨论身份或翻译已发评论。theme.comments 是全站配置，不在 i18n.locales 内分别复制。

theme 字符串直接传给 Giscus，常用例值是 'dark' 或 'light'；可用主题以及自定义 CSS 网址由 Giscus 负责，不会改变外层 AI 面板。需要自定义时查[官方主题说明](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#data-theme)，主题包不会验证自定义 CSS 的内容和可访问性。

<a id="fragment-overrides"></a>

## 碎片评论使用公共配置的哪些部分？

| 公共字段                                               | 碎片实际行为                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| repo / repoId / category / categoryId                  | 共用；四项 trim 后必须非空。原值继续传递，配置时不要加首尾空白；不验证远端权限 |
| theme / reactionsEnabled / inputPosition / crossorigin | 共用原设置                                                                     |
| enabled                                                | 忽略文章开关，使用 theme.fragments.comments.enabled                            |
| shareAcrossLocales                                     | 不使用；同一稳定 ID 本身就绑定同一讨论                                         |
| mapping / term / number                                | 固定 specific，term 为 `fragment/<ID>`，不发送 number                          |
| strict / emitMetadata                                  | 固定 '1' / '1'                                                                 |
| lang                                                   | 不使用公共 lang，始终按当前碎片页面语言映射                                    |
| loading                                                | 固定 eager，但首次点击评论按钮后才插入客户端                                   |

例如只开启碎片评论、关闭文章评论：

```ts
theme: {
  comments: {
    enabled: false,
    repo: 'your-account/blog-discussions',
    repoId: 'YOUR_REPOSITORY_ID',
    category: 'Announcements',
    categoryId: 'YOUR_CATEGORY_ID',
  },
  fragments: { enabled: true, comments: { enabled: true } },
},
```

同 ID 的多语言碎片共享 `fragment/<ID>`，与文章 slug 共享是两套规则。不要为改变排序或分页修改稳定 ID。弹窗首次点击才加载；关闭后保留 iframe，切换内容通过 Giscus 配置消息更新讨论，约 15 秒没有有效加载结果会显示失败与重试。没有公开的评论超时或预加载配置。即使只想配置碎片，如果同时启用文章评论，文章映射校验仍会执行。

<a id="messages"></a>

## 页面自身的评论文案

这些是 `i18n.locales.<语言>.messages` 下的 string 字段，均可省略，默认使用当前语言内置文案与回退链。示例值写到对应对象；只改变外层标签，不替换 Giscus iframe 内部按钮。表中仅列中文 / 英文默认值。

| 相对字段             | 中文 / 英文默认值                                                                                                         | 状态、作用与限制                                           | 示例值               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------- |
| `blog.comments`      | 评论 / Comments                                                                                                           | 条件生效：文章评论区域的无障碍名称，不是可见的额外标题     | `"文章讨论"`         |
| `fragments.comments` | 评论 / Comments                                                                                                           | 条件生效：碎片评论按钮与弹窗标题                           | `"参与讨论"`         |
| `fragments.close`    | 关闭 / Close                                                                                                              | 条件生效：弹窗关闭按钮；也用于首页碎片窗口关闭的无障碍名称 | `"关闭窗口"`         |
| `fragments.loading`  | 正在加载评论… / Loading comments…                                                                                         | 条件生效：碎片评论加载状态                                 | `"正在加载讨论…"`    |
| `fragments.error`    | 评论未能加载，请检查网络或评论配置后重试。 / Unable to load comments. Check your network or comment settings, then retry. | 条件生效：碎片评论失败提示                                 | `"讨论暂时不可用。"` |
| `fragments.retry`    | 重试 / Retry                                                                                                              | 条件生效：碎片评论失败后的重试按钮                         | `"重新加载"`         |

文章和碎片其他文案分别见[文章字典](/zh/blog/config-article/#article-messages)和[Fragments 字典](/zh/blog/config-fragments/#fragment-messages)。这些字段不决定 iframe 内部语言，后者使用前文的 lang 规则。

<a id="limits"></a>

## 加载与校验边界

文章输出异步 client.js；loading: 'lazy' 传给 Giscus iframe，并不表示主题等滚动到评论区才插入 script。碎片则先输出模板，点击后才插入客户端；它的 eager 指点击后的 iframe 行为。[官方加载说明](https://giscus.app/)区分了这两层。

本地代码检查文章映射约束和碎片必填项，不证明 GitHub 登录、应用授权、仓库可见性、分类、网络或服务端可用。文章连接字段为空时可能直接不渲染；只含空格的字符串仍可能通过文章输出条件，不能当成正确配置。碎片的非空检查更严格，但同样不能验证 ID 真伪。

目前所有 theme.comments 字段都有消费位置；不是所有字段都对碎片生效，覆盖关系已列出。不存在公开的单篇评论开关、自托管服务地址、评论排序、管理员 token 或本地数据库配置；客户端固定使用 https://giscus.app/client.js。Giscus 自身的仓库级配置不等于新增的 site.config 字段。

修改配置后重新构建部署；构建通过不等于真实评论服务验收通过。已有讨论的迁移和权限操作需在 GitHub/Giscus 侧处理，不会在保存 site.config 时自动完成。返回[配置总入口](/zh/blog/config-reference/)查其他模块。
