---
doc_id: readme_zh
doc_role: localized-user-guide
doc_purpose: 简体中文用户安装、使用与升级说明。
doc_scope: [setup, commands, themes, config, routing]
update_triggers: [sync-from-readme-en]
source_of_truth: false
depends_on: [README.md]
---

<h1 align="center">Anglefeint</h1>
<p align="center">一个具有电影感、多氛围切换的 Astro 个人发布主题。</p>

<p align="center">
  <a href="https://demo.anglefeint.com/">在线演示</a>
  ·
  <a href="https://github.com/voidtem/astro-theme-anglefeint">仓库地址</a>
  ·
  <a href="ASTRO_THEME_LISTING.md">主题提交文案</a>
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" />
  <img alt="Locales" src="https://img.shields.io/badge/i18n-en%20%7C%20ja%20%7C%20ko%20%7C%20es%20%7C%20zh-0A7EA4" />
  <img alt="Deployment" src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2EA043" />
</p>

## 模板安装

```bash
npm create astro@latest -- --template voidtem/astro-theme-anglefeint#starter
```

使用 `pnpm`：

```bash
pnpm create astro@latest --template voidtem/astro-theme-anglefeint#starter
```

## 环境要求

- Node.js `18+`（建议 LTS）
- 包管理器：`npm`、`pnpm`、`yarn` 或 `bun`

## 快速开始

```bash
npm install
npm run dev
```

构建与预览：

```bash
npm run build
npm run preview
```

质量检查命令：

```bash
npm run lint
npm run format:check
```

使用 `pnpm`：

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 升级主题

通过 `#starter` 创建的项目可直接执行：

```bash
npm update @anglefeint/astro-theme
npm install
npm run check
npm run build
```

## 新建文章

一次为全部语言（`en`、`ja`、`ko`、`es`、`zh`）创建同名 slug：

```bash
npm run new-post -- my-first-post
```

Slug 规则：仅使用小写字母、数字和连字符（示例：`my-first-post`）。
如果 `src/assets/blog/default-covers/` 中存在默认封面，脚本会按 slug 哈希自动分配一张（后续可手动替换 `heroImage`）。

URL 规则：
- 文件：`src/content/blog/zh/my-first-post.md`
- 访问地址：`/zh/blog/my-first-post/`
- 博客列表：`/zh/blog/`
- 不需要手动加路由，Astro 会在构建时根据内容文件自动生成。

## 新建页面

`new-post` 只创建博客文章。自定义页面请使用：

```bash
npm run new-page -- projects --theme base
```

可选主题：`base`、`ai`、`cyber`、`hacker`、`matrix`。  
命令会生成 `src/pages/[lang]/projects.astro`，并通过 `getStaticPaths()` 输出全部语言路由。

示例：

```bash
npm run new-page -- projects --theme base
npm run new-page -- projects --theme ai
npm run new-page -- projects --theme cyber
npm run new-page -- projects --theme hacker
npm run new-page -- projects --theme matrix
```

## 语言

[English](README.md) · 简体中文（当前） · [日本語](README.ja.md) · [Español](README.es.md) · [한국어](README.ko.md)

## 预览

| 首页 | 博客列表 |
| --- | --- |
| ![Home preview](public/images/theme-previews/preview-home.png) | ![Blog list preview](public/images/theme-previews/preview-blog-list.png) |

| 文章页（展开） | 文章页（折叠） |
| --- | --- |
| ![Blog post open preview](public/images/theme-previews/preview-blog-post-open.png) | ![Blog post collapsed preview](public/images/theme-previews/preview-blog-post-collapsed.png) |

| About |
| --- |
| ![About preview](public/images/theme-previews/preview-about.png) |

## 路由视觉氛围

- `/`：Matrix 终端风首页
- `/:lang/blog`：赛博朋克归档列表
- `/:lang/blog/[slug]`：AI 界面风文章页
- `/:lang/about`：可选黑客风 About 页面

## 主题命名约定

- 主题参数：`base`、`ai`、`cyber`、`hacker`、`matrix`
- 内部选择器与脚本前缀：`ai-*`、`cyber-*`、`hacker-*`
- 核心组合结构：`ThemeFrame -> Shell -> Layout -> Page`

## 功能特性

- Astro 5 静态输出
- Markdown + MDX 内容集合
- 内置语言：`en`、`ja`、`ko`、`es`、`zh`
- 按语言生成 RSS
- 内置 Sitemap 与 robots
- 配置驱动的主题定制
- 短页面下 Footer 贴底

## 主题配置

1. 复制 `.env.example` 为 `.env` 并填写站点信息。
2. 编辑 `src/site.config.ts`：
   - `social.links`：社交链接
   - `about`：About 页面内容与运行文案
   - `theme.enableAboutPage`：About 页面开关
3. 在 `src/content/blog/<locale>/` 替换示例文章。

## 配置入口

- 单一入口：`src/site.config.ts`
- 适配层（不建议直接编辑）：`src/config/site.ts`、`src/config/theme.ts`、`src/config/about.ts`、`src/config/social.ts`
- 站点信息仍支持 `PUBLIC_*` 环境变量覆盖

## 文档

- 架构说明：`docs/ARCHITECTURE.md`
- 视觉系统：`docs/VISUAL_SYSTEMS.md`
- 提交检查单：`docs/THEME_SUBMISSION_CHECKLIST.md`
- 主题提交文案：`ASTRO_THEME_LISTING.md`
- 升级指南：`UPGRADING.md`
- 变更日志：`CHANGELOG.md`

## 许可证

MIT License，见 `LICENSE`。
