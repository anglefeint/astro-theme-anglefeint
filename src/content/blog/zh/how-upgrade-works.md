---
title: '主题升级模型：starter 初始化，npm 持续更新'
subtitle: '初始化一次，后续走包升级'
description: '这篇文章说明 Anglefeint 的推荐升级路径，以及如何处理 Astro 大版本迁移。'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/hacker-01.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
aiLatencyMs: 165
aiConfidence: 0.97
wordCount: 690
tokenCount: 1040
---

主题项目最常见的问题之一是：初始化方便，但升级混乱。Anglefeint 的做法是把路径统一。

初始化：

npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter

兼容的纯包更新：

`npm update` 只更新主题包，不会改写本地 starter 的配置、路由、适配器或 Astro 集成。如果发布说明要求更新工程结构，应在新目录创建最新 starter，再迁移文章和个人设置，不要用旧配置辅助文件覆盖新文件。详见[升级指南](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md)。

npm update @anglefeint/astro-theme
npm install
npm run check
npm run build

这样主题核心可以通过包分发持续更新。

遇到 Astro 大版本迁移时，先看官方升级文档，再执行本项目的检查与构建命令。

目标不是零人工，而是路径清晰、可重复执行。
