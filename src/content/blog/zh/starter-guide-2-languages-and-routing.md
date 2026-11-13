---
tags: ['anglefeint', 'starter']
title: '使用指南 2：写第一篇文章'
subtitle: '创建文章、填写标题和日期、写正文，再用目录、标签、代码和公式组织内容。'
description: '从按默认流程创建文章到本地预览，说明当前支持的文章字段、Markdown 与 MDX、目录、标签、搜索和统计。'
pubDate: '2026-03-07'
updatedDate: '2026-11-13'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

本篇是入门教程的第 2 / 8 篇。[查看完整教程顺序](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order) · [按字段查配置字典](/zh/blog/config-reference/)。

完成[安装与站点设置](/zh/blog/starter-guide-1-configure-your-site/)后，日常写作主要修改 `src/content/blog/` 中的文章文件。标题、日期等单篇信息写在文件顶部的 frontmatter 中；站点名称、默认作者和全站开关仍在 `src/site.config.ts` 配置。

这篇先带你按项目默认流程创建并预览文章，再按需选择语言。后面的字段速查按需要阅读即可。

## 1. 按默认流程创建文章

在项目根目录，也就是包含 `package.json` 的目录，运行：

```bash
npm run new-post -- my-first-post
```

如果你在第一篇已经运行过这条命令，直接打开已有文件继续写。同名文件会跳过，不会覆盖你的内容。

未指定 `--locales` 或 `ANGLEFEINT_LOCALES` 时，命令为项目全部已启用语言创建 `src/content/blog/<语言代码>/my-first-post.md`。初始配置启用九种语言，因此会创建九份骨架；调整过语言开关时，按当前启用列表生成。它不会自动翻译正文。

选择自己要编辑的语言文件，对应网址是 `/<语言代码>/blog/my-first-post/`，列表是 `/<语言代码>/blog/`。例如默认英文首页下的文章为 `/en/blog/my-first-post/`，中文为 `/zh/blog/my-first-post/`，各语言需启用。无需手工创建路由。

`my-first-post` 是文章的 slug，只使用小写英文字母、数字和连字符，例如 `learning-astro-1`；不能包含空格、下划线或 `/`。更改文章文件名会改变网址，不会自动为旧链接建立重定向。

命令会填入标题、简介、当天的 UTC 日期和占位正文。如果 `src/assets/blog/default-covers/` 有 WebP、PNG 或 JPEG 图片，还会随机选一张作为封面；没有图片则不填 `heroImage`，不会下载封面。生成后可以替换文案、日期和图片。

### 只想创建指定语言时

以下是默认命令的可选用法。只创建中文时指定 zh，创建英文和中文时指定 en,zh；不必把这些示例逐条执行：

```bash
# 只创建中文
npm run new-post -- my-first-post --locales zh

# 创建英文和中文
npm run new-post -- my-first-post --locales en,zh
```

省略 `--locales` 时，命令默认读取项目启用的语言；若设置了 `ANGLEFEINT_LOCALES` 环境变量，则优先使用它。完整优先级是 `--locales` → `ANGLEFEINT_LOCALES` → 已启用语言。同一次命令的新文件共用所选封面，已有文件保持不变。

命令只创建文件，不会翻译，也不会自动启用语言。译文放在对应语言目录，保持相同 slug。文章详情页切换语言时，有同 slug 的译文才进入译文，否则前往目标语言的博客列表。

## 2. 填写标题、简介和日期

打开生成的文件。最顶部两条 `---` 之间是 YAML frontmatter，后面才是正文。可以先写成这样；如果原文件已有 `heroImage`，可以保留它：

```md
---
title: '我的第一篇文章'
description: '记录我用 Anglefeint 搭建博客的过程。'
pubDate: '2026-11-13'
tags: ['astro', '笔记']
---

这是我的第一篇文章。我准备在这里记录学习过程和遇到的问题。

## 为什么开始写博客

写下自己的想法，也给以后的自己留下线索。

### 先从一个小问题开始

今天先记录安装和发布过程。
```

将日期改成真实发布日期。`title`、`description`、`pubDate` 是必填字段；`tags` 可省略。标题已由文章页显示，正文通常从 `##` 开始，不必再写一遍 `# 我的第一篇文章`。

- `title` 用于文章标题、列表及相关元信息。
- `description` 是文章简介，也用于页面元描述；没有另外填写 `context` 时，还显示在文章标题下的上下文行。
- `pubDate` 决定列表排序，按时间从新到旧排列。
- 实质修改已发布文章后，可以添加真实的 `updatedDate`；它会显示为更新日期，sitemap 也优先使用它，但不会替代 `pubDate` 进行列表排序。

日期建议用带引号的 `YYYY-MM-DD`；需要准确时间时写包含时区的 ISO 日期，例如 `'2026-11-13T09:00:00+08:00'`。文章页以 UTC 日期显示，带时区的时间换算后可能跨日。

**当前没有草稿或定时发布过滤。** 默认生成的其他语言骨架也会随构建公开；发布前完成需要的内容，将未准备公开的文件移到 `src/content/blog/` 之外。`draft: true`、未来的 `pubDate` 和 `search: false` 都不能让文章变成私密内容。

## 3. 写正文，用标题组织内容

普通段落之间留一个空行。常用 Markdown 写法如下：

```md
这是一段正文，可以使用 **加粗**、_强调_ 和 `行内代码`。

- 第一个要点
- 第二个要点

[链接文字](https://example.com/)

> 这是一段引用。
```

正常使用 `##` 和 `###` 后，文章会自动生成目录。宽屏目录在正文右侧，窄屏在正文前方；没有二级或三级标题时不显示。四级及更深标题仍可用于正文，但不进入这个目录。

单篇不需要目录时，在已有 frontmatter 中加：

```yaml
toc: false
```

省略 `toc` 时继承 `src/site.config.ts` 中的 `theme.toc.enabled`，默认开启；`toc: true` 可以覆盖全站关闭设置。目录使用编译器提供的 Markdown 标题，MDX 组件内部或原始 HTML/JSX 生成的标题不属于自动收集范围。

### 用标签整理文章

在 frontmatter 填写 `tags: ['astro', '笔记']`，即可自动生成标签入口和当前语言的标签列表，无需手工添加路由。启用标签时可访问 `/zh/tags/` 查看。

标签区分大小写：`Astro` 和 `astro` 是两个标签。首尾空白会去掉，同一篇的重复标签只计一次。直接使用页面生成的标签链接，中文和特殊字符有稳定编码，不要手工猜路径。重命名标签会改变对应链接。

全站 `theme.tags.enabled: false` 会关闭标签入口和标签页面生成；文章本身仍然保留。

## 4. 插入代码和数学公式

代码块使用三个反引号围栏，后面写语言名称：

````md
```js
const message = 'Hello, world!';
console.log(message);
```
````

文章正文代码块会自动添加复制按钮，复制保留代码的换行和缩进。它复制文本，不会因为代码块写了 JavaScript 就运行其中代码。剪贴板不可用时会显示失败提示，可以手动选择复制；需要启用 JavaScript 才有该按钮。

数学公式默认开启，无需另外安装插件。行内用 `$...$`，独立公式写在两行 `$$` 之间：

```md
保存量为 $C_{saved}$。

$$
\frac{a}{b} = x_1 + x_2
$$
```

普通美元符号有歧义时写成 `\$`；行内代码和代码块中的内容保持原样。公式在构建时用 KaTeX 渲染，支持其数学语法，不是完整 LaTeX 文档。错误公式会使编译或构建失败，并提示来源；长独立公式可以横向滚动。

在 `src/site.config.ts` 已有的 `theme` 中合并 `math: { enabled: false }` 可以全站关闭数学。标题和简介保持纯文本，不要依赖其中的数学标记渲染公式。

### 什么时候使用 MDX？

普通写作用 `.md` 即可。需要在文章中导入和使用组件时，可以使用 `.mdx`；主题同时收集这两种扩展名，数学支持也适用于 MDX，不必自己再接入处理器。

`new-post` 生成的是 `.md`，需要时可将其改为 `.mdx`，保留 frontmatter。不要同时保留相同语言、相同文件主名的 `.md` 和 `.mdx` 来充当两篇文章，它们对应相同文章路径。MDX 的组件和表达式需要遵循 MDX 语法，不要把它当成只改变扩展名的纯文本。

## 5. 给文章添加图片

正文图片可以使用文章旁边的文件，也可以引用 `public/images/` 中的文件。先放入实际图片，再写对应路径：

```md
![照片内容的描述](./photo.jpg)

![照片内容的描述](/images/photo.jpg)
```

第一种相对于文章文件；第二种对应 `public/images/photo.jpg`，网址不含 `public`。描述文字用于图片的替代文本。

如果要更换封面，可以把 `cover.jpg` 放在文章旁边，在 frontmatter 设置 `heroImage: ./cover.jpg`。`heroImage` 接受本地图片，也可以省略；正文图片、封面和分享图是不同用途，改封面不会自动把它插入正文。

普通正文图片可点击，或聚焦后按 Enter／空格放大；Esc、关闭按钮或蒙版可收起。封面以及链接、按钮内部的图片不参与该预览。预览使用浏览器已选中的图片源，不会另外请求更高清的原图，也不提供相册切换。

新增或更换封面后，本地 dev 或 doctor 会准备响应式文件。提交原图和整个 `src/assets/blog/covers/`（包含 manifest.json 和 generated/）；部署构建与 CI doctor 只校验，缺失、过期或被修改时失败，不在部署端重新编码。此处的持久派生规则用于封面及碎片本地图片，普通文章正文图片仍走原有 Markdown/MDX 图片处理。

## 6. 在本地预览，再准备发布

运行 `npm run dev`，打开终端地址下的 `/<语言代码>/blog/my-first-post/`；例如英文 `/en/blog/my-first-post/`、中文 `/zh/blog/my-first-post/`。确认标题、日期、正文、目录、标签和图片符合预期；新增译文时也检查语言切换是否进入正确页面。

发布前停止开发服务，运行：

```bash
npm run doctor
npm run preview
```

doctor 包含检查和构建，成功后无需立即再跑 check 或 build。preview 显示已构建的 `dist/`，不会发布网站。构建失败时先修复错误，不要部署残留产物。

### 搜索为什么在 dev 中搜不到文章？

全文索引在构建时生成。`npm run dev` 的搜索入口显示开发提示；在构建后的 preview 中搜索一句正文，才能核对完整搜索和文章跳转。

默认搜索当前语言的文章标题和正文。单篇不希望进入站内搜索时，在 frontmatter 加 `search: false`；省略默认参与。它不阻止文章在列表、RSS、sitemap 或公开链接中出现。全站 `theme.search.enabled: false` 则同时关闭搜索入口与索引生成。

修改文章后重新构建、部署，线上搜索才会更新。公式和装饰界面不作为搜索正文。

想逐项查类型、默认值和当前未使用状态，进入[文章配置字典](/zh/blog/config-article/#frontmatter)；站内搜索的独立规则见[搜索字典](/zh/blog/config-search/#article-search)。下面保留写作时常用的速查。

## 按需查阅：其他文章字段

这些都是文章 frontmatter 字段，不要放进 `src/site.config.ts` 的 `site` 或 `theme` 中。普通文章不必逐项填写。

### 标题区域与图片

| 字段        | 当前行为                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `subtitle`  | 可选副标题；与上下文行文字相同时不重复显示                                                                          |
| `context`   | 标题下上下文行的文字；省略时使用 `description`，设为 `''` 隐藏这行，不改变页面元描述                                |
| `author`    | 单篇作者；省略或只有空白时使用站点作者                                                                              |
| `heroImage` | 本地文章封面，影响列表与文章详情；可省略                                                                            |
| `ogImage`   | 手动指定分享预览图，优先于自动分享图；可用文章相对图片路径、`/images/share.png` 这样的 public 路径或 HTTPS 图片直链 |

默认会为未指定 `ogImage` 的文章生成 1200×630 分享图，使用标题、作者和站点名称；它不替换正文封面。设置全站 `theme.socialImage.enabled: false` 后停止自动生成，手动 `ogImage` 仍有效，其余文章回退到封面或站点默认图。修改后需要重新构建和部署，分享平台仍可能缓存旧图。

### OUTPUT 统计和可选状态文字

| 字段                | 当前行为                                           |
| ------------------- | -------------------------------------------------- |
| `wordCount`         | 覆盖自动字词数，必须是非负整数                     |
| `tokenCount`        | 独立覆盖 tokens 估算，必须是非负整数               |
| `aiModel`           | 显示你填写的模型标签，出现在标题状态区和 OUTPUT 中 |
| `aiMode`、`aiState` | 在标题状态区显示你填写的模式、状态文字             |

不填写统计字段时，主题从正文源文本估算字词数：CJK 汉字、假名及韩文字符逐个计数，其余主要按空白分词。默认 tokens 为 `round(max(自动字词数, 1) × 1.3)`，不是实际模型分词器结果。只覆盖 `wordCount` 不会重新计算 tokens，需要时分别填写。

统计会剔除部分 Markdown 内容，但不是完整的可见文字统计，公式与 MDX 源码可能影响结果。数字达到 1,000 时以一位小数的 `k` 显示。模型、模式和状态字段只展示文字，不会连接 AI 服务、验证文章来源或执行任务。

### 兼容字段和当前不产生展示的字段

- `readMinutes`、`aiLatencyMs`、`aiConfidence`：仍接受旧文章数据，但当前文章页不显示阅读时长、延迟或置信度。保留时类型分别为正整数、非负整数和 0–1 的数字；新文章不需要填写。
- `canonicalTopic`：接受字符串，当前未接入页面、canonical 或导出逻辑，不会创建专题或改变文章网址。
- `sourceLinks`：接受来源地址数组，支持 HTTP(S) 地址，裸域名会补 `https://`；当前只有数据校验，不会自动显示参考链接或加入导出内容。需要读者看到来源时，直接在正文写 Markdown 链接。

自定义未支持的字段不会自动变成页面功能；例如 `draft` 不提供草稿行为。优先使用上面已有的字段和正文写法。

## 教程导航与配置查阅

[上一篇：安装博客，换成自己的信息](/zh/blog/starter-guide-1-configure-your-site/) · [下一篇：给文章和碎片添加图片](/zh/blog/starter-guide-images/) · [八篇教程总入口](/zh/blog/starter-guide-1-configure-your-site/#tutorial-order)。

本篇相关字段：[文章字段、目录和 OUTPUT](/zh/blog/config-article/)、[标签与列表](/zh/blog/config-blog-list/)、[搜索收录](/zh/blog/config-search/)。完整路径、默认值和限制见[配置字典总入口](/zh/blog/config-reference/)。
