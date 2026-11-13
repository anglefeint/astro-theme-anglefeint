---
tags: ['anglefeint', 'starter']
title: '使用指南 4：发布一条碎片'
subtitle: '用 Markdown 记录简短想法，添加图片或代码，再分享稳定链接；需要时开启评论。'
description: '从开启 Fragments、创建和编辑 Markdown，到首页预览、分页分享、多语言与可选 Giscus 评论。'
pubDate: '2026-11-11'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

本篇是入门教程的第 4 / 8 篇。[查看完整教程顺序](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order) · [按字段查配置字典](/zh/blog/config-reference/)。

想记录一句想法、一张图片或一段代码，不必为它写一篇完整文章。Fragments 将这些内容按时间放在独立列表里，也会在首页提供最近内容的预览入口。

本篇面向当前集成版 starter。如果已有项目缺少相关命令或功能，先按[安装博客，换成自己的信息](/zh/blog/starter-guide-1-configure-your-site/)中的升级说明处理，再继续操作。

## 1. 开启碎片列表

打开 `src/site.config.ts`，把下面的 `fragments` 合并到现有 `theme` 对象中。已有 `theme` 时直接添加或修改其字段，不要重复创建同名对象：

```ts
theme: {
  fragments: {
    enabled: true,
    pageSize: 20,
    comments: { enabled: false },
  },
},
```

| 字段                               | 默认值与实际作用                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `theme.fragments.enabled`          | 默认 `false`；开启后为已启用语言生成碎片列表，并允许有内容的首页显示预览入口 |
| `theme.fragments.pageSize`         | 默认 `20`；每页碎片数量，必须是 1–100 的整数，与博客每页文章数独立           |
| `theme.fragments.comments.enabled` | 默认 `false`；开启碎片的评论弹窗，还需要填写后文的 Giscus 仓库配置           |

本地运行 `npm run dev`，打开终端地址下的 `/<语言代码>/fragments/`，例如 `/en/fragments/` 或 `/zh/fragments/`。前提是对应语言已在项目中启用；没有内容时显示空列表，不需要先建立页面文件。碎片关闭时不生成该列表，首页也不会显示碎片入口，但不会删除你的 Markdown 文件。

## 2. 按默认流程创建碎片

在项目根目录运行：

```bash
npm run new-fragment
```

未指定 `--locales` 或 `ANGLEFEINT_LOCALES` 时，命令为项目全部已启用语言生成同一条碎片的骨架；初始配置会生成九份。文件位于 `src/content/fragments/<语言代码>/`，同次调用共用 ID 和发布时间，但不会自动翻译。终端会打印实际路径，文件名类似 `2026-11-13-q8Lm3XzP.md`，包含 UTC 日期和随机 ID；打开自己刚生成的文件，不必手工创建这个示例文件名。

只想创建中文时，可改用 `npm run new-fragment -- --locales zh`；指定多种语言可用 `--locales en,zh`。这些是替代用法，按需要选择一个，不必全部执行，也不会自动启用相应语言。发布前将未完成的其他语言骨架移出碎片内容目录。

**每执行一次命令都会创建一条新碎片。** 修改现有内容时直接编辑原文件，不要为了继续写同一条内容再运行创建命令。命令不要求给碎片起 slug，也不会覆盖已有文件。

当前 starter 自带 `new-fragment` 脚本。如果旧项目没有这个脚本，先确认主题已升级，再使用项目中的 CLI：

```bash
npx @anglefeint/astro-theme new-fragment
```

这是上一条创建命令的替代写法，不要把两条都执行来创建“同一条”碎片。

## 3. 替换占位正文，保留 ID

生成文件的顶部是 frontmatter，正文从第二条 `---` 后开始。保留生成的 `id` 和 `pubDate`，把正文里的占位内容换成自己的想法。下面仅展示格式，不要用示例 ID 覆盖自己的 ID：

```md
---
id: 'q8Lm3XzP'
pubDate: '2026-11-13T09:00:00+08:00'
---

今天把一个困扰很久的问题解决了，记下这个小进展。
```

碎片当前支持三个 frontmatter 字段：

| 字段      | 怎么填写                                                                           |
| --------- | ---------------------------------------------------------------------------------- |
| `id`      | 必填，恰好 8 位英文字母和数字，区分大小写。创建命令会生成并检查已有 ID，无需自己编 |
| `pubDate` | 必填，可解析的发布日期；建议保留命令生成的 ISO 时间，或填写带时间和时区的值        |
| `title`   | 可选字符串，填写后作为列表卡片标题显示；不填也可以正常发布                         |

添加标题时，在同一个 frontmatter 中补 `title: '一个小进展'` 即可。碎片不要求文章使用的 `description`，也没有文章封面 `heroImage` 字段；配图写在正文中。

列表按 `pubDate` 从新到旧排序，同一时间再按 ID 排序，不按文件名排列。页面显示 UTC 时间，与你填写的本地时区时间可能不同。只改正文或文件名不会改变评论和分享身份；修改日期会改变排序及所在分页。

**发布后请保留 ID。** 同一语言出现重复 ID 会报错，不同碎片不要复用 ID。旧 UUID 或长 ID 不符合当前格式；保留原内容备份后再处理兼容，主题不提供旧 ID、分享链接或评论的自动迁移。不要把批量改 ID 当成普通文件整理。

当前只收集 `src/content/fragments/` 下的 `.md`，不支持用 `.mdx` 创建碎片。没有草稿或未来日期过滤：`draft: true` 和未来时间都不能隐藏内容，未准备公开的碎片放在该目录之外。

## 4. 添加图片、代码和公式

普通 Markdown 段落、链接、列表和引用都可以使用。图片例如：

```md
![这次进展的截图](/images/fragments/progress.png)
```

先把实际图片放到 `public/images/fragments/progress.png`；也可以在碎片旁放 `photo.png`，用 `![图片说明](./photo.png)` 引用。更多写法、文件尺寸和 Git 提交要求见[给文章和碎片添加图片](/zh/blog/starter-guide-images/)。

代码保留 Markdown 围栏和缩进：

````md
```js
const progress = {
  done: true,
};
```
````

代码块是内容展示，不会因为写了 JavaScript 就执行其中代码。不要假定文章页的代码复制按钮或点击图片放大也应用于碎片；当前碎片列表没有接入那两套文章交互。

全站数学开启时，碎片同样支持 `$x_1$` 行内公式和两行 `$$` 之间的独立公式。它们在构建时渲染，错误公式会导致编译或构建失败；关闭 `theme.math.enabled` 会关闭数学处理。公式写法可参见[写第一篇文章](/zh/blog/starter-guide-2-languages-and-routing/)。

本地 dev 或 doctor 会准备受支持的碎片图片响应式文件。提交碎片 Markdown、原图及整个 `src/assets/blog/covers/`；部署构建和 CI doctor 只校验，不会在平台上补生成。不要只提交正文、漏掉图片文件。

## 5. 首页预览和列表分页

开启碎片且当前语言存在内容时，首页 header 下方会显示像素头像入口，打开后预览最新的最多三条。不需要另开一个首页配置，也不受 `homeLatestCount` 的文章数量设置控制。

预览可以包含文字、第一张可用图片和第一段代码的摘要，不是完整正文。图片与代码限高，超出部分裁切；多张图片或多个代码块不会全部展示。点击整张卡片进入对应碎片；底部的“预览条数 / 当前语言总条数 →”进入完整列表。例如有两条时显示 `2 / 2`，不是固定显示三条。空列表不显示首页入口。

完整列表按 `theme.fragments.pageSize` 分页。首页为 `/zh/fragments/`，第二页为 `/zh/fragments/2/`。分页外观和跳页行为共用 `theme.pagination`，但博客的 `blogPageSize` 不决定碎片每页数量。

切换列表语言时进入目标语言第一页，不保证停在同一条译文或同一页码。翻译数量可以不同，各语言总条数独立计算。

## 6. 分享一条碎片

碎片在列表中展示，没有为每一条生成独立的详情页。对外分享使用卡片的日期链接，或旁边的复制链接按钮，例如：

```text
https://your-domain.example/zh/fragments/#q8Lm3XzP
```

将域名和 ID 替换成真实值。日期链接和复制按钮使用列表根路径加 ID，不依赖这条内容当时位于第几页。新增内容、修改日期或 pageSize 后重新构建和部署，定位索引也会更新。

目标碎片不在当前页时，页面用 JavaScript 按需读取当前语言的静态索引，跳到其所在分页再定位。没有 JavaScript 时仍可浏览分页，但跨页自动定位和复制按钮不可用。复制受剪贴板权限限制时，会提供可选择的链接供手动复制。

不要把带 `/2/` 的地址栏链接当成长期分享地址。仍存在的旧分页可以纠正过时锚点，但如果某个旧页码已经不存在，会进入原有 404；定位脚本不接管 404。内容已删除、ID 不存在或索引加载失败时会提示，不会自动恢复已删除的碎片。

所有碎片分享链接共用该语言碎片列表的页面分享图，不会按每条 ID 单独生成。修改默认图可查看[图片教程的分享图说明](/zh/blog/starter-guide-images/)。

## 7. 给同一条碎片补译文

如果只准备为中文和英文创建骨架，可以用下面的命令代替前面的默认命令：

```bash
npm run new-fragment -- --locales zh,en
```

同一次命令生成的各语言文件共享 ID 和时间戳，正文需要自己翻译。`--locales` 只选择创建哪些文件，不会启用语言。语言优先级是 `--locales` → `ANGLEFEINT_LOCALES` 环境变量 → 项目已启用语言；省略参数时没有自动翻译能力。

后续为已有中文碎片补英文版，应把原文件复制到 `src/content/fragments/en/`，保留 `id` 和 `pubDate`，再翻译标题与正文。不要重新运行创建命令来补“同一条”的译文，那会分配另一个 ID。同一条的翻译可以跨语言共用 ID，但同一语言不能放两份同 ID 文件。

相同 ID 的译文会共用碎片评论；不同 ID 不会因为文字或文件名相同就自动关联。

## 8. 按需开启评论

只想记录内容可以保持评论关闭。需要读者留言时，先按[Giscus 评论教程](/zh/blog/starter-guide-4-giscus-comments/)准备公开仓库、Discussions、Giscus 应用和讨论分类，取得真实 ID，再合并到现有配置：

```ts
theme: {
  fragments: {
    enabled: true,
    comments: { enabled: true },
  },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
  },
},
```

替换账号、仓库、分类以及两个 ID 占位值；已有 `theme.comments` 时保留其他设置。四个仓库／分类字段缺失会报配置错误，填了占位值也不代表远程配置有效。无需粘贴 Giscus script，也无需安装额外的 Giscus npm 包。

碎片评论开关是 `theme.fragments.comments.enabled`。不需要为了它把文章评论的 `theme.comments.enabled` 设为 true；已经开启文章评论时，也可以继续保留自己的设置。

碎片评论固定使用 `specific`、严格匹配及 `fragment/<id>`。它不使用文章的 mapping、term、number、shareAcrossLocales 或固定 lang；评论界面跟随当前页面语言，相同 ID 的译文共用讨论和表情，评论正文不自动翻译。其他共享外观设置仍来自 `theme.comments`。

点击列表卡片的评论按钮后才加载客户端；关闭弹窗保留实例，再打开或切换碎片时复用。客户端失败或约 15 秒仍未就绪时会显示重试，不能把网络加载提示当成评论已经成功连接。访客发表评论需要 GitHub 授权。

修改 ID 不会搬迁旧评论，删除碎片也不会替你删除 GitHub 上的讨论。需要迁移讨论时自行评估处理，不要期待主题自动合并。

## 9. 发布前确认

在 dev 页面检查内容、时间、首页预览和分页。发布前停止 dev，再运行：

```bash
npm run doctor
npm run preview
```

doctor 包含本地图片准备、检查和构建，成功后不必立即重复运行 build。用构建后的 preview 检查分享定位和图片，配置了评论时再检查对应弹窗。预览不会发布网站；需要将更新的静态产物重新部署，线上内容才会改变。

碎片不加入文章全文搜索或文章 RSS。构建时会生成本语言的 `/zh/fragments/index.md`（其他语言替换 `zh`），合并该语言的公开碎片并保留 ID、时间、正文和稳定链接；也会加入 AI 可读索引。它是公开输出，不是私密备份，评论不包含在其中。

- 找不到列表：检查 fragments 开关和目标语言是否启用。
- 首页没有头像：检查当前语言是否确有碎片，其他语言有内容不代表当前语言也有。
- 创建命令因旧文件失败：检查已有碎片 frontmatter 的 ID 格式；创建器会读取已有 Markdown ID 查重。
- 构建报告重复 ID：检查同一语言是否复制了两份；补译文件应放到另一个语言目录。
- 图片构建失败：按[图片教程](/zh/blog/starter-guide-images/)准备并提交原图、清单与派生文件。
- 评论失败：检查真实仓库 ID、应用授权、分类、网络与浏览器拦截，不要反复改碎片 ID。

需要升级时查看[第一篇的升级说明](/zh/blog/starter-guide-1-configure-your-site/)。

## 教程导航与配置查阅

[上一篇：给文章和碎片添加图片](/zh/blog/starter-guide-images/) · [下一篇：把页面和功能调整成自己喜欢的样子](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/) · [八篇教程总入口](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相关字段：[碎片开关、分页和内容字段](/zh/blog/config-fragments/)、[碎片评论](/zh/blog/config-comments/)。完整路径、默认值和限制见[配置字典总入口](/zh/blog/config-reference/)。
