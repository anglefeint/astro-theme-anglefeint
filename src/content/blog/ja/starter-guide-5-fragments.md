---
tags: ['anglefeint', 'starter']
title: 'ユーザーガイド 5：断片を公開する'
description: '短い思いを Markdown で残し、コメントをダイアログで表示します。'
pubDate: '2026-11-11'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

既存のブログは、先にテーマを 0.29.0 以降へ更新してください：

```bash
npx @anglefeint/astro-theme@latest upgrade
```

`src/site.config.ts` の既存 theme に追加します。断片とコメントは初期状態で無効です。メニューは Decoder Lab の下に表示されます。

```ts
theme: {
  fragments: { enabled: true, pageSize: 20, comments: { enabled: false } },
},
```

有効化後は `/<locale>/fragments/` にアクセスします。`pageSize` は 1〜100 の整数です。ファイルは `.md` を使用します。下書きや未来の日付による公開除外はないため、未公開の断片は `src/content/fragments/` の外に保存してください。

既定の言語で断片を作成：

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

--locales en,zh で同じ ID の翻訳用ファイルを作成できます。自動翻訳はしません。有効な言語のみ指定できます。新 starter は npm run new-fragment も使用可能です。既存ユーザーは npx を使えばスクリプト追加不要です。

`src/content/fragments/<locale>/` の Markdown を編集します。タイトルは任意です：

後から翻訳を追加する場合は元の Markdown を対象言語フォルダーへコピーし、id を維持して本文を翻訳します。

```md
---
id: 550e8400-e29b-41d4-a716-446655440000
pubDate: 2026-11-11T08:30:00+08:00
---

断片.
```

編集やファイル名変更時も id を維持します。同じ断片の翻訳だけ同じ ID を使います。同一言語の重複 ID はビルドエラーです。pubDate に時刻とタイムゾーンを含め、UTC 表示・新しい順に並べます。

コメントは `theme.fragments.comments.enabled` を true にし、`theme.comments` の repo、repoId、category、categoryId を Giscus から設定します。ガイド 4 を参照。記事コメントは無効のままで構いません。 [Giscus](https://giscus.app/) · [4](../starter-guide-4-giscus-comments/)

```ts
theme: {
  fragments: { enabled: true, comments: { enabled: true } },
  comments: {
    repo: 'yourname/your-repository',
    repoId: 'R_...',
    category: 'Your category',
    categoryId: 'DIC_...',
  },
},
```

断片は specific、厳密一致、`fragment/<id>` を使用します。記事の mapping、term、number、shareAcrossLocales、lang は使用せず、表示言語はページに従います。同じ ID の翻訳はコメントとリアクションを共有します。記事の関連付けは変わりません。最初のクリックでコメントクライアントを読み込みます。閉じるとダイアログを非表示にし、再表示や別の断片への切り替えでは同じコメントインスタンスを再利用します。

静的公開です。Markdown 編集後に再ビルド・デプロイします。オンライン投稿画面はありません。記事検索・RSS・記事 Markdown 出力とは別です。画像は `public/images/` に置き `/images/...` で参照できます。

テーマを 0.29.0 以降へ更新し、設定で有効化します。個人のコンテンツ・設定・音楽・画像を保持します。個人ガイドは上書きされないため最新 demo を参照してください。GitHub の議論は統合・削除しません。

コメントは外部から読み込みます。Giscus の準備が完了するまで読み込み表示を維持し、失敗または15秒のタイムアウト時に再試行を表示します。ネットワークや設定を確認してください。記事と同じ Giscus 連携を使用するため、Giscus の npm パッケージを別途インストールする必要はなく、記事の対応関係も変わりません。

```bash
npm run build
```
