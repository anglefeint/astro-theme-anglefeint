---
title: 'Anglefeint Architecture: Why the Four-Layer Composition'
subtitle: 'ThemeFrame -> Shell -> Layout -> Page'
description: 'A practical breakdown of the architecture choices behind Anglefeint and why they improve long-term maintainability.'
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

In this theme, architecture was decided before visual polish. The reason is simple: when structure is unclear, every new feature becomes more expensive.

Anglefeint uses four layers:

- ThemeFrame: shared frame and global page shell
- Shell: route mood and atmosphere-specific wrappers
- Layout: page structure composition
- Page: content and route data only

This separation lets visual changes and content changes move independently. You can evolve style without rewriting content logic.

At repository level, core implementation is packaged in @anglefeint/astro-theme, while starter keeps content and configuration. This keeps the upgrade path focused on package updates instead of repeated manual copy operations.

The user-facing configuration entry is centered in site.config.ts. A single entry significantly lowers onboarding cost and keeps maintenance predictable.
