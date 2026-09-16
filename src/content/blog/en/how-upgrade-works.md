---
title: 'Upgrade Model: Starter Init, npm Update Later'
subtitle: 'One initialization path, one upgrade path'
description: 'Recommended workflow for initializing and upgrading Anglefeint projects.'
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

A common theme problem is easy initialization but painful upgrades. Anglefeint standardizes the path.

Initialization:

npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter

Compatible package-only updates:

`npm update` updates the theme package, not local starter configuration, routes, adapters or Astro integrations. If release notes require project-structure changes, create the latest starter in a new directory and migrate your content and personal settings. Do not overwrite its configuration helpers with old files. See the [upgrade guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

npm update @anglefeint/astro-theme
npm install
npm run check
npm run build

This keeps core updates package-driven.

For Astro major upgrades, follow the official Astro migration guide first, then run this project's checks.

This model is designed for clear, repeatable operations and lower maintenance overhead.
