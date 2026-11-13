---
title: 'Route-Based Visual System Design'
subtitle: 'Different routes, different moods'
description: 'How Anglefeint maps visual atmospheres to reading stages without breaking content focus.'
pubDate: '2026-03-03'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
aiModel: 'anglefeint-core'
aiMode: 'analysis'
aiState: 'stable'
updatedDate: '2026-11-14'
---

Readers do different things on different pages, so routes have distinct atmospheres:

- Home: Matrix for the first impression.
- Blog List and tags: Cyberpunk for discovery.
- Articles: AI for long-form reading.
- About: Hacker for the author and tools.
- Fragments: the Cyberpunk browsing atmosphere.
- Decoder Lab: local decoding tools with a network background.

By default, Home has a language prefix and `/` redirects to the default-language home, initially `/en/`. `defaultLocalePrefix: 'never'` changes only that home; blog and other routes keep their prefixes.

About, Decoder, tags and Fragments have independent switches. Fragments is disabled by default. The reference explains their settings.

Read next: [Anglefeint Architecture: Why the Four-Layer Composition Prioritizes Lightweight Runtime, Safer Upgrades, and Long-Term Reusability for Real Projects](/en/blog/architecture-of-anglefeint/) · [Configuration Reference: Languages, URLs, Messages and Fallback](/en/blog/config-languages/)
