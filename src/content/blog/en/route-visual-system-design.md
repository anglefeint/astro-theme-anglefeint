---
title: 'Route-Based Visual System Design'
subtitle: 'Different routes, different moods'
description: 'How Anglefeint maps visual atmospheres to reading stages without breaking content focus.'
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

Many blog themes apply one skin across all pages. Anglefeint uses route-based visual mapping.

- `/<locale>/` : Matrix terminal mood for first impression
- `/<locale>/blog/` : cyber archive mood for browsing
- `/<locale>/blog/<slug>/` : AI reading interface for long-form focus
- `/<locale>/about/` : hacker terminal profile style

With the default `i18n.routing.defaultLocalePrefix: 'always'`, `/` redirects to the default locale homepage (initially `/en/`). With `'never'`, only the default locale homepage moves to `/`; blog and About routes remain localized. About requires `theme.enableAboutPage: true`. When tags are enabled, `/<locale>/tags/` and tag result pages share the Cyber atmosphere.

The core principle is simple: background supports reading, not the other way around.

Each route has a clear objective in the reading journey. Home builds identity, blog list improves exploration, article pages prioritize the text surface, and About provides context.

This route-level strategy keeps visual identity strong while maintaining a clear content hierarchy.
