---
title: '按路由设计视觉系统：多氛围页面策略'
subtitle: '不同阶段，不同氛围'
description: '本文说明 Anglefeint 如何按路由分配视觉氛围，并保持内容层级清晰。'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
updatedDate: '2026-11-14'
---

读者在不同页面做不同的事，因此路由有各自的氛围：

- 首页：Matrix，建立第一印象。
- Blog List 与标签列表：Cyberpunk，浏览和发现内容。
- 文章详情：AI，聚焦长文阅读。
- About：Hacker，介绍作者并提供交互工具。
- Fragments：沿用 Cyberpunk 的内容浏览氛围。
- Decoder Lab：以工具界面和网络背景承载本地解码。

默认首页带语言前缀，`/` 转向默认语言首页，初始为 `/en/`。`defaultLocalePrefix: 'never'` 只改变默认语言首页的位置，博客等路由仍带语言前缀。

About、Decoder、标签和 Fragments 各有开关；Fragments 默认关闭。分开设计是为了帮助读者判断自己在哪里，具体配置放在字典中查阅。

继续阅读：[Anglefeint 架构设计：为什么使用四层组合](/zh/blog/architecture-of-anglefeint/) · [配置字典：语言启停、地址、界面翻译和回退](/zh/blog/config-languages/)
