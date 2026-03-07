---
title: 'Anglefeint Starter Guide 3: Comments, About, and Toggles'
subtitle: 'Giscus、About、pagination、post effects'
description: '現在有効な拡張設定は Giscus comments、About content、Red Queen effect、home counts、pagination です。'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

ここでは次の設定を扱います。

- `theme.comments.*`
- `i18n.locales.<code>.about`
- `theme.effects.enableRedQueen`
- `theme.blogPageSize`
- `theme.homeLatestCount`
- `theme.pagination.*`

Giscus では `enabled`, `repo`, `repoId`, `category`, `categoryId`, `mapping` などが実際に使われます。`mapping: 'specific'` は `term`、`mapping: 'number'` は正の整数 `number` が必要です。

About の本文や modal 文言は `i18n.locales.<code>.about` から供給されます。

- [Starter Guide 1](/ja/blog/starter-guide-1-configure-your-site/)
- [Starter Guide 2](/ja/blog/starter-guide-2-languages-and-routing/)
