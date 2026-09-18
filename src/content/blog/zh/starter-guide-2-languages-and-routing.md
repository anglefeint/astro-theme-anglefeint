---
tags: ['anglefeint', 'starter']
title: '使用指南 2：写文章与管理内容'
subtitle: '创建文章，配置封面与标签，使用目录、代码复制、图片预览、搜索和分享图。'
description: '创建文章，配置封面与标签，使用目录、代码复制、图片预览、搜索和分享图。'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

## 日常写作只需要内容文件

本文默认你已完成第一篇的安装与站点设置。站点级功能在 `src/site.config.ts` 配置；单篇文章的标题、标签和开关写在 Markdown 文件顶部的 frontmatter（两条 `---` 之间）。两者不是同一个地方。

## 1. 创建文章和理解网址

在项目根目录运行：

```bash
npm run new-post -- my-first-post
```

默认按配置中启用的语言创建文件。只想创建简体中文版本，可以改用下面这一条，而不是两条都执行：

```bash
npm run new-post -- my-first-post --locales zh
```

结果是 `src/content/blog/zh/my-first-post.md`，网址为 `/zh/blog/my-first-post/`。slug 只用小写字母、数字和连字符，不要空格或下划线。同名文件已存在时跳过，不覆盖内容。

`--locales` 只决定创建哪些文件，不会启用对应语言；路由还取决于站点配置。多语言版本保持相同文件名，正文由你分别编写；详情页切换到缺少该文章的语言时，会前往该语言博客列表。

## 2. 填写文章头部和封面

一个可用的文章头部如下，将它放在文件最开头，正文写在第二条 `---` 后面：

```yaml
---
title: 'My first post'
description: 'What I learned while building my blog.'
pubDate: '2026-09-18'
tags: ['astro', 'notes']
---
```

必填项是 `title`、`description`、`pubDate`。可选 `subtitle`、`updatedDate`、`author`；没有写 `author` 时使用站点作者。列表按 `pubDate` 从新到旧排序。当前没有草稿或定时发布过滤：不要靠 `draft: true` 或未来日期隐藏文章，未完成内容先放在内容目录之外。

封面用 `heroImage: ./cover.jpg`，文件放在文章旁边；也可以保留新建命令分配的本地封面路径。命令只在 `src/assets/blog/default-covers/` 有图片时自动分配封面，不会下载图片。`heroImage` 可省略。阅读时长和字数等指标已有自动计算，普通文章不用手工填写。

这些是估算值，不是连接 AI 服务后测得的数据。frontmatter 中的 `readMinutes`、`wordCount`、`tokenCount`、`aiLatencyMs`、`aiConfidence` 会优先于自动计算；不填写就使用估算值。部分演示文章为了展示效果填有固定值。

## 3. 用标题自动生成目录

正常书写二级和三级标题：

```md
## First topic

Write your explanation here.

### A closer look

Add details here.
```

文章目录默认开启，从 `##` 和 `###` 生成链接；宽屏在正文右侧，窄屏位于正文开头，没有这些标题就不显示。点击本页目录即可验证。

单篇关闭时，在已有 frontmatter 中加：

```yaml
toc: false
```

`toc: true` 可以覆盖全站关闭设置，省略则继承 `theme.toc.enabled`。MDX 中正常的 Markdown 标题可用，但组件内部或原始 HTML/JSX 生成的标题不属于自动收集范围。

## 4. 用标签组织文章

在 frontmatter 写 `tags: ["astro", "notes"]` 即可，不用新建标签配置或手工添加路由。构建时生成当前语言的标签目录和分页列表；博客标签入口、正文标签都能点击。访问 `/zh/tags/` 验证。

标签区分大小写，`Astro` 与 `astro` 不同；首尾空格会去除，同篇重复标签只算一次。中文或特殊字符会编码成稳定网址，直接使用页面生成的链接，不要猜网址。重命名标签会改变链接。未写标签的文章仍正常显示；`theme.tags.enabled: false` 会关闭标签入口和标签页生成。

## 5. 图片预览和代码复制无需配置

正文图片可以引用文章旁边的本地文件，或 `public/images/` 下的文件；下面是两种写法，使用前放入对应图片：

```md
![A description of the image](./photo.jpg)

![A description of the image](/images/photo.jpg)
```

普通正文图片可点击或按 Enter/空格放大，Esc、关闭按钮或蒙版收起。封面、链接或按钮里的图片不参与预览。放大使用浏览器已选中的图片源，不会自动下载一张更高清的原图，也不是相册切换功能。

代码继续用普通 Markdown 围栏：

````md
```js
console.log('Hello, world!');
```
````

代码块右上角自动出现复制按钮，复制保留缩进和换行。在 HTTPS 或 localhost 上验证；剪贴板权限失败时页面会提示手动复制。两项功能都不需要增加开关。

## 6. 搜索在构建后验证

搜索默认开启，搜索当前语言的文章标题和正文。`npm run build` 自动生成索引；再用 `npm run preview`，点顶部搜索按钮搜索一句正文，验证能跳转到文章。`npm run dev` 只显示开发提示，不提供实时全文搜索。

单篇不进入索引时，在 frontmatter 加：

```yaml
search: false
```

这不是私密或草稿功能：文章仍可直接访问、出现在列表中。全站关闭使用 `theme.search.enabled: false`，同时关闭入口和索引生成。文章变动后重新构建。

## 7. 默认分享图与自定义图片

默认构建会为未设置 `ogImage` 的文章生成 1200×630 PNG，使用文章标题、文章作者（未填则用站点作者）和站点名称。无需图片 API，也不用每篇制作图片；它不改变正文封面 `heroImage`。

若要自己指定，把 `share.png` 放在文章旁边，在 frontmatter 加：

```yaml
ogImage: ./share.png
```

另一种写法是 `ogImage: /images/share.png`，对应 `public/images/share.png`；也支持 HTTPS 图片直链。本地文件缺失会报错，外部图片则取决于对方服务。

手动 `ogImage` 优先。`theme.socialImage.enabled: false` 只关闭自动生成，手动图片仍有效，其他文章回退到封面或默认图。构建后查看文章 HTML 的 `og:image`；自动图片位于 `dist/_social/`。重新部署后，分享平台仍可能缓存旧预览。内置字体不保证所有 emoji 或文字系统。

## 8. 需要独立页面时再用 new-page

例如创建作品介绍页：

```bash
npm run new-page -- projects --theme cyber
```

它生成 `src/pages/[lang]/projects.astro`，为启用的语言生成 `/语言代码/projects/`。编辑这个 Astro 文件填入内容；不会自动为不同语言翻译正文，也不会自动在顶部导航新增栏目。

`--theme` 可选 `base`、`ai`、`cyber`、`hacker`、`matrix`，一次选一种。页面 slug 支持 `projects/labs` 这样的嵌套路径，仍只用小写字母、数字和连字符。同名页面会报错，别把同一路径的五种主题命令连续运行。新建文章仍用 `new-post`。

## 这套教程

- [使用指南 1：搭建你的博客](/zh/blog/starter-guide-1-configure-your-site/)
- [使用指南 2：写文章与管理内容](/zh/blog/starter-guide-2-languages-and-routing/)
- [使用指南 3：按需开启与定制功能](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)
