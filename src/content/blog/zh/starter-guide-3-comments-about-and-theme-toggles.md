---
title: 'Anglefeint Starter Guide 3：配置评论、About 与主题开关'
subtitle: 'Giscus、About 内容、首页数量、分页和文章特效'
description: 'Anglefeint 当前已经验证生效的增强配置：Giscus 评论、About 内容、Red Queen 开关、首页文章数和博客分页行为。'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

当站点身份信息和多语言配置都理顺之后，下一层就是功能开关。

## 开启 Giscus 评论

最小可用配置：

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'owner/repo',
    repoId: '...',
    category: 'Announcements',
    categoryId: '...',
    mapping: 'pathname',
  },
}
```

当前 starter 真实消费：

- `enabled`
- `repo`
- `repoId`
- `category`
- `categoryId`
- `mapping`
- `term`
- `number`
- `strict`
- `reactionsEnabled`
- `emitMetadata`
- `inputPosition`
- `theme`
- `lang`
- `loading`
- `crossorigin`

要记住：

- `mapping: 'specific'` 需要 `term`
- `mapping: 'number'` 需要正整数形式的 `number`

## 配置 About 页面内容

使用：

```ts
i18n.locales.<code>.about
```

它会驱动 About 正文、sidebar 标签、modal 内容和 About 运行时文案。

## 开关 Red Queen 文章特效

```ts
theme: {
  effects: {
    enableRedQueen: true,
  },
}
```

## 控制首页和博客数量

```ts
theme: {
  blogPageSize: 9,
  homeLatestCount: 3,
}
```

## 调整博客分页

当前真实接入的分页字段：

- `windowSize`
- `showJumpThreshold`
- `jump.enabled`
- `jump.enterToGo`
- `style.enabled`
- `style.mode`
- `style.variants`
- `style.fixedVariant`

## 一个边界

Matrix 首页、Cyber 博客列表、AI 文章页、Hacker About 页仍然是 route-owned 视觉系统。配置可以控制支持的开关和内容，但不是任意结构改造入口。

## 回看整套系列

- [Starter Guide 1：先配置你的站点](/zh/blog/starter-guide-1-configure-your-site/)
- [Starter Guide 2：配置多语言与路由](/zh/blog/starter-guide-2-languages-and-routing/)
