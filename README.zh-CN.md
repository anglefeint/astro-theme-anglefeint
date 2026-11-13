[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [繁體中文](README.zh-Hant.md)

<p align="center">
  <a href="https://demo.anglefeint.com/zh/">
    <img src="public/images/theme-previews/anglefeint-brand.webp" alt="Anglefeint — Matrix / Cyberpunk / Hacker / AI" width="1600" />
  </a>
</p>

<p align="center">为人类读者与 AI 智能体打造的多氛围电影感 Astro 个人发布主题。</p>

自动生成 `llms.txt`、多语言索引、全文合集与文章 Markdown，方便 AI Agent 读取和引用内容，支持 GEO（生成式引擎优化）。

<p align="center">
  <a href="https://demo.anglefeint.com/">在线演示</a>
  ·
  <a href="https://github.com/anglefeint/astro-theme-anglefeint">仓库地址</a>
</p>

<p align="center">
  <a href="#ai-assistant">AI 助手</a> · <a href="#installation">安装</a> · <a href="#setup">站点配置</a> · <a href="#writing">写文章</a> · <a href="#upgrade">升级</a> · <a href="#deployment">构建与部署</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7.3.7-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-9%20languages-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Static%20Hosting-0A7EA4" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## Anglefeint 能做什么？

用 Markdown／MDX 写文章，用 Fragments 记录短想法；内置多语言、搜索、标签、目录、代码复制、图片预览、数学公式和自动文章分享图。评论、音乐与 GA4 可按需启用。

| 页面           | 视觉氛围                               |
| -------------- | -------------------------------------- |
| 首页           | Matrix：绿色代码雨、终端与像素头像     |
| 博客及标签列表 | Cyberpunk：霓虹、雨幕与城市光束        |
| About          | Hacker：个人介绍、虚拟终端和交互工具   |
| 文章详情       | AI：网络背景、监视器与 OUTPUT 阅读面板 |

构建还会生成公开文章、About 和 Fragments 的 Markdown、`llms.txt` 及多语言全文合集，方便 AI 工具读取，不需要另设生产服务器；不保证模型收录或引用。

<a id="ai-assistant"></a>

## 用 AI 助手协作

可让 Cursor、Codex 或 Claude Code 按当前项目的 `AGENTS.md` 配置站点和管理内容；已有的 `CLAUDE.md`、Cursor 规则会指向对应指引。先说明要改什么，让助手查实际配置和本文相应章节，需要字段细节时再进入 demo 字典。

参与主题开发请从仓库的 [AGENTS.md](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/AGENTS.md) 和[贡献指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/CONTRIBUTING.md)进入；博客使用者不需要先学习维护者发布流程。

<a id="installation"></a>

## 1. 安装并启动

需要 **Node.js 22.12.0 或更新版本**，模板基于 **Astro 7**。在准备存放博客的目录执行：

```bash
npm create astro@latest -- my-blog --template anglefeint/astro-theme-anglefeint#starter --no-install --no-ai
cd my-blog
npm install
npm run dev
```

打开终端输出的网址。已有项目只需在原目录运行 `npm install`、`npm run dev`，不用重新创建博客。停止服务按 Ctrl+C；后续命令在项目根目录执行，可停止 dev 后运行，或另开终端。

新项目也可使用 `pnpm install`、`pnpm dev`；一个项目保持使用同一种包管理器。下文以 npm 为例，自动升级器目前仅支持 npm 项目。

详细步骤：[安装博客，换成自己的信息](https://demo.anglefeint.com/zh/blog/starter-guide-1-configure-your-site/)。

<a id="setup"></a>

## 2. 首次配置：换成自己的信息

安装后的项目已经带有 `src/site.config.ts`，**直接打开这个文件修改，不需要新建配置文件或声明新的配置对象**。

在文件现有的 `defineThemeConfig({ ... })` 内加入下面的 `site` 配置，把名称、作者、介绍和域名换成自己的。starter 默认省略了 `site`，使用主题默认值；如果你的文件已经有 `site`，直接修改其中字段，保留其他设置，不要重复添加同名对象。文件原有的 import、export 和其他配置保持不动。

```ts
site: {
  title: '我的博客',
  author: '你的名字',
  description: '记录项目、阅读和生活。',
  url: 'https://your-domain.example',
},
```

这段配置只修改全站信息，不改变语言设置。没有单独设置本地化 `homeTitle` 时，首页大标题会使用全站 `title`。首页介绍、About 内容和社交链接也可以换成自己的，具体字段见本节末尾的教程和字典。

`site.url` 是正式网站的公开地址，不是本地 dev 地址。部署环境中的 `PUBLIC_SITE_URL` 会覆盖它；改了配置却仍使用旧域名时，先检查这一项。

初始配置启用九种语言，默认语言为英文，访问 `/` 会进入 `/en/`。阅读中文 README 不需要把博客改成中文。若想调整默认语言或只发布部分语言，再按[语言教程](https://demo.anglefeint.com/zh/blog/starter-guide-languages/)配置；省略某种语言不会关闭它，默认语言始终启用，系统不会自动翻译文章。示例文章可在备份或提交 Git 后删除，不要删掉仍被内容引用的图片。

操作教程：[安装与首次配置](https://demo.anglefeint.com/zh/blog/starter-guide-1-configure-your-site/)、[选择语言和首页地址](https://demo.anglefeint.com/zh/blog/starter-guide-languages/)。字段参考：[站点与公共界面](https://demo.anglefeint.com/zh/blog/config-site-chrome/)、[首页](https://demo.anglefeint.com/zh/blog/config-home/)。

<a id="writing"></a>

## 3. 写第一篇文章

在项目根目录创建文章：

```bash
npm run new-post -- my-first-post
```

未指定 `--locales` 或 `ANGLEFEINT_LOCALES` 时，读取项目中全部已启用的语言，为每种语言生成同名文章骨架。初始配置启用九种语言，因此会创建九份文件；如果你已调整语言开关，就按调整后的启用语言生成。它不会自动翻译正文，已有文件不会被覆盖。

文件位于 `src/content/blog/<语言>/my-first-post.md`，访问路径为 `/<语言>/blog/my-first-post/`，列表为 `/<语言>/blog/`。例如英文文件是 `src/content/blog/en/my-first-post.md`，中文文件是 `src/content/blog/zh/my-first-post.md`。打开自己需要的文件，修改标题、描述和正文，不需要手工创建路由。一个最小内容示例：

```md
---
title: '我的第一篇文章'
description: '记录这次开始写博客的想法。'
pubDate: '2026-11-13'
---

这里开始写正文。
```

上面只展示必需字段，生成文件已有的封面和其他可选字段可继续保留。普通文章名使用小写字母、数字和连字符，如 `my-first-post`。

如果只想创建指定语言的文件，再使用 `--locales`。下面是可选用法，不必逐条执行：

```bash
# 只生成英文
npm run new-post -- my-first-post --locales en

# 只生成中文
npm run new-post -- my-first-post --locales zh

# 生成指定的多种语言
npm run new-post -- my-first-post --locales en,zh
```

`--locales` 只选择生成文件，不会启用语言；对应语言需在站点配置中启用才能生成其页面。同一次调用的新文件共用一张随机默认封面（来源池有图片时），已有文件仍不会被覆盖。

也可使用 `ANGLEFEINT_LOCALES` 环境变量选择语言，优先级为 `--locales` → 环境变量 → 项目已启用语言。Bash 可写 `ANGLEFEINT_LOCALES=zh,en npm run new-post -- my-first-post`；PowerShell 直接使用上面的 `--locales` 命令即可。

**当前没有草稿或未来日期自动隐藏功能。** 生成的各语言骨架也会随构建公开，发布前应完成需要的内容，并将未准备公开的文件移出内容集合。`draft: true` 和 `search: false` 都不能让内容变成私密文章。

操作教程：[写第一篇文章](https://demo.anglefeint.com/zh/blog/starter-guide-2-languages-and-routing/)、[添加图片](https://demo.anglefeint.com/zh/blog/starter-guide-images/)。字段参考：[文章详情与 frontmatter](https://demo.anglefeint.com/zh/blog/config-article/)。

## 4. 发布一条碎片

Fragments 适合简短文字、图片或代码。**主题和新建 starter 默认关闭碎片功能，演示站单独开启了它。** 要在自己的博客启用，请在 `src/site.config.ts` 现有 `theme` 对象中设置 `fragments.enabled: true`。下面展示合并后的结构，不要重复创建 theme：

```ts
theme: {
  fragments: { enabled: true },
},
```

如果已有 `enabled: true`，无需重复添加；如果是 false，将其改成 true 即可。这个开关控制碎片列表和首页预览入口，评论仍默认关闭。

然后创建一条碎片，默认为项目中全部已启用语言生成同一条内容的骨架：

```bash
npm run new-fragment
```

只想生成指定语言时，再选择相应参数：

```bash
# 只生成中文
npm run new-fragment -- --locales zh

# 生成指定的多种语言
npm run new-fragment -- --locales en,zh
```

每次执行都会新建一条；上面是不同用法，按需选择，不必逐条执行。CLI 语言选择不自动修改站点语言开关。

文件生成在 `src/content/fragments/<语言>/`，文件名类似 `2026-11-13-aB3dE6gH.md`，终端会打印实际路径。编辑该文件正文即可，保留生成的八位字母数字 ID；同次生成的译文共享 ID 和发布时间。继续修改同一条内容时不要再次运行创建命令。

列表地址为 `/<语言>/fragments/`，例如英文 `/en/fragments/`、中文 `/zh/fragments/`；对应语言首页有碎片时显示头像预览入口。稳定分享地址使用 `/<语言>/fragments/#ID`，不要把页码当成内容身份；改 ID 会影响链接和评论关联。碎片评论默认关闭。

操作教程：[发布一条碎片](https://demo.anglefeint.com/zh/blog/starter-guide-5-fragments/)。字段参考：[Fragments](https://demo.anglefeint.com/zh/blog/config-fragments/)。

## 5. 创建自定义页面

文章用 `new-post`；项目介绍、作品页等独立页面用 `new-page`：

```bash
npm run new-page -- projects
```

生成 `src/pages/[lang]/projects.astro`，默认使用 `base` 主题。打开这个文件修改内容，然后访问 `/<语言>/projects/`，例如 `/en/projects/`；一个文件为所有启用语言生成页面，不会自动翻译内容，也不会自动添加导航入口。

需要指定视觉风格时可添加 `--theme`，可选 `base`、`matrix`、`cyber`、`hacker`、`ai`；例如 `npm run new-page -- portfolio --theme cyber` 创建另一个 Cyberpunk 页面。

支持嵌套路径，例如：

```bash
npm run new-page -- projects/labs --theme hacker
```

路径每段使用小写字母、数字和连字符；不使用大写、下划线或首尾斜杠。已有文件不会被覆盖，主题保留的标准页面路径也不能用这个命令重建。

详细步骤：[页面定制教程](https://demo.anglefeint.com/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)。

## 6. 准备图片并保留生成文件

文章正文使用普通 Markdown 图片；例如把 `photo.jpg` 放在文章旁边，写 `![图片描述](./photo.jpg)`。封面在 frontmatter 中设置 `heroImage: ./cover.jpg`，先放好对应文件；public 图片网址不带 public 前缀。

封面和支持处理的碎片本地图片需要持久化的响应式文件。在本地显式准备，或只检查当前产物：

```bash
npx @anglefeint/astro-theme prepare-covers
npx @anglefeint/astro-theme prepare-covers --check
```

本地 dev 和本地 doctor 会准备缺失或过期的派生图片；build 和 CI doctor 只检查，不在部署端重新生成。原图以及整个 `src/assets/blog/covers/`（包含 `manifest.json`、`generated/`）都要提交到 Git。出现 missing／stale／modified 提示时，先在本地准备并提交，再重新构建。

这个命令不代表所有普通文章正文图片都已压缩；具体支持范围、图片路径和分享图规则见[图片教程](https://demo.anglefeint.com/zh/blog/starter-guide-images/)。

<a id="reference"></a>

## 按需要配置功能

常用命令和首次操作在本页即可完成；要调整功能，再打开对应教程或字段说明。配置字典逐项解释类型、默认值、限制、示例和当前未使用状态。

| 想做什么                             | 操作教程                                                                                                                                                                                  | 配置字典                                                                                                                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 调整首页、站点信息、导航、社交和页脚 | [页面与功能定制](https://demo.anglefeint.com/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   | [首页](https://demo.anglefeint.com/zh/blog/config-home/)、[站点与公共界面](https://demo.anglefeint.com/zh/blog/config-site-chrome/)                                                      |
| 改列表条数、标签和分页               | [页面与功能定制](https://demo.anglefeint.com/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   | [Blog List 与标签列表](https://demo.anglefeint.com/zh/blog/config-blog-list/)                                                                                                            |
| 改文章目录、数学、OUTPUT 或搜索收录  | [写第一篇文章](https://demo.anglefeint.com/zh/blog/starter-guide-2-languages-and-routing/)                                                                                                | [文章详情](https://demo.anglefeint.com/zh/blog/config-article/)、[搜索与内容发现](https://demo.anglefeint.com/zh/blog/config-search/)                                                    |
| 配置 About、终端或 Decoder           | [页面与功能定制](https://demo.anglefeint.com/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)                                                                                   | [About](https://demo.anglefeint.com/zh/blog/config-about/)、[终端](https://demo.anglefeint.com/zh/blog/config-terminal/)、[Decoder](https://demo.anglefeint.com/zh/blog/config-decoder/) |
| 开启音乐或评论                       | [音乐设置](https://demo.anglefeint.com/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)、[让读者留下评论](https://demo.anglefeint.com/zh/blog/starter-guide-4-giscus-comments/) | [音乐](https://demo.anglefeint.com/zh/blog/config-music/)、[Giscus 与多语言讨论共享](https://demo.anglefeint.com/zh/blog/config-comments/)                                               |
| 调整语言、统计或公开文本补充         | [多语言](https://demo.anglefeint.com/zh/blog/starter-guide-languages/)、[发布教程](https://demo.anglefeint.com/zh/blog/starter-guide-deployment/)                                         | [语言与回退](https://demo.anglefeint.com/zh/blog/config-languages/)、[GA4 与 AI 补充](https://demo.anglefeint.com/zh/blog/config-analytics-ai/)                                          |

不确定字段在哪里，从[配置字典总入口](https://demo.anglefeint.com/zh/blog/config-reference/)查找。只修改当前语言的文案不会自动翻译内容；配置和内容改动都需要重新构建部署。

<a id="upgrade"></a>

## 7. 升级已有博客

新安装的博客无需执行这一节，可直接进入下面的[检查、预览和第一次部署](#deployment)。

先保存自己的改动，例如提交到 Git；停止开发服务和 preview，在原项目根目录先检查兼容性，再执行升级：

```bash
npx @anglefeint/astro-theme@latest upgrade --check
npx @anglefeint/astro-theme@latest upgrade
```

`--check` 不修改文件、不安装或构建。实际升级适用于使用 npm、带 `package-lock.json` 且 `anglefeint.projectSchema: 1` 的集成版 starter；pnpm／yarn／bun 项目不能通过删除锁文件绕过限制。

升级器更新主题依赖并运行 doctor，保留文章、个人配置、音乐、图片和自定义页面。它会将两个依赖文件备份到 `.anglefeint/backups/`；这不是整站备份。安装或检查失败时会恢复依赖文件并尝试重装旧依赖；失败后不要部署遗留的 `dist/`。

选择特定版本可用 `npx @anglefeint/astro-theme@latest upgrade --to <版本号>`，使用时将占位替换为兼容的明确版本；不支持自动降级。升级成功已完成检查和构建，可直接 `npm run preview`，不必马上再 build。升级不会自动发布网站，也不会自动迁移不兼容的 Astro 版本。

0.27 之前的复制式旧骨架需要另建 starter、保留旧项目并迁移个人内容与资源，不支持直接原地升级。不要复制旧标准路由或适配器实现。

详细步骤与恢复方法：[已有项目如何升级](https://demo.anglefeint.com/zh/blog/starter-guide-1-configure-your-site/)、[升级指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)、[版本记录](https://github.com/anglefeint/astro-theme-anglefeint/releases)。

<a id="deployment"></a>

## 8. 检查、预览和第一次部署

在项目根目录停止 dev，先检查并构建，再预览生成的网站：

```bash
npm run doctor
npm run preview
```

`npm run doctor` 包含检查和构建，`npm run check` 是它的同义命令，选择一个即可；成功后不需要立即再执行 check 或 build。只检查 Astro／TypeScript、不构建时可用 `npm run check:no-build`。preview 只在本地展示构建产物，按 Ctrl+C 停止，不会上传网站。真实搜索也要在构建后的 preview 中使用；dev 只显示开发提示。

如果只需要构建、不运行完整检查，可改用下面这一组；两组选择其一：

```bash
npm run build
npm run preview
```

pnpm 项目对应使用 `pnpm run doctor`／`pnpm preview`，或 `pnpm build`／`pnpm preview`。检查命令不要简写为 `pnpm doctor`，以免调用 pnpm 自身的诊断命令。两组选择其一，无需重复构建。

首次部署到静态托管平台时：

1. 将 `site.url` 或 `PUBLIC_SITE_URL` 设置为正式地址，提交源内容、图片原图及生成文件。
2. 托管平台构建命令设置为 `npm run build`，发布目录设置为 `dist`；本地手动上传时，上传已成功构建的 **整个 dist 内容**。
3. 保留 `_astro/`、`pagefind/`、`_social/`、公开文本等生成产物，不要只上传 HTML。
4. 使用域名根部署，并支持目录 index 路由；任意子路径部署仍需额外适配，不能只设置 Astro base 就认为整站都已支持。
5. 按托管平台完成域名和 HTTPS 绑定，再检查首页、文章、语言入口、图片和搜索。

网站是静态产物，不需要生产 Node.js 服务或额外托管适配器。终端 JSON 的 noindex 响应头会合并到构建后的 `dist/_headers`；兼容平台会应用它，其他平台需要等效设置，Astro preview 不会模拟托管响应头。内容或配置改动后，重新构建并完整部署。

详细步骤：[把博客发布到自己的域名](https://demo.anglefeint.com/zh/blog/starter-guide-deployment/)。

## 许可证

本主题采用 [MIT License](LICENSE)。

## 预览

![Anglefeint — Four cinematic worlds](public/images/theme-previews/promo-overview.jpg)

![Anglefeint — Cyberpunk Cards and List](public/images/theme-previews/promo-cyberpunk.jpg)

![Anglefeint — Hacker About and Decoder Lab](public/images/theme-previews/promo-hacker.jpg)

![Anglefeint — AI reading and GEO](public/images/theme-previews/promo-ai.jpg)

### 分享预览

![Anglefeint 默认分享图](https://raw.githubusercontent.com/anglefeint/astro-theme-anglefeint/main/packages/theme/src/assets/theme/social/anglefeint-og.jpg)

### 页面截图

| 首页                                                           | 博客列表                                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home preview](public/images/theme-previews/preview-home.jpg) | ![Blog Cards preview](public/images/theme-previews/preview-blog-list.jpg) |

| Blog · 列表模式                                                            |
| -------------------------------------------------------------------------- |
| ![Blog List view](public/images/theme-previews/preview-blog-list-mode.jpg) |

| 文章页                                                                   |
| ------------------------------------------------------------------------ |
| ![Blog post preview](public/images/theme-previews/preview-blog-post.jpg) |

| About                                                            |
| ---------------------------------------------------------------- |
| ![About preview](public/images/theme-previews/preview-about.jpg) |

| 博客分页                                                                   | 文章相关推荐                                                                |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| ![博客分页](public/images/theme-previews/preview-blog-list-pagination.jpg) | ![文章相关推荐](public/images/theme-previews/preview-blog-post-related.jpg) |

| Decoder Lab                                                      |
| ---------------------------------------------------------------- |
| ![Decoder Lab](public/images/theme-previews/preview-decoder.jpg) |

| Decoder Lab · 密码朋克资源                                                           |
| ------------------------------------------------------------------------------------ |
| ![Decoder Lab resources](public/images/theme-previews/preview-decoder-resources.jpg) |
