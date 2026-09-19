---
tags: ['anglefeint', 'starter']
title: '使用指南 1：搭建你的博客'
subtitle: '从安装启动到修改站点信息、选择语言、替换示例文章和构建部署。'
description: '从安装启动到修改站点信息、选择语言、替换示例文章和构建部署。'
pubDate: '2026-03-07'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

## 先做最少的配置

这套教程面向配套的 0.8.0 starter。三篇分别讲建站、写作和可选功能。你不需要先读懂所有配置：先把站点身份和内容换成自己的，其他功能保留默认即可。教程本身就是普通博客文章，能直接体验目录、代码复制和搜索。

## 1. 安装并在本地打开

准备 Node.js 22.12.0 或更新版本，在终端运行：

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

创建向导里选择项目目录，例如 `my-blog`。进入实际生成的目录；以下第一行要与你选择的目录一致。如果向导已安装依赖，可以略过 `npm install`。

```bash
cd my-blog
npm install
npm run dev
```

打开终端显示的本地网址；端口被占用时可能变化。使用 pnpm 时，创建模板仍可使用上面的 npm 命令，跳过向导的依赖安装，再运行 `pnpm install`、`pnpm dev`。

## 2. 修改站点名称、首页介绍和链接

打开 `src/site.config.ts`，保留文件顶部的 import 和 export，只编辑 `defineThemeConfig({...})` 中的对象。下面展示该配置声明的完整示例；将域名、姓名、文案和链接替换成自己的。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: {
    title: 'My Blog',
    description: 'My notes and projects.',
    url: 'https://example.com',
    author: 'Your Name',
    tagline: 'Built with Astro.',
  },
  i18n: {
    defaultLocale: 'zh',
    locales: {
      zh: {
        site: { hero: 'Welcome to my blog.' },
        messages: { siteDescription: 'My notes and projects.' },
      },
    },
  },
  social: {
    links: [{ href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' }],
  },
});
```

`site.title` 是站点名称；`site.url` 填最终上线的完整网址，影响 canonical、RSS、sitemap 和分享图片地址；`site.author` 是文章默认作者；`site.tagline` 是页脚文案。

首页大标题下的介绍由当前语言的 `site.hero` 控制。`site.description` 是站点级默认描述，而首页元描述优先使用该语言的 `messages.siteDescription`。只改 `site.description` 不会替换首页可见介绍。

社交链接支持 `github`、`twitter`、`mastodon` 图标；用 `social: { links: [] }` 清空链接。空列表仍会在顶部和页脚显示 Mastodon、Twitter、GitHub 三个不可点击的占位图标；列表非空时只显示已配置的条目。若 `.env` 中已有 `PUBLIC_SITE_TITLE`、`PUBLIC_SITE_URL` 等站点覆盖值，它们会优先于配置文件；修改没有生效时也检查这些变量。

可在项目根目录的 `.env` 或托管平台的构建环境中设置 `PUBLIC_SITE_URL=https://your-domain.example`，覆盖 `site.url`。修改后重启开发服务或重新构建，并检查 canonical、RSS、sitemap 和分享图绝对地址是否使用该域名。这需要配套 starter 的 `astro.config.mjs` 和域名解析辅助脚本；只更新 npm 主题包不会更新这些文件。

## 3. 只保留你会使用的语言

默认启用 `en`、`ja`、`ko`、`es`、`zh`。第一份示例把默认语言设为 `zh`，但不会自动关闭其他语言。若只想使用简体中文，将以下内容合并到已有的 `i18n` 中，并保留上一步的首页文案：

```ts
i18n: {
  defaultLocale: 'zh',
  locales: {
    en: { meta: { enabled: false } },
    ja: { meta: { enabled: false } },
    ko: { meta: { enabled: false } },
    es: { meta: { enabled: false } },
    zh: { meta: { enabled: true } },
  },
},
```

配置会与默认值深合并；省略语言不等于删除语言，必须设置 `meta.enabled: false`。默认语言始终启用。语言设置控制导航选项和路由，不会替你翻译文章，也不会删除已有文件。先访问 `/zh/`，确认语言菜单与预期一致。

## 4. 替换示例内容并写第一篇

文章位于 `src/content/blog/<语言代码>/`。每个默认语言目录中的 `welcome-to-anglefeint.md` 和三个 `starter-guide-*.md` 都是示例文章，包括你正在读的教程。备份后可以删除不需要的示例 Markdown 文件，也可以保留教程供自己查阅。不要删除整个配置目录或仍被文章引用的图片。

```bash
npm run new-post -- my-first-post
```

命令为当前启用的语言生成同名文章文件，不会自动翻译正文。打开生成的 `src/content/blog/zh/my-first-post.md` 填入标题、简介和正文。保存后访问 `/zh/blog/my-first-post/`。第二篇会详细说明文章字段、图片和标签。

## 5. 构建、检查并部署

开发时用 `npm run dev`；正式发布前在项目目录运行：

```bash
npm run check
npm run build
npm run preview
```

`check` 检查配置/适配层、Astro 文件及构建中的 About 配置；`build` 生成静态输出 `dist/`，包含搜索索引和默认自动生成的分享图；`preview` 在本地检查构建产物，并不会把网站发布到互联网。预览结束可用 Ctrl+C 停止。

在静态托管平台配置构建命令 `npm run build`、输出目录 `dist`，并先把 `site.url` 改成实际域名。具体平台的连接仓库、域名和发布步骤参考 [Astro 部署指南](https://docs.astro.build/en/guides/deploy/)。部署后检查首页、文章、语言切换、搜索和 `/<语言代码>/rss.xml`。修改文章或配置后，需要重新构建并部署。

## 6. 配置时记住这三件事

只编辑 `src/site.config.ts` 的配置对象，不要把教程片段粘进 `src/config/*` 等生成的适配文件。

同一个对象中只保留一个 `theme`、一个 `i18n`；不同功能的内容要合并到已有对象，不要逐段追加同名键。未写出的配置使用默认值，数组（如歌曲或社交链接）会整体替换。

旧工程升级 npm 包不会自动更新本地 starter 文件。若缺少教程中的配置或功能，先看 [升级指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)，不要为消除报错随意删掉配置辅助文件。

## 这套教程

- [使用指南 1：搭建你的博客](/zh/blog/starter-guide-1-configure-your-site/)
- [使用指南 2：写文章与管理内容](/zh/blog/starter-guide-2-languages-and-routing/)
- [使用指南 3：按需开启与定制功能](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)
