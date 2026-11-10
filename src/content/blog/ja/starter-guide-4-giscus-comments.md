---
tags: ['anglefeint', 'starter']
title: '使い方ガイド 4：Giscus コメントの設定'
description: '使い方ガイド 4：Giscus コメントの設定'
pubDate: '2026-11-10'
updatedDate: '2026-11-10'
heroImage: '../../../assets/blog/default-covers/matrix-02.webp'
---

`src/site.config.ts` の既存の `defineThemeConfig({...})` に、以下の `theme.comments` を統合してください。他の設定を残し、`theme` や `comments` のキーを重複させないでください。

`shareAcrossLocales: false` — `mapping: 'pathname'`

## コメント設定ガイド

[Giscus 設定ページ](https://giscus.app/) に従い、公開 GitHub リポジトリ、Discussions、Giscus アプリ、分類を準備します。生成された設定から実際の repository/category ID を取得します。

```ts
theme: {
  comments: {
    enabled: true,
    repo: 'yourname/your-repository',
    repoId: 'REPLACE_WITH_REPO_ID',
    category: 'Announcements',
    categoryId: 'REPLACE_WITH_CATEGORY_ID',
    mapping: 'pathname',
    lang: '',
  },
},
```

2 つの `REPLACE_WITH_...` と、実際の分類名に置き換えてください。テーマ設定だけを入力し、記事ごとに Giscus の script 全体を貼る必要はありません。

コメントは記事ページに表示されます。主要な repo/category の 4 項目が欠けると表示されず、仮の値を入れても動作しません。`lang: ''` は記事の言語に追従します（`zh` は `zh-CN`）。既定値は固定の `en` です。

通常は `mapping: 'pathname'` のまま、記事のパスで議論を紐付けます。`specific` なら空でない `term`、`number` なら正の整数を文字列として `number` に指定します。この 2 モードで値が不正・不足しているとエラーになります。

記事末尾で確認し、表示されなければ ID、リポジトリ権限、ネットワーク、ブラウザーのブロックを調べます。`inputPosition`、`theme`、`reactionsEnabled` などは既定値で構いません。`strict` と `reactionsEnabled` は文字列の `'0'` / `'1'` です。

## 同じ記事の翻訳間でコメントを共有する

コメントと翻訳間の共有は既定で無効です。通常のパス別コメントには上の設定を使います。翻訳間で一つのディスカッションを共有する場合、リポジトリとカテゴリの値を残し、対応付けの設定を次のようにします：

```ts
theme: {
  comments: {
    // enabled、repo、repoId、category、categoryId は元の値を残します。
    shareAcrossLocales: true,
    mapping: 'specific',
    term: '',
    number: '',
    strict: '1',
    lang: '',
  },
},
```

共有時は mapping が specific、term と number が空、strict が文字列の 1 である必要があります。記事が言語接頭辞を除いた完全な slug を data-term に渡します。9言語で cypherpunk-ideals-ai-and-the-future-of-crypto を共有できます。guides/setup と other/setup は別のディスカッションです。slug がない場合はエラーです。翻訳には同じ slug を使います。lang が空なら画面言語に従い、指定すれば固定されます。本文は翻訳せず、ディスカッションとリアクションを共有します。

共有しない場合、自分の mapping、term、number、strict は従来通りです。specific には空でない term、number には正の整数文字列が必要です。共有とコメントが有効な状態で、mapping の不一致、空でない term/number、1 以外の strict は設定エラーになります。翻訳2件と別の記事で対応付けを確認してください。投稿には GitHub の認可が必要です。既存の comments に統合し、他の設定を上書きしないでください。

既存のディスカッションを自動で統合・移動・削除しません。共有を有効にすると別のディスカッションに切り替わり、以前のコメントが表示されない場合があります。変更前に mapping、term、number、strict を保存してください。戻す場合は shareAcrossLocales: false にして各値を元に戻します。旧コメントの移行が必要なら GitHub 上で確認して手動で対応してください。テーマは移行しません。

既存の統合版 starter は、この設定を含むテーマのリリースに更新してください。設定変更後は再ビルドして配信し、本番プレビューでコメントを確認します。

```bash
npx @anglefeint/astro-theme@latest upgrade
npm run build
npm run preview
```

[← 使い方ガイド 3](/ja/blog/starter-guide-3-comments-about-and-theme-toggles/)
