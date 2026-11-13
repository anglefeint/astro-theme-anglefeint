---
tags: ['anglefeint', 'starter']
title: '使用指南 6：让读者留下评论'
subtitle: '连接 Giscus，开启文章或碎片评论，并选择多语言版本是否共用讨论。'
description: '说明 Giscus 准备、主题配置、文章讨论映射、多语言共享、碎片评论差异，以及常见配置和加载问题。'
pubDate: '2026-11-10'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

本篇是入门教程的第 6 / 8 篇。[查看完整教程顺序](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order) · [按字段查配置字典](/zh/blog/config-reference/)。

Anglefeint 使用 Giscus 提供评论，默认关闭。文章和碎片可以分别开启，评论与反应保存在你配置的 GitHub Discussions 中，不需要给静态博客额外部署评论数据库。

先完成一次仓库配置，再决定是否共享译文讨论即可。不要为了添加评论修改文章模板，也不需要给每篇文章粘贴 script。

## 1. 准备 GitHub 仓库和分类

打开 [Giscus 中文配置页](https://giscus.app/zh-CN)，按页面检查并配置：

1. 使用自己的公开 GitHub 仓库作为评论存放位置，可以是博客仓库，也可以是单独的评论仓库。
2. 在仓库中启用 Discussions。
3. 为该仓库安装并授权 Giscus 应用。
4. 选择一个讨论分类，记下页面生成的仓库和分类信息。

配置页会生成一段 script。主题只需要其中的字段值：

| Giscus 生成属性    | 填入主题的位置                                         |
| ------------------ | ------------------------------------------------------ |
| `data-repo`        | `theme.comments.repo`，形如 `yourname/your-repository` |
| `data-repo-id`     | `theme.comments.repoId`，仓库 ID，不是仓库名称         |
| `data-category`    | `theme.comments.category`，实际分类名称                |
| `data-category-id` | `theme.comments.categoryId`，分类 ID，不是分类名称     |

不要将示例 ID、仓库网址或自己的用户名当作实际 ID。分类不一定叫 Announcements，应该使用你实际选择的名称和对应 ID。无需安装 Giscus npm 包，也不需要额外填写 GitHub token 或密码。

评论是外部服务：页面需要能连接 Giscus 和 GitHub。访客发表评论需要 GitHub 授权，也可以直接在对应的 GitHub Discussion 中参与；主题本身不提供匿名留言系统。具体外部服务行为以 [Giscus 官方说明](https://giscus.app/zh-CN)为准。

## 2. 先开启普通文章评论

在 `src/site.config.ts` 的现有 `defineThemeConfig({...})` 对象中合并：

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

替换账号、仓库、分类和两个 ID 占位值。已有 `theme` 或 `comments` 时直接修改其中的字段，保留其他设置，不要重复创建同名对象。

这个例子开启文章评论，按文章网址的路径关联讨论。`/zh/blog/my-first-post/` 与 `/en/blog/my-first-post/` 是不同路径，默认不会自动共用同一讨论。跨语言共享默认 `false`；如果之前已经开启过它，需要按后文说明恢复对应映射，不能只改这一段示例。

文章页只有启用评论且四个仓库／分类字段齐备时，才输出评论组件。缺少这些字段时可能没有评论区域；填写占位值通常只能通过本地非空检查，不能证明远程仓库已配置成功。当前没有单篇文章的 frontmatter 评论开关，不能靠 `comments: false` 只关闭某一篇。

示例中的 `lang: ''` 让评论界面跟随文章语言。主题默认其实是固定 `lang: 'en'`，所以希望跟随页面时要明确清空；其中 `zh` 映射为 `zh-CN`、`zh-hant` 为 `zh-TW`、`pt-br` 为 `pt`。它只改变界面文字，不翻译访客评论。

## 3. 确认评论真的连接成功

保存配置，在本地开发页面打开一篇文章，向下找到评论区域。可以检查它是否显示正确仓库的讨论，以及登录、评论和反应入口是否可用。首次看到空讨论不代表失败：Giscus 可以在首次评论或回应时创建对应讨论，打开页面不一定立刻生成一条记录。

发布前停止 dev，再运行：

```bash
npm run doctor
npm run preview
```

doctor 包含检查和构建，成功后无需紧接着重复运行 build。preview 只在本地展示构建产物，不会发布网站；正式站点需要重新部署。构建通过只说明本地配置和页面能生成，不能代替浏览器中对真实仓库权限及服务连接的确认。

文章默认使用 `loading: 'lazy'`。这是传给 Giscus iframe 的加载方式，不代表主题等到滚动时才输出客户端 script；文章页面会输出异步的 Giscus 脚本。与之不同，碎片弹窗在点击评论按钮后才加载客户端。

所有评论参数的类型、默认值和示例见[Giscus 字典](/zh/blog/config-comments/#connection)，已有评论时尤其要核对映射和共享约束。

## 4. 选择文章如何关联讨论

普通使用保留 `pathname` 即可。需要改变时，先了解映射依据，已有评论的网站不要随意切换：

| `mapping` 值 | 讨论关联依据与限制                                                           |
| ------------ | ---------------------------------------------------------------------------- |
| `'pathname'` | 页面 URL 的路径，不包含域名；更改文章路径可能关联到不同讨论                  |
| `'url'`      | 完整页面 URL；换域名也可能改变关联                                           |
| `'title'`    | 浏览器页面的 title；修改文章或站点标题可能影响关联                           |
| `'og:title'` | 页面的 Open Graph 标题                                                       |
| `'specific'` | 你填写的固定 `term`；非共享模式必须非空                                      |
| `'number'`   | 已有 discussion 编号，填在 `number`；不是 issue 编号，此模式不会自动创建讨论 |

这些映射交由 Giscus 查找讨论，主题不在本地建立评论数据库。严格匹配选项 `strict: '1'` 用于减少相似标题的模糊匹配，默认是 `'0'`。

非共享模式下，`term` 和 `number` 都是全站评论配置：把 `mapping` 改为 `specific` 并写一个固定 term，会让使用该配置的文章寻找同一讨论；`number` 也会指向固定编号。它们不是给每篇文章自动分配不同讨论的开关。

主题在文章评论启用时校验：`specific` 的 term 必须去除空白后非空；`number` 必须是正整数字符串，例如 `'42'`，不能用数字 `42`、`'0'` 或小数。无效参数会使配置检查失败，可能阻止 dev 或 build。

## 5. 让同一篇文章的译文共享评论

希望中文与英文译文共用讨论，但不同文章各自独立时，保留真实的仓库／分类字段，并将映射部分合并为：

```ts
theme: {
  comments: {
    // 保留 enabled: true 和自己的 repo、repoId、category、categoryId。
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

共享模式要求 specific、空 term、空 number 和字符串 `'1'` 的 strict。空 term 在这里是有意的：文章页会用完整、不含语言目录的 slug 填入它，而不是让所有文章使用一个固定词。

例如 `src/content/blog/zh/my-first-post.md` 与 `src/content/blog/en/my-first-post.md` 都使用 `my-first-post`；嵌套内容 `guides/setup` 与 `other/setup` 保留完整路径，仍是不同讨论。译文必须保持相同 slug，不靠标题或正文相似度识别。

开启共享且启用文章评论后，错误 mapping、非空 term／number 或不为 `'1'` 的 strict 会明确报错。普通包路由会提供文章 slug；自定义调用 BlogPost 的页面也必须提供有效 articleSlug。语言界面仍由 lang 决定，不会自动翻译评论正文。

验证时打开同一篇的两种译文，再打开另一篇文章：前两者应关联同一讨论，第三篇应独立。不要只看界面语言或评论框外观就判断共享成功。

### 已有评论怎么办？

主题不会合并、搬迁或删除旧讨论。开启共享后选中的讨论可能变化，因此原评论可能仍在 GitHub，却不出现在新的关联下。

切换前保存原来的仓库、分类、mapping、term、number 和 strict。需要恢复旧关联时，设置 `shareAcrossLocales: false`，并恢复这些字段的原值；仅关闭共享但保留空 term 的 specific 配置，会报错。确需整理讨论时，先在 GitHub 检查现有数据和关联，主题不提供自动迁移。

## 6. 碎片评论可以独立开启

如果只想让碎片接受评论，填写同一组仓库／分类信息，再设置：

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    enabled: false,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

这里的 `theme.comments.enabled: false` 只关闭文章评论，碎片使用 `theme.fragments.comments.enabled`。如果文章也需要评论，可以保留 true；不必为了碎片修改文章已有映射。

碎片固定使用 specific、严格匹配和 `fragment/<id>`，不使用文章的 mapping、term、number、shareAcrossLocales 或固定 lang。界面跟随当前页面语言，相同 ID 的译文共用讨论；反应、颜色主题和输入框位置等仍复用共享配置。缺少四个仓库／分类字段时，启用碎片评论会直接报配置错误。

首次点击列表卡片的评论按钮后才加载；关闭弹窗保留实例，再打开或切换碎片时复用。失败或约 15 秒仍未就绪会提供重试。弹窗加载提示不是连接成功的证明。完整发布、ID 和分享规则见[发布一条碎片](/zh/blog/starter-guide-5-fragments/)。

## 按需调整：显示和加载选项

下面这些字段都位于 `theme.comments`；通常保留默认即可。

| 字段               | 主题默认值    | 用途                                                                                            |
| ------------------ | ------------- | ----------------------------------------------------------------------------------------------- |
| `reactionsEnabled` | `'1'`         | 显示 discussion 主帖反应；`'0'` 关闭                                                            |
| `inputPosition`    | `'bottom'`    | 评论输入框位置，可选 `'top'`／`'bottom'`                                                        |
| `theme`            | `'dark'`      | 传给 Giscus 的配色标识，支持值按其配置页选择；不是切换博客主题                                  |
| `strict`           | `'0'`         | 文章的严格匹配；共享文章模式和碎片强制使用 `'1'`                                                |
| `emitMetadata`     | `'0'`         | 让 Giscus 向父页面发送讨论元数据；不是发布文章的元信息；碎片为判断就绪状态强制开启              |
| `lang`             | `'en'`        | 文章评论界面固定语言；`''` 跟随页面；碎片始终跟随页面                                           |
| `loading`          | `'lazy'`      | 文章 iframe 可用 `'lazy'`／`'eager'`；碎片弹窗打开后的 iframe 使用 eager                        |
| `crossorigin`      | `'anonymous'` | 客户端脚本的跨域属性，可选 `'anonymous'`／`'use-credentials'`；通常无需修改，不替代 GitHub 登录 |

`enabled`、`shareAcrossLocales` 是布尔值 true／false；`strict`、`reactionsEnabled`、`emitMetadata` 使用字符串 `'0'`／`'1'`。不要因为外观相似就混用类型。

## 评论不出现或关联不对时

| 现象                     | 检查顺序                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| 文章完全没有评论区域     | 文章开关是否 true、四个仓库／分类字段是否齐备；碎片开关不控制文章                                           |
| 碎片启用后直接报配置错误 | 是否填了全部仓库／分类字段，不要只打开开关                                                                  |
| 出现远程错误或持续加载   | 是否使用真实 ID、仓库公开、Discussions 开启、应用获得该仓库权限，分类是否匹配，以及网络或拦截器是否阻止请求 |
| 不同文章显示同一讨论     | 是否用了全局固定 term／number，是否缺少正确的共享模式设置；同时检查 Giscus 的实际匹配结果                   |
| 译文没有共享             | shareAcrossLocales 是否开启、slug 是否相同、共享映射约束是否满足                                            |
| 切换映射后“评论消失”     | 先到 GitHub 查看旧讨论是否仍在；不要反复改标题、ID 或删除讨论尝试恢复                                       |
| 评论界面一直是英文       | 文章 lang 默认 en，需要跟随页面时设为 `''`；这不会翻译访客留言                                              |
| 本地已修改，线上没变化   | 是否重新构建并部署，线上页面是否仍使用旧配置                                                                |

关闭文章评论用 `theme.comments.enabled: false`，关闭碎片评论用 `theme.fragments.comments.enabled: false`。它们只停止相应入口／嵌入，不会替你删除 GitHub Discussions 中的数据。升级器不负责迁移讨论；升级前保留现有映射，升级后核对关联，升级步骤见[安装教程](/zh/blog/starter-guide-1-configure-your-site/)。

## 教程导航与配置查阅

[上一篇：把页面和功能调整成自己喜欢的样子](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/) · [下一篇：让更多语言的读者使用博客](/zh/blog/starter-guide-languages/) · [八篇教程总入口](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相关字段：[Giscus 参数和共享讨论](/zh/blog/config-comments/)、[碎片评论开关](/zh/blog/config-fragments/)。完整路径、默认值和限制见[配置字典总入口](/zh/blog/config-reference/)。
