---
title: 'Anglefeint 架构设计：为什么使用四层组合'
subtitle: 'ThemeFrame -> Shell -> Layout -> Page'
description: '这篇文章解释 Anglefeint 的主题架构分层，以及为什么这种结构更适合长期维护。'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/ai-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 168
aiConfidence: 0.96
wordCount: 760
tokenCount: 1180
---

在这个主题里，最先确定的不是视觉，而是架构边界。结构混乱时，后续每次加功能和修问题都会更贵。

Anglefeint 采用四层组合：

- ThemeFrame：统一站点骨架
- Shell：承载不同路由氛围
- Layout：组织页面结构
- Page：只关心内容与数据

这种分层的价值在于改动隔离：改风格不必改内容逻辑，改内容也不会牵连主题实现。

工程组织上，核心实现放在 @anglefeint/astro-theme，starter 保留内容与配置。这样升级路径可以集中在包更新，而不是反复手动拷文件。

用户配置入口收敛到 site.config.ts。单入口能显著降低上手成本，也让维护更可控。
