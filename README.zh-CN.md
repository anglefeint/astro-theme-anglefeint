# Anglefeint

一个具有电影感、多氛围切换的 Astro 个人发布主题。

## 语言

- [English](README.md)
- 简体中文（当前）
- [日本語](README.ja.md)
- [Español](README.es.md)
- [한국어](README.ko.md)

## 在线演示

- https://demo.anglefeint.com/

## 技术栈

- Astro 5
- TypeScript
- Markdown + MDX 内容集合
- 静态站点生成（SSG）
- 可部署到 Cloudflare Workers / Pages

## 环境要求

- Node.js 18+（建议使用 LTS）
- 包管理器：npm / pnpm / yarn / bun

## 页面预览

- 首页（`/`）：Matrix 终端风
- 博客列表（`/:lang/blog`）：赛博朋克归档风
- 文章页（`/:lang/blog/[slug]`）：AI 界面阅读风
- About（`/:lang/about`）：可选黑客终端风个人页

## 功能特性

- Astro 5 静态输出
- Markdown + MDX 内容系统
- 内置语言：`en`、`ja`、`ko`、`es`、`zh`
- 按语言生成 RSS
- 内置 Sitemap 与 robots 支持
- 配置驱动（站点信息、主题行为、About 内容、社交链接）
- 粘底 Footer（短页面下也贴底显示）

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

`pnpm` 示例：

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 主题配置

1. 复制 `.env.example` 为 `.env` 并填写站点信息。
2. 在 `src/config/social.ts` 修改社交链接。
3. 在 `src/config/about.ts` 修改 About 文案。
4. 在 `src/config/theme.ts` 用 `ENABLE_ABOUT_PAGE` 控制 About 页面开关。
5. 在 `src/content/blog/<locale>/` 替换示例文章。

## 主要配置入口

- 站点信息：`src/config/site.ts`（或 `PUBLIC_*` 环境变量）
- 主题行为：`src/config/theme.ts`
- About 内容：`src/config/about.ts`
- 社交链接：`src/config/social.ts`

## 许可证

MIT License，见 `LICENSE`。
