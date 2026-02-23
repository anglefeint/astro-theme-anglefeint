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
npm create astro@latest -- --template voidtem/astro-theme-anglefeint
```

使用 `pnpm`：

```bash
pnpm create astro@latest --template voidtem/astro-theme-anglefeint
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

## 功能特性

- Astro 5 静态输出
- Markdown + MDX 内容集合
- 内置语言：`en`、`ja`、`ko`、`es`、`zh`
- 按语言生成 RSS
- 内置 Sitemap 与 robots
- 配置驱动的主题定制
- 短页面下 Footer 贴底

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

使用 `pnpm`：

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 新建文章

一次为全部语言（`en`、`ja`、`ko`、`es`、`zh`）创建同名 slug：

```bash
npm run new-post -- my-first-post
```

Slug 规则：仅使用小写字母、数字和连字符（示例：`my-first-post`）。

## 新建页面

`new-post` 只创建博客文章。自定义页面请使用：

```bash
npm run new-page -- projects --theme base
```

可选主题：`base`、`br`、`mesh`、`term`、`matrix`。  
命令会生成 `src/pages/[lang]/projects.astro`，并通过 `getStaticPaths()` 输出全部语言路由。

## 主题配置

1. 复制 `.env.example` 为 `.env` 并填写站点信息。
2. 在 `src/config/social.ts` 修改社交链接。
3. 在 `src/config/about.ts` 修改 About 内容。
4. 在 `src/config/theme.ts` 用 `ENABLE_ABOUT_PAGE` 控制 About 页面开关。
5. 在 `src/content/blog/<locale>/` 替换示例文章。

## 配置入口

- 站点信息：`src/config/site.ts`（或 `PUBLIC_*` 环境变量）
- 主题行为：`src/config/theme.ts`
- About 内容：`src/config/about.ts`
- 社交链接：`src/config/social.ts`

## 文档

- 架构说明：`docs/ARCHITECTURE.md`
- 视觉系统：`docs/VISUAL_SYSTEMS.md`
- 提交检查单：`docs/THEME_SUBMISSION_CHECKLIST.md`
- 主题提交文案：`ASTRO_THEME_LISTING.md`
- 升级指南：`UPGRADING.md`
- 变更日志：`CHANGELOG.md`

## 许可证

MIT License，见 `LICENSE`。
