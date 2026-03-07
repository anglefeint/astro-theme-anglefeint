---
title: 'Anglefeint Starter Guide 1: Site Configuration'
subtitle: 'Starter project の直後に最初に変更する項目'
description: '最初に触るべきユーザー設定は site 情報、social links、About トグル、そして starter 記事の置き換えです。'
pubDate: '2026-03-07'
heroImage: '../../../assets/blog/default-covers/cyber-02.webp'
---

Anglefeint starter を使った場合、最初の入口は `src/site.config.ts` です。

まず確認する項目:

- `site.title`
- `site.description`
- `site.url`
- `site.author`
- `site.tagline`
- `social.links`
- `theme.enableAboutPage`

`site.description` はサイト全体のデフォルト説明文で、ホームは `messages.siteDescription` が無いときにここへフォールバックします。

新しい記事は次のコマンドで作成できます。

```bash
npm run new-post -- your-first-post
```

- [Starter Guide 2](/ja/blog/starter-guide-2-languages-and-routing/)
- [Starter Guide 3](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)
