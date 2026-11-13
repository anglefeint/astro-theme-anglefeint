---
title: 'Anglefeint 架构设计：为什么使用四层组合'
subtitle: 'ThemeFrame -> Shell -> Layout -> Page'
description: '这篇文章解释 Anglefeint 的主题架构分层，以及为什么这种结构更适合长期维护。'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
updatedDate: '2026-11-14'
---

Anglefeint 的四层组合是一种职责划分：

- ThemeFrame：共享文档、SEO、导航、页脚和音乐组件。
- Shell：选择页面的主题样式与背景氛围。
- Layout：组织正文、封面和辅助区域。
- Page：读取内容与配置，再组合页面。

它不要求每个页面都逐层嵌套相同组件。共享结构负责一致性，页面保留各自的数据与交互。

标准路由、配置默认值和主题实现由 `@anglefeint/astro-theme` 提供；starter 保留文章、素材、`src/site.config.ts`、自定义页面和部署设置。更新主题不必复制标准页面。站点配置集中在一个入口，文章与碎片仍在各自的内容目录维护。

继续阅读：[按路由设计视觉系统：多氛围页面策略](/zh/blog/route-visual-system-design/) · [配置字典：站点名称、域名、公共导航、社交和页脚](/zh/blog/config-site-chrome/)
