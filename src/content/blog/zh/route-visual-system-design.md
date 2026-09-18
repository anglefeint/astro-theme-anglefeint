---
title: '按路由设计视觉系统：多氛围页面策略'
subtitle: '不同阶段，不同氛围'
description: '本文说明 Anglefeint 如何按路由分配视觉氛围，并保持内容层级清晰。'
pubDate: '2026-03-03'
updatedDate: '2026-09-19'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 171
aiConfidence: 0.95
wordCount: 700
tokenCount: 1080
---

很多博客主题会用一套皮肤覆盖所有页面。Anglefeint 选择按路由分配不同氛围。

- `/<locale>/`：Matrix 终端氛围
- `/<locale>/blog/`：Cyber 归档浏览氛围
- `/<locale>/blog/<slug>/`：AI 阅读界面氛围
- `/<locale>/about/`：Hacker 终端氛围

默认 `i18n.routing.defaultLocalePrefix: 'always'` 时，`/` 跳转到默认语言首页（初始为 `/en/`）。改为 `'never'` 只会将默认语言首页移到 `/`，博客和 About 路由仍带语言前缀。About 需要 `theme.enableAboutPage: true`。标签功能开启时，`/<locale>/tags/` 和标签结果页共享 Cyber 氛围。

核心原则很简单：背景服务阅读。

首页负责建立记忆点，列表页负责提高探索效率，详情页负责正文聚焦，About 负责补充背景。

这种按路由分工的方式，既能保留主题辨识度，也能保证信息层级稳定。
