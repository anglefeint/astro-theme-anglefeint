---
title: 'Anglefeint Starter Guide 2：配置多语言与路由'
subtitle: '默认语言、fallback 和 URL 结构怎么工作'
description: '用 src/site.config.ts 里的单一 locale registry 驱动路由、标签、fallback、messages、hero 和 About 内容。'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

Anglefeint 把多语言入口统一收敛在 `src/site.config.ts`。

路由、语言标签、fallback、界面文案、首页 hero 文案，以及 About 内容，都从这一个 registry 派生。

## i18n 的核心结构

```ts
i18n: {
  defaultLocale: 'en',
  routing: {
    defaultLocalePrefix: 'always',
  },
  locales: {
    en: {
      meta: {
        label: 'English',
        hreflang: 'en',
        ogLocale: 'en_US',
      },
      site: {
        hero: 'Your localized home hero copy.',
      },
      messages: {
        nav: { home: 'Home' },
      },
      about: {
        metaLine: '$ profile booted | mode: builder',
      },
    },
  },
}
```

## 默认语言和 URL 模式

- `i18n.defaultLocale`
- `i18n.routing.defaultLocalePrefix`

如果 `defaultLocalePrefix` 是 `'always'`：

- 默认语言首页是 `/<default-locale>/`
- `/` 会重定向过去

如果 `defaultLocalePrefix` 是 `'never'`：

- `/` 是默认语言首页 canonical 地址
- `/<default-locale>/` 会重定向回 `/`

## 当前真正生效的 locale metadata

- `label`
- `hreflang`
- `ogLocale`
- `enabled`
- `fallback`

`enabled` 会影响路由生成和语言切换器，`fallback` 会影响本地化文案、hero 和 About 配置解析。

## 最常改的三类本地化字段

1. `i18n.locales.<code>.messages`
2. `i18n.locales.<code>.site.hero`
3. `i18n.locales.<code>.about`

## 配置不替代内容文件

本地化文章仍然放在：

```text
src/content/blog/<locale>/
```

如果目标语言没有同 slug 文章，语言切换器在详情页会回退到该语言的博客列表。

## 下一篇

- [Starter Guide 1：先配置你的站点](/zh/blog/starter-guide-1-configure-your-site/)
- [Starter Guide 3：配置评论、About 与主题开关](/zh/blog/starter-guide-3-comments-about-and-theme-toggles/)
