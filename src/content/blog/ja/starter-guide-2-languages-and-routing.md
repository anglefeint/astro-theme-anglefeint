---
title: 'Anglefeint Starter Guide 2: Languages and Routing'
subtitle: 'default locale、fallback、URL ルール'
description: '単一の locale registry から routing、labels、fallback、messages、hero、About content を管理します。'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/cyber-03.webp'
---

多言語設定は `src/site.config.ts` の `i18n` で管理します。

重要な項目:

- `i18n.defaultLocale`
- `i18n.routing.defaultLocalePrefix`
- `i18n.locales`
- `meta.label`
- `meta.hreflang`
- `meta.ogLocale`
- `meta.enabled`
- `meta.fallback`
- `messages`
- `site.hero`
- `about`

`defaultLocalePrefix` が `'always'` の場合、デフォルト言語のホームは `/<default-locale>/` です。`'never'` の場合は `/` が canonical になります。

記事ファイル自体は引き続き `src/content/blog/<locale>/` に置きます。

- [Starter Guide 1](/ja/blog/starter-guide-1-configure-your-site/)
- [Starter Guide 3](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)
