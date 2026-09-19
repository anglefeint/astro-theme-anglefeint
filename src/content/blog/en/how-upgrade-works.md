---
title: 'Upgrade Model: Starter Init, npm Update Later'
subtitle: 'One initialization path, one upgrade path'
description: 'Recommended workflow for initializing and upgrading Anglefeint projects.'
pubDate: '2026-03-03'
updatedDate: '2026-09-19'
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

```bash
npm create astro@latest -- --template anglefeint/astro-theme-anglefeint#starter
```

Compatible package-only updates:

`npm update` updates the theme package, not local starter configuration, routes, adapters or Astro integrations. If release notes require project-structure changes, create the latest starter in a new directory and migrate your content and personal settings. Do not overwrite its configuration helpers with old files. See the [upgrade guide](https://github.com/anglefeint/astro-theme-anglefeint/blob/main/UPGRADING.md).

```bash
npm update @anglefeint/astro-theme
npm run doctor
```

`npm update` stays within the range in `package.json`: `^0.5.1` does not include `0.6.0`. For a compatible update outside that range, follow the release notes and install an explicit target version, not blindly `@latest`. Check the installed versions with `npm ls @anglefeint/astro-theme astro`.

In the current starter, `doctor` already includes checks and a build. After it succeeds, use `npm run preview` to inspect the site. Only if it reports generated adapters out of sync with local templates, run `npm run sync-adapters`, then rerun `npm run doctor`; this does not download upstream templates. Older projects may have different scripts: inspect their `package.json` and follow the upgrade guide.

This keeps core updates package-driven.

For Astro major upgrades, follow the official Astro migration guide first, then run this project's checks.

This model is designed for clear, repeatable operations and lower maintenance overhead.
