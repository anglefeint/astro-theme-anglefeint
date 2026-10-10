---
doc_id: theme_listing
doc_role: submission-copy
doc_purpose: Submission copy for Astro theme directory listing fields.
doc_scope: [theme-description, feature-summary, submission]
update_triggers: [theme-naming, visual-change, feature-change]
source_of_truth: false
depends_on: [README.md, docs/VISUAL_SYSTEMS.md]
---

# Astro Themes Listing Draft

## Short Description (EN)

Multi-atmosphere Astro theme: Matrix home, cyberpunk archive, AI-style article pages, and hacker-themed About page.

## 简短描述 (ZH)

多氛围 Astro 主题：Matrix 风首页、赛博归档博客列表、AI 界面风文章页，以及黑客终端风 About 页面。

## Long Description (EN)

Anglefeint is a static Astro blog theme with four cinematic atmospheres:

- Home: Matrix-inspired code rain and terminal visuals
- Blog archive: rain-soaked cyberpunk neon
- Articles: an AI-inspired reading interface
- About: an optional hacker-style profile page

Publish Markdown and MDX articles with built-in mathematical formulas, search, tags, a table of contents, code copying, image previews and automatically generated social cards.

Nine languages are enabled by default: English, Simplified Chinese, Traditional Chinese, Japanese, Korean, Spanish, Brazilian Portuguese, German and Russian. Configure the languages you need, with localized routes and per-language RSS feeds.

SEO features include sitemap generation, robots.txt, canonical URLs, hreflang links for available article translations, and JSON-LD metadata.

Customize your site identity, social links, About content and feature settings from one configuration file. Music, Giscus comments and Google Analytics 4 are optional.

Create an article: npm run new-post -- my-first-post

Create a page: npm run new-page -- projects --theme hacker

Build once and deploy the generated static files to your hosting provider or web server. No production Node.js server is required. Configure your public site URL before deployment.

## 详细描述 (ZH)

Anglefeint 是纯静态 Astro 博客主题，提供四种电影感氛围：首页的 Matrix 代码雨、列表页的 Cyberpunk 霓虹雨夜、文章页的 AI 阅读界面，以及可选的 Hacker 风 About 页面。

支持 Markdown/MDX 写作、默认全局数学公式、文章搜索、标签、目录、代码复制、图片预览和自动分享图。默认开启英语、简体中文、繁体中文、日语、韩语、西班牙语、巴西葡萄牙语、德语和俄语九种语言，用户可按需关闭；包含各语言路由与 RSS。

内置 sitemap、robots.txt、canonical、真实文章译文的 hreflang 和 JSON-LD。通过一个配置入口定制站点身份、社交链接、About 内容和功能开关；音乐、Giscus 评论及 GA4 可选。

创建文章：npm run new-post -- my-first-post

创建页面：npm run new-page -- projects --theme hacker

构建后把静态文件部署到托管平台或自己的服务器即可，不依赖 Cloudflare 或线上 Node.js。上线前配置正式域名。

## Key Features (EN)

- Pagefind full-text article search, generated with the static build and scoped to the current language
- Automatic Markdown article contents and per-language tag directories with paginated archives
- Code-block copy buttons and keyboard-accessible article image previews
- Astro 7 static output
- MD + MDX content collections, with global default-on build-time mathematics
- Automatic article social cards; optional music, Giscus comments and GA4
- Locale routes (`en`, `ja`, `ko`, `es`, `zh`, `pt-br`, `de`, `ru`, `zh-hant`)
- Route-specific atmosphere system
- Single-entry config via `src/site.config.ts` (site identity, social links, About content, feature toggles)
- Optional About section via `theme.enableAboutPage`
- Sitemap + robots + locale RSS

## 核心特性 (ZH)

- 构建时自动生成 Pagefind 全文索引，搜索当前语言文章
- Markdown 自动文章目录、各语言标签目录和分页归档
- 代码块一键复制、支持键盘操作的正文图片预览
- 基于 Astro 7 静态输出
- 支持 MD + MDX 内容集合，默认全局开启构建期数学公式
- 自动文章分享图；可选音乐、Giscus 评论和 GA4
- 多语言路由（`en`、`ja`、`ko`、`es`、`zh`、`pt-br`、`de`、`ru`、`zh-hant`）
- 按路由切换视觉氛围系统
- 通过单一入口 `src/site.config.ts` 配置站点信息、社交链接、About 内容与功能开关
- 支持 `theme.enableAboutPage` 功能开关
- 内置 sitemap + robots + 多语言 RSS

## Suggested Tags

- blog
- portfolio
- dark
- cyberpunk
- creative
- multilingual
- mdx
- content

## Demo + Setup Links

- Live Demo: `https://demo.anglefeint.com/`
- Repository (HTTPS): `https://github.com/anglefeint/astro-theme-anglefeint`
- Repository (SSH): `git@github.com:anglefeint/astro-theme-anglefeint.git`

## Submission notes

For rich-text listing forms, paste commands as plain text; copied inline-code styling can create low-contrast backgrounds. The examples above are executable commands, not shell alternatives separated by pipes. This file is reusable submission copy, not evidence that the external listing has been updated. Navigation currently has Home, Blog and optional About; do not advertise an arbitrary configurable menu.
