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

有効なすべての言語で、同じ断片のひな形を作成：

有効な全言語を既定で作成するにはテーマ 0.31.0 以降が必要です。先にアップグレードしてください。0.29–0.30 では `--locales` で明示的に指定します。

```bash
npx @anglefeint/astro-theme@latest new-fragment
```

`new-post` と同様に、既定ではプロジェクトで有効な全言語に、同じ ID とタイムスタンプのひな形を作成します。自動翻訳はしません。優先順位は `--locales` → `ANGLEFEINT_LOCALES` → 有効な言語です。明示した一覧は空白除去・小文字化・重複除去され、設定の読み込みを省略して指定言語のディレクトリだけを作成します。言語の有効化設定は変更しません。

新 starter は `npm run new-fragment` も提供します。既存プロジェクトはスクリプトを追加せず npx を使えます。

```bash
npx @anglefeint/astro-theme@latest new-fragment --locales en,zh
npx @anglefeint/astro-theme@latest new-fragment --locales ja
```

`src/content/fragments/<locale>/` の Markdown を編集します。タイトルは任意です：

後から翻訳を追加する場合は元の Markdown を対象言語フォルダーへコピーし、id を維持して本文を翻訳します。

```md
---
id: 'q8Lm3XzP'
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

0.32.0 以降のページ送り改善：断片は Blog とページ番号、ネオン表示、設定したしきい値で表示されるページ移動欄を共有します。`theme.pagination` は両方の一覧に適用され、断片の1ページあたりの件数は引き続き `theme.fragments.pageSize` で個別に設定します。

## 安定した共有リンク（0.32.0 以降）

0.32.0 以降の共有機能：日付のリンクで一覧内の断片を定位でき、その横でリンクをコピーできます。共有には `/ja/fragments/#fragment-ID` を使用します。ID は Markdown frontmatter の id です。現在のページに対象がない場合のみ、言語別の小さな静的索引を読み込み、現在のページへ移動します。追加、日付や pageSize の変更後は再ビルドし、ID は変えないでください。ページをまたぐ定位とコピーには JavaScript が必要です。

閲覧中の URL にページ番号が付いていても、共有には日付リンクかコピー操作を使ってください。存在する旧ページは古いアンカーを補正できますが、消えたページ番号はサイト通常の 404 になります。この機能は 404 ページを処理しません。

断片が存在しない場合や通信失敗時は案内を表示し、移動を繰り返しません。クリップボードが使えない場合は手動コピー用のリンクを表示します。この機能にはテーマ 0.32.0 以降が必要です。自動定位を利用する前に更新してください。

## 既定の共有画像と Fragment の短い ID（0.33.0+）

src/site.config.ts の既存の site 設定に site.ogImage を追加できます。public ルートのパス（/images/share.jpg は public/images/share.jpg）または HTTPS URL を指定します。空欄なら内蔵の 1200×630 Anglefeint 画像を使います。Fragments とすべての #fragment-ID 共有リンクは同じ画像を使います。記事固有の画像と自動生成画像が優先され、自動生成を無効にした場合も記事のカバー画像がサイト既定画像より優先されます。変更後は再ビルドしてデプロイしてください。共有サービスにはキャッシュが残る場合があります。

```ts
export const THEME_CONFIG = defineThemeConfig({
  site: { ogImage: '/images/share.jpg' },
});
```

new-fragment は大文字・小文字を区別する英数字 8 文字の Nano ID を生成し、各言語の既存 Markdown ID と重複すると再試行します。同じ実行の全言語は ID と公開日時を共有します。Fragment ID は英数字 8 文字のみです。以前の UUID や長い ID は非対応のため、古い項目は削除して再投稿してください。移行や旧リンク互換機能はありません。公開後の ID は維持してください。変更するとコメントの関連付けも変わります。
