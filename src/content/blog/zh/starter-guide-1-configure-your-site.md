---
title: 'Anglefeint Starter Guide 1：先配置你的站点'
subtitle: '从 starter 创建项目后，优先改哪些字段'
description: '从真正的用户入口开始：站点身份信息、社交链接、About 开关，以及如何替换 starter 示例文章。'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

如果你是通过 Anglefeint starter 创建项目，第一步就看 `src/site.config.ts`。

这个文件就是主要的用户配置入口。一般情况下，你不需要直接去改 `src/config/*` 或 `src/i18n/*`。

## 先改站点身份信息

```ts
site: {
  title: 'Your Site Name',
  description: 'Your default site description.',
  url: 'https://example.com',
  author: 'Your Name',
  tagline: 'Built with Astro.',
}
```

当前真实作用：

- `site.title`：header、footer、页面元数据和 RSS 标题
- `site.description`：站点级默认描述；首页在当前语言没有 `messages.siteDescription` 时会回退到它
- `site.url`：canonical、语言 alternate、RSS 和 robots
- `site.author`：文章默认作者与 SEO author
- `site.tagline`：footer 文案

## 配置社交链接

```ts
social: {
  links: [
    { href: 'https://github.com/yourname', label: 'GitHub', icon: 'github' },
    { href: 'https://x.com/yourname', label: 'Twitter', icon: 'twitter' },
  ],
}
```

内置 icon：

- `github`
- `twitter`
- `mastodon`

## 决定要不要 About 页面

```ts
theme: {
  enableAboutPage: true,
}
```

设成 `false` 就不会生成 `/[lang]/about/`，导航里也不会显示它。

## 替换 starter 内容

文章目录：

```text
src/content/blog/<locale>/
```

新建文章：

```bash
npm run new-post -- your-first-post
```

## 下一篇

- [Starter Guide 2：配置多语言与路由](/zh/blog/starter-guide-2-languages-and-routing/)
- [Starter Guide 3：配置评论、About 与主题开关](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)
