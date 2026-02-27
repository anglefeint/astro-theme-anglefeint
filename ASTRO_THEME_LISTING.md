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

Anglefeint is a cinematic Astro theme system that maps a distinct visual atmosphere to each stage of the reading journey:

- Home (`/`): Matrix-style terminal ambiance for first impression.
- Blog list (`/:lang/blog`): cyberpunk / Blade Runner mood for archive browsing.
- Blog detail (`/:lang/blog/[slug]`): AI-interface reading experience with immersive overlays, reading progress, and animated feedback.
- About (`/:lang/about`): hacker / Anonymous terminal profile with interactive sidebar modals.

Designed for creators who want a bold editorial identity instead of one flat visual style.

## 详细描述 (ZH)

Anglefeint 是一个具备电影感叙事节奏的 Astro 主题系统，将不同视觉氛围映射到阅读路径的不同阶段：

- 首页（`/`）：Matrix 风格终端氛围，强化首次进入时的品牌记忆。
- 博客列表（`/:lang/blog`）：赛博朋克归档场景，适合内容浏览与筛选。
- 文章详情（`/:lang/blog/[slug]`）：AI 界面风阅读体验，包含进度反馈与沉浸式动态细节。
- About 页面（`/:lang/about`）：黑客终端风个人页，支持侧边栏交互弹窗。

适合希望通过“分场景视觉语言”建立个性化内容品牌的创作者，而不只是单一扁平风格博客。

## Key Features (EN)

- Astro 5 static output
- MD + MDX content collections
- Locale routes (`en`, `ja`, `ko`, `es`, `zh`)
- Route-specific atmosphere system
- Configurable About content and modal copy (`src/config/about.ts`)
- Configurable social links in both header and footer (`src/config/social.ts`)
- Optional About section via feature toggle (`ENABLE_ABOUT_PAGE`)
- Sitemap + robots + locale RSS

## 核心特性 (ZH)

- 基于 Astro 5 静态输出
- 支持 MD + MDX 内容集合
- 多语言路由（`en`、`ja`、`ko`、`es`、`zh`）
- 按路由切换视觉氛围系统
- About 页面文案与弹窗内容可配置（`src/config/about.ts`）
- Header/Footer 社交链接可配置（`src/config/social.ts`）
- 支持 `ENABLE_ABOUT_PAGE` 功能开关
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
- Repository (HTTPS): `https://github.com/voidtem/astro-theme-anglefeint`
- Repository (SSH): `git@github.com:voidtem/astro-theme-anglefeint.git`
